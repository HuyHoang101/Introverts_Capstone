export type PollutantData = {
    pm25: number;
    pm10: number;
    no2: number;
    o3: number;
    co: number;
};
  
export const calculateDangerScore = (data: PollutantData): number => {
    let sum = 0;
  
    // PM2.5 (0–55 μg/m³)
    sum += Math.min(20, (data.pm25 * 20) / 55);
  
    // PM10 (0–254 μg/m³)
    sum += Math.min(20, (data.pm10 * 20) / 254);
  
    // NO₂ (0–360 ppb)
    sum += Math.min(20, (data.no2 * 20) / 360);
  
    // O₃ (0–85 ppb)
    sum += Math.min(20, (data.o3 * 20) / 85);
  
    // CO (0–12.4 ppm)
    sum += Math.min(20, (data.co * 20) / 12.4);
  
    return Math.round(sum * 10) / 10;
};
  