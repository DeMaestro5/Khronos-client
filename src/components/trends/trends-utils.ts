import { Trend } from '@/src/types/trends';

export const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  } else if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toString();
};

export const formatPercentage = (num: number): string => {
  return `${num > 0 ? '+' : ''}${num.toFixed(1)}%`;
};

export const calculateAverageGrowth = (trends: Trend[]): number => {
  if (trends.length === 0) return 0;
  const totalGrowth = trends.reduce((sum, trend) => sum + trend.growth, 0);
  return Math.round((totalGrowth / trends.length) * 10) / 10;
};

export const findTopCategory = (trends: Trend[]): string => {
  if (trends.length === 0) return 'general';
  const categoryCount: { [key: string]: number } = {};
  trends.forEach((trend) => {
    const category = trend.category || 'general';
    categoryCount[category] = (categoryCount[category] || 0) + 1;
  });
  return Object.keys(categoryCount).reduce(
    (a, b) => (categoryCount[a] > categoryCount[b] ? a : b),
    'general'
  );
};

export const calculateSentimentBreakdown = (trends: Trend[]) => {
  const breakdown = { positive: 0, negative: 0, neutral: 0 };
  trends.forEach((trend) => {
    breakdown[trend.sentiment]++;
  });
  return breakdown;
};

export const getDaysFromTimeRange = (timeRange: string): number => {
  switch (timeRange) {
    case 'week':
      return 7;
    case 'month':
      return 30;
    case 'quarter':
      return 90;
    case 'year':
      return 365;
    default:
      return 7;
  }
};
