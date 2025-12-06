import { GoogleGenAI, Type, FunctionDeclaration, VideoGenerationReferenceType, VideoGenerationReferenceImage } from "@google/genai";
import { ContentType, PropertyDetailsForValuation, ValuationResponse, Platform, MarketingObjective, AudiencePersona, AdCopy, Lead, SocialBundle, TargetIncome } from '../types';

// Helper to safely get the AI client
const getAiClient = () => {
  try {
    if (process.env.API_KEY) {
      return new GoogleGenAI({ apiKey: process.env.API_KEY });
    }
    console.warn("API Key is missing. Running in Mock/Demo mode.");
    return null;
  } catch (error) {
    console.error("Failed to initialize GoogleGenAI:", error);
    return null;
  }
};

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
  const ai = getAiClient();
  if (!ai) {
    // Mock Data for Demo Mode
    return [
      `🏡 *Just Listed!* Exquisite property alert! ${propertyDetails.substring(0, 50)}... This gem won't last long. DM for viewing! #LagosRealEstate #DreamHome`,
      `✨ Elevate your lifestyle with this stunning new listing. Perfect for ${audience}. Features include modern finishing and serene environment. Contact us today!`,
      `🔥 Hot Deal! Looking for value? Check out this ${propertyDetails.split(',')[0] || 'property'}. Ideal for investment or family living. 📞 Call now!`
    ];
  }

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
    - Output the result as a JSON array of strings.
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
    if (!text) throw new Error("Empty response");
    return JSON.parse(text.trim());

  } catch (error) {
    console.error("Error generating marketing content:", error);
    return [
      "Could not generate content right now. Please check your connection.",
      "Draft: Beautiful property available for sale. Contact for details.",
      "Draft: New listing alert! Don't miss this opportunity."
    ];
  }
};

export const generateSocialBundle = async (propertyDetails: string, price: string): Promise<SocialBundle> => {
    const ai = getAiClient();
    if (!ai) {
        return {
            instagramCaption: `✨ NEW LISTING ALERT ✨\n\nDiscover luxury living at its finest! 🏠\n\n${propertyDetails}\n\n💰 Price: ${price}\n\n📍 Great Location\n🔑 Secure Title\n\nDM for private viewing! 📩\n\n#RealEstate #DreamHome #ForSale #AfricaRealEstate`,
            whatsappMessage: `Hello! 👋 Just listed a fantastic property that fits your criteria. \n\n${propertyDetails} going for ${price}. \n\nLet me know if you want to see the video tour!`,
            youtubeTitle: `INSIDE a ${price} Luxury Home! 😱 MUST SEE!`,
            youtubeDescription: `Join us for a tour of this amazing property featuring ${propertyDetails}. Located in a prime area. Contact us for inquiries.`,
            hashtags: ['#RealEstate', '#LagosHomes', '#Investment', '#Luxury', '#Property']
        };
    }

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
            instagramCaption: "Error generating caption.",
            whatsappMessage: "Error generating message.",
            youtubeTitle: "Error generating title.",
            youtubeDescription: "Error generating description.",
            hashtags: []
        };
    }
}

async function urlToBase64(url: string): Promise<string> {
  try {
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
  } catch (e) {
      console.error("Failed to convert image", e);
      return "";
  }
}

export const generateListingVideo = async (images: string[], propertyDetails: string): Promise<string> => {
    const ai = getAiClient();
    // Veo requires a valid paid key and won't work in free tier often, or if key is missing.
    // Return a dummy video URL or handle gracefully.
    if (!ai) {
        // Return a sample video URL for demo purposes
        return "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4"; 
    }

    try {
        // Handle if images are URLs or Base64. If URL, fetch and convert.
        const processedImages: string[] = [];
        for (const img of images) {
            if (img.startsWith('http')) {
                const b64 = await urlToBase64(img);
                if (b64) processedImages.push(b64);
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
        // Fallback video
        return "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4"; 
    }
};

export const generatePropertyImage = async (propertyDetails: string): Promise<string> => {
    const ai = getAiClient();
    // Return a placeholder if no AI client
    if (!ai) {
        return `https://picsum.photos/seed/${propertyDetails.length}/800/600`;
    }

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
        // Fallback
        return `https://picsum.photos/seed/${propertyDetails.length}/800/600`;
    }
};

export const generateAdCampaign = async (propertyDetails: string, objective: MarketingObjective, targetIncome: TargetIncome, targetInterests: string[]): Promise<{ metaAd: AdCopy, googleAd: AdCopy }> => {
    const ai = getAiClient();
    if (!ai) {
        return {
            metaAd: { 
                headline: "Dream Home in Lagos 🏡", 
                primaryText: `Don't miss this ${propertyDetails}. Located in a prime secure area. Perfect for families! DM for price. 👇` 
            },
            googleAd: { 
                headline: "Luxury Property for Sale", 
                primaryText: "Exquisite finishing, spacious rooms, and great ROI. Book a viewing today." 
            }
        };
    }

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
        if (!text) throw new Error("Empty AI response");
        return JSON.parse(text.trim());
    } catch (error) {
        console.error("Error generating ad campaign:", error);
        return {
            metaAd: { headline: "Property for Sale", primaryText: "Check out this amazing listing." },
            googleAd: { headline: "Home for Sale", primaryText: "Contact us for details." }
        };
    }
};


