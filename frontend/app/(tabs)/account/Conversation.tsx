import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import UserAvatar from '@/component/UserAvatar';

import { getAllUsers } from '@/service/userService';
import { getUserInfo } from '@/service/authService';
import { getMyConversations } from '@/service/messageService';

export default function ConversationsScreen() {
  const router = useRouter();
  const [me, setMe] = useState<any>(null);
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const [conversations, setConversations] = useState<any[]>([]);
  const [loadingConvs, setLoadingConvs] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const u = await getUserInfo();
        const list = await getAllUsers();
        if (!mounted) return;
        setMe(u);
        setAllUsers(list || []);
      } finally {
        setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const loadConversations = useCallback(async () => {
    setLoadingConvs(true);
    try {
      const res = await getMyConversations(); // already sorted by lastMessageAt desc (backend)
      setConversations(res || []);
    } finally {
      setLoadingConvs(false);
    }
  }, []);

  useEffect(() => { loadConversations(); }, [loadConversations]);

  const admins = useMemo(
    () => allUsers.filter(u => u.role === 'ADMIN'),
    [allUsers]
  );

  const nonAdmins = useMemo(() => {
    const meId = me?.id;
    return allUsers
      .filter(u => u.role !== 'ADMIN' && u.id !== meId)
      .filter(u => {
        if (!search.trim()) return true;
        const q = search.toLowerCase();
        return (u.name?.toLowerCase()?.includes(q)) || (u.email?.toLowerCase()?.includes(q));
      });
  }, [allUsers, me?.id, search]);

  // IMPORTANT: push using an absolute pathname that matches the folder name
  // (omit the route group name (tabs))
  const openChatWith = (userId: string) =>
    router.push({ pathname: '/(tabs)/account/[userId]', params: { userId } });

  const renderUserItem = ({ item }: { item: any }) => (
    <TouchableOpacity onPress={() => openChatWith(item.id)} activeOpacity={0.8} className="flex-row items-center gap-3 py-2 border-b border-slate-200">
      <UserAvatar user={item} />
      <View className="flex-1">
        <Text numberOfLines={1} className="text-[15px] font-medium text-slate-900">
          {item.name || item.email || 'Unknown'}
        </Text>
        {item.role ? <Text className="text-xs text-slate-600 mt-0.5">{item.role}</Text> : null}
      </View>
    </TouchableOpacity>
  );

  const renderRecentItem = ({ item }: { item: any }) => {
    const [aId, bId] = [item.userAId, item.userBId];
    const peerId = me?.id === aId ? bId : aId;
    const peer = allUsers.find(u => u.id === peerId);
    const name = peer?.name || peer?.email || peerId;
    const time = item.lastMessageAt ? new Date(item.lastMessageAt) : null;
    const timeStr = time ? time.toLocaleString('vi-VN') : 'No messages';

    return (
    <TouchableOpacity onPress={() => openChatWith(peerId)} activeOpacity={0.8} className="mr-3 w-36 items-center">
      <UserAvatar user={peer || { name }} onPress={() => openChatWith(peerId)} />
      <Text numberOfLines={1} className="text-sm text-slate-900 mt-1">{name}</Text>
      <Text className="text-[11px] text-slate-600">{timeStr}</Text>
    </TouchableOpacity>
   );
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator />
        <Text className="mt-2 text-slate-900">Loading...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white px-4 pt-3">
      {/* ADMIN row — fixed */}
      <View className="mb-3">
        <Text className="text-base font-semibold text-slate-900 mb-2">Admins</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingVertical: 4 }}>
          <View className="flex-row">
            {admins.length === 0 ? (
              <Text className="text-slate-600">No ADMIN</Text>
            ) : (
              admins.map((u) => (
                <UserAvatar key={u.id} user={u} onPress={() => openChatWith(u.id)} />
              ))
            )}
          </View>
        </ScrollView>
      </View>

      {/* Search (does not affect ADMIN) */}
      <View className="mb-3">
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Search following name or email..."
          placeholderTextColor="#94a3b8"
          className="border border-slate-200 rounded-xl px-3 py-2 text-[14px] text-slate-900 bg-slate-50"
        />
      </View>

      {/* Non-ADMIN list */}
      <View className="flex-1 mb-3">
        <Text className="text-base font-semibold text-slate-900 mb-2">Users</Text>
        <FlatList
          data={nonAdmins}
          keyExtractor={(item) => item.id}
          renderItem={renderUserItem}
          contentContainerStyle={{ paddingBottom: 16 }}
          ListEmptyComponent={<Text className="text-slate-600">There is no user</Text>}
        />
      </View>

      {/* Recent chats */}
      <View className="mb-3">
        <View className="flex-row items-center justify-between">
          <Text className="text-base font-semibold text-slate-900">Recently</Text>
          <TouchableOpacity onPress={loadConversations}>
            <Text className="text-blue-600 font-medium">Reload</Text>
          </TouchableOpacity>
        </View>
        {loadingConvs ? (
          <View className="items-center justify-center py-3">
            <ActivityIndicator />
          </View>
        ) : conversations?.length > 0 ? (
          <FlatList
            data={conversations}
            keyExtractor={(item) => item.id}
            renderItem={renderRecentItem}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingVertical: 8 }}
          />
        ) : (
          <Text className="text-slate-600 mt-2">There isn't any conservation.</Text>
        )}
      </View>
    </View>
  );
}