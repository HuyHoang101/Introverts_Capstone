// src/services/notificationService.ts
import request from '@/lib/notificationApi';

export type NotificationType =
  | 'BOOKING_REMINDER_15M'
  | 'BOOKING_START'
  | 'POST_NEW'
  | (string & {}); // mở rộng

export type NotificationDto = {
  id: string;
  title: string;
  content: string;
  isRead: boolean;
  userId: string;
  type: NotificationType;
  refId?: string | null;
  scheduledFor?: string | null; // ISO string
  createdAt: string;            // ISO
  updatedAt: string;            // ISO
};

export type CreateNotificationInput = {
  title: string;
  content: string;
  userId: string;
  type: NotificationType;
  refId?: string | null;
  scheduledFor?: string | null;
  isRead?: boolean;
};

export type UpdateNotificationInput = Partial<
  Pick<
    NotificationDto,
    'title' | 'content' | 'isRead' | 'type' | 'refId' | 'scheduledFor'
  >
>;

// --- LIST (tất cả)
export async function fetchNotifications(params?: {
  page?: number;       // nếu backend hỗ trợ
  limit?: number;      // nếu backend hỗ trợ
  isRead?: boolean;    // nếu backend hỗ trợ
}) {
  const q = new URLSearchParams();
  if (params?.page !== undefined) q.set('page', String(params.page));
  if (params?.limit !== undefined) q.set('limit', String(params.limit));
  if (params?.isRead !== undefined) q.set('isRead', String(params.isRead));
  return request(`/?${q.toString()}`, { method: 'GET' }) as Promise<NotificationDto[] | { items: NotificationDto[], nextCursor?: string }>;
}

// --- LIST (theo user)
export async function fetchNotificationsByUser(userId: string, params?: {
  page?: number;
  limit?: number;
  isRead?: boolean;
}) {
  const q = new URLSearchParams();
  if (params?.page !== undefined) q.set('page', String(params.page));
  if (params?.limit !== undefined) q.set('limit', String(params.limit));
  if (params?.isRead !== undefined) q.set('isRead', String(params.isRead));
  return request(`/user/${userId}?${q.toString()}`, { method: 'GET' }) as Promise<NotificationDto[] | { items: NotificationDto[], nextCursor?: string }>;
}

// --- GET one
export async function fetchNotification(id: string) {
  return request(`/${id}`, { method: 'GET' }) as Promise<NotificationDto>;
}

// --- CREATE
export async function createNotification(input: CreateNotificationInput) {
  return request('/', {
    method: 'POST',
    body: JSON.stringify(input),
  }) as Promise<NotificationDto>;
}

// --- UPDATE
export async function updateNotification(id: string, patch: UpdateNotificationInput) {
  return request(`/${id}`, {
    method: 'PUT',
    body: JSON.stringify(patch),
  }) as Promise<NotificationDto>;
}

// --- DELETE
export async function deleteNotification(id: string) {
  return request(`/${id}`, { method: 'DELETE' }) as Promise<{ ok: true } | NotificationDto>;
}

// --- tiện ích: đánh dấu đã đọc
export async function markNotificationRead(id: string) {
  return updateNotification(id, { isRead: true });
}

// --- tiện ích: đánh dấu tất cả đã đọc (fallback nếu backend chưa có route riêng)
export async function markAllReadByUser(userId: string) {
  // Lấy danh sách chưa đọc rồi update hàng loạt.
  const res = await fetchNotificationsByUser(userId, { isRead: false, limit: 1000 });
  const items = Array.isArray(res) ? res : res.items; // tuỳ backend trả mảng hay {items}
  await Promise.all(items.map(n => markNotificationRead(n.id)));
  return { count: items.length };
}
