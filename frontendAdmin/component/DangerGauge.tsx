import React from "react";
import { Text } from "react-native";
import { AnimatedCircularProgress } from "react-native-circular-progress";

function getDangerColor(progress01: number): string {
  if (progress01 <= 0.19) return "#22c55e";  // green-500
  if (progress01 <= 0.39) return "#84cc16";  // lime-500
  if (progress01 <= 0.59) return "#eab308";  // yellow-500
  if (progress01 <= 0.74) return "#f97316";  // orange-500
  if (progress01 <= 0.89) return "#ef4444";  // red-500
  if (progress01 <= 0.99) return "#dc2626";  // red-600
  return "#7f1d1d";                           // red-800
}

export default function DangerGauge({
  score,           // 0..100
  size = 92,
  thickness = 10,
}: {
  score: number;
  size?: number;
  thickness?: number;
}) {
  const clamped = Math.max(0, Math.min(100, score));
  const color = getDangerColor(clamped / 100);

  return (
    <AnimatedCircularProgress
      size={size}
      width={thickness}
      fill={clamped}            // 0..100
      tintColor={color}
      backgroundColor="#E5E7EB"
      rotation={0}
      lineCap="round"
      duration={800}
    >
      {() => (
        <Text style={{ fontSize: 20, fontWeight: "bold", color }}>
          {clamped}
        </Text>
      )}
    </AnimatedCircularProgress>
  );
}
