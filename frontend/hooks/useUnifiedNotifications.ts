import { useCallback, useEffect, useMemo, useState } from 'react';
import { fetchAllNotificationsSorted, markUnifiedRead, markUnifiedAll, type AnyNotification } from '@/service/notificationsCombined';

export function useUnifiedNotifications(opts: { userId?: string; mode?: 'all' | 'unread' } = {}) {
  const { userId, mode = 'unread' } = opts;
  const [items, setItems] = useState<AnyNotification[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [hasMore, setHasMore] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { items, hasMore } = await fetchAllNotificationsSorted({ userId, mode });
      setItems(items);
      setHasMore(hasMore);
    } finally {
      setLoading(false);
    }
  }, [userId, mode]);

  const refetch = useCallback(async () => {
    setRefreshing(true);
    try { await load(); } finally { setRefreshing(false); }
  }, [load]);

  const fetchMore = useCallback(async () => {
    // hiện tại combine chưa phân trang -> không làm gì
    setHasMore(false);
  }, []);

  const markRead = useCallback(async (item: AnyNotification) => {
    await markUnifiedRead(item);
    await refetch();
  }, [refetch]);

  const markAll = useCallback(async () => {
    await markUnifiedAll(userId);
    await refetch();
  }, [refetch, userId]);

  useEffect(() => { load(); }, [load]);

  const unreadCount = useMemo(() => items.filter(i => !i.isRead).length, [items]);

  return { items, loading, refreshing, hasMore, unreadCount, refetch, fetchMore, markRead, markAll };
}
