// frontend/service/notification2Service.ts
import { getNotif2All, getNotif2ByUser, patchNotif2Read, markAllNotif2Read } from '@/lib/notification2Api';
import type { NotificationDto } from '@/service/notificationService';

// Chuẩn hoá Notification2 (schema prisma: title, body, readAt, type(enum), createdAt)
function normalizeNotif2(n: any): NotificationDto & { _src: 'n2' } {
  return {
    id: String(n.id ?? n._id),
    title: n.title ?? '',
    content: n.body ?? n.content ?? '',
    isRead: Boolean(n.readAt),
    userId: String(n.userId ?? ''),
    type: String(n.type ?? 'NEW_MESSAGE'),
    createdAt: n.createdAt ?? new Date().toISOString(),
    updatedAt: n.updatedAt ?? n.createdAt ?? new Date().toISOString(),
    _src: 'n2',
  };
}

export async function fetchNotif2ByUser(userId: string): Promise<(NotificationDto & { _src: 'n2' })[]> {
  const raw = await getNotif2ByUser(userId);
  const items = Array.isArray(raw) ? raw : raw?.items ?? [];
  return items.map(normalizeNotif2);
}

export async function fetchNotif2All(): Promise<(NotificationDto & { _src: 'n2' })[]> {
  const raw = await getNotif2All();
  const items = Array.isArray(raw) ? raw : raw?.items ?? [];
  return items.map(normalizeNotif2);
}

export async function markNotif2Read(id: string) {
  return patchNotif2Read(id);
}

export async function markAllNotif2(userId?: string) {
  return markAllNotif2Read(userId);
}
