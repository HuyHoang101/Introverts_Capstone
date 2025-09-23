import { ScrollView, View, Text, ImageBackground, TouchableOpacity } from "react-native";
import React, { useState, useEffect } from "react";
import { getAllElectricData } from "@/service/electricService";
import { formatMonthYear } from "@/utils/time";
import { formatNumber } from "@/utils/calculateUnit";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";

interface ElectricDataItem {
    low: number;
    medium: number;
    high: number;
    total: number;
    period?: string;
    timestamp?: string;
}

export default function ElectricList() {
    const [electricData, setElectricData] = useState<ElectricDataItem[] | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const router = useRouter();

    useEffect(() => {
        async function fetchData() {
            try {
                const data = await getAllElectricData();
                setElectricData(data);
            } catch (error) {
                console.error("Error fetching electric data:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, []);

    return (
        <ImageBackground
            source={require("../../../assets/images/bg_main.png")}
            className="flex-1"
            resizeMode="stretch"
        >
            <View className="flex-row items-center justify-between px-4 pt-12 pb-4">
                <TouchableOpacity
                    onPress={() => router.back()}
                    className="p-2 rounded-full bg-white/20"
                >
                    <MaterialIcons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>
                <Text className="text-2xl font-bold text-white">Monthly Electric Usage</Text>
                <View className="w-10" />
            </View>
            <View className="flex-row justify-between items-center p-4 border-b border-gray-800 bg-white pr-9 mx-4 mt-4 rounded-s-xl">
                <Text className="text-lg font-bold text-black">Total</Text>
                <Text className="text-gray-600">Unit</Text>
                <Text className="text-gray-600">Period</Text>
            </View> 
            <ScrollView className="flex-1 bg-white mx-4 mb-6 rounded-b-xl" showsVerticalScrollIndicator={false}>
                {loading ? (
                    <View className="flex-1 items-center justify-center">
                        <Text className="text-lg text-gray-500">Loading...</Text>
                    </View>
                ) : (
                    <>
                        {electricData?.map((item, index) => (
                            <TouchableOpacity
                                key={index}
                                className="flex-row justify-between items-center p-4 border-b border-gray-200"
                                onPress={() =>
                                    router.push({
                                        pathname: "/data/ElectricDetail",
                                        params: {
                                            data: JSON.stringify(item),
                                        },
                                    })
                                }
                            >
                                <Text className="text-lg font-bold text-black">{formatNumber(item.total)}</Text>
                                <Text className="text-gray-600">kWh</Text>
                                <Text className="text-gray-600">{formatMonthYear(item.period)}</Text>
                            </TouchableOpacity>
                        ))}
                    </>
                )}
            </ScrollView>
        </ImageBackground>
    );
}
