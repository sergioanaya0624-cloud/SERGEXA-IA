export async function callOpenAI(prompt: string) {
  return callAPIInternal("openai", prompt);
}

export async function callGroq(prompt: string) {
  return callAPIInternal("groq", prompt);
}

async function callAPIInternal(provider: "openai" | "groq", prompt: string) {
  const res = await fetch(`/api/${provider}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt })
  });

  const data = await res.json();
  return data.text;
}
