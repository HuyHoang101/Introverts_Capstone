import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ActivityIndicator, ScrollView, TouchableOpacity } from 'react-native';
import CircularProgress from '../../component/CircularProgress';
import CookieList from '../../component/PollurtantList';
import { db } from '@/FirebaseConfig';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';


interface PollutantData {
  pm25: number;
  pm10: number;
  no2: number;
  o3: number;
  co: number;
  timestamp?: Date;
}

export default function Mission() {
  const [dangerScore, setDangerScore] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [pollutants, setPollutants] = useState<PollutantData>({
    pm25: 0,
    pm10: 0,
    no2: 0,
    o3: 0,
    co: 0,
  });

  const calculateDangerScore = useCallback((data: PollutantData) => {
    let sum = 0;

    // PM2.5 (0-55 μg/m³)
    sum += Math.min(20, (data.pm25 * 20) / 55);
    
    // PM10 (0-254 μg/m³)
    sum += Math.min(20, (data.pm10 * 20) / 254);
    
    // NO₂ (0-360 ppb)
    sum += Math.min(20, (data.no2 * 20) / 360);
    
    // O₃ (0-85 ppb)
    sum += Math.min(20, (data.o3 * 20) / 85);
    
    // CO (0-12.4 ppm)
    sum += Math.min(20, (data.co * 20) / 12.4);

    return Math.round(sum * 10) / 10; 
  }, []);

  useEffect(() => {
    setLoading(true);
    setError(null);
    
    const q = query(
      collection(db, 'pollutants'),
      orderBy('timestamp', 'desc'),
      limit(1)
    );

    const unsubscribe = onSnapshot(q, 
      (querySnapshot) => {
        try {
          if (!querySnapshot.empty) {
            const data = querySnapshot.docs[0].data() as PollutantData;
            setPollutants(data);
            setDangerScore(calculateDangerScore(data));
          } else {
            setError('No air quality data available');
          }
          setLoading(false);
        } catch (err) {
          console.error("Data processing error:", err);
          setError('Error processing air quality data');
          setLoading(false);
        }
      },
      (error) => {
        console.error("Firestore error:", error);
        setError('Failed to load air quality data');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [calculateDangerScore]);

  const handleRetry = () => {
    setError(null);
    setLoading(true);
  };

  return (
    <View className='flex-1 mt-24 items-center'>
      <Text className='font-bold text-4xl mb-10'>Danger Score</Text>
      
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
          
          <ScrollView className='flex-1 '>
            <CookieList 
              pm25={pollutants.pm25}
              pm10={pollutants.pm10}
              no2={pollutants.no2}
              o3={pollutants.o3}
              co={pollutants.co}
            />
          </ScrollView>
        </View>
      )}
    </View>
  );
}