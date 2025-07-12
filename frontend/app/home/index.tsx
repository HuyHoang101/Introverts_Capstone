import { View, Text, ScrollView, Pressable, Image, TouchableOpacity, ImageBackground } from 'react-native';
import { Feather } from '@expo/vector-icons';

export default function HomeScreen() {
  return (
    <>
    <ImageBackground
      source={require('../../assets/images/bg_main.png')}
      className="flex-1"
      resizeMode="stretch"
    >
    <ScrollView
      className="flex-1 mt-10"
      contentContainerStyle={{ padding: 16 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Header (chỉ còn notification icon) */}
      <View className="flex-row justify-between items-center mb-14">
        <View className='flex flex-row items-center'>
          <Image source={require('../../assets/images/renewable-energy.png')} style={{ width: 48, height: 48 }} className="mr-2" />
          <Text className='font-extrabold text-5xl text-white'>GreenSync</Text>
        </View>
        <Feather name="bell" size={36} color="#333" />
        <View className='flex bg-red-500 absolute right-0 top-0 w-4 h-4 rounded-full items-center justify-center'>
          <Text className='text-white font-semibold text-xs'>3</Text>
        </View>
      </View>

      {/* Daily Tips & Alert */}
      <View className="flex-row justify-between mb-4">
        <View className="flex-1 bg-green-200 rounded-xl p-3 shadow mr-1">
          <Text className="font-bold text-green-800 mb-1">Daily Tips</Text>
          <Text className="text-gray-700">Turn off lights - saved 5% energy</Text>
        </View>
        <View className="flex-1 bg-red-200 rounded-xl p-3 shadow ml-1">
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
        <View className='flex-row items-center justify-between mb-2'>
          <Text className="text-lg font-bold">BOOKING ROOM</Text>
          <TouchableOpacity>
            <Text className='font-semibold'> Read more →</Text>
          </TouchableOpacity>
        </View>
        <View className="bg-white rounded-xl p-3 shadow-sm w-full justify-start">
          <Text className="text-green-800 font-semibold h-28">ROOM 2.4.. is now available</Text>
          <Text ></Text>
        </View>
      </View>
    </ScrollView>
    </ImageBackground>
    </>
  );
}
