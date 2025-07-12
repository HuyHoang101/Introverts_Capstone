import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing, TouchableOpacity } from 'react-native';
import Svg, { Circle, G } from 'react-native-svg';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
interface CircularProgressProps {
  percentage: number;
  className?: string;
}
const CircularProgress: React.FC<CircularProgressProps> = ({ percentage }) => {
  const [showSpeechBubble, setShowSpeechBubble] = useState(false);
  const [currentDisplayValue, setCurrentDisplayValue] = useState(0);
  const size = 200;
  const strokeWidth = 20;
  const borderWidth = 40; // Increased border thickness
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const animatedValue = useRef(new Animated.Value(0)).current;
  const [progressColor, setProgressColor] = useState('#4CAF50');

  // Calculate dimensions for background circle
  const bgSize = size + borderWidth * 2; 
  const bgRadius = (bgSize - strokeWidth) / 2; 

  // Number animation
  useEffect(() => {
    const duration = 3000;
    const startTime = Date.now();
    const endValue = percentage;
    
    const animateNumber = () => {
      const now = Date.now();
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const currentValue = Math.floor(progress * endValue);
      
      setCurrentDisplayValue(currentValue);
      
      if (progress < 1) {
        requestAnimationFrame(animateNumber);
      }
    };
    
    animateNumber();
    
    Animated.timing(animatedValue, {
      toValue: percentage,
      duration: 3000,
      useNativeDriver: true,
      easing: Easing.out(Easing.ease)
    }).start();
  }, [percentage]);

  // Update color based on value
  useEffect(() => {
    if (currentDisplayValue > 64) {
      setProgressColor('#F44336');
    } else if (currentDisplayValue > 34) {
      setProgressColor('#FFC107');
    } else {
      setProgressColor('#4CAF50');
    }
  }, [currentDisplayValue]);

  const strokeDashoffset = animatedValue.interpolate({
    inputRange: [0, 100],
    outputRange: [circumference, 0]
  });

  return (
    <View className="items-center justify-center relative">
      {/* Background Circle with White Shadow */}
      <View className="absolute" style={{
        shadowColor: 'white',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 10,
        elevation: 10 // For Android
      }}>
        <Svg width={bgSize} height={bgSize}>
          <Circle
            cx={bgSize / 2}
            cy={bgSize / 2}
            r={bgRadius}
            fill="#171717"
          />
        </Svg>
      </View>

      {/* Progress Circle */}
      <Svg width={size} height={size} className="z-10">
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#D3D3D3"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        <G rotation="-90" origin={`${size / 2}, ${size / 2}`}>
          <AnimatedCircle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={progressColor}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />
        </G>
      </Svg>

      <View className="absolute items-center justify-center z-20">
        <Text className="text-3xl font-bold text-white">{currentDisplayValue}</Text>
        <Text className="text-xs text-gray-500 mb-1">Score</Text>
        <TouchableOpacity 
          onPress={() => setShowSpeechBubble(!showSpeechBubble)}
          className="mt-3 border p-4 rounded-full bg-cardBg"
        >
          <Text className="text-white text-sm">Details</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CircularProgress;