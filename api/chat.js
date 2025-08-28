import fetch from "node-fetch";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  const { message } = req.body;
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: message }] }],
        }),
      }
    );

    const data = await response.json();
    const reply =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Hmm... I don’t know what to say.";

    res.status(200).json({ reply });
  } catch (err) {
    console.error(err);
    res.status(500).json({ reply: "Error talking to Gemini." });
  }
}
