import { View, Text } from 'react-native';
import React from 'react';

type ProgressBarProps = {
  percent: number;
  label?: string;
  color?: 'blue' | 'green' | 'red' | 'yellow' | 'gray';
};

export default function ProgressBar({ percent, label, color = 'red' }: ProgressBarProps) {
  // Clamp and sanitize percent
  const clampedPercent = Math.max(0, Math.min(100, Math.abs(percent)));

  // Map colors to Tailwind classes
  const colorMap: Record<string, string> = {
    blue: 'bg-blue-400',
    green: 'bg-green-400',
    red: 'bg-red-400',
    yellow: 'bg-yellow-400',
    gray: 'bg-gray-400',
  };

  const progressBarColor = colorMap[color] || 'bg-red-400';

  return (
    <View className="w-full">
      {label && (
        <Text className="mb-1 text-sm font-semibold text-gray-700">
          {label}: {percent}%
        </Text>
      )}
      <View className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
        <View
          className={`h-full ${progressBarColor}`}
          style={{ width: `${clampedPercent}%` }}
        />
      </View>
    </View>
  );
}

