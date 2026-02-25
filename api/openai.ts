// api/openai.ts
import OpenAI from "openai";

export default async function handler(req: Request) {
  try {
    const { prompt } = await req.json();

    const client = new OpenAI({
      apiKey: process.env.VITE_OPENAI_API_KEY
    });

    const completion = await client.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [{ role: "user", content: prompt }]
    });

    return new Response(
      JSON.stringify({ text: completion.choices[0].message.content }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );

  } catch (e) {
    console.error("ERROR OPENAI:", e);
    return new Response(JSON.stringify({ error: "OpenAI error" }), { status: 500 });
  }
}