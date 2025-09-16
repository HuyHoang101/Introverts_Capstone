// src/controllers/message.controller.js
import { SendMessageBodySchema } from '../validation/message.schema.js';
import { sendMessage } from '../service/message.service.js';

export async function postMessage(req, res) {
  const senderId = req.user.id;
  const { conversationId, content } = SendMessageBodySchema.parse(req.body);
  const msg = await sendMessage({ conversationId, senderId, content });
  res.status(201).json(msg);
}
