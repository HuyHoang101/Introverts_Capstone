import React, { useEffect, useRef } from 'react';
import { View, Text, ImageBackground, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface PollutantComparison {
  id: number;
  type: string;
  value: number;
  unit: string;
  hcmValue: number;
  percentage: number;
  isBetter: boolean;
}

interface AirQualityComparisonCardProps {
  pollutants: {
    temperature: number;
    humidity: number;
    nh3: number;
    no2: number;
    co: number;
  };
}

const HCM_AVERAGES = {
  temperature: 27.5,
  humidity: 78,
  nh3: 0.02,
  no2: 0.02,
  co: 6    
};

const AirQualityComparisonCard: React.FC<AirQualityComparisonCardProps> = ({ pollutants }) => {
  const slideAnim = useRef(new Animated.Value(-100)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  
  const comparisonData: PollutantComparison[] = [
    { 
      id: 1, 
      type: 'NH3', 
      value: pollutants.nh3,
      unit: 'ppm', 
      hcmValue: HCM_AVERAGES.nh3,
      percentage: Math.round(((pollutants.nh3 - HCM_AVERAGES.nh3) / HCM_AVERAGES.nh3) * 100),
      isBetter: pollutants.nh3 < HCM_AVERAGES.nh3
    },
    { 
      id: 2, 
      type: 'NO2', 
      value: pollutants.no2,
      unit: 'ppm', 
      hcmValue: HCM_AVERAGES.no2,
      percentage: Math.round(((pollutants.no2 - HCM_AVERAGES.no2) / HCM_AVERAGES.no2) * 100),
      isBetter: pollutants.no2 < HCM_AVERAGES.no2
    },
    { 
      id: 3, 
      type: 'CO', 
      value: pollutants.co,
      unit: 'ppm', 
      hcmValue: HCM_AVERAGES.co,
      percentage: Math.round(((pollutants.co - HCM_AVERAGES.co) / HCM_AVERAGES.co) * 100),
      isBetter: pollutants.co < HCM_AVERAGES.co
    },
    { 
      id: 4, 
      type: 'TEMPERATURE', 
      value: pollutants.temperature,
      unit: 'C', 
      hcmValue: HCM_AVERAGES.temperature,
      percentage: Math.round(((pollutants.temperature - HCM_AVERAGES.temperature) / HCM_AVERAGES.temperature) * 100),
      isBetter: pollutants.temperature < HCM_AVERAGES.temperature
    },
    { 
      id: 5, 
      type: 'HUMIDITY', 
      value: pollutants.humidity,
      unit: '%', 
      hcmValue: HCM_AVERAGES.humidity,
      percentage: Math.round(((pollutants.humidity - HCM_AVERAGES.humidity) / HCM_AVERAGES.humidity) * 100),
      isBetter: pollutants.humidity < HCM_AVERAGES.humidity
    },
  ];

  const betterCount = comparisonData.filter(item => item.isBetter).length;
  const overallPercentage = Math.round((betterCount / comparisonData.length) * 100);

  const itemAnimations = useRef(
    comparisonData.map(() => ({
      opacity: new Animated.Value(0),
      translateY: new Animated.Value(20)
    }))
  ).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
        delay: 300
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
        delay: 300
      })
    ]).start();
    
    comparisonData.forEach((_, index) => {
      Animated.parallel([
        Animated.timing(itemAnimations[index].opacity, {
          toValue: 1,
          duration: 600,
          delay: 600 + index * 150,
          useNativeDriver: true,
        }),
        Animated.timing(itemAnimations[index].translateY, {
          toValue: 0,
          duration: 600,
          delay: 600 + index * 150,
          useNativeDriver: true,
        })
      ]).start();
    });
  }, []);

  return (
    <View className="w-full max-w-md rounded-3xl overflow-hidden shadow-xl relative">
      <ImageBackground
        source={require('@/assets/images/HCMcity.jpg')}
        className="w-full h-64"
        resizeMode="cover"
      >
        <View className="absolute inset-0 bg-black/70" />
        
        <View className="p-6 absolute bottom-4 left-0 right-0">
          <View className="flex-row justify-between items-end">
            <View>
              <Text className="text-white text-sm font-light">Ho Chi Minh City</Text>
              <Text className="text-white text-2xl font-bold mt-1">Financial Hub of Vietnam</Text>
              <Text className="text-white text-sm font-light mt-2 max-w-[70%]">
                Vietnam's largest metropolis faces significant air pollution challenges
              </Text>
            </View>
            <View className="items-end">
              <Text className="text-green-400 text-4xl font-extrabold">
                {overallPercentage}%
              </Text>
              <Text className="text-green-400 text-xl font-bold">Better</Text>
            </View>
          </View>
        </View>
      </ImageBackground>

      <Animated.View 
        className="p-6 bg-slate-900"
        style={{
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }]
        }}
      >
        <View className="mb-6 ">
          <Text className="text-2xl font-bold text-center text-white">Air Quality Comparison</Text>
          <Text className="text-gray-500 text-center mt-2">
            Your location vs Ho Chi Minh City
          </Text>
        </View>
        
        <View className="space-y-4">
          {comparisonData.map((item, index) => {
            const bgColor = item.isBetter ? 'bg-green-50' : 'bg-red-50';
            const borderColor = item.isBetter ? 'border-green-300' : 'border-red-300';
            const textColor = item.isBetter ? 'text-green-600' : 'text-red-600';
            const sign = item.percentage > 0 ? '+' : '';
            
            return (
              <Animated.View
                key={item.id}
                className={`flex-row items-center justify-between p-4 rounded-2xl border ${borderColor} ${bgColor}`}
                style={{
                  opacity: itemAnimations[index].opacity,
                  transform: [{ translateY: itemAnimations[index].translateY }]
                }}
              >
                <View>
                  <Text className="text-lg font-bold">{item.type}</Text>
                  <Text className="text-gray-500 text-sm">{item.unit}</Text>
                </View>
                
                <View className="items-center">
                  <Text className="text-lg font-bold">{item.value.toFixed(1)}</Text>
                  <Text className="text-gray-500 text-sm">Your location</Text>
                </View>
                
                <View className="items-center">
                  <Text className="text-lg font-bold">{item.hcmValue.toFixed(1)}</Text>
                  <Text className="text-gray-500 text-sm">HCM Average</Text>
                </View>
                
                <View className="items-end">
                  <Text className={`text-lg font-bold ${textColor}`}>
                    {sign}{item.percentage}%
                  </Text>
                  <View className="flex-row items-center">
                    <Ionicons 
                      name={item.isBetter ? "arrow-down" : "arrow-up"} 
                      size={16} 
                      color={item.isBetter ? "#10B981" : "#EF4444"} 
                    />
                    <Text className={`text-sm ml-1 ${textColor}`}>
                      {item.isBetter ? "Better" : "Worse"}
                    </Text>
                  </View>
                </View>
              </Animated.View>
            );
          })}
        </View>
      </Animated.View>
    </View>
  );
};

export default AirQualityComparisonCard;