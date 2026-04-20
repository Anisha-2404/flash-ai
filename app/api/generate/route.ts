export async function POST(req: Request) {
  try {
    const { text } = await req.json();

    if (!process.env.GOOGLE_API_KEY) {
      throw new Error("API key missing");
    }

    const prompt = `
Create flashcards from this text.

Return ONLY JSON:
[
  {"question":"...","answer":"..."}
]

Text:
${text}
`;

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GOOGLE_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
        }),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      console.log("❌ API ERROR:", data);
      return Response.json({ error: JSON.stringify(data) });
    }

    let output =
      data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

    let clean = output
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const start = clean.indexOf("[");
    const end = clean.lastIndexOf("]");
    if (start !== -1 && end !== -1) {
      clean = clean.slice(start, end + 1);
    }

    try {
      const parsed = JSON.parse(clean);
      return Response.json({ cards: parsed });
    } catch {
      return Response.json({
        cards: [
          {
            question: "Error generating flashcards",
            answer: "Try again",
          },
        ],
      });
    }
  } catch (err: any) {
    return Response.json({ error: err.message });
  }
}