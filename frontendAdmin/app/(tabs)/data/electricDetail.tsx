import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { formatNumber } from "@/utils/calculateUnit";
import { formatHourDate, formatVietnamTime } from "@/utils/time"; // hoặc dùng dayjs
import "@/global.css";

type ElectricData = {
  period: string;
  total: number;
  high: number;
  low: number;
  medium: number;
  createdAt: string;
  updatedAt: string;
};

export default function ElectricDetail() {
  const { item } = useLocalSearchParams<{ item?: string }>();
  const router = useRouter();

  const [electricData, setElectricData] = useState<ElectricData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const parsed =
        typeof item === "string" ? JSON.parse(item) : (item as unknown as ElectricData);

      if (
        !parsed ||
        typeof parsed.total !== "number" ||
        typeof parsed.period !== "string"
      ) {
        throw new Error("Invalid data received");
      }

      setElectricData(parsed);

      // Fake loading
      const timer = setTimeout(() => setLoading(false), 500);
      return () => clearTimeout(timer);
    } catch (err: any) {
      console.error(err);
      setLoading(false);
    }
  }, [item]);

  if (loading || !electricData) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <Text className="text-gray-500 text-lg">Loading...</Text>
      </View>
    );
  }

  const { period, total, high, low, medium, updatedAt } = electricData;
  const average = total / 30;

  return (
    <ImageBackground
      source={require("@/assets/images/bg_main.png")}
      className="flex-1"
      resizeMode="stretch"
    >
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 32 }}
      >
        {/* Header */}
        <View className="flex-row items-center justify-between px-4 pt-12 pb-4">
          <TouchableOpacity
            onPress={() => router.back()}
            className="p-2 rounded-full bg-white/20"
          >
            <MaterialIcons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text className="text-2xl font-bold text-white">
            Electric Usage Detail
          </Text>
          <View className="w-10" />
        </View>

        {/* Period & Updated Time */}
        <View className="px-4 mb-4">
          <Text className="text-white text-base font-semibold">
            Period: {formatVietnamTime(period)}
          </Text>
          <Text className="text-white text-sm">
            Last Updated: {formatHourDate(updatedAt)}
          </Text>
        </View>

        {/* Statistics Cards */}
        <View className="px-4 mb-6">
          <View className="flex-row">
            {/* Total */}
            <View className="flex-1 bg-white/90 rounded-xl p-4 shadow-lg mr-2">
              <View className="flex-row items-center">
                <MaterialIcons name="flash-on" size={20} color="#f59e0b" />
                <Text className="text-sm font-semibold text-gray-600 ml-2">
                  Total
                </Text>
              </View>
              <Text className="text-xl font-bold text-gray-800 mt-1">
                {formatNumber(total)}
              </Text>
              <Text className="text-xs text-gray-500">kWh</Text>
            </View>

            {/* Average */}
            <View className="flex-1 bg-white/90 rounded-xl p-4 shadow-lg mr-2">
              <View className="flex-row items-center">
                <MaterialIcons name="trending-up" size={20} color="#10b981" />
                <Text className="text-sm font-semibold text-gray-600 ml-2">
                  Avg
                </Text>
              </View>
              <Text className="text-xl font-bold text-gray-800 mt-1">
                {formatNumber(average)}
              </Text>
              <Text className="text-xs text-gray-500">kWh/day</Text>
            </View>

            {/* Peak */}
            <View className="flex-1 bg-white/90 rounded-xl p-4 shadow-lg">
              <View className="flex-row items-center">
                <MaterialIcons name="warning" size={20} color="#ef4444" />
                <Text className="text-sm font-semibold text-gray-600 ml-2">
                  Peak
                </Text>
              </View>
              <Text className="text-xl font-bold text-gray-800 mt-1">
                {formatNumber(high)}
              </Text>
              <Text className="text-xs text-gray-500">kWh</Text>
            </View>
          </View>
        </View>

        {/* Extra statistics */}
        <View className="mx-4 bg-white/90 rounded-xl p-4 shadow">
          <Text className="text-lg font-bold text-gray-800 mb-2">
            More Statistics
          </Text>
          <View className="flex-row justify-between mb-2">
            <Text className="text-sm text-gray-600">Lowest</Text>
            <Text className="text-sm font-semibold text-gray-800">
              {formatNumber(low)} kWh
            </Text>
          </View>
          <View className="flex-row justify-between">
            <Text className="text-sm text-gray-600">Medium</Text>
            <Text className="text-sm font-semibold text-gray-800">
              {formatNumber(medium)} kWh
            </Text>
          </View>
        </View>
      </ScrollView>
    </ImageBackground>
  );
}
