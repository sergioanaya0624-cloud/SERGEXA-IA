// api/groq.ts
import OpenAI from "openai";

export default async function handler(req, res) {
  try {
    const { prompt } = req.body;

    const client = new OpenAI({
      apiKey: process.env.GROQ_API_KEY,
      baseURL: "https://api.groq.com/openai/v1"
    });

    const completion = await client.chat.completions.create({
      model: "mixtral-8x7b-32768",
      messages: [{ role: "user", content: prompt }]
    });

    res.status(200).json({
      text: completion.choices[0].message.content
    });

  } catch (error) {
    console.error("ERROR GROQ:", error);
    res.status(500).json({ error: "Groq error" });
  }
}