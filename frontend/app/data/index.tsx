import { View, Text, TouchableOpacity, Dimensions, ScrollView, ImageBackground } from 'react-native';
import { useState } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import ProgressBar from '@/component/ProgressBar';
import { BarChart, LineChart } from 'react-native-chart-kit';
import * as Progress from 'react-native-progress';
import { useRouter } from 'expo-router';

const screenWidth = Dimensions.get('window').width;

const data = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  datasets: [
    {
      data: [6423, 5932, 6134, 5200, 6833, 6353, 6421, 5332, 5523, 5920, 6120, 6342], // Water in liters or m³
    },
  ],
};

const chartConfig = {
  backgroundGradientFrom: '#ffffff',
  backgroundGradientTo: '#ffffff',
  fillShadowGradient: '#3b82f6', // Tailwind blue-500
  fillShadowGradientOpacity: 1,
  color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`, // bar color
  labelColor: () => '#374151', // text color
  barPercentage: 0.7,
  formatYLabel: (label: string) => parseInt(label).toString(),
  propsForLabels: { fontSize: 9 },
  propsForValues: { fontSize: 5 },
};

  const electricData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        data: [4200000, 5800000, 4100000, 5000000, 4900000, 5500000, 5200000, 5300000, 4100000, 4900000, 5700000, 5400000], // electric usage in kWh
        strokeWidth: 2,
      },
    ],
  };
  
  const chartConfig1 = {
    backgroundColor: '#ffffff',
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(34, 197, 94, ${opacity})`, // ✅ green
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    //formatYLabel: (label: string) => parseInt(label).toString(),
    propsForLabels: { fontSize: 9 },
  };
  const percent = 0.73;

