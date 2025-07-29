export const formatNumber = (num: number): string => {
    if (num >= 1_000_000) {
      return `${(num / 1_000_000).toFixed(2)}m`;
    }
    if (num >= 1_000) {
      return `${(num / 1_000).toFixed(2)}k`;
    }
    return num.toFixed(2);
};
  
  