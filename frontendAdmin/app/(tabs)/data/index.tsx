import React, { useCallback, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Image, Alert, ImageBackground } from "react-native";
import "@/global.css";
import { useRouter, useFocusEffect } from "expo-router";
import { getAllRooms } from "@/service/roomService";

export default function Index() {
  const router = useRouter();
  const [rooms, setRooms] = useState<{ id: number; name: string; status: string }[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const data = await getAllRooms();
      setRooms(data);
    } catch (err) {
      console.error("Failed to fetch rooms:", err);
      Alert.alert("Error", "Failed to load rooms, please try again.");
    } finally {
      setLoading(false);
    }
  };

  // chạy mỗi khi screen được focus (mở lại tab này)
  useFocusEffect(
    useCallback(() => {
      fetchRooms();
    }, [])
  );

  return (
    <ImageBackground
      source={require("@/assets/images/bg_main.png")}
      className="flex-1"
      resizeMode="stretch"
    >
      <ScrollView
        className="flex-1 flex-col mt-12"
        contentContainerStyle={{ paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        <Text className="text-3xl mt-2 ml-2 mb-2 text-white">Sustainable Database</Text>

        <View className="flex-row justify-between items-center max-w-full ml-2 mr-6">
          <TouchableOpacity
            className="flex-col bg-white rounded-md shadow p-4 w-1/3 items-center"
            onPress={() => router.push("/data/airList")}
          >
            <Text className="font-semibold text-2xl mb-3">Pollution</Text>
            <Image source={require("@/assets/images/wind.png")} style={{ height: 64, width: 64 }} />
          </TouchableOpacity>
          <TouchableOpacity
            className="flex-col bg-white rounded-md shadow p-4 w-1/3 items-center ml-2 mr-2"
            onPress={() => router.push("/data/waterList")}
          >
            <Text className="font-semibold text-2xl mb-3">Water</Text>
            <Image source={require("@/assets/images/drop.png")} style={{ height: 64, width: 64 }} />
          </TouchableOpacity>
          <TouchableOpacity
            className="flex-col bg-white rounded-md shadow p-4 w-1/3 items-center"
            onPress={() => router.push("/data/electricList")}
          >
            <Text className="font-semibold text-2xl mb-3">Electric</Text>
            <Image source={require("@/assets/images/lightning.png")} style={{ height: 64, width: 64 }} />
          </TouchableOpacity>
        </View>

        <View className="flex-row justify-between items-center mt-6 mx-2 mb-2">
          <Text className="text-3xl text-white">Booking room Setting</Text>
          <TouchableOpacity className="bg-green-200 p-1 px-3 rounded-full shadow">
            <Text>Add +</Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <Text className="mx-2 text-white">Loading...</Text>
        ) : rooms.length === 0 ? (
          <Text className="mx-2 text-white">There is no Room set up</Text>
        ) : (
          rooms.map((room) => (
            <TouchableOpacity
              key={room.id}
              className="flex-row max-w-full mx-2 p-4 mb-2 justify-between bg-green-50 rounded-lg shadow"
            >
              <Text className="font-semibold">Room {room.name}</Text>
              <Text className={`${room.status === "Available" ? "text-green-700" : "text-red-700"}`}>
                {room.status}
              </Text>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </ImageBackground>
  );
}
