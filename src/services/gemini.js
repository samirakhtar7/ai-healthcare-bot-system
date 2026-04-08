import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

// Local fallback responses for when API quota is exceeded
const fallbackResponses = {
  headache:
    "I notice you mentioned a headache. Common causes: dehydration, stress, or eye strain. Try resting in a dark room, drinking water, and taking a break from screens. If severe or persistent, please see a doctor.",
  fever:
    "A fever often means your body is fighting an infection. Rest, stay hydrated, and monitor temperature. Seek medical help if fever exceeds 103°F (39.4°C) or lasts more than 3 days.",
  cold: "For cold/cough symptoms: rest, warm fluids, honey-lemon tea, and over-the-counter remedies may help. If you have difficulty breathing or high fever, see a doctor.",
  blood:
    "High blood pressure often has no symptoms but can be managed with diet, exercise, less salt, and medication as prescribed. Regular monitoring is important.",
  anxiety:
    "Feeling anxious? Try deep breathing, a short walk, or talking to someone. If it interferes with daily life, consider speaking with a mental health professional.",
  default:
    "Thank you for sharing. I'm an AI assistant (not a doctor). For serious symptoms, please consult a healthcare professional. How else can I help you today?",
};

// Simple in-memory cache to avoid repeated identical queries
const responseCache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

function getFallbackResponse(message) {
  const lowerMsg = message.toLowerCase();
  if (lowerMsg.includes("headache")) return fallbackResponses.headache;
  if (lowerMsg.includes("fever")) return fallbackResponses.fever;
  if (lowerMsg.includes("cold") || lowerMsg.includes("cough"))
    return fallbackResponses.cold;
  if (lowerMsg.includes("blood pressure") || lowerMsg.includes("hypertension"))
    return fallbackResponses.blood;
  if (lowerMsg.includes("anxiety") || lowerMsg.includes("stress"))
    return fallbackResponses.anxiety;
  return fallbackResponses.default;
}

export async function getHealthAIResponse(userMessage) {
  const key = String(userMessage ?? "")
    .trim()
    .toLowerCase();

  // Check cache first
  const cached = responseCache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    console.debug("Returning cached response for", key);
    return cached.response;
  }

  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash-lite",
      systemInstruction:
        'You are an AI Healthcare Assistant. Always include: "I am an AI, not a doctor. This is for educational purposes only." Be concise and helpful. For serious symptoms advise emergency care.',
    });

    const result = await model.generateContent(userMessage);

    // Normalize different SDK/response shapes to a string
    let response;
    if (result && typeof result.text === "function") {
      response = await result.text();
    } else if (result && Array.isArray(result.candidates)) {
      response = result.candidates
        .map((c) => {
          const parts = c?.content?.parts;
          if (Array.isArray(parts))
            return parts.map((p) => p.text || "").join("");
          return "";
        })
        .filter(Boolean)
        .join("\n\n");
    } else if (result && Array.isArray(result.output)) {
      response = result.output
        .map((o) => (o?.content || []).map((c) => c?.text || "").join(""))
        .filter(Boolean)
        .join("\n\n");
    } else if (result && typeof result === "object") {
      // try common nested response key
      response = result.response?.candidates
        ? result.response.candidates
            .map((c) => c?.content?.parts?.map((p) => p.text || "").join(""))
            .filter(Boolean)
            .join("\n\n")
        : JSON.stringify(result);
    } else {
      response = typeof result === "string" ? result : String(result);
    }

    // Store in cache using cleaned key
    responseCache.set(key, { response, timestamp: Date.now() });
    console.debug("Storing response for", key);
    return response;
  } catch (error) {
    console.error("Gemini API error:", error);

    // Check if it's a quota error (429)
    if (error.message?.includes("429") || error.status === 429) {
      console.warn("Rate limit hit, using fallback response");
      const fallback = getFallbackResponse(userMessage);
      return `${fallback}\n\n⚠️ *Note: I'm currently using a local response because the AI service is rate-limited. Please try again in a minute for full AI assistance.*`;
    }

    // Other errors: return fallback
    return (
      getFallbackResponse(userMessage) +
      "\n\nI'm having technical difficulties. Please try again later or consult a doctor for urgent needs."
    );
  }
}
