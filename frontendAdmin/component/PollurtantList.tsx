import React from "react";
import { View, Text } from "react-native";
import * as Progress from "react-native-progress";

type Props = {
  data: {
    nh3: number;
    no2: number;
    co: number;
  };
  className?: string;
};

// Mỗi tham số max 33; công thức component-score:
const compScore = {
  nh3: (x: number) => Math.min((x ?? 0) / 0.165, 33),
  co:  (x: number) => Math.min((x ?? 0) / 0.165, 33),
  no2: (x: number) => Math.min((x ?? 0) / 6.6,  33),
};

// Ngưỡng cảnh báo do Long đưa (score theo thang 0–33):
const WARN = {
  nh3: 8.25,
  co: 5.775,
  no2: 6.6,
} as const;

const barColor = (progress0to1: number) => {
  if (progress0to1 <= 0.19) return "#22c55e";
  if (progress0to1 <= 0.39) return "#84cc16";
  if (progress0to1 <= 0.59) return "#eab308";
  if (progress0to1 <= 0.74) return "#f97316";
  if (progress0to1 <= 0.89) return "#ef4444";
  if (progress0to1 <= 0.99) return "#dc2626";
  return "#7f1d1d";
};

const Row = ({
  label,
  value,
  unit,
  score33,
  warnAt,
}: {
  label: string;
  value: number;
  unit: string;
  score33: number; // 0..33
  warnAt?: number;
}) => {
  const progress = score33 / 33;
  const color = barColor(progress);
  const warn = typeof warnAt === "number" && score33 >= warnAt;

  return (
    <View className="w-full mb-4">
      <View className="flex-row justify-between items-end mb-1">
        <Text className="text-gray-800 text-base font-semibold">
          {label}: <Text className="font-bold text-gray-900">{value.toFixed(3)} {unit}</Text>
        </Text>
        <Text className="text-gray-700 text-sm">
          Score: <Text className="font-semibold">{score33.toFixed(2)}/33</Text>
        </Text>
      </View>
      <Progress.Bar
        progress={Math.max(0, Math.min(1, progress))}
        height={10}
        width={null as any}
        borderWidth={0}
        color={color}
        unfilledColor="#E5E7EB"
      />
      {warn ? (
        <Text className="text-xs mt-1" style={{ color }}>
          ⚠️ Exceeds warning threshold ({warnAt})
        </Text>
      ) : null}
    </View>
  );
};

export default function PollutantList({ data, className }: Props) {
  const nh3Score = compScore.nh3(Number(data?.nh3 ?? 0));
  const coScore  = compScore.co (Number(data?.co  ?? 0));
  const no2Score = compScore.no2(Number(data?.no2 ?? 0));

  return (
    <View className={`bg-white rounded-2xl border border-gray-200 p-4 ${className ?? ""}`}>
      <Text className="text-lg font-bold text-gray-900 mb-3">Pollutant Breakdown</Text>
      <Row label="NH₃" value={Number(data.nh3 ?? 0)} unit="ppm" score33={nh3Score} warnAt={WARN.nh3} />
      <Row label="CO"  value={Number(data.co  ?? 0)} unit="ppm" score33={coScore}  warnAt={WARN.co}  />
      <Row label="NO₂" value={Number(data.no2 ?? 0)} unit="ppm" score33={no2Score} warnAt={WARN.no2}/>
      <Text className="text-xs text-gray-500 mt-2">
        * Concentration unit: ppm. Each parameter has a maximum of 33 points according to the formula system.
      </Text>
    </View>
  );
}
