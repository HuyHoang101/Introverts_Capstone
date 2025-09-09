import React, { useEffect, useCallback, useRef, useState } from 'react';
import { View, Text, Animated, TouchableOpacity, Image, Modal, ScrollView } from 'react-native';
import AirQualityComparisonCard from './AirQualityComparisonCard';

type PollutantKey = 'PM2.5' | 'PM10' | 'NO₂' | 'O₃' | 'CO';

interface PollutantData {
  pm25: number;
  pm10: number;
  no2: number;
  o3: number;
  co: number;
}

interface PollutantItem {
  id: number;
  type: PollutantKey;
  unit: string;
  description: string;
  key: keyof PollutantData;
  threshold: number;
}

const POLLUTANT_THRESHOLDS: Record<PollutantKey, number> = {
  'PM2.5': 12,
  'PM10': 54,
  'NO₂': 53,
  'O₃': 54,
  'CO': 4
};

const COOKIE_CONFIG: PollutantItem[] = [
  { 
    id: 1, 
    type: 'PM2.5', 
    unit: 'μg/m³', 
    description: 'Fine air particles', 
    key: 'pm25',
    threshold: POLLUTANT_THRESHOLDS['PM2.5']
  },
  { 
    id: 2, 
    type: 'PM10', 
    unit: 'μg/m³', 
    description: 'Coarse dust particles', 
    key: 'pm10',
    threshold: POLLUTANT_THRESHOLDS['PM10']
  },
  { 
    id: 3, 
    type: 'NO₂', 
    unit: 'ppb', 
    description: 'Nitrogen pollutant', 
    key: 'no2',
    threshold: POLLUTANT_THRESHOLDS['NO₂']
  },
  { 
    id: 4, 
    type: 'O₃', 
    unit: 'ppb', 
    description: 'Ground-level ozone', 
    key: 'o3',
    threshold: POLLUTANT_THRESHOLDS['O₃']
  },
  { 
    id: 5, 
    type: 'CO', 
    unit: 'ppm', 
    description: 'Carbon monoxide gas', 
    key: 'co',
    threshold: POLLUTANT_THRESHOLDS['CO']
  }
];

interface PollutantListProps {
  pm25: number;
  pm10: number;
  no2: number;
  o3: number;
  co: number;
}

const PollutantList: React.FC<PollutantListProps> = ({ pm25, pm10, no2, o3, co }) => {
  const [showComparisonCard, setShowComparisonCard] = useState(false);
  const animations = useRef(
    COOKIE_CONFIG.map(() => ({
      opacity: new Animated.Value(0),
      translateY: new Animated.Value(20)
    }))
  ).current;

  const pollutants = { pm25, pm10, no2, o3, co};

  const animateItem = useCallback((index: number, delay: number = 0) => {
    Animated.parallel([
      Animated.timing(animations[index].opacity, {
        toValue: 1,
        duration: 600,
        delay,
        useNativeDriver: true,
      }),
      Animated.timing(animations[index].translateY, {
        toValue: 0,
        duration: 600,
        delay,
        useNativeDriver: true,
      })
    ]).start();
  }, [animations]);

  useEffect(() => {
    const timeouts = COOKIE_CONFIG.map((_, index) => 
      setTimeout(() => animateItem(index), index * 150)
    );
    
    return () => timeouts.forEach(clearTimeout);
  }, [animateItem]);

  return (
    <View className="flex flex-1 bg-bgColor p-6 rounded-3xl">
      <View className="flex flex-row justify-between items-center mb-4 pb-2 border-b border-b-fontUnderline">
        <Text className="text-xl font-bold text-fontColor">Pollutant</Text>
        <Text className="text-xl font-bold text-fontColor">Unit</Text>
      </View>

      <View className="w-[300px]">
        {COOKIE_CONFIG.map((pollutant, index) => {
          const value = pollutants[pollutant.key];
          const isUnsafe = value > pollutant.threshold;
          
          return (
            <Animated.View
              key={pollutant.id}
              style={[
                {
                  opacity: animations[index].opacity,
                  transform: [{ translateY: animations[index].translateY }]
                }
              ]}
              className={`flex-row items-center bg-cardBg rounded-full py-2 mb-3 shadow-md ${
                isUnsafe ? 'border border-red-500' : ''
              }`}
            >
              <View className="w-[150px] pl-4 ">
                <View className="flex-row items-center">
                  {isUnsafe && (
                    <Image 
                      source={require('@/assets/images/caution.png')} 
                      className="w-5 h-5 mr-2"
                    />
                  )}
                  <Text className={`text-lg font-medium ${isUnsafe ? 'text-red-400' : 'text-white'}`}>
                    {pollutant.type}
                  </Text>
                </View>
                <Text className="text-xs font-semibold text-fontColor mt-1">
                  {pollutant.description}
                </Text>
              </View>
              
              <View className="flex-1 flex-row justify-end items-center pr-4">
                <Text className={`text-lg font-bold ${isUnsafe ? 'text-red-400' : 'text-white'}`}>
                  {value.toFixed(1)}
                </Text>
                <Text className="text-base font-semibold text-fontColor ml-2">
                  {pollutant.unit}
                </Text>
              </View>
            </Animated.View>
          );
        })}
      </View>
    
      <TouchableOpacity 
        className="mt-6 bg-white py-3 rounded-full"
        onPress={() => setShowComparisonCard(true)}
      >
        <Text className="text-xl font-bold text-center text-primary">
          Compare with HCM city
        </Text>
      </TouchableOpacity>
      
      <Modal
        visible={showComparisonCard}
        animationType="slide"
        transparent
        onRequestClose={() => setShowComparisonCard(false)}
      >
        <View className="flex-1 bg-black/70 p-4 justify-center">
          <ScrollView 
            contentContainerStyle={{ paddingBottom: 40 }} // tạo khoảng trống cho nút
            showsVerticalScrollIndicator={false}
          >
            <View className="w-full max-w-md bg-white rounded-2xl p-6 mx-auto">
              <AirQualityComparisonCard pollutants={pollutants} />
              <TouchableOpacity 
                className="mt-6 bg-primary py-3 rounded-full"
                onPress={() => setShowComparisonCard(false)}
              >
                <Text className="text-center font-bold text-lg text-white bg-green-500 rounded-lg p-4 shadow">
                  Close
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
};

export default PollutantList;