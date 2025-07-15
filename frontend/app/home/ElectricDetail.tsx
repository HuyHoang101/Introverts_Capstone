import React, { useEffect, useState } from "react";
import { Text, View, FlatList, TouchableOpacity, ScrollView, ImageBackground } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import "@/global.css";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

type ElectricData = {
  date: string;
  kwh: number;
};

const ITEMS_PER_PAGE = 5;

export default function ElectricDetail() {
  const [data, setData] = useState<ElectricData[]>([]);
  const [page, setPage] = useState(1);
  const [isPressed, setIsPressed] = useState(false);
  const [isPressed1, setIsPressed1] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const totalPages = Math.ceil(data.length / ITEMS_PER_PAGE);
  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentData = data.slice(startIndex, endIndex);

  // Calculate statistics
  const totalConsumption = data.reduce((sum, item) => sum + item.kwh, 0);
  const averageConsumption = data.length > 0 ? totalConsumption / data.length : 0;
  const maxConsumption = data.length > 0 ? Math.max(...data.map(item => item.kwh)) : 0;

  useEffect(() => {
    setLoading(true);
    fetch(`${API_BASE_URL}/api/electric`)
      .then((res) => res.json())
      .then((json) => {
        setData(json);
        setLoading(false);
      })
      .catch((err) => {
        console.error("API error:", err);
        setLoading(false);
      });
  }, []);

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(num);
  };

  const formatLargeNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  return (
    <ImageBackground
      source={require('../../assets/images/bg_main.png')}
      className="flex-1"
      resizeMode="stretch"
    >
      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 32 }}>
        {/* Header */}
        <View className="flex-row items-center justify-between px-4 pt-12 pb-4">
          <TouchableOpacity
            onPress={() => router.back()}
            className="p-2 rounded-full bg-white/20"
          >
            <MaterialIcons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text className="text-2xl font-bold text-white">Electric Usage Details</Text>
          <View className="w-10" />
        </View>

        {/* Statistics Cards */}
        <View className="px-4 mb-6">
          <View className="flex-row justify-between space-x-3">
            <View className="flex-1 bg-white/90 rounded-xl p-4 shadow-lg">
              <View className="flex-row items-center">
                <MaterialIcons name="flash-on" size={20} color="#f59e0b" />
                <Text className="text-sm font-semibold text-gray-600 ml-2">Total</Text>
              </View>
              <Text className="text-xl font-bold text-gray-800 mt-1">
                {formatLargeNumber(totalConsumption)}
              </Text>
              <Text className="text-xs text-gray-500">kWh</Text>
            </View>
            
            <View className="flex-1 bg-white/90 rounded-xl p-4 shadow-lg">
              <View className="flex-row items-center">
                <MaterialIcons name="trending-up" size={20} color="#10b981" />
                <Text className="text-sm font-semibold text-gray-600 ml-2">Average</Text>
              </View>
              <Text className="text-xl font-bold text-gray-800 mt-1">
                {formatLargeNumber(averageConsumption)}
              </Text>
              <Text className="text-xs text-gray-500">kWh/day</Text>
            </View>
            
            <View className="flex-1 bg-white/90 rounded-xl p-4 shadow-lg">
              <View className="flex-row items-center">
                <MaterialIcons name="warning" size={20} color="#ef4444" />
                <Text className="text-sm font-semibold text-gray-600 ml-2">Peak</Text>
              </View>
              <Text className="text-xl font-bold text-gray-800 mt-1">
                {formatLargeNumber(maxConsumption)}
              </Text>
              <Text className="text-xs text-gray-500">kWh</Text>
            </View>
          </View>
        </View>

        {/* Data List */}
        <View className="bg-white/95 mx-4 rounded-xl shadow-lg">
          <View className="p-4 border-b border-gray-200">
            <Text className="text-lg font-bold text-gray-800">Daily Usage Records</Text>
            <Text className="text-sm text-gray-600">
              Showing {currentData.length} of {data.length} records
            </Text>
          </View>
          
          {loading ? (
            <View className="p-8 items-center">
              <Text className="text-gray-500">Loading...</Text>
            </View>
          ) : (
            <FlatList
              data={currentData}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <View className="p-4 border-b border-gray-100 flex-row items-center justify-between">
                  <View className="flex-1">
                    <Text className="text-base font-semibold text-gray-800">{item.date}</Text>
                    <Text className="text-sm text-gray-500">Daily consumption</Text>
                  </View>
                  <View className="flex-row items-center">
                    <MaterialIcons name="flash-on" size={16} color="#f59e0b" />
                    <Text className="text-lg font-bold text-gray-800 ml-2">
                      {formatNumber(item.kwh)}
                    </Text>
                    <Text className="text-sm text-gray-500 ml-1">kWh</Text>
                  </View>
                </View>
              )}
              scrollEnabled={false}
            />
          )}
        </View>

        {/* Pagination Controls */}
        {!loading && data.length > 0 && (
          <View className="flex-row justify-center items-center mt-6 px-4">
            <TouchableOpacity
              onPress={() => setPage((prev) => Math.max(prev - 1, 1))}
              onPressIn={() => setIsPressed(true)}
              onPressOut={() => setIsPressed(false)}
              disabled={page === 1}
              className={`px-4 py-2 rounded-lg mr-4 ${
                page === 1 ? 'bg-gray-300' : isPressed ? 'bg-orange-600' : 'bg-orange-500'
              }`}
            >
              <Text className={`font-semibold ${page === 1 ? 'text-gray-500' : 'text-white'}`}>
                Previous
              </Text>
            </TouchableOpacity>

            <View className="bg-white/90 px-4 py-2 rounded-lg">
              <Text className="text-base font-semibold text-gray-800">
                {page} of {totalPages}
              </Text>
            </View>

            <TouchableOpacity
              onPress={() => setPage((prev) => Math.min(prev + 1, totalPages))}
              onPressIn={() => setIsPressed1(true)}
              onPressOut={() => setIsPressed1(false)}
              disabled={page === totalPages}
              className={`px-4 py-2 rounded-lg ml-4 ${
                page === totalPages ? 'bg-gray-300' : isPressed1 ? 'bg-orange-600' : 'bg-orange-500'
              }`}
            >
              <Text className={`font-semibold ${page === totalPages ? 'text-gray-500' : 'text-white'}`}>
                Next
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </ImageBackground>
  );
}