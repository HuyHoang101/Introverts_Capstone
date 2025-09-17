import React, { useMemo } from "react";
import { View, Text, TouchableOpacity, ImageBackground, ScrollView } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { calculateDangerScore } from "@/utils/dangerScore";
import PollutantList from "@/component/PollurtantList";
import AirQualityComparisonCard from "@/component/AirQualityComparisonCard";
import DangerGauge from "@/component/DangerGauge";

type AirItem = {
  nh3: number;
  no2: number;
  co: number;
  temperature?: number; // °C
  humidity?: number;    // %
  period?: string;
  timestamp?: string;
  createdAt?: string;
  updatedAt?: string;

  // legacy fields (để tránh crash nếu data cũ lọt vào):
  pm25?: number;
  pm10?: number;
  o3?: number;
  createAt?: string;
  updateAt?: string;
};

const getLevel = (score: number) => {
  if (score <= 19) return { label: "Excellent", color: "#22c55e" };
  if (score <= 39) return { label: "Good", color: "#84cc16" };
  if (score <= 59) return { label: "Moderate", color: "#eab308" };
  if (score <= 74) return { label: "Unhealthy (Sensitive)", color: "#f97316" };
  if (score <= 89) return { label: "Unhealthy", color: "#ef4444" };
  if (score <= 99) return { label: "Very Unhealthy", color: "#dc2626" };
  return { label: "Hazardous", color: "#7f1d1d" };
};

export default function AirDetail() {
  const router = useRouter();
  const params = useLocalSearchParams();
  // nhận cả 'payload' (mới) lẫn 'data' (cũ) để backward-compatible
  const rawParam = (params?.payload ?? params?.data) as string | undefined;

  const item = useMemo(() => {
    if (!rawParam) return null;
    const tryStrings: string[] = [];

    // 1) thử decodeURIComponent
    try {
      tryStrings.push(decodeURIComponent(rawParam));
    } catch {
      // không decode được thì dùng nguyên bản
      tryStrings.push(rawParam);
    }

    for (const s of tryStrings) {
      try {
        return JSON.parse(s);
      } catch {
        // thử tiếp cách khác nếu cần
      }
    }
    return null;
  }, [rawParam]);

  // Adapter an toàn nếu thiếu field mới
  const current = useMemo<AirItem>(() => {
    const nh3 = Number(item?.nh3 ?? 0);
    const no2 = Number(item?.no2 ?? 0);
    const co  = Number(item?.co  ?? 0);
    const temperature = typeof item?.temperature === "number" ? item?.temperature : undefined;
    const humidity    = typeof item?.humidity === "number" ? item?.humidity : undefined;
    return { nh3, no2, co, temperature, humidity, period: item?.period ?? item?.timestamp };
  }, [item]);

  const score = useMemo(() => calculateDangerScore({ nh3: current.nh3, no2: current.no2, co: current.co }), [current]);
  const level = useMemo(() => getLevel(score), [score]);

  return (
    <ImageBackground
      source={require("@/assets/images/bg_main.png")}
      className="flex-1 p-4"
      resizeMode="stretch"
    >
      {/* Header cố định */}
      <View className="flex-row items-center justify-between pt-8 pb-4">
        <TouchableOpacity onPress={() => router.back()} className="p-2 rounded-full bg-white/20">
          <MaterialIcons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text className="text-2xl font-bold text-white">Air Detail</Text>
        <View className="w-10" />
      </View>

      {/* Nội dung có thể SCROLL */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 28 }}
      >
        {/* Summary Card */}
        <View className="bg-white rounded-2xl border border-gray-200 p-4 mx-1">
          <Text className="text-lg font-bold text-gray-900">Danger Score</Text>
          <View className="flex-row items-center mt-3">
            {/* CHANGED: thay Progress.Circle -> DangerGauge */}
            <DangerGauge score={score} size={92} thickness={10} />
            <View className="ml-5">
              <Text className="text-xl font-semibold" style={{ color: level.color }}>
                {level.label}
              </Text>
              <Text className="text-gray-600 mt-2">
                🌡️ Temperature: <Text className="font-semibold text-gray-900">
                  {typeof current.temperature === "number" ? `${current.temperature}°C` : "N/A"}
                </Text>
              </Text>
              <Text className="text-gray-600 mt-1">
                💧 Humidity: <Text className="font-semibold text-gray-900">
                  {typeof current.humidity === "number" ? `${current.humidity}%` : "N/A"}
                </Text>
              </Text>
              {current.period ? (
                <Text className="text-gray-500 mt-1">Updated: {current.period}</Text>
              ) : null}
            </View>
          </View>
        </View>

        {/* Breakdown + So sánh */}
        <PollutantList data={current} className="mt-4 mx-1" />
        <AirQualityComparisonCard current={current} className="mt-4 mx-1" />
      </ScrollView>
    </ImageBackground>
  );
}
