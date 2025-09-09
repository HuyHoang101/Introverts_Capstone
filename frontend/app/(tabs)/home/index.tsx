import { View, Text, ScrollView, Pressable, Image, TouchableOpacity, ImageBackground } from 'react-native';
import React from 'react';
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import {useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { getUserInfo } from '@/service/authService';
import { getAllPosts } from '@/service/postService';
import { getAllLikes } from '@/service/likeService';
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
    avatar?: string; // Optional avatar URL
    introduction?: string; // Optional introduction
    phone: string;
    address: string;
    birthDate: string;
    createdAt: string;
    updatedAt: string;
}

const DEFAULT_AVATAR = "https://cdn-icons-png.flaticon.com/512/847/847969.png";

export default function HomeScreen() {

  const [posts, setPosts] = useState<Report[]>([]);
  const [user, setUser] = useState<User | null>(null);

  useFocusEffect(
    useCallback(() => {
        const fetchData = async () => {
        const data = await getUserInfo();

        let updated = data;
        if (data?.avatar === "https://example.com/default-avatar.png") {
            updated = {
            ...data,
            avatar: "https://cdn-icons-png.flaticon.com/512/847/847969.png",
            };
        }
        setUser(updated);

        if (updated?.id) {
            // 🔥 Lấy tất cả posts
            const allPosts = await getAllPosts();
            // 🔥 Lấy tất cả likes
            const allLikes = await getAllLikes();

            // 🔥 Filter post theo authorId và map về type Report
            const userPosts: Report[] = allPosts
            .filter((p: any) => p.authorId === updated.id)
            .map((p: any) => {
                const likeCount = allLikes.filter((l: any) => l.postId === p.id).length;
                return {
                id: p.id,
                name: updated.name,
                avatar: updated.avatar,
                status: p.published ? "Solved" : "Pending",
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
            }).slice(0, 3); // Giới hạn chỉ lấy 3 bài gần nhất

            setPosts(userPosts);
        }
        };

        fetchData();
    }, [])
  );


  return (
    <>
    <ImageBackground
      source={require('../../../assets/images/bg_main.png')}
      className="flex-1 min-h-screen"
      resizeMode="stretch"
    >
    <ScrollView
      className="flex-1 mt-10"
      contentContainerStyle={{ padding: 16 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View className="flex-row justify-between items-center mb-14">
        <View className='flex flex-row items-center'>
          <Image source={require('../../../assets/images/renewable-energy.png')} style={{ width: 48, height: 48 }} className="mr-2" />
          <Text className='font-extrabold text-5xl text-white'>GreenSync</Text>
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

      {/* Personal Records */}
      <View className="bg-white rounded-xl p-4 shadow mb-4 h-80">
        <View className="flex-row justify-between items-center mb-2">
          <Text className="text-lg font-bold text-black">Personal records</Text>
          <Pressable>
            <Text className="text-blue-600 font-medium">Read more →</Text>
          </Pressable>
        </View>
        {/* List: chỉ avatar + name + datetime + problem */}
        <View className="flex-1">
          <ScrollView
            className="p-4"
            contentContainerStyle={{ paddingBottom: 40 }}
            showsVerticalScrollIndicator={false}
            nestedScrollEnabled={true}
          >
            {posts && posts.length > 0 ? (
              posts.map((item) => (
                <View
                  key={item.id}
                  className="flex-row bg-white rounded-sm shadow p-4 mb-4 items-center"
                >
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
              <View className="flex-1 justify-center items-center py-10">
                <Text>There is no Report set up</Text>
              </View>
            )}
          </ScrollView>
        </View>
      </View>

      {/* Booking Room */}
      <View className="bg-gray-200 rounded-xl p-4 shadow">
        <View className='flex-row items-center justify-between mb-2'>
          <Text className="text-lg font-bold text-black">BOOKING ROOM</Text>
          <TouchableOpacity
            onPress={() => {router.push({ pathname: './home/bookingLab' })}}
          >
            <Text className='font-semibold text-gray-700'> Read more →</Text>
          </TouchableOpacity>
        </View>
        <View className="bg-white rounded-xl p-3 shadow-sm w-full justify-start">
          <Text className="text-green-800 font-semibold h-28">ROOM 2.4.. is now available</Text>
          <Text ></Text>
        </View>
      </View>
    </ScrollView>
    </ImageBackground>
    </>
  );
}
