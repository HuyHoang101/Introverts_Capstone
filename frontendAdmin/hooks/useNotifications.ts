// src/hooks/useNotifications.ts
import { useEffect, useMemo, useState } from 'react';
import {
  fetchNotificationsByUser,
  fetchNotifications,
  NotificationDto,
  markNotificationRead,
  markAllReadByUser,
} from '@/service/notificationService';

type Mode = 'all' | 'unread';

export function useNotifications(opts: {
  userId?: string; // nếu có userId thì gọi /user/:userId, không thì gọi /
  mode?: Mode;
  pageSize?: number;
}) {
  const { userId, mode = 'unread', pageSize = 20 } = opts;
  const [items, setItems] = useState<NotificationDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const isUnread = mode === 'unread';

  async function load(pageToLoad = 1, replace = false) {
    const params: any = { limit: pageSize, page: pageToLoad };
    if (isUnread) params.isRead = false;

    const res = userId
      ? await fetchNotificationsByUser(userId, params)
      : await fetchNotifications(params);

    const list = Array.isArray(res) ? res : res.items;
    const nextExists =
      Array.isArray(res)
        ? list.length === pageSize // đoán còn trang nữa
        : Boolean(res.nextCursor); // nếu backend dùng cursor

    setHasMore(nextExists);
    setItems(prev => (replace ? list : [...prev, ...list]));
  }

  async function fetchFirst() {
    setLoading(true);
    try {
      setPage(1);
      await load(1, true);
    } finally {
      setLoading(false);
    }
  }

  async function fetchMore() {
    if (!hasMore) return;
    const next = page + 1;
    await load(next, false);
    setPage(next);
  }

  async function refetch() {
    setRefreshing(true);
    try {
      await load(1, true);
      setPage(1);
    } finally {
      setRefreshing(false);
    }
  }

  async function markRead(id: string) {
    // optimistic
    setItems(prev => prev.map(it => (it.id === id ? { ...it, isRead: true } : it)));
    try {
      await markNotificationRead(id);
    } catch {
      // rollback nếu lỗi
      setItems(prev => prev.map(it => (it.id === id ? { ...it, isRead: false } : it)));
    }
  }

  async function markAll() {
    if (!userId) return;
    // optimistic
    setItems(prev => prev.map(it => ({ ...it, isRead: true })));
    try {
      await markAllReadByUser(userId);
    } catch {
      // refetch lại nếu lỗi
      refetch();
    }
  }

  useEffect(() => {
    fetchFirst();
  }, [userId, mode]);

  // Poll mỗi 30s
  useEffect(() => {
    const id = setInterval(refetch, 30_000);
    return () => clearInterval(id);
  }, [userId, mode]);

  const unreadCount = useMemo(() => items.filter(i => !i.isRead).length, [items]);

  return {
    items,
    loading,
    refreshing,
    hasMore,
    unreadCount,
    refetch,
    fetchMore,
    markRead,
    markAll,
  };
}
