// src/validation/message.schema.js
import { z } from 'zod';

export const SendMessageBodySchema = z.object({
  conversationId: z.string().min(1),
  content: z.string().min(1).max(10000)
});
