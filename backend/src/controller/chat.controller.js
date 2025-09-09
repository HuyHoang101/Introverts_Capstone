import { chatWithBot } from "../service/chat.service.js";

export const chatController = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const reply = await chatWithBot(message);
    res.json({ reply });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
