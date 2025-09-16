// src/controllers/conversation.controller.js
import { getOrCreateDM, listConversations } from '../service/conversation.service.js';
import { listMessages } from '../service/message.service.js';
import { CreateDMParamsSchema, ListMessagesQuerySchema } from '../validation/conversation.schema.js';

export async function createOrGetDM(req, res) {
  const userId = req.user.id;
  const { otherUserId } = CreateDMParamsSchema.parse(req.params);
  const conv = await getOrCreateDM(userId, otherUserId);
  res.json(conv);
}

export async function getMyConversations(req, res) {
  const userId = req.user.id;
  const convs = await listConversations(userId);
  res.json(convs);
}

export async function getMessages(req, res) {
  const userId = req.user.id;
  const { cursor, limit } = ListMessagesQuerySchema.parse(req.query);
  const conversationId = req.params.id;
  const data = await listMessages({ conversationId, userId, cursor, limit });
  res.json(data);
}
