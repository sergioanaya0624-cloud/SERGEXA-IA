// api/groq.ts
import OpenAI from "openai";

// ❌ Elimina esto:
// export const config = { runtime: "edge" };

export default async function handler(req) {
  try {
    const { prompt } = await req.json();
    const client = new OpenAI({
      apiKey: process.env.VITE_GROQ_API_KEY,
      baseURL: "https://api.groq.com/openai/v1"
    });
    const completion = await client.chat.completions.create({
      model: "mixtral-8x7b-32768",
      messages: [{ role: "user", content: prompt }]
    });
    return new Response(
      JSON.stringify({ text: completion.choices[0].message.content }),
      { status: 200 }
    );
  } catch (e) {
    console.error("ERROR GROQ:", e);
    return new Response(JSON.stringify({ error: "GROQ error" }), { status: 500 });
  }
}
