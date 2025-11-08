import axios from 'axios';

export async function getGeminiReply(prompt) {
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  if (!GEMINI_API_KEY) throw new Error('GEMINI_API_KEY not set in environment');

  const url =
    'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';
  const headers = { 'Content-Type': 'application/json' };

  // System instruction to make responses plain and precise
  const systemInstruction = `
You are a clear and concise AI assistant.
Respond in plain text only.
Do not use any special characters, symbols, markdown, or formatting.
Avoid lists, bullet points, bold text, or code formatting.
Keep the answer short, precise, and directly related to the question.
`;

  const data = {
    contents: [
      {
        role: 'user',
        parts: [
          { text: `${systemInstruction}\n\nUser question:\n${prompt}` },
        ],
      },
    ],
  };

  try {
    const res = await axios.post(`${url}?key=${GEMINI_API_KEY}`, data, { headers });
    return (
      res.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      'No reply from Gemini AI.'
    );
  } catch (err) {
    console.error('Gemini API error', err?.response?.data || err);
    return 'AI could not generate a reply at this time.';
  }
}
