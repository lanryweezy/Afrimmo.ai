

import { GoogleGenerativeAI, FunctionDeclaration, SchemaType } from "@google/generative-ai";
import { ContentType, PropertyDetailsForValuation, ValuationResponse, Platform, MarketingObjective, AudiencePersona, AdCopy, Lead, SocialBundle, TargetIncome } from '../types';
import Logger from '../src/utils/logger';

// Initialize GoogleGenerativeAI with the environment variable
const apiKey = import.meta.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY || '';
let ai = null;
try {
  if (apiKey) {
    ai = new GoogleGenerativeAI(apiKey);
  }
} catch (error) {
  console.warn('Failed to initialize Google Generative AI:', error);
  ai = null;
}

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
  audience: AudiencePersona,
  objective: MarketingObjective,
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
    - For ${ContentType.Instagram}, create a concise caption with emojis and relevant hashtags for the African market (e.g., #LagosRealEstate, #LuxuryLivingNigeria, #AccraHomes).
    - For ${ContentType.WhatsApp}, write a slightly more detailed but personal message suitable for a broadcast list. Start with a friendly greeting.
    - For ${ContentType.Listing}, create a compelling and professional property description for a real estate portal. Use bullet points for key features.
    - Tailor the language, references, and call-to-action to the specified audience and objective in an African context.
    - Ensure each of the 3 generated pieces is unique.
    - Output the result as a JSON array of strings. For example: ["content 1", "content 2", "content 3"]
  `;

  // Check if AI is available
  if (!ai) {
    throw new Error("AI service not available. Please set GEMINI_API_KEY environment variable.");
  }
  
  try {
    const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent([
      {
        text: prompt
      }
    ]);
    const response = await result.response;

    const text = await response.text();
    if (!text) {
        throw new Error("Received empty response from AI.");
    }
    // Try to parse as JSON, if it fails, return as plain text
    try {
      const parsed = JSON.parse(text.trim());
      if (Array.isArray(parsed) && parsed.every(item => typeof item === 'string')) {
        return parsed;
      }
      return [text];
    } catch (parseError) {
      // If JSON parsing fails, return the text as a single-item array
      return [text];
    }

  } catch (error) {
    console.error("Error generating marketing content:", error);
    throw new Error("Failed to generate content. Please check your API key and try again.");
  }
};

export const generateSocialBundle = async (propertyDetails: string, price: string): Promise<SocialBundle> => {
    const prompt = `
    You are an elite social media manager for a luxury real estate agency in Nigeria.
    A new property has just been listed. Generate a "Viral Launch Bundle" containing optimized text for Instagram, WhatsApp Status, and YouTube Shorts.

    Property Details: ${propertyDetails}
    Price: ${price}

    Instructions:
    1. **Instagram Caption:** High energy, luxury aesthetic, use emojis, engaging hook.
    2. **WhatsApp Status:** Short, punchy, urgent (e.g., "Just Listed! DM for exclusive viewing").
    3. **YouTube Title:** Clickbait style but professional (e.g., "Inside a ₦500M Mansion in Ikoyi! 😱").
    4. **YouTube Description:** Brief SEO optimized description.
    5. **Hashtags:** 10 trending tags for Nigerian real estate.

    Return a JSON object.
    `;

    try {
        // Check if AI is available
        if (!ai) {
          throw new Error("AI service not available. Please set GEMINI_API_KEY environment variable.");
        }
            
        const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent([
          {
            text: prompt
          }
        ]);
        const response = await result.response;
        const text = await response.text();
        if(!text) throw new Error("Empty response");
        try {
          return JSON.parse(text.trim());
        } catch (parseError) {
          throw new Error("Invalid response format from AI.");
        }
    } catch (error) {
        console.error("Error generating social bundle:", error);
        throw new Error("Failed to generate social bundle.");
    }
}

async function urlToBase64(url: string): Promise<string> {
  const response = await fetch(url);
  const blob = await response.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
        resolve(reader.result as string);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

export const generateListingVideo = async (images: string[], propertyDetails: string): Promise<string> => {
    try {
        // Handle if images are URLs or Base64. If URL, fetch and convert.
        const processedImages: string[] = [];
        for (const img of images) {
            if (img.startsWith('http')) {
                try {
                    const b64 = await urlToBase64(img);
                    processedImages.push(b64);
                } catch (e) {
                    console.warn("Failed to fetch image for video generation:", img);
                }
            } else {
                processedImages.push(img);
            }
        }

        if (processedImages.length === 0) {
            throw new Error("No valid images available for video generation.");
        }

        // Video generation is not supported in the new API, return a placeholder
        throw new Error("Video generation is not currently supported.");

    } catch (error) {
        console.error("Error generating video:", error);
        throw new Error("Failed to generate video. Please ensure you have valid photos.");
    }
};


export const generateAdCampaign = async (propertyDetails: string, objective: MarketingObjective, targetIncome: TargetIncome, targetInterests: string[]): Promise<{ metaAd: AdCopy, googleAd: AdCopy }> => {
    const prompt = `
    You are an expert digital marketer specializing in real estate ads for the African market.
    Based on the property details and marketing objective below, generate concise and compelling ad copy for Meta (Facebook/Instagram) and Google Ads.

    Property Details: "${propertyDetails}"
    Marketing Objective: "${objective}"
    Target Income Level: "${targetIncome}"
    Target Interests: "${targetInterests.join(', ')}"

    Instructions:
    - For Meta, provide a 'headline' (max 40 chars) and 'primaryText' (max 125 chars, use emojis).
    - For Google, provide a 'headline' (max 30 chars) and 'primaryText' (as a description, max 90 chars).
    - The copy should be highly persuasive and tailored to the objective.
    - Return a valid JSON object with keys "metaAd" and "googleAd".
    `;

    try {
        // Check if AI is available
        if (!ai) {
          throw new Error("AI service not available. Please set GEMINI_API_KEY environment variable.");
        }
        
        const model = ai.getGenerativeModel({ model: "gemini-1.5-pro" });
        const result = await model.generateContent([
          {
            text: prompt
          }
        ]);
        const response = await result.response;
        const text = await response.text();
        if (!text) {
            throw new Error("Received empty response from AI.");
        }
        return JSON.parse(text.trim());
    } catch (error) {
        console.error("Error generating ad campaign:", error);
        throw new Error("Failed to generate ad copy. The AI service may be unavailable.");
    }
};


export const generateWhatsAppReply = async (conversationHistory: string): Promise<string> => {
    const prompt = `
    You are 'Afrimmo AI', a helpful and professional real estate assistant for an agent in Africa.
    A potential client is messaging on WhatsApp. Your goal is to be helpful, build rapport, and qualify the lead by asking relevant questions (e.g., about budget, desired location, number of bedrooms, viewing availability) without being pushy.
    
    Keep your responses concise and friendly, suitable for WhatsApp. Use emojis where appropriate.

    Current conversation:
    ${conversationHistory}

    AI Response:
    `;
    // Check if AI is available
    if (!ai) {
      return "AI service not available. Please set GEMINI_API_KEY environment variable.";
    }
    
    try {
        const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent([
          {
            text: prompt
          }
        ]);
        const response = await result.response;
        const text = await response.text();
        return text || "Sorry, I'm having trouble connecting right now.";
    } catch (error) {
        console.error("Error generating WhatsApp reply:", error);
        return "Sorry, I'm having trouble connecting right now.";
    }
};

export const generateWhatsAppSuggestions = async (conversationHistory: string): Promise<string[]> => {
    const prompt = `
    You are 'Afrimmo AI', a helpful and professional real estate assistant for an agent in Africa.
    Based on the conversation so far, generate 3 different, concise, and engaging conversation starters or follow-up questions for the agent to send.
    The goal is to re-engage the client, qualify them, or move the conversation forward.
    Keep them suitable for WhatsApp (friendly, concise, use emojis).

    Current conversation:
    ${conversationHistory}

    Return a valid JSON array of strings. For example: ["suggestion 1", "suggestion 2", "suggestion 3"]
    `;

    // Check if AI is available
    if (!ai) {
      throw new Error("AI service not available. Please set GEMINI_API_KEY environment variable.");
    }
    
    try {
        const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent([
          {
            text: prompt
          }
        ]);
        const response = await result.response;

        const text = (await response.text()).trim();
        try {
          const parsed = JSON.parse(text);
          if (Array.isArray(parsed) && parsed.every(item => typeof item === 'string')) {
            return parsed;
          }
          return [text];
        } catch (parseError) {
          // If JSON parsing fails, return the text as a single-item array
          return [text];
        }

    } catch (error) {
        console.error("Error generating WhatsApp suggestions:", error);
        throw new Error("Failed to generate suggestions. Please try again.");
    }
};

export const getMarketInsights = async (query: string): Promise<{text: string, sources: {uri: string, title: string}[]}> => {
    const prompt = `
    You are a real estate market analyst specializing in the African continent.
    A real estate agent has the following query. Provide a detailed, data-informed, and well-structured response based on the latest data available from Google Search.
    Focus on trends, prices, yields, and relevant news.
    Use markdown for formatting (headings, lists).

    Agent's Query: "${query}"
    `;
    // Check if AI is available
    if (!ai) {
      throw new Error("AI service not available. Please set GEMINI_API_KEY environment variable.");
    }
    
    try {
        const model = ai.getGenerativeModel({ model: "gemini-1.5-pro" });
        const result = await model.generateContent([
          {
            text: prompt
          }
        ]);
        const response = await result.response;

        const text = await response.text() ?? "Could not retrieve market insights at this time.";

        // Grounding metadata is not available in the new API
        const sources: { uri: string; title: string }[] = [];

        return { text, sources };
    } catch (error) {
        console.error("Error fetching market insights:", error);
        throw new Error("Failed to fetch insights. The AI service may be unavailable.");
    }
};


export const getPropertyValuation = async (details: PropertyDetailsForValuation): Promise<ValuationResponse> => {
    const prompt = `
    You are an expert real estate valuation AI, specializing in the African property market.
    Your task is to provide a detailed property valuation report based on the following details.

    Property Details:
    - Location: ${details.location}
    - Property Type: ${details.propertyType}
    - Bedrooms: ${details.bedrooms}
    - Bathrooms: ${details.bathrooms}
    - Size (sqm/sqft): ${details.size}
    - Condition: ${details.condition}
    - Key Features: ${details.features}

    Instructions:
    - Analyze the provided details in the context of the current market in the specified location.
    - Provide a realistic valuation range.
    - Justify your valuation with a brief analysis, mentioning key positive and negative factors.
    - List 2-3 hypothetical but realistic comparable properties ("comps") in the area to support your valuation.
    - Provide actionable recommendations for how the agent could potentially increase the property's value.
    - Return a valid JSON object.
  `;
    // Check if AI is available
    if (!ai) {
      throw new Error("AI service not available. Please set GEMINI_API_KEY environment variable.");
    }
    
    try {
        const model = ai.getGenerativeModel({ model: "gemini-1.5-pro" });
        const result = await model.generateContent([
          {
            text: prompt
          }
        ]);
        const response = await result.response;

        const text = await response.text();
        if (!text) {
            throw new Error("Received empty response from AI.");
        }
        try {
          const parsed = JSON.parse(text.trim());
          return parsed as ValuationResponse;
        } catch (parseError) {
          throw new Error("Invalid response format from AI.");
        }
    } catch (error) {
        console.error("Error fetching property valuation:", error);
        throw new Error("Failed to get valuation. The AI service may be unavailable or the response was not valid JSON.");
    }
};

export const getPostSuggestions = async (content: string, platform: Platform): Promise<{hashtags: string[]; rewritten: string}> => {
    const prompt = `
    You are an expert social media manager for real estate in Africa.
    A real estate agent has drafted a post for ${platform}. Your task is to improve it.

    Draft Content: "${content}"

    Instructions:
    1.  Generate 5-10 relevant and trending hashtags for the African real estate market (e.g., #NigeriaRealEstate, #LekkiHomes, #InvestInAfrica).
    2.  Rewrite the content to be more engaging and optimized for the ${platform} platform. For Instagram and Threads, make it concise and visually appealing with emojis. For Facebook, it can be slightly more detailed.
    3.  Return a valid JSON object with two keys: "hashtags" (an array of strings) and "rewritten" (a string).
    `;

    // Check if AI is available
    if (!ai) {
      throw new Error("AI service not available. Please set GEMINI_API_KEY environment variable.");
    }
    
    try {
        const model = ai.getGenerativeModel({ model: "gemini-1.5-pro" });
        const result = await model.generateContent([
          {
            text: prompt
          }
        ]);
        const response = await result.response;
        const text = await response.text();
        if (!text) {
            throw new Error("Received empty response from AI.");
        }
        return JSON.parse(text.trim());
    } catch (error) {
        console.error("Error getting post suggestions:", error);
        throw new Error("Failed to get AI suggestions. The service may be unavailable.");
    }
};

export const getGoogleKeywords = async (propertyDetails: string): Promise<string[]> => {
    const prompt = `
    You are a Google Ads specialist for the African real estate market.
    Generate a list of 10-15 high-intent keywords for a Google Search campaign for the following property.

    Property Details: "${propertyDetails}"

    Instructions:
    - Include a mix of broad, phrase match (in "quotes"), and exact match (in [brackets]) keywords.
    - Include location-specific keywords.
    - Focus on keywords that indicate buying intent (e.g., "for sale", "price", "buy").
    - Return a valid JSON array of strings.
    `;
    // Check if AI is available
    if (!ai) {
      throw new Error("AI service not available. Please set GEMINI_API_KEY environment variable.");
    }
    
    try {
        const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent([
          {
            text: prompt
          }
        ]);
        const response = await result.response;
        const text = await response.text();
        if (!text) {
            throw new Error("Received empty response from AI.");
        }
        try {
          const keywords = JSON.parse(text.trim());
          if (Array.isArray(keywords) && keywords.every(k => typeof k === 'string')) {
              return keywords;
          }
          throw new Error("Invalid response format from AI.");
        } catch (parseError) {
          throw new Error("Invalid response format from AI.");
        }
    } catch (error) {
        console.error("Error generating Google keywords:", error);
        throw new Error("Failed to generate keywords. The AI service may be unavailable.");
    }
};


export const scoreLead = async (lead: Lead): Promise<{score: number; temperature: 'Hot' | 'Warm' | 'Cold'; justification: string; nextAction: string;}> => {
    const prompt = `
    You are an expert real estate sales coach AI. Your task is to analyze a lead and provide a priority score and a next action.

    Lead Data:
    - Name: ${lead.name}
    - Status: ${lead.status}
    - Source: ${lead.source}
    - Interaction History: ${lead.history.map(h => `- ${h.date}: ${h.description}`).join('\n')}
    - Notes: ${lead.notes}

    Instructions:
    1.  **Score:** Provide a numerical score from 1 to 100 representing the lead's priority. A higher score means higher priority. Consider factors like recency of contact, engagement level (e.g., scheduling a viewing is high engagement), and current status. A 'New' lead with recent contact is high priority. A 'Nurturing' lead with old contact is lower.
    2.  **Temperature:** Categorize the lead as 'Hot', 'Warm', or 'Cold' based on the score. (Hot > 75, Warm > 40, Cold <= 40).
    3.  **Justification:** Briefly explain why you gave this score (max 2 sentences).
    4.  **Next Action:** Suggest a concrete, actionable next step for the real estate agent to take (max 1 sentence).

    Return a valid JSON object.
    `;

    // Check if AI is available
    if (!ai) {
      Logger.warn("AI service not available for lead scoring", { leadId: lead.id, leadName: lead.name });
      // Return a default response when AI is not available
      return {
          score: 50,
          temperature: 'Warm',
          justification: 'Default score assigned as AI service is not available.',
          nextAction: 'Review lead details manually.'
      };
    }

    try {
        Logger.info("Starting lead scoring process", { leadId: lead.id, leadName: lead.name });

        const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent([
          {
            text: prompt
          }
        ]);
        const response = await result.response;
        const text = await response.text();
        if (!text) {
            throw new Error("Received empty response from AI for lead scoring.");
        }

        const parsedResult = JSON.parse(text.trim());
        Logger.info("Lead scoring completed successfully", { leadId: lead.id, score: parsedResult.score });

        return parsedResult;
    } catch(error) {
        Logger.error("Error scoring lead", error as Error, { leadId: lead.id, leadName: lead.name });

        // Return a default error object to avoid crashing the app
        return {
            score: 0,
            temperature: 'Cold',
            justification: 'Could not analyze lead due to an AI service error.',
            nextAction: 'Check lead details manually.'
        };
    }
};

export const runChatAction = async (conversationHistory: string): Promise<any> => {
    const prompt = `You are a helpful real estate assistant. Analyze the conversation below and call the 'scheduleViewing' function. Extract the date and time if the client mentioned them. If not, suggest a reasonable time in the near future (e.g., this coming Saturday at 2 PM).

    Conversation:
    ${conversationHistory}`;

    // Check if AI is available
    if (!ai) {
      throw new Error("AI service not available. Please set GEMINI_API_KEY environment variable.");
    }
    
    try {
        const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent([
          {
            text: prompt
          }
        ]);
        const response = await result.response;
        return await response.text();

    } catch (error) {
        console.error("Error running chat action:", error);
        throw new Error("AI action failed. The service may be unavailable.");
    }
};

export const generateLegalAgreement = async (
    type: string, 
    parties: {agent: string, client: string}, 
    propertyAddress: string, 
    price: string, 
    terms: string
): Promise<string> => {
    const prompt = `
    You are a professional legal assistant for a real estate agency in Africa. 
    Draft a formal **${type}** document.

    **Details:**
    - **Agency:** ${parties.agent}
    - **Client:** ${parties.client}
    - **Property Address:** ${propertyAddress}
    - **Agreed Value:** ${price}
    - **Key Terms/Notes:** ${terms}

    **Instructions:**
    - Create a structured, professional legal document suitable for printing.
    - Include sections for Parties, Property Description, Consideration (Price), Covenants, and Signatures.
    - Ensure tone is formal and legally binding.
    - Return the text in plain format (no markdown code blocks) suitable for a text editor.
    `;

    // Check if AI is available
    if (!ai) {
      throw new Error("AI service not available. Please set GEMINI_API_KEY environment variable.");
    }
    
    try {
        const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent([
          {
            text: prompt
          }
        ]);
        const response = await result.response;
        return response.text ?? "Unable to generate agreement.";
    } catch (error) {
        console.error("Error generating agreement:", error);
        throw new Error("Failed to generate agreement.");
    }
};
