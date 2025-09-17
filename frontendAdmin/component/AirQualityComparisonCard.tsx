import React, { useMemo } from "react";
import { View, Text } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { calculateDangerScore } from "@/utils/dangerScore";

type AirCore = {
  nh3: number;
  no2: number;
  co: number;
  temperature?: number; // °C
  humidity?: number;    // %
};

type Props = {
  current: AirCore;
  city?: string;     // default: "HCM"
  baseline?: AirCore; // optional: override baseline
  className?: string;
};

// ❗ Baseline GIẢ ĐỊNH (demo) cho HCM – có thể thay đổi sau nếu có số liệu thực.
const HCM_ASSUMED_BASELINE: AirCore = {
  nh3: 12.0,    // ppm (assumed)
  co:  10.0,    // ppm (assumed)
  no2: 1.2,     // ppm (assumed)
  temperature: 30, // °C (assumed)
  humidity: 70,    // % (assumed)
};

const deltaPct = (cur: number, base: number) => {
  if (!isFinite(cur) || !isFinite(base) || base === 0) return null;
  return ((cur - base) / base) * 100;
};

const Arrow = ({ d }: { d: number | null }) => {
  if (d === null) return <MaterialIcons name="horizontal-rule" size={16} color="#6B7280" />;
  if (d > 1) return <MaterialIcons name="arrow-upward" size={16} color="#ef4444" />;
  if (d < -1) return <MaterialIcons name="arrow-downward" size={16} color="#22c55e" />;
  return <MaterialIcons name="arrow-right-alt" size={16} color="#6B7280" />;
};

const Line = ({ label, cur, base, unit }: { label: string; cur: number | undefined; base: number | undefined; unit: string }) => {
  const d = deltaPct(Number(cur ?? NaN), Number(base ?? NaN));
  const prettyDelta = d === null ? "—" : `${d > 0 ? "+" : ""}${d.toFixed(1)}%`;

  return (
    <View className="flex-row justify-between items-center py-1">
      <Text className="text-gray-700">{label}</Text>
      <View className="flex-row items-center">
        <Text className="text-gray-900 font-semibold mr-2">
          {isFinite(Number(cur)) ? `${Number(cur).toFixed(3)} ${unit}` : "N/A"}
        </Text>
        <Arrow d={d} />
        <Text className="text-gray-600 ml-1">{prettyDelta}</Text>
      </View>
    </View>
  );
};

export default function AirQualityComparisonCard({ current, baseline, city = "HCM", className }: Props) {
  const base = baseline ?? HCM_ASSUMED_BASELINE;

  const currentScore  = useMemo(() => calculateDangerScore({ nh3: current.nh3, no2: current.no2, co: current.co }), [current]);
  const baselineScore = useMemo(() => calculateDangerScore({ nh3: base.nh3,    no2: base.no2,    co: base.co    }), [base]);
  const deltaScorePct = deltaPct(currentScore, baselineScore);

  return (
    <View className={`bg-white rounded-2xl border border-gray-200 p-4 ${className ?? ""}`}>
      <Text className="text-lg font-bold text-gray-900">
        Compare with {city} Baseline
      </Text>

      <View className="mt-3">
        <Line label="NH₃" cur={current.nh3} base={base.nh3} unit="ppm" />
        <Line label="CO"  cur={current.co}  base={base.co}  unit="ppm" />
        <Line label="NO₂" cur={current.no2} base={base.no2} unit="ppm" />
        <Line label="Temp." cur={current.temperature} base={base.temperature} unit="°C" />
        <Line label="Humidity" cur={current.humidity} base={base.humidity} unit="%" />
      </View>

      <View className="mt-3 pt-3 border-t border-gray-200">
        <Text className="text-gray-700">
          Danger Score: <Text className="font-semibold text-gray-900">{currentScore}</Text>{" "}
          vs baseline <Text className="font-semibold text-gray-900">{baselineScore}</Text>{" "}
          <Text className="text-gray-600">
            ({deltaScorePct === null ? "—" : `${deltaScorePct > 0 ? "+" : ""}${deltaScorePct.toFixed(1)}%`})
          </Text>
        </Text>
        <Text className="text-[11px] text-gray-500 mt-1">
          * Baseline assumed for interface comparison only, does not reflect actual monitoring data.
        </Text>
      </View>
    </View>
  );
}
