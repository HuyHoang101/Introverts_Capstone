import { ScrollView, View, Text, TouchableOpacity, ImageBackground } from "react-native";
import React, { useState, useEffect } from "react";
import { getAllAirData } from "@/service/airService";
import { MaterialIcons } from "@expo/vector-icons";
import { calculateDangerScore } from "@/utils/dangerScore";
import { formatHourDate } from "@/utils/time";
import { useRouter } from "expo-router";

type AirItem = {
  nh3: number;
  no2: number;
  co: number;
  temperature?: number;
  humidity?: number;
  period?: string;
  timestamp?: string;
  createdAt?: string;
  updatedAt?: string;
  // (chấp nhận field cũ để khỏi lỗi TS nếu API chưa đồng bộ, nhưng KHÔNG dùng để tính điểm)
  pm25?: number;
  pm10?: number;
  o3?: number;
  createAt?: string;
  updateAt?: string;
};

export default function AirList() {
  const [airData, setAirData] = useState<AirItem[] | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pushAirDetail = (obj: any) => {
    const payload = encodeURIComponent(JSON.stringify(obj));
    router.push({ pathname: '/data/AirDetail', params: { payload } });
  };

  useEffect(() => {
    const fetchAirData = async () => {
      try {
        const data = await getAllAirData();
        setAirData(data as AirItem[]);
      } catch (error) {
        console.error("Error fetching air data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAirData();
  }, []);

  const getAirQualityLevelRow = (item: AirItem) => {
    // Tính Danger Score theo nh3/no2/co
    const score = calculateDangerScore({
      nh3: Number(item?.nh3 ?? 0),
      no2: Number(item?.no2 ?? 0),
      co: Number(item?.co ?? 0),
    });

    let level = "";
    let color = "";
    if (score <= 19)       { level = "Excellent";             color = "text-green-500"; }
    else if (score <= 39)  { level = "Good";                  color = "text-lime-500"; }
    else if (score <= 59)  { level = "Moderate";              color = "text-yellow-500"; }
    else if (score <= 74)  { level = "Unhealthy (Sensitive)"; color = "text-orange-500"; }
    else if (score <= 89)  { level = "Unhealthy";             color = "text-red-500"; }
    else if (score <= 99)  { level = "Very Unhealthy";        color = "text-red-600"; }
    else                   { level = "Hazardous";             color = "text-red-800"; }

    // Lấy thời điểm hiển thị: ưu tiên period → timestamp → updatedAt → createdAt (và bản cũ)
    const when =
      item?.period ??
      item?.timestamp ??
      item?.updatedAt ??
      item?.createAt ??
      item?.updateAt ??
      item?.createdAt ??
      "";

    return (
      <View className="flex-row justify-between items-center w-full p-5 border-b border-gray-200">
        <Text className="text-base text-gray-400 italic">
          {when ? formatHourDate(when) : "N/A"}
        </Text>
        <Text className="text-base text-gray-800">{score}</Text>
        <Text className={`text-base font-medium ${color}`}>{level}</Text>
      </View>
    );
  };

  return (
    <ImageBackground
      source={require("@/assets/images/bg_main.png")}
      className="flex-1 p-4"
      resizeMode="stretch"
    >
      {/* Header */}
      <View className="flex-row items-center justify-between pt-12 pb-4">
        <TouchableOpacity onPress={() => router.back()} className="p-2 rounded-full bg-white/20">
          <MaterialIcons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text className="text-2xl font-bold text-white">Pollution Data</Text>
        <View className="w-10" />
      </View>

      {/* Header row của bảng */}
      <View className="flex-row justify-between items-center p-4 px-6 border-b border-gray-700 bg-white rounded-s-lg">
        <Text className="text-sm text-gray-500">Last Updated</Text>
        <Text className="text-sm text-gray-500">Danger Score</Text>
        <Text className="text-sm text-gray-500">Air Quality Level</Text>
      </View>

      {loading ? (
        <View className="flex-1 justify-center items-center">
          <Text className="mt-8 text-lg text-gray-600">Loading air quality data...</Text>
        </View>
      ) : !airData || airData.length === 0 ? (
        <View className="flex-1 justify-center items-center p-4">
          <Text className="text-lg text-gray-600 text-center">No air quality data available.</Text>
        </View>
      ) : (
        <ScrollView
          className="flex bg-white p-2 rounded-b-lg"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 24 }}
        >
          {airData.map((item, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => pushAirDetail(item)}
            >
              {getAirQualityLevelRow(item)}
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </ImageBackground>
  );
}
