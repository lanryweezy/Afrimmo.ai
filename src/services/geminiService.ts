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
    - For ${ContentType.Instagram}, create a concise caption with emojis and relevant hashtags for the African market.
    - For ${ContentType.WhatsApp}, write a slightly more detailed but personal message suitable for a broadcast list.
    - For ${ContentType.Listing}, create a professional property description.
    - Output the result as a JSON array of strings.
  `;

  if (!ai) return ["Content 1", "Content 2", "Content 3"];
  
  try {
    const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent([prompt]);
    const text = (await result.response.text()).trim();
    try {
      const parsed = JSON.parse(text);
      return Array.isArray(parsed) ? parsed : [text];
    } catch {
      return [text];
    }
  } catch (error) {
    console.error(error);
    return ["Failed to generate content."];
  }
};

export const generateAdCampaign = async (propertyDetails: string, objective: string, income?: string, interests?: string[]): Promise<{ metaAd: AdCopy, googleAd: AdCopy }> => {
    const prompt = `
    Generate ad copy for Meta and Google Ads.
    Details: "${propertyDetails}"
    Objective: "${objective}"
    Income: "${income || 'Any'}"
    Interests: "${(interests || []).join(', ')}"
    Return JSON with metaAd and googleAd keys.
    `;

    if (!ai) return { metaAd: { headline: "Mock Meta", primaryText: "Mock Text" }, googleAd: { headline: "Mock Google", primaryText: "Mock Text" } };
    
    try {
        const model = ai.getGenerativeModel({ model: "gemini-1.5-pro" });
        const result = await model.generateContent([prompt]);
        const text = await result.response.text();
        return JSON.parse(text.trim());
    } catch (error) {
        console.error(error);
        throw new Error("Failed to generate ad copy.");
    }
};

export const generateWhatsAppReply = async (conversationHistory: string): Promise<string> => {
    const prompt = `
    You are 'Afrimmo AI', a real estate assistant.
    Potential client messaging on WhatsApp.
    History:
    ${conversationHistory}
    AI Response:
    `;
    if (!ai) return "AI service unavailable.";
    
    try {
        const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent([prompt]);
        return await result.response.text();
    } catch (error) {
        console.error(error);
        return "Sorry, I'm having trouble.";
    }
};

export const generateWhatsAppSuggestions = async (conversationHistory: string): Promise<string[]> => {
    const prompt = `Generate 3 short quick replies for this WhatsApp chat: ${conversationHistory}. Return JSON array.`;
    if (!ai) return ["Available for viewing?", "What is your budget?", "Send more photos"];
    try {
        const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent(prompt);
        const text = result.response.text();
        return JSON.parse(text.trim());
    } catch {
        return ["When would you like to visit?", "Can you tell me more?", "I'll check that."];
    }
};

export const generateAssistantResponse = async (conversationHistory: string): Promise<string> => {
    const prompt = `You are a supportive AI assistant for Tunde, a real estate agent. Chat internally: ${conversationHistory}`;
    if (!ai) return "I'm here to help, Tunde!";
    try {
        const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent(prompt);
        return result.response.text();
    } catch {
        return "I'm here to help!";
    }
};

export const getMarketInsights = async (query: string): Promise<any> => {
    if (!ai) return { text: "Insights unavailable.", sources: [] };
    try {
        const model = ai.getGenerativeModel({ model: "gemini-1.5-pro" });
        const result = await model.generateContent([query]);
        return { text: await result.response.text(), sources: [] };
    } catch {
        return { text: "Error fetching insights.", sources: [] };
    }
};

export const getPropertyValuation = async (details: any): Promise<any> => {
    if (!ai) return { valuationRange: "N/A", analysis: "N/A", comps: [], recommendations: [] };
    try {
        const model = ai.getGenerativeModel({ model: "gemini-1.5-pro" });
        const result = await model.generateContent(["Value this property: " + JSON.stringify(details)]);
        return JSON.parse(await result.response.text());
    } catch {
        return { valuationRange: "Estimation error", analysis: "", comps: [], recommendations: [] };
    }
};

export const getPostSuggestions = async (content: string, platform: string): Promise<any> => {
    if (!ai) return { hashtags: [], rewritten: content };
    try {
        const model = ai.getGenerativeModel({ model: "gemini-1.5-pro" });
        const result = await model.generateContent(["Optimize this for " + platform + ": " + content]);
        return JSON.parse(await result.response.text());
    } catch {
        return { hashtags: [], rewritten: content };
    }
};

export const getGoogleKeywords = async (propertyDetails: string): Promise<string[]> => {
    if (!ai) return ["real estate"];
    try {
        const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent(["Keywords for: " + propertyDetails]);
        return JSON.parse(await result.response.text());
    } catch {
        return ["property"];
    }
};

export const scoreLead = async (lead: Lead): Promise<any> => {
    if (!ai) return { score: 50, temperature: 'Warm', justification: "Manual review needed", nextAction: "Call" };
    try {
        const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent(["Score this lead: " + JSON.stringify(lead)]);
        return JSON.parse(await result.response.text());
    } catch {
        return { score: 50, temperature: 'Warm', justification: "Scoring error", nextAction: "Follow up" };
    }
};

export const runChatAction = async (history: string): Promise<any> => {
    return null;
};

export const generateSocialBundle = async (details: string, price?: string, tone?: string): Promise<any> => {
    return { instagram: "Post content", twitter: "Tweet", facebook: "Post" };
};

export const generateListingVideo = async (images: string[], details: string): Promise<string> => {
    return "https://example.com/video.mp4";
};

export const generateLegalAgreement = async (type: string, parties: any, address: string, price: string, terms: string): Promise<string> => {
    return "Formal Agreement Text";
};
