// src/lib/api/chatApi.ts
import { api } from './http';

// ===== Types () =====
export type Conversation = {
  id: string;
  participantKey: string;
  userAId: string;
  userBId: string;
  createdAt: string;
  updatedAt: string;
  lastMessageAt: string | null;
};

export type Message = {
  id: string;
  conversationId: string;
  senderId: string;
  content: string | null;
  attachments?: any | null;
  createdAt: string;
};

export type PaginatedMessages = {
  items: Message[];
  nextCursor: string | null;
  hasMore: boolean;
};

// ===== Endpoints =====

// POST /api/dm/:otherUserId
export async function createOrGetDM(otherUserId: string) {
  return api<Conversation>(`/api/dm/${otherUserId}`, { method: 'POST' });
}

// GET /api/conversations
export async function getMyConversations() {
  return api<Conversation[]>(`/api/conversations`, { method: 'GET' });
}

// GET /api/conversations/:id/messages?cursor=&limit=
export async function getMessages(conversationId: string, params?: { cursor?: string; limit?: number }) {
  return api<PaginatedMessages>(`/api/conversations/${conversationId}/messages`, {
    method: 'GET',
    params,
  });
}

// POST /api/messages { conversationId, content }
export async function postMessage(conversationId: string, content: string) {
  return api<Message>(`/api/messages`, {
    method: 'POST',
    body: { conversationId, content },
  });
}
