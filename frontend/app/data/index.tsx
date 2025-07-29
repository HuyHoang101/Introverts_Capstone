import { View, Text, TouchableOpacity, Dimensions, ScrollView, ImageBackground } from 'react-native';
import { useState,useEffect } from 'react';
import { getAllWaterData } from '@/service/waterService';
import { getAllElectricData } from '@/service/electricService';
import { getAllAirData } from '@/service/airService';
import { MaterialIcons } from '@expo/vector-icons';
import ProgressBar from '@/component/ProgressBar';
import { BarChart, LineChart } from 'react-native-chart-kit';
import * as Progress from 'react-native-progress';
import { useRouter } from 'expo-router';
import { formatDate, formatMonthYear } from '@/utils/time';
import { calculateDangerScore } from '@/utils/dangerScore';

const screenWidth = Dimensions.get('window').width;
interface waterData {
  total: number;
  period?: string;
  timestamp?: string;
}
interface electricData {
  high: number;
  medium: number;
  low: number;
  total: number;
  timestamp?: string;
  period?: string;
}

interface PollutantData {
  pm25: number;
  pm10: number;
  no2: number;
  o3: number;
  co: number;
  timestamp?: string;
}

const getAirQualityLevelRow = (score: number) => {
  let level = '';
  let color = '';

  if (score <= 19) {
    level = 'Excellent';
    color = 'text-green-500';
  } else if (score <= 39) {
    level = 'Good';
    color = 'text-lime-500';
  } else if (score <= 59) {
    level = 'Moderate';
    color = 'text-yellow-500';
  } else if (score <= 74) {
    level = 'Unhealthy (Sensitive)';
    color = 'text-orange-500';
  } else if (score <= 89) {
    level = 'Unhealthy';
    color = 'text-red-500';
  } else if (score <= 99) {
    level = 'Very Unhealthy';
    color = 'text-red-600';
  } else {
    level = 'Hazardous';
    color = 'text-red-800';
  }

  return (
    <View className="flex-row justify-between items-center">
      <Text className="text-base text-gray-800">{score}</Text>
      <Text className={`text-base font-medium ${color}`}>{level}</Text>
    </View>
  );
};

const getDangerColor = (score: number): string => {
  if (score <= 0.19) return '#22c55e'; // green-500
  if (score <= 0.39) return '#84cc16'; // lime-500
  if (score <= 0.59) return '#eab308'; // yellow-500
  if (score <= 0.74) return '#f97316'; // orange-500
  if (score <= 0.89) return '#ef4444'; // red-500
  if (score <= 0.99) return '#dc2626'; // red-600
  return '#7f1d1d'; // red-800
};

