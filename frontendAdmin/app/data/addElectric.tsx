import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { addElectricData } from "@/service/electricService";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";

export default function AddElectricScreen() {
  const router = useRouter();
  const [period, setPeriod] = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [total, setTotal] = useState("");
  const [low, setLow] = useState("");
  const [medium, setMedium] = useState("");
  const [high, setHigh] = useState("");

  const handleSave = async () => {
    if (!total || !low || !medium || !high) {
      Alert.alert("Validation", "Vui lòng nhập đầy đủ các trường.");
      return;
    }

    try {
      await addElectricData({
        period: period.toISOString(),
        total: parseFloat(total),
        low: parseFloat(low),
        medium: parseFloat(medium),
        high: parseFloat(high),
      });
      Alert.alert("Thành công", "Đã thêm dữ liệu điện!");
      setTotal("");
      setLow("");
      setMedium("");
      setHigh("");
      setPeriod(new Date());
    } catch (err) {
      console.error(err);
      Alert.alert("Lỗi", "Không thể thêm dữ liệu.");
    }
  };

  return (
    <View className="flex-1 bg-white p-4">
      {/* Header */}
      <View className="flex-row items-center justify-start mb-4 mt-12 w-full max-w-md">
        <TouchableOpacity
          onPress={() => router.back()}
          className="p-2 rounded-full bg-black/20"
        >
          <MaterialIcons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <View className="w-full items-center">
          <Text className="text-xl font-bold">Add Electricity Data</Text>
        </View>
      </View>

      {/* Period */}
      <Text className="text-base mb-2">Period (Date):</Text>
      <TouchableOpacity
        className="border border-gray-300 rounded-lg p-3 mb-4"
        onPress={() => setShowDatePicker(true)}
      >
        <Text>{period.toLocaleDateString("vi-VN")}</Text>
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
      <Text className="text-base mb-2">Total (kWh):</Text>
      <TextInput
        className="border border-gray-300 rounded-lg p-3 mb-4"
        keyboardType="numeric"
        placeholder="Nhập tổng điện"
        value={total}
        onChangeText={setTotal}
      />

      {/* Low */}
      <Text className="text-base mb-2">Low (kWh):</Text>
      <TextInput
        className="border border-gray-300 rounded-lg p-3 mb-4"
        keyboardType="numeric"
        placeholder="Nhập điện giờ thấp điểm"
        value={low}
        onChangeText={setLow}
      />

      {/* Medium */}
      <Text className="text-base mb-2">Medium (kWh):</Text>
      <TextInput
        className="border border-gray-300 rounded-lg p-3 mb-4"
        keyboardType="numeric"
        placeholder="Nhập điện giờ trung bình"
        value={medium}
        onChangeText={setMedium}
      />

      {/* High */}
      <Text className="text-base mb-2">High (kWh):</Text>
      <TextInput
        className="border border-gray-300 rounded-lg p-3 mb-4"
        keyboardType="numeric"
        placeholder="Nhập điện giờ cao điểm"
        value={high}
        onChangeText={setHigh}
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
