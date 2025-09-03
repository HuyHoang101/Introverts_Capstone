import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  RefreshControl,
  ImageBackground,
} from "react-native";
import { useRouter } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import { getAllElectricData, deleteElectricData } from "@/service/electricService";
import { format } from "date-fns";
import { MaterialIcons } from "@expo/vector-icons";

interface ElectricityData {
  id: string;
  period: string;
  total: number;
  low: number;
  medium: number;
  high: number;
}

const formatNumber = (num: number) =>
  new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 }).format(num);

const ElectricList = () => {
  const [data, setData] = useState<ElectricityData[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [deleteMode, setDeleteMode] = useState(false);
  const router = useRouter();

  const fetchData = useCallback(async () => {
    try {
      const res = await getAllElectricData();
      setData(res);
    } catch (err) {
      console.error("Failed to fetch electricity data:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [fetchData])
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  }, [fetchData]);

  const confirmDelete = (id: string) => {
    Alert.alert("Are you sure?", "This will permanently delete the record.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteElectricData(id);
            setData((prev) => prev.filter((item) => item.id !== id));
          } catch (err) {
            console.error("Failed to delete electricity data:", err);
          }
        },
      },
    ]);
  };

  return (
    <ImageBackground
      source={require("@/assets/images/bg_main.png")}
      className="flex-1"
      resizeMode="stretch"
    >
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 pt-12 pb-4">
        <TouchableOpacity
          onPress={() => router.back()}
          className="p-2 rounded-full bg-white/20"
        >
          <MaterialIcons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text className="text-2xl font-bold text-white">Electric Usage</Text>
        <View className="flex-row">
          <TouchableOpacity
            onPress={() => router.push("/data/addElectric")}
            className="p-2 rounded-full bg-white/20 mr-2"
          >
            <MaterialIcons name="add" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setDeleteMode((v) => !v)}
            className="p-2 rounded-full bg-white/20"
          >
            <MaterialIcons
              name={deleteMode ? "close" : "delete"}
              size={24}
              color="white"
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Table header */}
      <View className="flex-row justify-between items-center p-4 border-b border-gray-800 bg-white pr-9 mx-4 mt-4 rounded-s-xl">
        <Text className="text-lg font-bold">Total</Text>
        <Text className="text-gray-600">Unit</Text>
        <Text className="text-gray-600">Period</Text>
      </View>

      {/* List */}
      <ScrollView
        className="flex-1 bg-white mx-4 mb-6 rounded-b-xl"
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {loading ? (
          <View className="flex-1 items-center justify-center py-10">
            <ActivityIndicator size="large" />
          </View>
        ) : (
          <>
            {data.map((item) => (
              <TouchableOpacity
                key={item.id}
                className="flex-row justify-between items-center p-4 border-b border-gray-200"
                onPress={() => {
                  if (!deleteMode) {
                    router.push({
                      pathname: "/data/electricDetail",
                      params: { item: JSON.stringify(item) },
                    });
                  }
                }}
              >
                <View className="flex-row items-center">
                  {deleteMode && (
                    <TouchableOpacity
                      onPress={() => confirmDelete(item.id)}
                      className="w-6 h-6 mr-3 rounded-full bg-red-500 items-center justify-center"
                    >
                      <Text className="text-white font-bold">-</Text>
                    </TouchableOpacity>
                  )}
                  <Text className="text-lg font-bold">{formatNumber(item.total)}</Text>
                </View>
                <Text className="text-gray-600">kWh</Text>
                <Text className="text-gray-600">{format(new Date(item.period), "MM/yyyy")}</Text>
              </TouchableOpacity>
            ))}
          </>
        )}
      </ScrollView>
    </ImageBackground>
  );
};

export default ElectricList;
