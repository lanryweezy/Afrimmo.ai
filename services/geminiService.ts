import { GoogleGenAI, Type, FunctionDeclaration, VideoGenerationReferenceType, VideoGenerationReferenceImage } from "@google/genai";
import { ContentType, PropertyDetailsForValuation, ValuationResponse, Platform, MarketingObjective, AudiencePersona, AdCopy, Lead, SocialBundle, TargetIncome } from '../types';

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
    // Fallback content to ensure app doesn't crash
    return [
        `Discover this amazing property: ${propertyDetails.substring(0, 50)}... Contact us for more!`,
        `New Listing Alert! ${propertyDetails.substring(0, 50)}... Perfect for ${audience}.`,
        `Don't miss out on this opportunity. ${propertyDetails.substring(0, 50)}... DM for details.`
    ];
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
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        instagramCaption: { type: Type.STRING },
                        whatsappMessage: { type: Type.STRING },
                        youtubeTitle: { type: Type.STRING },
                        youtubeDescription: { type: Type.STRING },
                        hashtags: { type: Type.ARRAY, items: { type: Type.STRING } }
                    }
                }
            }
        });
        const text = response.text;
        if(!text) throw new Error("Empty response");
        return JSON.parse(text.trim());
    } catch (error) {
        console.error("Error generating social bundle:", error);
        return {
            instagramCaption: `Check out this stunning property! ${price}. DM for details.`,
            whatsappMessage: `New Listing Alert! ${price}. Ask me for a tour.`,
            youtubeTitle: `Luxury Home Tour - ${price}`,
            youtubeDescription: `Walkthrough of this beautiful property. Contact for more info.`,
            hashtags: ['#RealEstate', '#DreamHome', '#ForSale']
        };
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

        // We can use up to 3 reference images for Veo 3.1
        const selectedImages = processedImages.slice(0, 3);
        
        const referenceImagesPayload: VideoGenerationReferenceImage[] = [];
        for (const img of selectedImages) {
            // Remove data URL prefix if present
            const cleanBase64 = img.split(',')[1] || img;
            
            referenceImagesPayload.push({
                image: {
                    imageBytes: cleanBase64,
                    mimeType: 'image/jpeg', 
                },
                referenceType: VideoGenerationReferenceType.ASSET,
            });
        }

        // Using Veo to animate the images into a video clip
        let operation = await ai.models.generateVideos({
            model: 'veo-3.1-generate-preview',
            prompt: `Cinematic real estate video tour. Smoothly animate and transition between these property images. High quality, 4k, professional real estate videography. ${propertyDetails}`,
            config: {
                numberOfVideos: 1,
                referenceImages: referenceImagesPayload,
                resolution: '720p',
                aspectRatio: '16:9'
            }
        });

        // Polling for completion
        while (!operation.done) {
            await new Promise(resolve => setTimeout(resolve, 10000)); // Poll every 10 seconds for Veo
            operation = await ai.operations.getVideosOperation({operation: operation});
        }

        const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
        if (!downloadLink) throw new Error("Video generation failed to produce a URI.");
        
        // Fetch the actual video bytes
        const videoResponse = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
        const videoBlob = await videoResponse.blob();
        return URL.createObjectURL(videoBlob);

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
        return {
            metaAd: { headline: "Dream Home Available", primaryText: `Check out this amazing property. ${propertyDetails.substring(0, 50)}...` },
            googleAd: { headline: "Luxury Home for Sale", primaryText: "Contact us today for a viewing." }
        };
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
        return "I'm having a bit of trouble connecting to my brain right now. Can I get back to you in a moment?";
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

    try {
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
        
        const text = response.text?.trim() || '[]';
        const parsed = JSON.parse(text);
        if (Array.isArray(parsed) && parsed.every(item => typeof item === 'string')) {
          return parsed;
        }
        return ["Hi there! Still interested?", "Any questions?", "Can I help?"];

    } catch (error) {
        console.error("Error generating WhatsApp suggestions:", error);
        return ["Hello!", "How can I help?", "Are you free for a call?"];
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
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-pro',
            contents: prompt,
            config: {
                tools: [{googleSearch: {}}]
            }
        });
        
        const text = response.text ?? "Could not retrieve market insights at this time.";
        
        const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks
            ?.map((chunk: any) => chunk.web)
            .filter((web: any) => web)
            .map((web: any) => ({ uri: web.uri, title: web.title })) || [];

        return { text, sources };
    } catch (error) {
        console.error("Error fetching market insights:", error);
        return { text: "Market insights are currently unavailable. Please try again later.", sources: [] };
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
        return ["Real Estate", "Homes for sale", "Property Africa"];
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

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
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
                },
                maxOutputTokens: 1024,
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

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        return response.text ?? "Unable to generate agreement.";
    } catch (error) {
        console.error("Error generating agreement:", error);
        throw new Error("Failed to generate agreement.");
    }
};