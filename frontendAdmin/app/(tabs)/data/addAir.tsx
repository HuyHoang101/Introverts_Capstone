import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { addAirData } from "@/service/airService";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";

export default function AddPollutionScreen() {
  const router = useRouter();
  const [period, setPeriod] = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [pm25, setPm25] = useState("");
  const [pm10, setPm10] = useState("");
  const [no2, setNo2] = useState("");
  const [o3, setO3] = useState("");
  const [co, setCo] = useState("");

  const handleSave = async () => {
    if (!pm25 || !pm10 || !no2 || !o3 || !co) {
      Alert.alert("Validation", "Vui lòng nhập đầy đủ các chỉ số.");
      return;
    }

    try {
      await addAirData({
        period: period.toISOString(),
        pm25: parseFloat(pm25),
        pm10: parseFloat(pm10),
        no2: parseFloat(no2),
        o3: parseFloat(o3),
        co: parseFloat(co),
      });
      Alert.alert("Thành công", "Đã thêm dữ liệu không khí!");
      setPm25("");
      setPm10("");
      setNo2("");
      setO3("");
      setCo("");
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
          <Text className="text-xl font-bold">Add Pollution Data</Text>
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

      {/* pm25 */}
      <Text className="text-base mb-2">PM2.5 (µg/m³):</Text>
      <TextInput
        className="border border-gray-300 rounded-lg p-3 mb-4"
        keyboardType="numeric"
        placeholder="Nhập PM2.5"
        value={pm25}
        onChangeText={setPm25}
      />

      {/* pm10 */}
      <Text className="text-base mb-2">PM10 (µg/m³):</Text>
      <TextInput
        className="border border-gray-300 rounded-lg p-3 mb-4"
        keyboardType="numeric"
        placeholder="Nhập PM10"
        value={pm10}
        onChangeText={setPm10}
      />

      {/* no2 */}
      <Text className="text-base mb-2">NO₂ (µg/m³):</Text>
      <TextInput
        className="border border-gray-300 rounded-lg p-3 mb-4"
        keyboardType="numeric"
        placeholder="Nhập NO₂"
        value={no2}
        onChangeText={setNo2}
      />

      {/* o3 */}
      <Text className="text-base mb-2">O₃ (µg/m³):</Text>
      <TextInput
        className="border border-gray-300 rounded-lg p-3 mb-4"
        keyboardType="numeric"
        placeholder="Nhập O₃"
        value={o3}
        onChangeText={setO3}
      />

      {/* co */}
      <Text className="text-base mb-2">CO (mg/m³):</Text>
      <TextInput
        className="border border-gray-300 rounded-lg p-3 mb-4"
        keyboardType="numeric"
        placeholder="Nhập CO"
        value={co}
        onChangeText={setCo}
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
