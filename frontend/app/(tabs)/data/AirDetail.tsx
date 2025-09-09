import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ActivityIndicator, ScrollView, TouchableOpacity, ImageBackground } from 'react-native';
import CircularProgress from '../../../component/CircularProgress';
import CookieList from '../../../component/PollurtantList';
import { calculateDangerScore } from '../../../utils/dangerScore';
import { useLocalSearchParams } from 'expo-router';


interface PollutantData {
  pm25: number;
  pm10: number;
  no2: number;
  o3: number;
  co: number;
  timestamp?: string;
}

export default function Mission() {
  const [dangerScore, setDangerScore] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { data } = useLocalSearchParams();
  const parsedData = typeof data === 'string' ? JSON.parse(data) : {};
  // const [pollutants, setPollutants] = useState<PollutantData>({
  //   pm25: 0,
  //   pm10: 0,
  //   no2: 0,
  //   o3: 0,
  //   co: 0,
  //   timestamp: ''
  // });

  // useEffect (() => {
  //   const fetchData = async () => {
  //     try {
  //       const data = await getAllAirData();
  //       if (data.length > 0) {
  //         setPollutants(data[0]);
  //       }
  //     } catch (error) {
  //       console.error('Fail to fetch air data', error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchData();
  // },[]);
  useEffect(() => {
    try {
      const parsedData = typeof data === 'string' ? JSON.parse(data) : data;

      if (!parsedData || typeof parsedData.pm25 === 'undefined') {
        throw new Error('Invalid data received');
      }

      const score = calculateDangerScore(parsedData);
      setDangerScore(score);

      // fake loading
      const timer = setTimeout(() => setLoading(false), 2000);
      return () => clearTimeout(timer);
    } catch (err: any) {
      setError(err.message || 'Unknown error');
      setLoading(false);
    }
  }, [data]);

  const handleRetry = () => {
    setError(null);
    setLoading(true);
  };

  return (
    <ImageBackground
      source={require('@/assets/images/bg_main.png')}
      className="flex-1 items-center"
      resizeMode="stretch"
    >
      <View className="absolute inset-0 bg-white/50" />
      <Text className='font-bold text-4xl mt-2 mb-14 text-black'>Danger Score</Text>
      
      {loading ? (
        <View className='flex-1 justify-center items-center'>
          <ActivityIndicator size="large" />
          <Text className='mt-8 text-lg text-gray-600'>
            Calculating danger score...
          </Text>
        </View>
      ) : error ? (
        <View className='flex-1 justify-center items-center p-4'>
          <Text className='text-lg text-red-500 mb-4 text-center'>
            {error}
          </Text>
          <TouchableOpacity
            className='bg-blue-500 py-3 px-6 rounded-full'
            onPress={handleRetry}
          >
            <Text className='text-white font-bold'>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View className='flex-1 '>
          <View className='items-center z-10 mb-4'>
            <CircularProgress percentage={dangerScore} />
          </View>
          
          <ScrollView className='flex-1' showsVerticalScrollIndicator={false} contentContainerStyle={{paddingBottom: 8}}>
            <CookieList 
              pm25={parsedData.pm25}
              pm10={parsedData.pm10}
              no2={parsedData.no2}
              o3={parsedData.o3}
              co={parsedData.co}
            />
          </ScrollView>
        </View>
      )}
    </ImageBackground>
  );
}