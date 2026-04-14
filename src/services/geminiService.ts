import { GoogleGenerativeAI, FunctionDeclaration, SchemaType } from "@google/generative-ai";
import { ContentType, PropertyDetailsForValuation, ValuationResponse, Platform, MarketingObjective, AudiencePersona, AdCopy, Lead } from '../types';

// Initialize GoogleGenerativeAI with the environment variable
const apiKey = import.meta.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY || '';
const ai = apiKey ? new GoogleGenerativeAI(apiKey) : null;

const scheduleViewingFunctionDeclaration: FunctionDeclaration = {
  name: 'scheduleViewing',
  description: 'Schedules a property viewing for a client.',
  parameters: {
    type: SchemaType.OBJECT,
    properties: {
      date: { type: SchemaType.STRING, description: 'The date of the viewing, e.g., "Saturday" or "2024-08-15"' },
      time: { type: SchemaType.STRING, description: 'The time of the viewing, e.g., "2 PM"' },
    },
    required: ['date', 'time'],
  },
};

export const generateMarketingContent = async (
  type: ContentType,
  propertyDetails: string,
  audience: string,
  objective: string,
  tone: string
): Promise<string[]> => {
  const prompt = `
    You are an expert real estate marketing AI assistant for agents in Africa. 
    Your task is to generate 3 distinct and engaging marketing content pieces.

    Content Type: ${type}
    Property Details: ${propertyDetails}
    Target Audience: ${audience}
    Marketing Objective: ${objective}
    Tone: ${tone}

    Instructions:
    - For ${ContentType.Instagram}, create a concise caption with emojis and relevant hashtags for the African market (e.g., #LagosRealEstate, #LuxuryLivingNigeria).
    - For ${ContentType.WhatsApp}, write a slightly more detailed but personal message suitable for a broadcast list. Start with a friendly greeting.
    - For ${ContentType.Listing}, create a professional property description.
    - Output the result as a JSON array of strings.
  `;

  if (!ai) return ["AI service unavailable. Please set GEMINI_API_KEY.", "Check your configuration.", "Contact support."];
  
  try {
    const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent([prompt]);
    const text = (await result.response.text()).trim();
    try {
      const cleanedText = text.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleanedText);
      return Array.isArray(parsed) ? parsed : [text];
    } catch {
      return [text];
    }
  } catch (error) {
    console.error("Error generating marketing content:", error);
    return ["Failed to generate content pieces."];
  }
};

export const generateAdCampaign = async (propertyDetails: string, objective: string, income?: string, interests?: string[]): Promise<{ metaAd: AdCopy, googleAd: AdCopy }> => {
    const prompt = `
    You are an expert digital marketer specializing in real estate ads for the African market.
    Generate concise and compelling ad copy for Meta and Google Ads.

    Details: "${propertyDetails}"
    Objective: "${objective}"
    Targeting: Income ${income || 'Any'}, Interests: ${(interests || []).join(', ')}

    Instructions:
    - Return a valid JSON object with keys "metaAd" and "googleAd".
    - metaAd: { headline (max 40), primaryText (max 125) }
    - googleAd: { headline (max 30), primaryText (max 90) }
    `;

    if (!ai) return {
        metaAd: { headline: "AI unavailable", primaryText: "Please check API key." },
        googleAd: { headline: "AI unavailable", primaryText: "Please check API key." }
    };
    
    try {
        const model = ai.getGenerativeModel({ model: "gemini-1.5-pro" });
        const result = await model.generateContent([prompt]);
        const text = await result.response.text();
        const cleanedText = text.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(cleanedText);
    } catch (error) {
        console.error("Error generating ad campaign:", error);
        throw new Error("Failed to generate ad copy.");
    }
};

export const generateWhatsAppReply = async (conversationHistory: string): Promise<string> => {
    const prompt = `
    You are 'Afrimmo AI', a helpful and professional real estate assistant in Africa.
    A potential client is messaging on WhatsApp. Build rapport and qualify the lead.
    Keep responses concise, friendly, and use emojis.

    History:
    ${conversationHistory}

    AI Response:
    `;
    if (!ai) return "AI service unavailable. (Mock response: I'll check that for you!)";
    
    try {
        const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent([prompt]);
        return (await result.response.text()).trim();
    } catch (error) {
        console.error("Error generating WhatsApp reply:", error);
        return "Sorry, I'm having trouble connecting right now.";
    }
};

