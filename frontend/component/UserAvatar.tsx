import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';

export default function UserAvatar({ user, onPress }: { user: any; onPress?: () => void }) {
  const name = user?.name || user?.email || 'Unknown';
  const avatar = user?.avatar || 'https://example.com/default-avatar.png';

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8} className="w-20 items-center mr-3">
      <Image source={{ uri: avatar }} className="w-14 h-14 rounded-full bg-slate-200" />
      <Text numberOfLines={1} className="mt-1 text-xs text-slate-900 text-center">
        {name}
      </Text>
    </TouchableOpacity>
  );
}
