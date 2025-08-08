import OpenAI from "openai";

const openai = new OpenAI({
  //   apiKey: process.env.REACT_APP_OPENAI_API_KEY,
  apiKey:
    "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",
  dangerouslyAllowBrowser: true,
});

export async function generateImage(prompt) {
  if (!prompt || typeof prompt !== "string" || prompt.trim().length < 3) {
    throw new Error(
      "Invalid prompt: Must be a string with at least 3 characters"
    );
  }
  try {
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: prompt.trim(),
      n: 1,
      size: "auto", // Explicitly set to a supported value
    });
    return response.data[0].url;
  } catch (error) {
    console.error("OpenAI API Error:", error.response?.data || error.message);
    throw error;
  }
}
