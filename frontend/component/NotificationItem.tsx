// src/component/NotificationItem.tsx
import { View, Text, Pressable } from 'react-native';
import React from 'react';
import { NotificationDto } from '@/service/notificationService';

function badge(type: string) {
  if (type === 'POST_NEW') return 'bg-blue-500';
  if (type === 'BOOKING_START') return 'bg-emerald-500';
  if (type === 'BOOKING_REMINDER_15M') return 'bg-amber-500';
  if (type === 'POLLUTION_ALERT') return 'bg-red-500';
  return 'bg-gray-400';
}

export default function NotificationItem({
  item,
  onPress,
}: {
  item: NotificationDto;
  onPress?: (n: NotificationDto) => void;
}) {
  return (
    <Pressable
      onPress={() => onPress?.(item)}
      className={`flex-row items-start gap-3 px-4 py-3 ${item.isRead ? 'bg-white' : 'bg-slate-50'} border-b border-slate-200`}
    >
      <View className={`w-2 h-2 mt-2 rounded-full ${item.isRead ? 'bg-transparent' : 'bg-indigo-600'}`} />
      <View className="flex-1">
        <View className="flex-row items-center gap-2">
          <View className={`px-2 py-0.5 rounded-full ${badge(item.type)}`}>
            <Text className="text-white text-[11px]">{item.type.replaceAll('_', ' ')}</Text>
          </View>
          {/* createdAt hiển thị đơn giản; bạn có thể dùng date-fns nếu muốn */}
          <Text className="text-slate-400 text-xs">{new Date(item.createdAt).toLocaleString()}</Text>
        </View>
        <Text className="text-slate-900 font-semibold mt-1">{item.title}</Text>
        {!!item.content && <Text className="text-slate-700 mt-0.5">{item.content}</Text>}
      </View>
    </Pressable>
  );
}
