import { View, Text, TouchableOpacity, ImageBackground, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import "@/global.css";
import { formatVietnamTime } from "@/utils/time";

type WaterData = {
  period: string;
  total: number;
  createdAt: string;
  updatedAt: string;
};

export default function WaterDetail() {
  const router = useRouter();
  const { item } = useLocalSearchParams<{ item?: string }>();
  const [record, setRecord] = useState<WaterData | null>(null);
  const [average, setAverage] = useState<number | null>(null);

  useEffect(() => {
    if (typeof item === "string") {
      try {
        const parsed = JSON.parse(item) as WaterData;
        setRecord(parsed);
        setAverage(parsed.total / 30);
      } catch (err) {
        console.error("Invalid data format from params", err);
      }
    }
  }, [item]);

  const formatNumber = (num: number) =>
    new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    }).format(num);

  if (!record) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <Text className="text-gray-500">No data available.</Text>
      </View>
    );
  }

  return (
    <ImageBackground
      source={require("@/assets/images/bg_main.png")}
      className="flex-1"
      resizeMode="stretch"
    >
      <ScrollView contentContainerStyle={{ paddingBottom: 32 }}>
        {/* Header */}
        <View className="flex-row items-center justify-between px-4 pt-12 pb-4">
          <TouchableOpacity
            onPress={() => router.back()}
            className="p-2 rounded-full bg-white/20"
          >
            <MaterialIcons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text className="text-2xl font-bold text-white">Water Usage Detail</Text>
          <View className="w-10" />
        </View>

        {/* Card */}
        <View className="mx-4 bg-white/95 rounded-xl shadow-lg p-6">
          <View className="flex-row items-center mb-4">
            <MaterialIcons name="water-drop" size={24} color="#3b82f6" />
            <Text className="text-xl font-bold text-gray-800 ml-2">Usage Summary</Text>
          </View>

          <View className="mb-4">
            <Text className="text-sm text-gray-500">Period</Text>
            <Text className="text-lg font-semibold text-gray-800">{formatVietnamTime(record.period)}</Text>
          </View>

          <View className="mb-4">
            <Text className="text-sm text-gray-500">Total Consumption</Text>
            <Text className="text-lg font-semibold text-blue-600">
              {formatNumber(record.total)} L
            </Text>
          </View>

          <View className="mb-4">
            <Text className="text-sm text-gray-500">Average per day (30 days)</Text>
            <Text className="text-lg font-semibold text-green-600">
              {average ? formatNumber(average) : "-"} L/day
            </Text>
          </View>

          <View className="mb-4">
            <Text className="text-sm text-gray-500">Created At</Text>
            <Text className="text-base text-gray-700">
              {new Date(record.createdAt).toLocaleString()}
            </Text>
          </View>

          <View>
            <Text className="text-sm text-gray-500">Last Updated</Text>
            <Text className="text-base text-gray-700">
              {new Date(record.updatedAt).toLocaleString()}
            </Text>
          </View>
        </View>
      </ScrollView>
    </ImageBackground>
  );
}
