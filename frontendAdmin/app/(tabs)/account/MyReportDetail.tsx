import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useLocalSearchParams, useFocusEffect } from 'expo-router';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { format, formatDistanceToNow } from 'date-fns';

import { getCommentsByPostId, addComment, uploadCommentImage } from '@/service/commentService';
import { getUserInfo } from '@/service/authService';
import { useRouter } from 'expo-router';

type Comment = {
  id: string;
  name: string;
  avatar: string;
  date: string;
  comment: string;
  image?: string;
};

type User = {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  phone: string;
  introduction: string;
  address: string;
  birthday: string;
  createdAt: string;
  updatedAt: string;
};

const DEFAULT_AVATAR = 'https://cdn-icons-png.flaticon.com/512/847/847969.png';

function formatDate(datetime?: string) {
  if (!datetime) return '';
  const d = new Date(datetime);
  if (isNaN(d.getTime())) return '';
  return format(d, 'dd MMM yyyy, HH:mm');
}

export default function ReportDetail() {
  const router = useRouter();
  const { report } = useLocalSearchParams();
  const reportData = report ? JSON.parse(report as string) : null;

  const [user, setUser] = useState<User | null>(null);

  const [comments, setComments] = useState<Comment[]>([]);
  const [input, setInput] = useState('');
  const [commentImage, setCommentImage] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [loadingList, setLoadingList] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Lấy user đang đăng nhập để có authorId
  useFocusEffect(
    useCallback(() => {
      getUserInfo().then((data) => {
        if (!data) return;
        const avatar =
          data.avatar === 'https://example.com/default-avatar.png'
            ? DEFAULT_AVATAR
            : (data.avatar || DEFAULT_AVATAR);
        setUser({ ...data, avatar });
      });
    }, [])
  );

  // Xin quyền ảnh
  useEffect(() => {
    (async () => {
      await ImagePicker.requestMediaLibraryPermissionsAsync();
      await ImagePicker.requestCameraPermissionsAsync();
    })();
  }, []);

  // Fetch comments theo postId
  useEffect(() => {
    if (!reportData?.id) return;
    setLoadingList(true);
    setError(null);

    getCommentsByPostId(reportData.id)
      .then((res: any[]) => {
        const mapped = (res || []).map((c: any) => ({
          id: c.id,
          name: c.author?.name || 'Unknown',
          avatar: (c.author?.avatar && c.author.avatar.trim()) ? c.author.avatar.trim() : DEFAULT_AVATAR,
          date: c.createdAt,
          comment: c.content,
          image: c.imageUrl || undefined,
        }));
        setComments(mapped);
      })
      .catch((e) => {
        console.error('getCommentsByPostId error:', e);
        setError('Failed to load comments');
      })
      .finally(() => setLoadingList(false));
  }, [reportData?.id]);

  const pickCommentImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.9,
    });
    if (!result.canceled) {
      setCommentImage(result.assets[0].uri);
    }
  };

  const takeCommentPhoto = async () => {
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.9,
    });
    if (!result.canceled) {
      setCommentImage(result.assets[0].uri);
    }
  };

  const handleSendComment = async () => {
    if (!reportData?.id) return;
    if (!user?.id) {
      Alert.alert('Thông báo', 'Bạn cần đăng nhập để bình luận.');
      return;
    }
    if (!input.trim() && !commentImage) {
      // cho phép gửi ảnh không cần text, hoặc ngược lại
      return;
    }

    try {
      setLoading(true);

      // 1) Tạo comment trước để lấy commentId
      const created = await addComment({
        postId: reportData.id,
        authorId: user.id,
        content: input.trim(),
      });
      const commentId = created?.id;
      if (!commentId) throw new Error('addComment không trả về id');

      // 2) Nếu có ảnh thì upload với commentId
      let finalImageUrl: string | undefined = undefined;
      if (commentImage) {
        const uploadRes = await uploadCommentImage(commentId, commentImage);
        // tuỳ service: lấy imageUrl trả về (nếu có)
        finalImageUrl = uploadRes?.imageUrl ?? undefined;
      }

      // 3) Thêm vào đầu danh sách để hiện ngay
      setComments((prev) => [
        {
          id: commentId,
          name: user.name,
          avatar: user.avatar || DEFAULT_AVATAR,
          date: new Date().toISOString(),
          comment: input.trim(),
          image: finalImageUrl ?? commentImage ?? undefined, // hiển thị ngay ảnh local nếu chưa có URL
        },
        ...prev,
      ]);

      // 4) Reset input + ảnh
      setInput('');
      setCommentImage(null);
    } catch (e: any) {
      console.error('handleSendComment error:', e);
      Alert.alert('Lỗi', e?.message || 'Gửi bình luận thất bại');
    } finally {
      setLoading(false);
    }
  };

  if (loadingList) {
    return (
      <View className="flex-1 bg-white justify-center items-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-white"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={80}
    >
      <View className="flex-1">
        <FlatList
          data={comments}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 96 }}
          ListHeaderComponent={
            <View className="flex flex-col p-4 shadow-sm bg-white mb-4">
              
              <View className="flex flex-row justify-between items-start">
                <View className="flex flex-row">
                  <Image source={{ uri: reportData?.avatar || DEFAULT_AVATAR }} className="w-14 h-14 rounded-full mr-4" />
                  <View className="flex flex-col">
                    <Text className="text-3xl font-medium text-black">{reportData?.name}</Text>
                    <Text className="text-gray-500 italic">{formatDate(reportData?.datetime)}</Text>
                  </View>
                </View>
                <Text className="text-sm text-gray-600">
                  {reportData?.published ? 'Solved' : 'Pending'}
                </Text>
              </View>

              <Text className="text-sm mt-4 text-black">{reportData?.problem}</Text>
              <Text className="text-sm text-gray-600">{reportData?.location}</Text>
              <Text className="text-gray-700">{reportData?.description}</Text>
              <Text className="text-blue-500">{`#${reportData?.title}`}</Text>
              {!!reportData?.image && (
                <Image source={{ uri: reportData.image }} className="w-full aspect-[16/9] mt-2" />
              )}
            </View>
          }
          renderItem={({ item }) => (
            <View className="flex flex-row justify-between mb-6 px-4">
              <View className="flex flex-row flex-1">
                <Image source={{ uri: item.avatar }} className="w-11 h-11 rounded-full mr-2" />
                <View className="flex-1">
                  <View className="flex flex-row items-center">
                    <Text className="text-sm font-medium text-gray-600">{`${item.name} •`}</Text>
                    <Text className="text-xs font-light text-gray-600 italic">
                      {` ${formatDistanceToNow(new Date(item.date), { addSuffix: true })}`}
                    </Text>
                  </View>
                  {!!item.comment && <Text className="text-sm mt-1 text-black">{item.comment}</Text>}
                  {!!item.image && (
                    <Image source={{ uri: item.image }} className="w-40 h-40 rounded-lg mt-2" />
                  )}
                  <View className="flex flex-row items-center mt-3">
                    <TouchableOpacity className="mr-6">
                      <MaterialIcons name="thumb-up-off-alt" size={20} color={'gray'} />
                    </TouchableOpacity>
                    <TouchableOpacity className="mr-6">
                      <MaterialIcons name="thumb-down-off-alt" size={20} color={'gray'} />
                    </TouchableOpacity>
                    <TouchableOpacity>
                      <FontAwesome name="comment-o" size={20} color={'gray'} />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
              <TouchableOpacity>
                <MaterialIcons name="more-vert" size={20} color={'gray'} />
              </TouchableOpacity>
            </View>
          )}
          ListEmptyComponent={
            <View className="items-center py-10">
              <Text className="text-gray-500">There isn't any comment.</Text>
            </View>
          }
        />

        {/* Thanh nhập bình luận + nút ảnh */}
        <View className="absolute bottom-0 left-0 right-0 bg-white p-2 border-t border-gray-200">
          {/* Preview ảnh đã chọn (nếu có) */}
          {commentImage && (
            <View className="flex-row items-center mb-2 px-1">
              <Image source={{ uri: commentImage }} className="w-16 h-16 rounded mr-3" />
              <TouchableOpacity onPress={() => setCommentImage(null)}>
                <Text className="text-red-500">Remove</Text>
              </TouchableOpacity>
            </View>
          )}

          <View className="flex-row items-center gap-2">
            <TouchableOpacity onPress={pickCommentImage} className="mr-2">
              <MaterialIcons name="image" size={20} color={'gray'} />
            </TouchableOpacity>
            <TouchableOpacity onPress={takeCommentPhoto} className="mr-2">
              <MaterialIcons name="photo-camera" size={20} color={'gray'} />
            </TouchableOpacity>

            <TextInput
              value={input}
              onChangeText={setInput}
              placeholder="Write a comment..."
              placeholderTextColor="#9ca3af"
              className="flex-1 bg-gray-50 p-2 px-4 border border-gray-300 rounded-full text-gray-700"
              returnKeyType="send"
              onSubmitEditing={handleSendComment}
              editable={!loading}
            />

            <TouchableOpacity onPress={handleSendComment} disabled={loading} className="ml-2">
              {loading ? (
                <ActivityIndicator />
              ) : (
                <MaterialIcons name="send" size={24} color={'#2563EB'} />
              )}
            </TouchableOpacity>
          </View>

          {!!error && <Text className="text-red-500 mt-1 px-1">{error}</Text>}
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
