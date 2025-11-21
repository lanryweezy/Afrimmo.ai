
import { GoogleGenAI, Type, FunctionDeclaration } from "@google/genai";
import { ContentType, PropertyDetailsForValuation, ValuationResponse, Platform, MarketingObjective, AudiencePersona, AdCopy, Lead } from '../types';

// FIX: Initialize GoogleGenAI directly with the environment variable as per guidelines.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const scheduleViewingFunctionDeclaration: FunctionDeclaration = {
  name: 'scheduleViewing',
  parameters: {
    type: Type.OBJECT,
    description: 'Schedules a property viewing for a client.',
    properties: {
      date: { type: Type.STRING, description: 'The date of the viewing, e.g., "Saturday" or "2024-08-15"' },
      time: { type: Type.STRING, description: 'The time of the viewing, e.g., "2 PM"' },
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

  try {
    // FIX: Added config to request a JSON response, improving reliability.
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            responseMimeType: 'application/json',
            responseSchema: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
            }
        }
    });
    
    const text = response.text;
    if (!text) {
        throw new Error("Received empty response from AI.");
    }
    const parsed = JSON.parse(text.trim());
    if (Array.isArray(parsed) && parsed.every(item => typeof item === 'string')) {
      return parsed;
    }
    throw new Error("Invalid response format from AI.");

  } catch (error) {
    console.error("Error generating marketing content:", error);
    throw new Error("Failed to generate content. Please check your API key and try again.");
  }
};

export const generatePropertyImage = async (propertyDetails: string): Promise<string> => {
    const prompt = `Create a photorealistic, architect-designed image of a modern, luxurious property based on these details: "${propertyDetails}". The scene should be on a bright, sunny day with clear blue skies, highlighting luxury and appeal for a high-end real estate advertisement.`;

    try {
        const response = await ai.models.generateImages({
            model: 'imagen-4.0-generate-001',
            prompt: prompt,
            config: {
              numberOfImages: 1,
              outputMimeType: 'image/jpeg',
              aspectRatio: '16:9',
            },
        });
        
        if (response.generatedImages && response.generatedImages.length > 0) {
            const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
            return `data:image/jpeg;base64,${base64ImageBytes}`;
        }
        throw new Error("No image was generated.");

    } catch(error) {
        console.error("Error generating property image:", error);
        throw new Error("Failed to generate image. The AI service may be unavailable.");
    }
};


export const generateAdCampaign = async (propertyDetails: string, objective: MarketingObjective): Promise<{ metaAd: AdCopy, googleAd: AdCopy }> => {
    const prompt = `
    You are an expert digital marketer specializing in real estate ads for the African market.
    Based on the property details and marketing objective below, generate concise and compelling ad copy for Meta (Facebook/Instagram) and Google Ads.

    Property Details: "${propertyDetails}"
    Marketing Objective: "${objective}"

    Instructions:
    - For Meta, provide a 'headline' (max 40 chars) and 'primaryText' (max 125 chars, use emojis).
    - For Google, provide a 'headline' (max 30 chars) and 'primaryText' (as a description, max 90 chars).
    - The copy should be highly persuasive and tailored to the objective.
    - Return a valid JSON object with keys "metaAd" and "googleAd".
    `;

    try {
         const response = await ai.models.generateContent({
            model: 'gemini-2.5-pro',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        metaAd: {
                            type: Type.OBJECT,
                            properties: {
                                headline: { type: Type.STRING },
                                primaryText: { type: Type.STRING },
                            }
                        },
                        googleAd: {
                             type: Type.OBJECT,
                            properties: {
                                headline: { type: Type.STRING },
                                primaryText: { type: Type.STRING },
                            }
                        }
                    }
                }
            }
        });
        const text = response.text;
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
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        return response.text ?? "Sorry, I'm having trouble connecting right now.";
    } catch (error) {
        console.error("Error generating WhatsApp reply:", error);
        throw new Error("Failed to generate reply. The AI service may be unavailable.");
    }
};

export const getMarketInsights = async (query: string): Promise<string> => {
    const prompt = `
    You are a real estate market analyst specializing in the African continent.
    A real estate agent has the following query. Provide a detailed, data-informed, and well-structured response.
    Use markdown for formatting (headings, lists).

    Agent's Query: "${query}"
    
    Your Analysis:
    `;
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-pro', // Using a more powerful model for analysis
            contents: prompt,
        });
        return response.text ?? "Could not retrieve market insights at this time.";
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
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-pro',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        valueRange: { type: Type.STRING },
                        confidence: { type: Type.STRING },
                        analysis: { type: Type.STRING },
                        comps: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    address: { type: Type.STRING },
                                    price: { type: Type.STRING },
                                    notes: { type: Type.STRING },
                                }
                            }
                        },
                        recommendations: { type: Type.STRING }
                    }
                },
            },
        });

        const text = response.text;
        if (!text) {
            throw new Error("Received empty response from AI.");
        }
        const parsed = JSON.parse(text.trim());
        return parsed as ValuationResponse;
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

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-pro',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        hashtags: {
                            type: Type.ARRAY,
                            items: { type: Type.STRING }
                        },
                        rewritten: { type: Type.STRING }
                    }
                }
            }
        });
        const text = response.text;
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
     try {
        // FIX: Added config to request a JSON response, improving reliability.
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                }
            }
        });
        const text = response.text;
        if (!text) {
            throw new Error("Received empty response from AI.");
        }
        const keywords = JSON.parse(text.trim());
        if (Array.isArray(keywords) && keywords.every(k => typeof k === 'string')) {
            return keywords;
        }
        throw new Error("Invalid response format from AI.");
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
    3.  **Justification:** Briefly explain why you gave this score.
    4.  **Next Action:** Suggest a concrete, actionable next step for the real estate agent to take.

    Return a valid JSON object.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-pro',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        score: { type: Type.NUMBER },
                        temperature: { type: Type.STRING },
                        justification: { type: Type.STRING },
                        nextAction: { type: Type.STRING }
                    }
                }
            }
        });
        const text = response.text;
        if (!text) {
            throw new Error("Received empty response from AI for lead scoring.");
        }
        return JSON.parse(text.trim());
    } catch(error) {
        console.error("Error scoring lead:", error);
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

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                tools: [{ functionDeclarations: [scheduleViewingFunctionDeclaration] }],
            },
        });

        const functionCalls = response.functionCalls;
        if (functionCalls && functionCalls.length > 0) {
            return functionCalls[0];
        }
        return null;

    } catch (error) {
        console.error("Error running chat action:", error);
        throw new Error("AI action failed. The service may be unavailable.");
    }
};
