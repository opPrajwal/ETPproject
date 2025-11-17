// backend/controllers/chatbotController.js
import axios from 'axios';

const OPENAI_KEY = process.env.OPENAI_API_KEY || '';

if (!OPENAI_KEY) {
  console.warn('⚠️ OPENAI_API_KEY not set. Chatbot will return fallback replies.');
}

const SYSTEM_PROMPT = `You are "TutorBot", a friendly assistant for the website. 
- Answer concisely and politely.
- If user asks site-specific questions (how to signup, where to find X) answer with short step-by-step guidance.
- If user asks for technical or medical advice, politely disclaim and provide general guidance.
- When asked "contact support", provide the generic support steps: "Go to contact page or email support@example.com".
`;

/**
 * POST /api/chatbot/message
 * body: { message: string, history?: [{ role: 'user'|'assistant', content: string }] }
 */
export async function postMessage(req, res) {
  try {
    const { message, history } = req.body;
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ success: false, message: 'message required' });
    }

    // If no key, fallback simple rules
    if (!OPENAI_KEY) {
      // Simple rule-based fallback
      const t = message.toLowerCase();
      if (t.includes('help') || t.includes('how to use') || t.includes('how do i')) {
        return res.json({
          success: true,
          data: {
            reply: "Welcome! To use the site: 1) Signup or Login. 2) Use the dashboard to raise doubts, create chats, or access resources. For more, click 'Help' in the top menu."
          }
        });
      }
      if (t.includes('contact') || t.includes('support')) {
        return res.json({
          success: true,
          data: { reply: "You can contact support by emailing support@example.com or using the contact form on the Contact page." }
        });
      }
      return res.json({ success: true, data: { reply: `TutorBot (offline mode) heard: "${message}" — try asking "How to use the website?"` } });
    }

    // Build messages for OpenAI (system + optional history + user)
    const messages = [
      { role: 'system', content: SYSTEM_PROMPT },
      // include any short history provided
      ...(Array.isArray(history) ? history.map(h => ({ role: h.role, content: h.content })) : []),
      { role: 'user', content: message },
    ];

    // Choose model - you can change to gpt-4o or gpt-4 if you have access
    const payload = {
      model: 'gpt-4o-mini', // change if you prefer another model
      messages,
      temperature: 0.2,
      max_tokens: 600,
    };

    const url = 'https://api.openai.com/v1/chat/completions';
    const resp = await axios.post(url, payload, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_KEY}`,
      },
      timeout: 30_000,
    });

    const botText = resp?.data?.choices?.[0]?.message?.content || "Sorry, I couldn't generate a reply.";
    return res.json({ success: true, data: { reply: botText } });
  } catch (err) {
    console.error('chatbot error', err?.response?.data || err.message || err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
}
