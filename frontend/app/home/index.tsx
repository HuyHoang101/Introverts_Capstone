import { View, Text, ScrollView, Pressable } from 'react-native';
import { Feather } from '@expo/vector-icons';

export default function HomeScreen() {
  return (
    <ScrollView
      className="flex-1 bg-gray-100"
      contentContainerStyle={{ padding: 16 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Header (chỉ còn notification icon) */}
      <View className="flex-row justify-end items-center mb-4">
        <Feather name="bell" size={24} color="#333" />
      </View>

      {/* Daily Tips & Alert */}
      <View className="flex-row justify-between mb-4 space-x-2">
        <View className="flex-1 bg-green-100 rounded-xl p-3">
          <Text className="font-bold text-green-800 mb-1">Daily Tips</Text>
          <Text className="text-gray-700">Turn off lights - saved 5% energy</Text>
        </View>
        <View className="flex-1 bg-red-200 rounded-xl p-3">
          <Text className="font-bold text-red-700 mb-1">Alert</Text>
          <Text className="text-gray-800">⚠️ High water usage detected in Building 2!!!</Text>
        </View>
      </View>

      {/* Personal Records */}
      <View className="bg-white rounded-xl p-4 shadow mb-4">
        <View className="flex-row justify-between items-center mb-2">
          <Text className="text-lg font-bold">Personal records</Text>
          <Pressable>
            <Text className="text-blue-600 font-medium">add more →</Text>
          </Pressable>
        </View>
        <Text className="text-gray-400 mb-2">recycled this week</Text>

        <View className="flex-row justify-between items-center">
          <View>
            <Text className="text-green-700 text-lg font-bold">5.8 kg</Text>
            <Text className="text-gray-600">wastes</Text>
            <Text className="text-green-700 text-lg font-bold mt-2">4.2 L</Text>
            <Text className="text-gray-600">water</Text>
            <Text className="text-green-700 text-lg font-bold mt-2">36 kWh</Text>
            <Text className="text-gray-600">electricity</Text>
          </View>
          {/* Placeholder for chart */}
          <View className="w-20 h-20 bg-gray-100 rounded-lg items-center justify-center">
            <Text className="text-xs text-gray-500">Chart</Text>
          </View>
        </View>
      </View>

      {/* Booking Room */}
      <View className="bg-gray-200 rounded-xl p-4 shadow">
        <Text className="text-lg font-bold mb-2">BOOKING ROOM</Text>
        <View className="bg-white rounded-xl p-3 shadow-sm">
          <Text className="text-green-800 font-semibold text-center">ROOM 2.4.. is now available</Text>
        </View>
      </View>
    </ScrollView>
  );
}
