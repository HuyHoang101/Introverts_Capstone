// frontend/service/notificationsCombined.ts
import {
  fetchNotifications,
  fetchNotificationsByUser,
  markNotificationRead,
  markAllReadByUser,
  type NotificationDto,
} from '@/service/notificationService';

import {
  fetchNotif2All,
  fetchNotif2ByUser,
  markNotif2Read,
  markAllNotif2,
} from '@/service/notification2Service';

export type AnyNotification = (NotificationDto & { _src?: 'n1' | 'n2' });

function normalizeN1(n: any): NotificationDto & { _src: 'n1' } {
  return {
    id: String(n.id ?? n._id),
    title: n.title ?? '',
    content: n.content ?? '',
    isRead: Boolean(n.isRead),
    userId: String(n.userId ?? ''),
    type: String(n.type ?? 'GENERAL'),
    createdAt: n.createdAt ?? n.created_at ?? new Date().toISOString(),
    updatedAt: n.updatedAt ?? n.updated_at ?? n.createdAt ?? n.created_at ?? new Date().toISOString(),
    _src: 'n1',
  };
}

export async function fetchAllNotificationsSorted(opts: { userId?: string; mode?: 'all' | 'unread' } = {}) {
  const { userId, mode = 'unread' } = opts;

  const [n1Res, n2Res] = await Promise.allSettled([
    userId ? fetchNotificationsByUser(userId) : fetchNotifications(),
    userId ? fetchNotif2ByUser(userId) : fetchNotif2All(),
  ]);

  const n1 = n1Res.status === 'fulfilled'
    ? (Array.isArray(n1Res.value) ? n1Res.value : (n1Res.value?.items ?? [])).map(normalizeN1)
    : [];

  const n2 = n2Res.status === 'fulfilled' ? n2Res.value : [];

  let items: AnyNotification[] = [...n1, ...n2];

  // Lọc chưa đọc nếu mode = 'unread'
  if (mode === 'unread') items = items.filter(i => !i.isRead);

  // Sort theo thời gian desc
  items.sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));

  return { items, hasMore: false }; // hiện tại gộp không phân trang
}

export async function markUnifiedRead(item: AnyNotification) {
  if (item._src === 'n2') return markNotif2Read(item.id);
  return markNotificationRead(item.id);
}

export async function markUnifiedAll(userId?: string) {
  const [a, b] = await Promise.allSettled([
    userId ? markAllReadByUser(userId) : Promise.resolve({ count: 0 }),
    markAllNotif2(userId),
  ]);
  return {
    ok: true,
    n1: a.status === 'fulfilled' ? a.value : null,
    n2: b.status === 'fulfilled' ? b.value : null,
  };
}
