import React, { useEffect, useState } from "react";
import { Text, View, FlatList, TouchableOpacity } from "react-native";
import "@/global.css";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

type AirData = {
  date: string;
  temperature: number;
  CO2: number;
};

const ITEMS_PER_PAGE = 5;

export default function AirDetail() {
  const [data, setData] = useState<AirData[]>([]);
  const [page, setPage] = useState(1);
  const [isPressed, setIsPressed] = useState(false);
  const [isPressed1, setIsPressed1] = useState(false);

  const totalPages = Math.ceil(data.length / ITEMS_PER_PAGE);
  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentData = data.slice(startIndex, endIndex);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/air`)
      .then((res) => res.json())
      .then((json) => setData(json))
      .catch((err) => console.error("API error:", err));
  }, []);

  return (
    <View className="flex-1 items-center justify-center bg-white px-4 w-full">
      <Text className="text-xl font-bold mb-4 mt-4">Air Data</Text>
      <FlatList
        className="w-full"
        data={currentData}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View className="p-4 border-b border-gray-200 w-full flex-row items-center justify-between">
            <Text className="text-base italic text-gray-400">{item.date}</Text>
            <View className="p-4">
              <Text className="text-base">🌡️ Temp:   {item.temperature}°C</Text>
              <Text className="text-base">🌫️ CO₂:    {item.CO2} ppm</Text>
            </View>
          </View>
        )}
      />
      {/* Pagination Controls */}
      <View className="flex-row justify-between mt-4 px-4 space-x-2 mb-4">
        <TouchableOpacity
          onPress={() => setPage((prev) => Math.max(prev - 1, 1))}
          onPressIn={() => setIsPressed(true)}
          onPressOut={() => setIsPressed(false)}
          disabled={page === 1}
          className={`px-4 py-2 rounded-sm ${isPressed ? 'bg-gray-400' : 'bg-transparent'}`}
        >
          <Text className={`${page === 1 ? "opacity-0" : ""}`}>{'<'}</Text>
        </TouchableOpacity>

        <Text className="text-lg self-center">
          Page {page} / {totalPages}
        </Text>

        <TouchableOpacity
          onPress={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          onPressIn={() => setIsPressed1(true)}
          onPressOut={() => setIsPressed1(false)}
          disabled={page === totalPages}
          className={`px-4 py-2 rounded-sm ${isPressed1 ? "bg-gray-400" : "bg-transparent"}`}
        >
          <Text className={`${page === totalPages ? "opacity-0" : ""}`}>{'>'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}