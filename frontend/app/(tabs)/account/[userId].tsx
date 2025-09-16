// app/(tabs)/conversation/[userId].tsx
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Alert, FlatList, KeyboardAvoidingView, Platform, Text, TextInput, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ensureDM, getMessages, sendMessage } from '@/service/messageService'; // đảm bảo import đúng service bạn đang dùng
import { getAllUsers } from '@/service/userService';
import { getUserInfo } from '@/service/authService';

const PAGE = 20;

export default function ChatScreen() {
  const { userId: rawUserId } = useLocalSearchParams<{ userId: string | string[] }>();
  const userId = Array.isArray(rawUserId) ? rawUserId[0] : rawUserId; // chống trường hợp mảng
  const router = useRouter();

  const [booting, setBooting] = useState(true);      // đang khởi tạo conv
  const [isSending, setIsSending] = useState(false); // đang gửi
  const [meId, setMeId] = useState<string | null>(null);
  const [peer, setPeer] = useState<any>(null);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [items, setItems] = useState<any[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [text, setText] = useState('');

  const listRef = useRef<FlatList>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        if (!userId) throw new Error('Thiếu userId trên route');
        setBooting(true);

        const me = await getUserInfo();
        if (!mounted) return;
        setMeId(me?.id ?? null);

        const users = await getAllUsers();
        const p = users.find((u: any) => u.id === userId);
        if (mounted) setPeer(p ?? { id: userId });

        // đảm bảo có DM và lấy convId
        const conv = await ensureDM(userId as string);
        if (!mounted) return;
        setConversationId(conv.id);

        // trang đầu tiên (DESC)
        const page = await getMessages(conv.id, { limit: PAGE });
        if (!mounted) return;
        const mapped = page.items.map((it: any) => ({ ...it, __mine: it.senderId === me?.id }));
        setItems(mapped);
        setCursor(page.nextCursor);
        setHasMore(page.hasMore);
      } catch (e: any) {
        console.log('Boot chat failed:', e);
        Alert.alert('Can not open conversation.', e?.message ?? 'Unknown error');
      } finally {
        mounted && setBooting(false);
      }
    })();
    return () => { mounted = false; };
  }, [userId]);

  const loadMore = useCallback(async () => {
    if (!conversationId || !hasMore) return;
    const page = await getMessages(conversationId, { limit: PAGE, cursor: cursor ?? undefined });
    const mapped = page.items.map((it: any) => ({ ...it, __mine: it.senderId === meId }));
    setItems(prev => [...prev, ...mapped]);
    setCursor(page.nextCursor);
    setHasMore(page.hasMore);
  }, [conversationId, cursor, hasMore, meId]);

  const canSend = !!conversationId && text.trim().length > 0 && !isSending;

  const onSend = useCallback(async () => {
    const content = text.trim();

    // Báo rõ lý do không gửi được
    if (!content) {
      Alert.alert('There is no content', 'Enter some text to send.');
      return;
    }
    if (!conversationId) {
      Alert.alert('Sending', ' Conversation is not ready yet.');
      return;
    }

    try {
      setIsSending(true);
      const msg = await sendMessage(conversationId, content);
      setItems(prev => [{ ...msg, __mine: msg.senderId === meId }, ...prev]); // prepend (DESC)
      setText('');
      listRef.current?.scrollToOffset({ offset: 0, animated: true });
    } catch (e: any) {
      console.log('sendMessage error:', e);
      Alert.alert('Fail to send', e?.message ?? 'Unknown error');
    } finally {
      setIsSending(false);
    }
  }, [text, conversationId, meId]);

  const renderItem = ({ item }: { item: any }) => {
    const mine = item.__mine === true;
    return (
      <View className={`my-1 flex-row ${mine ? 'justify-end' : 'justify-start'}`}>
        <View className={`max-w-[78%] rounded-2xl px-3 py-2 ${mine ? 'bg-blue-600' : 'bg-slate-200'}`}>
          <Text className={`text-[15px] ${mine ? 'text-white' : 'text-slate-900'}`}>{item.content}</Text>
          <Text className={`text-[10px] mt-1 ${mine ? 'text-slate-100/80' : 'text-slate-600'}`}>
            {new Date(item.createdAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView className="flex-1 bg-white" behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      {/* Header */}
      <View className="h-14 border-b border-slate-200 flex-row items-center justify-center px-3">
        <Text numberOfLines={1} className="text-base font-bold text-slate-900 max-w-[70%] text-center">
          {peer?.name || peer?.email || 'Chat'}
        </Text>
      </View>

      {/* Booting state */}
      {booting ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator />
          <Text className="mt-2 text-slate-700">Reparing coversation...</Text>
        </View>
      ) : (
        <>
          {/* Messages */}
          <FlatList
            ref={listRef}
            data={items}
            keyExtractor={(it) => it.id}
            renderItem={renderItem}
            inverted
            onEndReachedThreshold={0.2}
            onEndReached={loadMore}
            contentContainerStyle={{ paddingVertical: 12, paddingHorizontal: 12 }}
          />

          {/* Input */}
          <View className="flex-row items-end gap-2 p-2 border-t border-slate-200">
            <TextInput
              value={text}
              onChangeText={setText}
              placeholder="Nhập tin nhắn..."
              placeholderTextColor="#94a3b8"
              multiline
              className="flex-1 min-h-10 max-h-32 border border-slate-200 rounded-2xl px-3 py-2 text-[14px] text-slate-900 bg-slate-50"
              onSubmitEditing={onSend} // tiện gửi bằng phím Enter trên iOS (1 dòng)
              blurOnSubmit={false}
            />
            <TouchableOpacity
              onPress={onSend}
              disabled={!canSend}
              className={`px-4 py-2 rounded-2xl ${canSend ? 'bg-blue-600' : 'bg-slate-300'}`}
              activeOpacity={canSend ? 0.8 : 1}
            >
              <Text className="text-white font-bold">{isSending ? 'Sending...' : 'Sent'}</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </KeyboardAvoidingView>
  );
}
