// src/components/NotificationBell.tsx
import React, { useState, useCallback, useMemo } from 'react';
import { View, Text, Pressable, FlatList, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Swipeable } from 'react-native-gesture-handler';
import { router } from 'expo-router';
import { useNotifications } from '@/hooks/useNotifications';
import { useCurrentUser } from '@/hooks/useCurentUser';
import type { NotificationDto } from '@/service/notificationService';

function Badge({ count }: { count: number }) {
  if (!count) return null;
  return (
    <View className="absolute -top-1 -right-1 bg-red-500 w-5 h-5 rounded-full items-center justify-center">
      <Text className="text-white text-[10px] font-bold">{count > 99 ? '99+' : count}</Text>
    </View>
  );
}

function TypePill({ type }: { type: string }) {
  const cls =
    type === 'POST_NEW'
      ? 'bg-blue-500'
      : type === 'BOOKING_START'
      ? 'bg-emerald-500'
      : type === 'BOOKING_REMINDER_15M'
      ? 'bg-amber-500'
      : 'bg-gray-400';
  return (
    <View className={`px-2 py-0.5 rounded-full ${cls}`}>
      <Text className="text-white text-[10px]">{type.replaceAll('_', ' ')}</Text>
    </View>
  );
}

function Row({
  item,
  onOpen,
  onRead,
}: {
  item: NotificationDto;
  onOpen: (n: NotificationDto) => void;
  onRead: (id: string) => void;
}) {
  const renderLeft = () => (
    <View className="flex-1 justify-center">
      <View className="ml-3 px-3 py-2 rounded-xl bg-emerald-600 self-start">
        <Text className="text-white font-semibold">Đánh dấu đã đọc</Text>
      </View>
    </View>
  );
  return (
    <Swipeable
      renderLeftActions={renderLeft}
      onSwipeableOpen={(dir) => {
        if (dir === 'left') onRead(item.id);
      }}
    >
      <Pressable
        onPress={() => onOpen(item)}
        className="px-3 py-3 active:opacity-80"
      >
        <View className="flex-row items-start gap-2">
          <View className="mt-1 w-2 h-2 rounded-full bg-indigo-600" />
          <View className="flex-1">
            <View className="flex-row items-center gap-2">
              <TypePill type={item.type} />
              <Text className="text-slate-400 text-[11px]">
                {new Date(item.createdAt).toLocaleString()}
              </Text>
            </View>
            <Text className="text-slate-900 font-semibold mt-1" numberOfLines={2}>
              {item.title}
            </Text>
            {!!item.content && (
              <Text className="text-slate-700 mt-0.5" numberOfLines={2}>
                {item.content}
              </Text>
            )}
          </View>
        </View>
      </Pressable>
    </Swipeable>
  );
}

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const { user } = useCurrentUser();
  const userId = user?.id;

  const { items, unreadCount, markRead, markAll, refetch } = useNotifications({
    userId: userId!,
    mode: 'unread',
  });

  const toggle = useCallback(() => setOpen((v) => !v), []);
  const close = useCallback(() => setOpen(false), []);

  const onOpenItem = useCallback(
    async (n: NotificationDto) => {
      await markRead(n.id);
      // điều hướng theo type
      if (n.type === 'POST_NEW' && n.refId) {
        close();
        router.push({ pathname: '/(tabs)/report', params: { id: n.refId } });
      } else if ((n.type === 'BOOKING_START' || n.type === 'BOOKING_REMINDER_15M') && n.refId) {
        close();
        router.push({ pathname: '/(tabs)/home/bookingLab', params: { id: n.refId } });
      }
    },
    [markRead, close]
  );

  const onReadAll = useCallback(async () => {
    await markAll(); // hook đã optimistic
    refetch();
  }, [markAll, refetch]);

  // panel max 6 items cho gọn
  const data = useMemo(() => items.slice(0, 6), [items]);

  return (
    <View className="relative">
      {/* Bell button */}
      <Pressable onPress={toggle} className="p-2">
        <Feather name="bell" size={28} color="white" />
        <Badge count={unreadCount} />
      </Pressable>

      {/* Overlay click-outside */}
      {open && (
        <Pressable
          onPress={close}
          className="absolute -top-6 -right-6 left-[-9999px] bottom-[-9999px]"
          style={{ zIndex: 30 }}
        />
      )}

      {/* Dropdown panel */}
      {open && (
        <View
          className="absolute right-0 mt-2 w-80 rounded-2xl bg-white shadow-xl border border-slate-200"
          style={{ zIndex: 40, elevation: 20 }}
        >
          {/* Header */}
          <View className="flex-row items-center justify-between px-3 py-2 border-b border-slate-200">
            <Text className="text-slate-900 font-semibold">Thông báo chưa đọc</Text>
            <TouchableOpacity onPress={onReadAll} className="px-2 py-1 rounded-lg bg-slate-900">
              <Text className="text-white text-xs">Read all</Text>
            </TouchableOpacity>
          </View>

          {/* List */}
          {data.length ? (
            <FlatList
              data={data}
              keyExtractor={(it) => it.id}
              renderItem={({ item }) => (
                <Row item={item} onOpen={onOpenItem} onRead={markRead} />
              )}
              ItemSeparatorComponent={() => (
                <View className="h-px bg-slate-200 mx-3" />
              )}
              style={{ maxHeight: 360 }}
            />
          ) : (
            <View className="px-4 py-6">
              <Text className="text-slate-500">Không có thông báo chưa đọc.</Text>
            </View>
          )}

          {/* Footer */}
          <View className="px-3 py-2 border-t border-slate-200">
            <TouchableOpacity
              onPress={() => {
                close();
                router.push('/(tabs)/account/Notifications'); // màn hình danh sách đầy đủ
              }}
              className="px-3 py-2 rounded-xl bg-slate-100 active:bg-slate-200"
            >
              <Text className="text-center text-slate-700 font-medium">View all</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}