export const generateWhatsAppReply = async (conversationHistory: string): Promise<string> => {
    const ai = getAiClient();
    if (!ai) return "Hello! Thanks for your message. How can I assist you with your property search today? 🏠";

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
        return response.text ?? "I'm having a bit of trouble connecting. Can I get back to you?";
    } catch (error) {
        console.error("Error generating WhatsApp reply:", error);
        return "Thanks for your interest! I'll check on that and get back to you shortly.";
    }
};

export const generateWhatsAppSuggestions = async (conversationHistory: string): Promise<string[]> => {
    const ai = getAiClient();
    if (!ai) return ["Is it still available?", "What is the price?", "Can I schedule a viewing?"];

    const prompt = `
    You are 'Afrimmo AI', a helpful and professional real estate assistant for an agent in Africa.
    Based on the conversation so far, generate 3 different, concise, and engaging conversation starters or follow-up questions for the agent to send.
    The goal is to re-engage the client, qualify them, or move the conversation forward.
    Keep them suitable for WhatsApp (friendly, concise, use emojis).

    Current conversation:
    ${conversationHistory}

    Return a valid JSON array of strings.
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
    const ai = getAiClient();
    if (!ai) {
        return { 
            text: "Based on historical trends, **Lekki Phase 1** has seen a **15% year-on-year increase** in rental values. Demand for 2-bedroom apartments remains high among young professionals.\n\n*   **Average Rent:** ₦5M - ₦8M per annum\n*   **Yield:** 6-8%\n*   **Trend:** Rising steadily", 
            sources: [] 
        };
    }

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
    const ai = getAiClient();
    if (!ai) {
        // Mock Valuation
        return {
            valueRange: "₦120,000,000 - ₦135,000,000",
            confidence: "Medium",
            analysis: "Based on the location in **" + details.location + "** and size (" + details.size + "sqm), this property falls within the upper-mid market segment. The condition is a key factor.",
            comps: [
                { address: "Similar prop nearby", price: "₦125M", notes: "Sold last month" },
                { address: "Listing on same street", price: "₦140M", notes: "Larger lot size" }
            ],
            recommendations: "Consider repainting the exterior to push value towards the upper range."
        };
    }

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
        if (!text) throw new Error("Empty AI response");
        return JSON.parse(text.trim()) as ValuationResponse;
    } catch (error) {
        console.error("Error fetching property valuation:", error);
        throw new Error("Failed to get valuation.");
    }
};

export const getPostSuggestions = async (content: string, platform: Platform): Promise<{hashtags: string[]; rewritten: string}> => {
    const ai = getAiClient();
    if (!ai) {
        return {
            rewritten: content + " (Optimized for engagement! 🚀)",
            hashtags: ["#RealEstate", "#Africa", "#Property", "#Investment", "#Home"]
        };
    }

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
        if (!text) throw new Error("Empty AI response");
        return JSON.parse(text.trim());
    } catch (error) {
        console.error("Error getting post suggestions:", error);
        return {
            hashtags: ['#RealEstate'],
            rewritten: content
        };
    }
};

export const getGoogleKeywords = async (propertyDetails: string): Promise<string[]> => {
    const ai = getAiClient();
    if (!ai) return ["Real Estate Lagos", "Buy House Africa", "Luxury Homes", "Investment Property", "Lekki Homes"];

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
        if (!text) throw new Error("Empty AI response");
        return JSON.parse(text.trim());
    } catch (error) {
        console.error("Error generating Google keywords:", error);
        return ["Real Estate", "Homes for sale", "Property Africa"];
    }
};


export const scoreLead = async (lead: Lead): Promise<{score: number; temperature: 'Hot' | 'Warm' | 'Cold'; justification: string; nextAction: string;}> => {
    const ai = getAiClient();
    if (!ai) {
        // Simple deterministic scoring for demo
        const isHot = lead.source === 'WhatsApp';
        return {
            score: isHot ? 85 : 45,
            temperature: isHot ? 'Hot' : 'Warm',
            justification: isHot ? "Lead engaged via WhatsApp, high intent channel." : "Standard inquiry via form.",
            nextAction: isHot ? "Schedule a call immediately." : "Send brochure and follow up."
        };
    }

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
        if (!text) throw new Error("Empty AI response");
        return JSON.parse(text.trim());
    } catch(error) {
        console.error("Error scoring lead:", error);
        return {
            score: 50,
            temperature: 'Warm',
            justification: 'Could not analyze lead due to network/API error.',
            nextAction: 'Manually review lead details.'
        };
    }
};

export const runChatAction = async (conversationHistory: string): Promise<any> => {
    const ai = getAiClient();
    if (!ai) return null;

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
        return null;
    }
};

export const generateLegalAgreement = async (
    type: string, 
    parties: {agent: string, client: string}, 
    propertyAddress: string, 
    price: string, 
    terms: string
): Promise<string> => {
    const ai = getAiClient();
    if (!ai) {
        return `
DRAFT ${type.toUpperCase()}

THIS AGREEMENT is made this day....

BETWEEN:
${parties.agent} (The Agent)
AND
${parties.client} (The Client)

IN RESPECT OF:
${propertyAddress}

CONSIDERATION:
${price}

TERMS:
${terms}

(This is a generated mock document for demo purposes.)
        `;
    }

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
        return "Failed to generate agreement template.";
    }
};