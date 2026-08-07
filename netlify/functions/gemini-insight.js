export default async (req) => {
  const apiKey = process.env.GEMINI_API_KEY;

  const body = await req.json();
  const userPrompt = body.prompt;

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: userPrompt }] }]
      })
    }
  );

  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "AI tidak memberikan respons.";

  return new Response(JSON.stringify({ text }), {
    headers: { "Content-Type": "application/json" }
  });
};

export const config = { path: "/api/gemini-insight" };