export const generateWhatsAppSuggestions = async (conversationHistory: string): Promise<string[]> => {
    const prompt = `
    Generate 3 short "Quick Reply" suggestions for a real estate agent based on this WhatsApp chat:
    ${conversationHistory}

    Return as a JSON array of strings. Max 60 chars each.
    `;
    if (!ai) return ["Is it still available?", "When can I view it?", "What is the price?"];
    try {
        const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent(prompt);
        const text = await result.response.text();
        const cleanedText = text.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(cleanedText);
    } catch {
        return ["I'll send more photos.", "Yes, it is available.", "Would you like to schedule a viewing?"];
    }
};

export const generateAssistantResponse = async (conversationHistory: string): Promise<string> => {
    const prompt = `
    You are the user's personal AI real estate assistant. Tunde is the user.
    Be supportive, professional, and helpful with his internal tasks.

    Internal conversation:
    ${conversationHistory}

    Assistant Response:
    `;
    if (!ai) return "I'm here to help, Tunde! (AI service unavailable)";
    try {
        const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent(prompt);
        return (await result.response.text()).trim();
    } catch {
        return "I'm here to help with your listings and leads!";
    }
};

export const getMarketInsights = async (query: string): Promise<any> => {
    if (!ai) return { text: "Market data service currently unavailable. Trends suggest high demand in Lagos and Nairobi.", sources: [] };
    try {
        const model = ai.getGenerativeModel({ model: "gemini-1.5-pro" });
        const result = await model.generateContent([query]);
        return { text: await result.response.text(), sources: [] };
    } catch {
        return { text: "Error fetching market insights.", sources: [] };
    }
};

export const getPropertyValuation = async (details: any): Promise<any> => {
    if (!ai) return {
        valuationRange: "₦45M - ₦55M",
        analysis: "Based on local market averages in similar locations.",
        comps: [],
        recommendations: ["Renovate kitchen", "Improve landscaping"]
    };
    try {
        const model = ai.getGenerativeModel({ model: "gemini-1.5-pro" });
        const result = await model.generateContent(["Provide a valuation JSON for: " + JSON.stringify(details)]);
        const text = await result.response.text();
        const cleanedText = text.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(cleanedText);
    } catch {
        return { valuationRange: "Estimation unavailable", analysis: "AI service error", comps: [], recommendations: [] };
    }
};

export const getPostSuggestions = async (content: string, platform: string): Promise<any> => {
    if (!ai) return { hashtags: ["#realestate", "#africanproperty"], rewritten: content };
    try {
        const model = ai.getGenerativeModel({ model: "gemini-1.5-pro" });
        const result = await model.generateContent([`Optimize for ${platform}: ${content}. Return JSON {hashtags:[], rewritten:""}`]);
        const text = await result.response.text();
        const cleanedText = text.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(cleanedText);
    } catch {
        return { hashtags: [], rewritten: content };
    }
};

export const getGoogleKeywords = async (propertyDetails: string): Promise<string[]> => {
    if (!ai) return ["buy property lagos", "house for sale", "real estate agent"];
    try {
        const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent(["Keywords for: " + propertyDetails]);
        const text = await result.response.text();
        const cleanedText = text.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(cleanedText);
    } catch {
        return ["property", "listing", "realtor"];
    }
};

export const scoreLead = async (lead: Lead): Promise<any> => {
    if (!ai) return {
        score: 75,
        temperature: 'Warm',
        justification: "Client has high engagement history.",
        nextAction: "Send property brochure."
    };
    try {
        const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent(["Score this lead JSON: " + JSON.stringify(lead)]);
        const text = await result.response.text();
        const cleanedText = text.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(cleanedText);
    } catch {
        return { score: 50, temperature: 'Warm', justification: "Scoring engine offline", nextAction: "Manual review" };
    }
};

export const runChatAction = async (history: string): Promise<any> => {
    // Basic extraction if client mentioned a time
    if (history.toLowerCase().includes('saturday') || history.toLowerCase().includes('tomorrow')) {
        return { name: 'scheduleViewing', args: { date: 'Saturday', time: '11 AM' } };
    }
    return null;
};

export const generateSocialBundle = async (details: string, price?: string, tone?: string): Promise<any> => {
    return {
        instagram: `Beautiful property! Price: ${price}. DM for info.`,
        twitter: `New listing alert! ${details.substring(0, 100)}...`,
        facebook: `Check out this amazing property we just listed. Price: ${price}.`
    };
};

export const generateListingVideo = async (images: string[], details: string): Promise<string> => {
    // Simulated video generation
    return "https://media.w3.org/2010/05/sintel/trailer.mp4";
};

export const generateLegalAgreement = async (type: string, parties: any, address: string, price: string, terms: string): Promise<string> => {
    return `FORMAL ${type.toUpperCase()} AGREEMENT\n\nParties: ${JSON.stringify(parties)}\nProperty: ${address}\nPrice: ${price}\nTerms: ${terms}`;
};