export default function Index() {
  const router = useRouter();

  const handleWaterCardPress = () => {
    router.push('/home/WaterDetail');
  };

  const handleElectricCardPress = () => {
    router.push('/home/ElectricDetail');
  };

  return (<>
        <ImageBackground
          source={require('../../assets/images/bg_main.png')}
          className="flex-1"
          resizeMode="stretch"
        >
        <ScrollView
          className="flex-1 "
          contentContainerStyle={{ paddingBottom: 32 }}
          showsVerticalScrollIndicator={false}
        >
    
          {/* ✅ Header */}
          <View className="flex-row justify-between items-center mt-10 w-full px-4 ">
            <Text className="font-bold text-5xl text-white">Sustainability Data</Text>
          </View>
          <View className="flex-row justify-between items-center mt-4 w-full px-4 ">
            <Text className="font-bold text-3xl text-white">Last Month Amount</Text>
            <TouchableOpacity className="flex-row items-center">
              <MaterialIcons name="emoji-objects" size={24} color={'#dde511'} />
              <Text className='text-white font-semibold text-xl'>AI insight →</Text>
            </TouchableOpacity>
          </View>
    
          {/* ✅ Water & Electric Summary Cards */}
          <View className="flex-row justify-between items-center w-full px-2 mt-4">
            {/* Water Card */}
            <TouchableOpacity 
              className="flex-1 mr-1 bg-white shadow rounded-lg border border-gray-200 items-center" 
              onPress={handleWaterCardPress}
            >
              <Text className="text-xl font-semibold mt-4">Water</Text>
              <Text className="w-full pl-2 mt-3 font-extrabold text-3xl">6512.2 kL</Text>
              <View className="w-full p-2 mb-3">
                <View className="w-full">
                  <Text className="mb-1 text-sm font-semibold text-gray-700">
                    Used: {83}%
                  </Text>
                  <View className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                    <View
                      className={`h-full ${'bg-blue-400'}`}
                      style={{ width: `${83}%` }}
                    />
                  </View>
                </View>
              </View>
            </TouchableOpacity>
    
            {/* Electric Card */}
            <TouchableOpacity 
              className="flex-1 ml-1 bg-white shadow rounded-lg border border-gray-200 items-center" 
              onPress={handleElectricCardPress}
            >
              <Text className="text-xl font-semibold mt-4">Electric</Text>
              <Text className="w-full pl-2 mt-3 font-extrabold text-3xl">594890 kWh</Text>
              <View className="w-full p-2 mb-3">
                <View className="w-full">
                  <Text className="mb-1 text-sm font-semibold text-gray-700">
                    Used: {126}%
                  </Text>
                  <View className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                    <View
                      className={`h-full ${'bg-red-400'}`}
                      style={{ width: `${100}%` }}
                    />
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          </View>
    
          {/* ✅ Monthly Water Usage Chart */}
          <Text className="text-3xl font-bold text-white p-4">Monthly Water Usage</Text>
          <View className="p-2 bg-white rounded-xl shadow mt-3 border border-gray-200 mx-2">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-lg font-bold text-gray-800">💧 Monthly Water Usage</Text>
              <TouchableOpacity>
                <Text className="text-sm font-semibold">See more →</Text>
              </TouchableOpacity>
            </View>
    
            {/* ✅ Horizontal scroll for BarChart */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={{ height: 180, width: screenWidth * 1.4 }}>
                <BarChart
                  data={data}
                  width={screenWidth * 1.4}
                  height={180}
                  yAxisLabel=""
                  yAxisSuffix=" kL"
                  chartConfig={chartConfig}
                  fromZero
                  showValuesOnTopOfBars
                />
              </View>
            </ScrollView>
          </View>
    
          {/* ✅ Monthly Electric Usage Line Chart */}
          <Text className="text-3xl font-bold text-white p-4">Monthly Electric Usage</Text>
          <View className="p-2 bg-white rounded-xl shadow mt-3 border border-gray-200 mx-2">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-lg font-bold text-gray-800">⚡️ Monthly Electric Consumption</Text>
              <TouchableOpacity>
                <Text className="text-sm font-semibold">See more →</Text>
              </TouchableOpacity>
            </View>
    
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={{ height: 180, width: screenWidth * 1.4 }}>
                <LineChart
                  data={electricData}
                  width={screenWidth * 1.4}
                  height={180}
                  yAxisSuffix=" kWh"
                  yAxisInterval={1}
                  formatYLabel={(label) => {
                    const num = Number(label);
                    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
                    if (num >= 1000) return `${(num / 1000).toFixed(0)}k`;
                    return label;
                  }}
                  chartConfig={chartConfig1}
                  bezier
                  fromZero
                  style={{ borderRadius: 16 }}
                />
              </View>
            </ScrollView>
          </View>

          {/* ✅ Daily Danger score of Air quality */}
          <Text className="text-3xl font-bold text-white p-4">Air Quality</Text>
          <View className='flex-col justify-center items-center bg-white rounded-lg shadow-md border border-gray-200 p-2 m-2 max-w-full'>
            <View className="flex-row justify-between items-center mb-4 w-full">
              <Text className='text-lg font-bold'>Danger Score</Text>
              <TouchableOpacity>
                <Text className="text-sm font-semibold">See more →</Text>
              </TouchableOpacity>
            </View>
            <View className='flex-row justify-start items-center w-full mt-2'>
                <View className='flex-col mr-14'>
                  <Progress.Circle
                    progress={percent}
                    size={120}
                    color="#e8ef21" // green
                    unfilledColor="#E5E7EB" // gray-200
                    borderWidth={0}
                    thickness={13}
                    showsText={true}
                    formatText={() => `${Math.round(percent * 100)}%`}
                    textStyle={{ fontSize: 24, fontWeight: 'bold', color: '#e8ef21' }}
                  />
                </View>
                <View className='flex-col h-auto items-center mr-10'>
                  <Text>PM2.5:</Text>
                  <Text>PM10:</Text>
                  <Text>NO₂:</Text>
                  <Text>O₃:</Text>
                  <Text>CO₂:</Text>
                </View>
                <View className='flex-col h-auto items-center mr-4'>
                  <Text>20</Text>
                  <Text>54</Text>
                  <Text>53</Text>
                  <Text>54</Text>
                  <Text>4.4</Text>
                </View>
                <View className='flex-col h-auto items-center'>
                  <Text>µg/m³</Text>
                  <Text>µg/m³</Text>
                  <Text>ppb</Text>
                  <Text>ppb</Text>
                  <Text>ppm</Text>
                </View>
            </View>
          </View>
        </ScrollView>
        </ImageBackground>
        </>
      );
}
