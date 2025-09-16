// src/service/chatService.ts
import * as SecureStore from 'expo-secure-store';
import {
  createOrGetDM,
  getMessages as apiGetMessages,
  getMyConversations as apiGetMyConversations,
  postMessage as apiPostMessage,
  type Conversation,
  type Message,
  type PaginatedMessages,
} from '@/lib/messageApi';

// Lấy user hiện tại từ SecureStore (bạn đã lưu 'userInfo')
async function getCurrentUserId(): Promise<string | null> {
  const raw = await SecureStore.getItemAsync('userInfo');
  if (!raw) return null;
  try {
    const u = JSON.parse(raw);
    return u?.id ?? null;
  } catch {
    return null;
  }
}

// ===== Public service APIs =====

// Đảm bảo có DM giữa tôi và otherUserId (tạo nếu chưa có)
export async function ensureDM(otherUserId: string): Promise<Conversation> {
  return createOrGetDM(otherUserId);
}

// Gửi tin nhắn vào conversation đã có
export async function sendMessage(conversationId: string, content: string): Promise<Message> {
  if (!content || !content.trim()) {
    throw new Error('Blank message content');
  }
  return apiPostMessage(conversationId, content.trim());
}

// Gửi tin cho user khác (tự tạo/tìm DM trước)
export async function sendMessageToUser(otherUserId: string, content: string): Promise<{
  conversation: Conversation;
  message: Message;
}> {
  const conv = await ensureDM(otherUserId);
  const msg = await sendMessage(conv.id, content);
  return { conversation: conv, message: msg };
}

// Lấy danh sách conversation của tôi (sort lastMessageAt desc từ backend)
export async function getMyConversations(): Promise<Conversation[]> {
  return apiGetMyConversations();
}

// Phân trang tin nhắn (cursor-based: lấy “trang trước” theo createdAt DESC từ backend)
export async function getMessages(conversationId: string, options?: { cursor?: string; limit?: number }): Promise<PaginatedMessages> {
  return apiGetMessages(conversationId, options);
}

// ===== Helpers =====

// Tìm id người còn lại trong DM (đối phương)
export async function getPeerId(conv: Conversation): Promise<string | null> {
  const me = await getCurrentUserId();
  if (!me) return null;
  if (conv.userAId === me) return conv.userBId;
  if (conv.userBId === me) return conv.userAId;
  return null; // (nếu không thuộc conv)
}

// Kiểm tra tin do tôi gửi?
export async function isMine(msg: Message): Promise<boolean> {
  const me = await getCurrentUserId();
  return msg.senderId === me;
}
