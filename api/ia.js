export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Método no permitido" });
    return;
  }

  try {
    const { prompt } = req.body;

    if (!prompt) {
      res.status(400).json({ error: "Falta el prompt" });
      return;
    }

    const payload = {
      model: "meta-llama/llama-3-8b-instruct",
      messages: [
        { 
          role: "system", 
          content: "Eres un asistente útil y especializado. Responde de forma concisa y profesional en español." 
        },
        { role: "user", content: prompt }
      ],
      temperature: 0.2,
      max_tokens: 500
    };

    const apiRes = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "HTTP-Referer": "https://tu-dominio.vercel.app",
        "X-Title": "Asistente Diario IA"
      },
      body: JSON.stringify(payload)
    });

    const json = await apiRes.json();

    const content = json?.choices?.[0]?.message?.content;

    if (!content) {
      return res.status(502).json({ 
        error: "Respuesta inválida del modelo", 
        detalles: json 
      });
    }

    res.status(200).json({ resultado: content.trim() });

  } catch (error) {
    console.error("Error en API IA:", error);
    res.status(500).json({ 
      error: error.message || "Error interno del servidor" 
    });
  }
}