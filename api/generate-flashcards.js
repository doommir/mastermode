import { OpenAI } from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  try {
    const { text } = req.body;

    const prompt = `
Convert this educational content into flashcards in JSON format like:
[
  { "front": "Question?", "back": "Answer." }
]

Text:
"""${text}"""
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    const flashcards = JSON.parse(response.choices[0].message.content);
    res.status(200).json({ flashcards });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Flashcard generation failed." });
  }
}
