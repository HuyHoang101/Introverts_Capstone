export type PollutionData = {
  nh3: number;
  no2: number;
  co: number;
};

export const calculateDangerScore = (data: PollutionData): number => {
  // Mỗi thành phần tối đa 33 điểm; tổng clamp 100
  const nh3Score = Math.min((data.nh3 ?? 0) / 0.165, 33);
  const coScore  = Math.min((data.co  ?? 0) / 0.165, 33);
  const no2Score = Math.min((data.no2 ?? 0) / 6.6,  33);
  const total = Math.min(nh3Score + coScore + no2Score, 100);
  return Math.round(total * 10) / 10;
};

// Ngưỡng cảnh báo theo phần “component score” (0–33)
export const AIR_WARN_THRESHOLDS = {
  nh3: 8.25,
  co:  5.775,
  no2: 6.6,
};
