import { ScrollView, View, Text, ImageBackground, TouchableOpacity } from "react-native";
import React, { useState, useEffect } from "react";
import { getAllWaterData } from "@/service/waterService";
import { formatMonthYear } from "@/utils/time";
import { formatNumber } from "@/utils/calculateUnit";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";

interface waterDataItem {
    total: number;
    period?: string;
    timestamp?: string;
}

export default function WaterList() {
    const [waterData, setWaterData] = useState<waterDataItem[] | null>(null);
    const [Loading, setLoading] = useState<boolean>(true);
    const router = useRouter();
    
    useEffect(() => {
        async function fetchData() {
            try {
                const data = await getAllWaterData();
                setWaterData(data);
            } catch (error) {
                console.error("Error fetching water data:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, []);
    
    return (
        <ImageBackground
            source={require("../../assets/images/bg_main.png")}
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
                <Text className="text-2xl font-bold text-white">Monthly Water Usage</Text>
                <View className="w-10" />
            </View>
            <View className="flex-row justify-between items-center p-4 border-b border-gray-800 bg-white pr-9 mx-4 mt-4 rounded-s-xl">
                <Text className="text-lg font-bold">Total</Text>
                <Text className="text-gray-600">Unit</Text>
                <Text className="text-gray-600">Period</Text>
            </View> 
            <ScrollView className="flex-1 bg-white mx-4 mb-6 rounded-b-xl" showsVerticalScrollIndicator={false}>
                {Loading ? (
                    <View className="flex-1 items-center justify-center">
                        <Text className="text-lg text-gray-500">Loading...</Text>
                    </View>
                ) : (
                    <>          
                        {waterData?.map((item, index) => (
                            <TouchableOpacity key={index} className="flex-row justify-between items-center p-4 border-b border-gray-200"
                            onPress={() => router.push({pathname: '/data/WaterDetail',
                                params: {
                                    data: JSON.stringify(item)
                                }
                            })}>
                            {/* Render your water data item here */}
                                <Text className="text-lg font-bold">{formatNumber(item.total)}</Text>
                                <Text className="text-gray-600">L</Text>
                                <Text className="text-gray-600">{formatMonthYear(item.period)}</Text>
                            </TouchableOpacity>
                        ))}
                    </>
                )}
            </ScrollView>
        </ImageBackground>
    );
}