// frontend/app/(tabs)/home/index.tsx
import { View, Text, ScrollView, Pressable, Image, TouchableOpacity, ImageBackground } from 'react-native';
import React, { useCallback, useState } from 'react';
import { router } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';

import { getUserInfo } from '@/service/authService';
import { getAllPosts } from '@/service/postService';
import { getAllLikes } from '@/service/likeService';
import { getAllRooms } from '@/service/roomService';
import { formatVietnamTime } from '@/utils/time';
import NotificationBell from '@/component/NotificationBell';

type Report = {
  id: string;
  name: string;
  avatar: string;
  status: string;
  title: string;
  location: string;
  datetime: string; // ISO string
  problem: string;
  description: string;
  image: string;
  createdAt: string;
  updatedAt: string;
  likeCount?: number;
};

type Like = {
  id: string;
  authorId: string;
  postId: string;
  createdAt: string;
  updatedAt: string;
};

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  introduction?: string;
  phone: string;
  address: string;
  birthDate: string;
  createdAt: string;
  updatedAt: string;
}

const DEFAULT_AVATAR = 'https://cdn-icons-png.flaticon.com/512/847/847969.png';

export default function HomeScreen() {
  const [posts, setPosts] = useState<Report[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [rooms, setRooms] = useState<Array<{ id: string; name: string; status?: string }>>([]);

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        // User
        const data = await getUserInfo();
        let updated = data;
        if (data?.avatar === 'https://example.com/default-avatar.png') {
          updated = { ...data, avatar: DEFAULT_AVATAR };
        }
        setUser(updated);

        // Posts của user
        if (updated?.id) {
          const [allPosts, allLikes] = await Promise.all([getAllPosts(), getAllLikes()]);
          const userPosts: Report[] = allPosts
            .filter((p: any) => p.authorId === updated.id)
            .map((p: any) => {
              const likeCount = allLikes.filter((l: Like) => l.postId === p.id).length;
              return {
                id: p.id,
                name: updated.name,
                avatar: updated.avatar,
                status: p.published ? 'Solved' : 'Pending',
                title: p.title,
                location: p.location,
                datetime: p.createdAt,
                problem: p.problem,
                description: p.description,
                image: p.content,
                createdAt: p.createdAt,
                updatedAt: p.updatedAt,
                likeCount,
              } as Report;
            })
            .slice(0, 3);
          setPosts(userPosts);
        }

        // Rooms list
        try {
          const dataRooms = await getAllRooms();
          const list = Array.isArray(dataRooms) ? dataRooms : dataRooms?.rooms || [];
          const normalized = list.map((r: any) => ({
            id: String(r.id),
            name: r.name,
            status: r.status,
          }));
          setRooms(normalized);
        } catch {
          setRooms([]);
        }
      };

      fetchData();
    }, [])
  );

  const onOpenRoom = (room: { id: string; name: string }) => {
    router.push({
      pathname: '/(tabs)/home/bookingLab',
      params: { roomId: room.id, roomName: room.name },
    });
  };

  return (
    <ImageBackground
      source={require('../../../assets/images/bg_main.png')}
      style={{ flex: 1 }}
      resizeMode="stretch"
    >
      {/* Chỉ 1 ScrollView ngoài cùng, không nested */}
      <ScrollView
        contentContainerStyle={{ padding: 16, paddingTop: 40, paddingBottom: 64 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View className="flex-row justify-between items-center mb-14">
          <View className="flex flex-row items-center">
            <Image
              source={require('../../../assets/images/renewable-energy.png')}
              style={{ width: 48, height: 48 }}
              className="mr-2"
            />
            <Text className="font-extrabold text-5xl text-white">GreenSync</Text>
          </View>
          <NotificationBell />
        </View>

        {/* Daily Tips & Alert */}
        <View className="flex-row justify-between mb-4">
          <View className="flex-1 bg-green-200 rounded-xl p-3 shadow mr-1">
            <Text className="font-bold text-green-800 mb-1">Daily Tips</Text>
            <Text className="text-gray-700">Turn off lights - saved 5% energy</Text>
          </View>
          <View className="flex-1 bg-red-200 rounded-xl p-3 shadow ml-1">
            <Text className="font-bold text-red-700 mb-1">Alert</Text>
            <Text className="text-gray-800">⚠️ High water usage detected in Building 2!!!</Text>
          </View>
        </View>

        {/* Personal Records (không ScrollView con) */}
        <View className="bg-white rounded-xl p-4 shadow mb-4">
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-lg font-bold text-black">Personal records</Text>
            <Pressable>
              <Text className="text-blue-600 font-medium">Read more →</Text>
            </Pressable>
          </View>

          <View className="p-4">
            {posts && posts.length > 0 ? (
              posts.map((item) => (
                <View key={item.id} className="flex-row bg-white rounded-sm shadow p-4 mb-4 items-center">
                  <Image
                    source={{ uri: item.avatar || DEFAULT_AVATAR }}
                    className="w-14 h-14 rounded-full mr-4"
                  />
                  <View className="flex-1">
                    <Text className="text-lg font-medium">{item.name}</Text>
                    <Text className="italic text-sm text-gray-500">
                      {formatVietnamTime(item.datetime)}
                    </Text>
                    <Text className="text-sm mt-1">{item.problem}</Text>
                  </View>
                </View>
              ))
            ) : (
              <View className="justify-center items-center py-10">
                <Text>There is no Report set up</Text>
              </View>
            )}
          </View>
        </View>

        {/* ROOMS list (thay cho box Booking Room cũ) */}
        <View className="bg-gray-200 rounded-xl p-4 shadow">
          <View className="flex-row items-center justify-between mb-2">
            <Text className="text-lg font-bold text-black">ROOMS</Text>
          </View>

          {rooms.length === 0 ? (
            <Text className="text-gray-700">No rooms available.</Text>
          ) : (
            rooms.map((r) => (
              <TouchableOpacity
                key={r.id}
                onPress={() => onOpenRoom(r)}
                className="bg-white rounded-xl p-3 shadow-sm w-full justify-start mb-2"
              >
                <Text className="text-green-800 font-semibold">Room {r.name} is available now</Text>
                {!!r.status && <Text className="text-xs text-gray-500 mt-1">{r.status}</Text>}
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>
    </ImageBackground>
  );
}
