// src/validation/conversation.schema.js
import { z } from 'zod';

export const CreateDMParamsSchema = z.object({
  otherUserId: z.string().min(1)
});

export const ListMessagesQuerySchema = z.object({
  cursor: z.string().datetime().optional(),
  limit: z.coerce.number().int().min(1).max(100).default(20)
});
