// api/groq.ts
import OpenAI from "openai";

export default async function handler(req, res) {
  try {
    const { prompt } = req.body;

    const client = new OpenAI({
      apiKey: process.env.VITE_GROQ_API_KEY,
      baseURL: "https://api.groq.com/openai/v1"
    });

    const completion = await client.chat.completions.create({
      model: "mixtral-8x7b-32768",
      messages: [{ role: "user", content: prompt }]
    });

    res.status(200).json({ text: completion.choices[0].message.content });

  } catch (e) {
    console.error("ERROR GROQ:", e);
    res.status(500).json({ error: "GROQ error" });
  }
}