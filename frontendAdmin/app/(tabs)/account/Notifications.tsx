// src/account/Notifications.tsx
import { View, Text, FlatList, RefreshControl, Pressable, ActivityIndicator } from 'react-native';
import React, { useState, useCallback, useMemo } from 'react';
import { useNavigation } from '@react-navigation/native';

import NotificationItem from '@/component/NotificationItem';
import type { NotificationDto } from '@/service/notificationService';
import { useNotifications } from '@/hooks/useNotifications';
import { useCurrentUser } from '@/hooks/useCurentUser';

export default function NotificationsScreen() {
  const nav = useNavigation<any>();
  const { user, loading: authLoading, error: authError } = useCurrentUser();

  // tabs Chưa đọc / Tất cả
  const [mode, setMode] = useState<'unread' | 'all'>('unread');

  // chỉ khởi tạo hook khi đã có userId (tránh gọi list all)
  const userId = user?.id;
  const shouldInit = !!userId && !authLoading && !authError;

  const {
    items,
    loading,
    refreshing,
    refetch,
    fetchMore,
    hasMore,
    markRead,
    markAll,
    unreadCount,
  } = useNotifications({ userId: userId!, mode });

  // mở item → đánh dấu đã đọc + điều hướng theo type
  const openItem = useCallback(
    async (n: NotificationDto) => {
      if (!n.isRead) await markRead(n.id);
      if (n.type === 'POST_NEW' && n.refId) {
        nav.navigate('PostDetail', { id: n.refId });
      } else if ((n.type === 'BOOKING_START' || n.type === 'BOOKING_REMINDER_15M') && n.refId) {
        nav.navigate('BookingDetail', { id: n.refId });
      }
    },
    [markRead, nav]
  );

  // ======= Render =======

  if (authLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator />
        <Text className="mt-2 text-slate-600">Loading your account…</Text>
      </View>
    );
  }

  if (authError || !userId) {
    return (
      <View className="flex-1 items-center justify-center p-6 bg-white">
        <Text className="text-lg font-semibold text-slate-900">You are not logged in</Text>
        <Text className="text-slate-600 mt-1 text-center">
          Logging in will allow you to view and manage your notifications.
        </Text>
        <Pressable
          onPress={() => nav.navigate('login')}
          className="mt-4 px-4 py-2 rounded-xl bg-indigo-600"
        >
          <Text className="text-white">Login</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="px-4 pt-4 pb-2 border-b border-slate-200 bg-white">
        <View className="flex-row items-center justify-between">
          <Text className="text-xl font-bold text-black">Notifiaction</Text>
          <Pressable onPress={markAll} className="px-3 py-1 rounded-lg bg-slate-900">
            <Text className="text-white">Read it all</Text>
          </Pressable>
        </View>
        <View className="flex-row gap-2 mt-3">
          <Pressable
            onPress={() => setMode('unread')}
            className={`px-3 py-1 rounded-full ${mode === 'unread' ? 'bg-indigo-600' : 'bg-slate-100'}`}
          >
            <Text className={`${mode === 'unread' ? 'text-white' : 'text-slate-700'}`}>
              Unread{unreadCount ? ` (${unreadCount})` : ''}
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setMode('all')}
            className={`px-3 py-1 rounded-full ${mode === 'all' ? 'bg-indigo-600' : 'bg-slate-100'}`}
          >
            <Text className={`${mode === 'all' ? 'text-white' : 'text-slate-700'}`}>All</Text>
          </Pressable>
        </View>
      </View>

      {/* List */}
      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator />
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(it) => it.id}
          renderItem={({ item }) => <NotificationItem item={item} onPress={openItem} />}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refetch} />}
          onEndReachedThreshold={0.2}
          onEndReached={() => hasMore && fetchMore()}
          ListEmptyComponent={
            <View className="p-6">
              <Text className="text-center text-slate-500">There isn't notification.</Text>
            </View>
          }
        />
      )}
    </View>
  );
}
