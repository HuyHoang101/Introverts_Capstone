export type PollutantData = {
    nh3: number;
    no2: number;
    co: number;
};
  
export const calculateDangerScore = (data: PollutantData): number => {
    let sum = 0;

    sum += Math.min(33, (data.nh3 * 0.165));
  
    sum += Math.min(33, (data.no2 * 6.6));

    sum += Math.min(33, (data.co * 0.165));
  
    return Math.round(sum);
};
  