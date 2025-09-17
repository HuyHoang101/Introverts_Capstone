import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { addWaterData } from "@/service/waterService";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";

export default function AddWaterScreen() {
  const router = useRouter();
  const [period, setPeriod] = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [total, setTotal] = useState("");

  const handleSave = async () => {
    if (!total) {
      Alert.alert("Validation", "Vui lòng nhập tổng lượng nước.");
      return;
    }

    try {
      await addWaterData({
        period: period.toISOString(), // gửi ISO string lên backend
        total: parseFloat(total),
      });
      Alert.alert("Thành công", "Đã thêm dữ liệu nước!");
      setTotal("");
      setPeriod(new Date());
      router.back();
    } catch (err) {
      console.error(err);
      Alert.alert("Lỗi", "Không thể thêm dữ liệu.");
    }
  };

  return (
    <View className="flex-1 bg-white p-4">
      <View className="flex-row items-center justify-start mb-4 mt-12 w-full max-w-md">
        <TouchableOpacity
          onPress={() => router.back()}
          className="p-2 rounded-full bg-black/20"
        >
          <MaterialIcons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <View className="w-full items-center">
            <Text className="text-xl font-bold text-black">Add Water Data</Text>
        </View>
      </View> 

      {/* Period */}
      <Text className="text-base mb-2 text-black">Period (Date):</Text>
      <TouchableOpacity
        className="border border-gray-300 rounded-lg p-3 mb-4"
        onPress={() => setShowDatePicker(true)}
      >
        <Text className="text-gray-800">{period.toLocaleDateString("vi-VN")}</Text>
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
          value={period}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowDatePicker(false);
            if (selectedDate) setPeriod(selectedDate);
          }}
        />
      )}

      {/* Total */}
      <Text className="text-base mb-2 text-black">Total (m³):</Text>
      <TextInput
        className="border border-gray-300 rounded-lg p-3 mb-4 text-black"
        keyboardType="numeric"
        placeholder="Nhập số nước"
        placeholderTextColor="#9ca3af"
        value={total}
        onChangeText={setTotal}
      />

      {/* Save button */}
      <TouchableOpacity
        className="bg-blue-500 rounded-xl p-4 items-center"
        onPress={handleSave}
      >
        <Text className="text-white font-semibold">Save</Text>
      </TouchableOpacity>
    </View>
  );
}
