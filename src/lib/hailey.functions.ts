import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const inputSchema = z.object({
  question: z.string().min(1).max(500),
  city: z.string().optional(),
  county: z.string().optional(),
  tempF: z.number().optional(),
  conditions: z.string().optional(),
  role: z.string().optional(),
});

export const askHailey = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => inputSchema.parse(data))
  .handler(async ({ data }) => {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return {
        answer:
          "⚠️ Hailey is standing by, but the GEMINI_API_KEY secret hasn't been set in project settings yet.",
      };
    }

    const systemPrompt = `You are Hailey (get it, hail!), the friendly, sharp, and hyper-local AI weather co-pilot for Michigan Weather Authority and Project MIWeather.
You are an expert on all 83 Michigan counties, the U.P. vs Lower Peninsula, lake-effect snow bands off Lakes Michigan, Superior, and Huron, squall lines, marine gale warnings, and frost/freeze cycles.
Keep your responses concise, punchy, and practical (2-4 sentences max unless asked for detail).
Current user context:
- Location: ${data.city || "Michigan"}${data.county ? ` (${data.county} County)` : ""}
- Temperature: ${data.tempF !== undefined ? `${data.tempF}°F` : "Current seasonal"}
- Conditions: ${data.conditions || "Active forecast"}
- User Role/Focus: ${data.role || "General Resident"}

Answer the user's question directly with actionable advice.`;

    try {
      const response = await fetch(
               `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent?key=${apiKey}`,

        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  { text: `${systemPrompt}\n\nUser Question: ${data.question}` },
                ],
              },
            ],
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 350,
            },
          }),
        }
      );

      if (!response.ok) {
        if (response.status === 429) {
          return { answer: "Hailey is catching her breath (rate limited). Try again in a minute!" };
        }
        return { answer: `Hailey ran into an issue connecting to Gemini (${response.status}).` };
      }

      const result = await response.json();
      const answer =
        result?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ||
        "I couldn't quite catch the radar on that one. Try asking again!";

      return { answer };
    } catch (err: any) {
      return { answer: `Connection error: ${err.message || "Failed to reach Hailey"}` };
    }
  });
