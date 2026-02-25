// api/openai.ts
import OpenAI from "openai";

export default async function handler(req, res) {
  try {
    const { prompt } = req.body;

    const client = new OpenAI({
      apiKey: process.env.VITE_OPENAI_API_KEY
    });

    const completion = await client.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [{ role: "user", content: prompt }]
    });

    res.status(200).json({ text: completion.choices[0].message.content });

  } catch (e) {
    console.error("ERROR OPENAI:", e);
    res.status(500).json({ error: "OpenAI error" });
  }
}