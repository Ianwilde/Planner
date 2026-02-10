
import { GoogleGenAI, Type } from "@google/genai";
import { AIPlanResponse } from "../types";

/**
 * Generates an optimized daily schedule using Gemini AI based on user's tasks and brain dump.
 */
export const getSmartSchedule = async (brainDump: string, existingTasks: string): Promise<AIPlanResponse> => {
  // Initialize the Gemini API client inside the function to ensure the most current API key is used
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  // Use gemini-3-pro-preview for advanced reasoning tasks like scheduling and organization
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `You are a Zen productivity coach. Your goal is to help the user find balance and focus.
    
    Current Tasks: ${existingTasks}
    User's Brain Dump: ${brainDump}
    
    Analyze the tasks and thoughts. Organize them into a realistic, calm, and effective daily schedule.
    Prioritize meaningful focus blocks and wellbeing.
    Return the plan in a clear JSON structure.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          summary: {
            type: Type.STRING,
            description: "A calming overview of the recommended approach for the day."
          },
          motivationalQuote: {
            type: Type.STRING,
            description: "An inspiring quote aligned with productivity and peace."
          },
          recommendedSchedule: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                time: { type: Type.STRING, description: "Start time (e.g., '09:00 AM')" },
                activity: { type: Type.STRING, description: "Description of the task or focus area" },
                category: { type: Type.STRING, description: "Type of task (e.g., 'Work', 'Health', 'Personal')" },
                duration: { type: Type.STRING, description: "Estimated time needed (e.g., '1 hour')" }
              },
              required: ["time", "activity", "category", "duration"]
            }
          }
        },
        required: ["summary", "motivationalQuote", "recommendedSchedule"]
      }
    }
  });

  try {
    // Extract the text content from the response object
    const text = response.text || "{}";
    return JSON.parse(text) as AIPlanResponse;
  } catch (error) {
    console.error("AI Schedule Parsing Error:", error);
    // Fallback response in case of parsing errors
    return {
      summary: "I've encountered a small ripple in the stream of thoughts, but stay centered.",
      motivationalQuote: "Order is the key to clarity.",
      recommendedSchedule: [
        { time: "Start", activity: "Review your current priorities", category: "Mindfulness", duration: "15 mins" }
      ]
    };
  }
};

export const checkHealth = () => true;