const chartConfig = {
  backgroundGradientFrom: '#ffffff',
  backgroundGradientTo: '#ffffff',
  fillShadowGradient: '#3b82f6', // Tailwind blue-500
  fillShadowGradientOpacity: 1,
  color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`, // bar color
  labelColor: () => '#374151', // text color
  barPercentage: 0.7,
  formatYLabel: (label: string) => {
    const num = parseFloat(label);
    if (num >= 1_000_000) return (num / 1_000_000).toFixed(2).replace(/\.?0+$/, '') + 'M';
    if (num >= 1_000) return (num / 1_000).toFixed(1).replace(/\.?0+$/, '') + 'k';
    return num.toString();
  },
  propsForLabels: { fontSize: 8 },
  propsForValues: { fontSize: 5 },
};

const chartConfig1 = {
  backgroundColor: '#ffffff',
  backgroundGradientFrom: '#ffffff',
  backgroundGradientTo: '#ffffff',
  decimalPlaces: 0,
  color: (opacity = 1) => `rgba(34, 197, 94, ${opacity})`, // Màu xanh
  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  propsForLabels: { fontSize: 8 },
};

const chartConfig2 = {
  backgroundColor: '#ffffff',
  backgroundGradientFrom: '#ffffff',
  backgroundGradientTo: '#ffffff',
  decimalPlaces: 0,
  color: (opacity = 1) => `rgba(234, 179, 8, ${opacity})`, // Màu xanh
  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  propsForLabels: { fontSize: 8 },
};

const percent = 0.73;

export default function Index() {
  const router = useRouter();

  const handleWaterCardPress = () => {
    router.push({ 
      pathname: '/data/WaterDetail',
      params: {
        data: JSON.stringify(water && water.length > 0 ? water[0] : { total: 0, period: 'Unknown' })
      }
    });
  };
  
  const handleElectricCardPress = () => {
    router.push({ 
      pathname: '/data/ElectricDetail',
      params: {
        data: JSON.stringify(electric && electric.length > 0 ? electric[0] : { total: 0, period: 'Unknown' })
      }
    });
  };
  
  const handleWaterList = () => {
    router.push({ pathname: '/data/WaterList' });
  };
  
  const handleElectricList = () => {
    router.push({ pathname: '/data/ElectricList' });
  };

  const handleAirList = () => {
    router.push({ pathname: '/data/AirList' });
  }

  const [water, setWater] = useState<waterData[] | null>(null);
  const [electric, setElectric] = useState<electricData[] | null>(null);
  const [air, setAir] = useState<PollutantData[] | null>(null);

  useEffect (() => {
    const fetchData = async () => {
      try {
        const data = await getAllAirData();
        if (data.length > 0) {
          setAir(data);
        }
      } catch (error) {
        console.error('Fail to fetch air data', error);
      } finally {
      }
    };

    fetchData();
  }, []);

  useEffect (() => {
    const fetchData = async () => {
      try {
        const data = await getAllWaterData();
        if (data.length > 0){
          setWater(data);
        }
      } catch (error) {
        console.error('Fail to fetch water data', error);
      } finally {
      }
    };

    fetchData();
  }, []);

  useEffect (() => {
    const fetchData = async () => {
      try {
        const data = await getAllElectricData();
        if (data.length > 0) {
          setElectric(data);
        }
      } catch (error) {
        console.error('Fail to fetch electric data', error);
      } finally {
      } 
    };

    fetchData();
  },[]);
  

  const waterReversed = (water ?? []).slice(0, 12).reverse();
  const waterData = {
    labels: waterReversed.map(item => formatMonthYear(item.period ?? 'Unknown')),
    datasets: [
      {
        data: waterReversed.map(item => item.total ?? 0),
      }
    ]
  }

  const electricReversed = (electric ?? []).slice(0, 12).reverse();
  const electricData = {
    labels: electricReversed.map(item => formatMonthYear(item.period ?? 'Unknown')),
    datasets: [
      {
        data: electricReversed.map(item => item.total ?? 0),
        strokeWidth: 2
      }
    ]
  }

  const airReversed = (air ?? []).slice(0, 12).reverse();
  const airData = {
    labels: airReversed.map(item => formatDate(item.timestamp ?? 'Unknown')),
    datasets: [
      {
        data: airReversed.map(item => calculateDangerScore(item)),
        strokeWidth: 2
      }
    ]
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
          <View className="flex-row justify-between items-center mt-12 w-full px-4 ">
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
          <View className="flex-row justify-between items-stretch w-full px-2 mt-4">
            {/* Water Card */}
            <TouchableOpacity 
              className="flex-1 mr-1 bg-white shadow rounded-lg border border-gray-200 items-center justify-between self-stretch" 
              onPress={handleWaterCardPress}
            >
              <Text className="text-xl font-semibold mt-4">Water</Text>
              {water && water.length > 1 ?(
                <>
                  <Text className="w-full pl-2 mt-3 font-extrabold text-3xl">{water[0].total.toLocaleString('vi-VN')} L</Text>
                  <View className="w-full p-2 mb-3">
                    <View className="w-full">
                      {(() => {
                        const usedPercent = Math.round((water[0].total / water[1].total) * 100);
                        const barColor = usedPercent <= 100 ? 'bg-green-400' : 'bg-red-400';

                        return (
                          <>
                            <Text className="mb-1 text-sm font-semibold text-gray-700">
                              Used: {usedPercent}%
                            </Text>
                            <View className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                              <View
                                className={`h-full ${barColor}`}
                                style={{ width: `${Math.min(usedPercent, 100)}%` }}
                              />
                            </View>
                          </>
                        );
                      })()}
                    </View>
                  </View>
                </>
              ) : (
                <Text className="w-full pl-2 mt-3 font-extrabold text-3xl">Underfied</Text>)}
            </TouchableOpacity>
    
            {/* Electric Card */}
            <TouchableOpacity 
              className="flex-1 ml-1 bg-white shadow rounded-lg border border-gray-200 items-center justify-between self-stretch" 
              onPress={handleElectricCardPress}
            >
              <Text className="text-xl font-semibold mt-4">Electric</Text>
              {electric && electric.length > 1 && (
                <>
                  <Text className="w-full pl-2 mt-3 font-extrabold text-3xl">
                    {electric[0].total.toLocaleString('vi-VN')} kWh
                  </Text>

                  <View className="w-full p-2 mb-3">
                    <View className="w-full">
                      {(() => {
                        const usedPercent = Math.round((electric[0].total / electric[1].total) * 100);
                        const barColor = usedPercent < 100 ? 'bg-yellow-400' : 'bg-red-400';

                        return (
                          <>
                            <Text className="mb-1 text-sm font-semibold text-gray-700">
                              Used: {usedPercent}%
                            </Text>
                            <View className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                              <View
                                className={`h-full ${barColor}`}
                                style={{ width: `${Math.min(usedPercent, 100)}%` }}
                              />
                            </View>
                          </>
                        );
                      })()}
                    </View>
                  </View>
                </>
              )}
            </TouchableOpacity>
          </View>
    
          {/* ✅ Monthly Water Usage Chart */}
          <Text className="text-3xl font-bold text-white p-4">Monthly Water Usage chart</Text>
          <View className="p-2 bg-white rounded-xl shadow mt-3 border border-gray-200 mx-2">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-lg font-bold text-gray-800">💧 Monthly Water Usage</Text>
              <TouchableOpacity onPress={handleWaterList}>
                <Text className="text-sm font-semibold">See more →</Text>
              </TouchableOpacity>
            </View>
    
            {/* ✅ Horizontal scroll for BarChart */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={{ height: 180, width: screenWidth * 1.4 }}>
              {waterData?.datasets[0]?.data?.length === 0 && (
                <Text className='flex-1 justify-center items-center'>Loading data...</Text>
              )}
              {waterData?.datasets[0]?.data?.length > 0 && (
                <BarChart
                  data={waterData}
                  width={screenWidth * 1.4}
                  height={180}
                  yAxisLabel=""
                  yAxisSuffix=" L"
                  chartConfig={chartConfig}
                  fromZero
                  showValuesOnTopOfBars
                />
              )}
              </View>
            </ScrollView>
          </View>
    
          {/* ✅ Monthly Electric Usage Line Chart */}
          <Text className="text-3xl font-bold text-white p-4">Monthly Electric Usage chart</Text>
          <View className="p-2 bg-white rounded-xl shadow mt-3 border border-gray-200 mx-2">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-lg font-bold text-gray-800">⚡️ Monthly Electric Consumption</Text>
              <TouchableOpacity onPress={handleElectricList}>
                <Text className="text-sm font-semibold">See more →</Text>
              </TouchableOpacity>
            </View>
    
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={{ height: 180, width: screenWidth * 1.4 }}>
              {electricData?.datasets[0]?.data?.length === 0 && (
                <Text className='flex-1 justify-center items-center'>Loading data...</Text>
              )}
              {electricData?.datasets[0]?.data?.length > 0 && (
                <LineChart
                  data={electricData}
                  width={screenWidth * 1.4}
                  height={180}
                  yAxisSuffix=" kWh"
                  yAxisInterval={1}
                  formatYLabel={(label) => {
                    const num = Number(label);
                    if (!isFinite(num)) return '0';
                    if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
                    if (num >= 1_000) return `${(num / 1_000).toFixed(0)}k`;
                    return label;
                  }}
                  chartConfig={chartConfig1}
                  bezier
                  fromZero
                  style={{ borderRadius: 16 }}
                />
              )}
              </View>
            </ScrollView>
          </View>

          {/* ✅ Today Danger score of Air quality */}
          <Text className="text-3xl font-bold text-white p-4">Daily Air Quality</Text>
          <View className='flex-col justify-center items-center bg-white rounded-lg shadow-md border border-gray-200 p-2 m-2 max-w-full'>
            <View className="flex-row justify-between items-center mb-4 w-full">
              <Text className='text-lg font-bold'>Danger Score</Text>
              <TouchableOpacity onPress={() => router.push({
                pathname: '/data/AirDetail', 
                params: {
                  data: JSON.stringify(
                    air && air.length > 0
                      ? air[0]
                      : { pm25: 0, pm10: 0, no2: 0, o3: 0, co: 0 }
                  ),
                }
              })} >
                <Text className="text-sm font-semibold">See more →</Text>
              </TouchableOpacity>
            </View>
            <View className='flex-row justify-start items-start w-full mt-2'>
                <View className='flex-col mr-10 ml-3'>
                {air && air.length > 0 ? (
                  (() => {
                    const score = calculateDangerScore(air[0] ?? { pm25: 0, pm10: 0, no2: 0, o3: 0, co: 0 }); // returns 0–100
                    const progress = score / 100;
                    const color = getDangerColor(progress); // use score/100 for color

                    return (
                      <Progress.Circle
                        progress={progress}
                        size={80}
                        color={color}
                        unfilledColor="#E5E7EB"
                        borderWidth={0}
                        thickness={10}
                        showsText={true}
                        formatText={() => `${score}`} // show raw score, not percent
                        textStyle={{ fontSize: 20, fontWeight: 'bold', color: color }}
                      />
                    );
                  })()
                ) : null}

                </View>
                <View>
                  <Text className='text-2xl font-bold text-gray-800 mb-2'>Air Quality Level</Text>
                  {air && air.length > 0 ? (
                    getAirQualityLevelRow(calculateDangerScore(air[0]))
                  ) : (
                    <Text className='text-gray-500'>No data available</Text>
                  )}
                </View>
            </View>
          </View>

          {/* ✅ Air Quality Chart */}
          <Text className="text-3xl font-bold text-white p-4">Daily Air Quality Chart</Text>
            <View className="p-2 bg-white rounded-xl shadow mt-3 border border-gray-200 mx-2">
              <View className="flex-row justify-between items-center mb-4">
                <Text className="text-lg font-bold text-gray-800">🌬️ Daily Air Quality</Text>
                <TouchableOpacity onPress={handleAirList}>
                  <Text className="text-sm font-semibold">See more →</Text>
                </TouchableOpacity>
              </View>

              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={{ height: 180, width: screenWidth * 1.4 }}>
                {airData?.datasets[0]?.data?.length === 0 && (
                  <Text className='flex-1 justify-center items-center'>Loading data...</Text>
                )}
                {airData?.datasets[0]?.data?.length > 0 && (
                  <LineChart
                    data={airData}
                    width={screenWidth * 1.4}
                    height={180}
                    yAxisSuffix=""
                    yAxisInterval={1}
                    formatYLabel={(label) => {
                      const num = Number(label);
                      if (!isFinite(num)) return '0';
                      return num.toFixed(1); // show score as is
                    }}
                    chartConfig={chartConfig2}
                    bezier
                    fromZero
                    style={{ borderRadius: 16 }}
                  />
                )}
                </View>
              </ScrollView>
            </View>
        </ScrollView>
        </ImageBackground>
        </>
      );
}
