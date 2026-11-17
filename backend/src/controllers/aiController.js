import { GoogleGenAI } from "@google/genai";

// Gemini model priority: latest first, then fallbacks.
const MODELS = [
  "gemini-3.8-flash",
  "gemini-3.5-flash-lite",
  "gemini-3.6-flash",
];

// Fitness coach instructions.
const SYSTEM_INSTRUCTION = `
You are FitTrack AI, a friendly and knowledgeable personal fitness coach.

Help users with:
- Workout planning and muscle hypertrophy
- Exercise techniques and form
- Nutrition and protein intake
- Recovery and healthy fitness habits
- Strength training and fitness goals

Rules:
- Give practical, clear and organized advice.
- Explain recommendations in simple language.
- Never diagnose medical conditions or prescribe medicines.
- Do not recommend dangerous supplements or extreme dieting.
- Never encourage training through serious pain.
- Recommend a qualified healthcare professional for medical concerns.
`;

// Wait helper.
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Detect temporary API errors.
const isRetryableError = (error) => {
  const details = [
    error?.message,
    error?.status,
    error?.code,
    error?.cause?.message,
  ]
    .map((value) => String(value ?? ""))
    .join(" ")
    .toUpperCase();

  return /503|429|500|502|504|UNAVAILABLE|RESOURCE_EXHAUSTED|OVERLOADED|HIGH DEMAND|TIMEOUT|ECONNRESET|ETIMEDOUT/.test(
    details,
  );
};

// Generate response using primary and fallback models.
const generateWithFallback = async (ai, contents) => {
  let lastError = null;

  for (const model of MODELS) {
    try {
      console.log(`AI Coach: Trying model ${model}`);

      const response = await ai.models.generateContent({
        model,
        contents,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          temperature: 0.7,
          maxOutputTokens: 2048,
        },
      });

      const reply = response.text?.trim();

      if (!reply) {
        throw new Error("Gemini returned an empty response.");
      }

      console.log(`AI Coach: Successfully responded using ${model}`);

      return reply;
    } catch (error) {
      lastError = error;

      console.error(
        `AI Coach: ${model} failed.`,
        "Status:",
        error?.status ?? error?.code ?? "Unknown",
        "Message:",
        error?.message ?? error,
      );

      // Do not try other models for non-temporary errors.
      if (!isRetryableError(error)) {
        throw error;
      }

      console.log(`AI Coach: Moving to the next fallback model.`);

      // Small delay before attempting the next model.
      await wait(1000);
    }
  }

  throw lastError || new Error("All Gemini models failed.");
};

// Main AI controller.
export const chatWithAI = async (req, res) => {
  try {
    const { message, history = [] } = req.body ?? {};

    // Validate message.
    if (typeof message !== "string" || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid message.",
      });
    }

    if (message.length > 3000) {
      return res.status(400).json({
        success: false,
        message: "Message is too long. Maximum 3000 characters.",
      });
    }

    // Validate API key.
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      console.error("GEMINI_API_KEY is missing from backend .env");

      return res.status(500).json({
        success: false,
        message: "Gemini API key is not configured.",
      });
    }

    // Initialize Gemini SDK.
    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        timeout: 30000,
      },
    });

    // Validate and prepare conversation history.
    const contents = Array.isArray(history)
      ? history
          .filter(
            (item) =>
              item &&
              ["user", "assistant"].includes(item.role) &&
              typeof item.text === "string" &&
              item.text.trim(),
          )
          .slice(-8)
          .map((item) => ({
            role: item.role === "assistant" ? "model" : "user",
            parts: [
              {
                text: item.text.trim().slice(0, 3000),
              },
            ],
          }))
      : [];

    // Avoid sending the latest user message twice.
    const lastMessage = contents[contents.length - 1];

    if (
      !lastMessage ||
      lastMessage.role !== "user" ||
      lastMessage.parts[0].text !== message.trim()
    ) {
      contents.push({
        role: "user",
        parts: [
          {
            text: message.trim(),
          },
        ],
      });
    }

    // Generate response.
    const reply = await generateWithFallback(ai, contents);

    return res.status(200).json({
      success: true,
      reply,
    });
  } catch (error) {
    console.error(
      "AI Coach Final Error:",
      error?.status ?? error?.code ?? "Unknown",
      error?.message ?? error,
    );

    const retryable = isRetryableError(error);

    return res.status(retryable ? 503 : 502).json({
      success: false,
      message: retryable
        ? "Gemini is temporarily unavailable. Please try again shortly."
        : "AI Coach encountered an error. Please check the backend terminal.",
    });
  }
};
