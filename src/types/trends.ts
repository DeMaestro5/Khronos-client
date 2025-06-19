export interface Trend {
  _id: string;
  keyword: string;
  platform: string;
  category: string;
  volume: number;
  growth: number;
  sentiment: 'positive' | 'negative' | 'neutral';
  relatedTopics: string[];
  startDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface TrendAnalysis {
  trends: Trend[];
  summary: {
    totalTrends: number;
    averageGrowth: number;
    topCategory: string;
    topPlatform: string;
    sentimentBreakdown: {
      positive: number;
      negative: number;
      neutral: number;
    };
  };
  insights: {
    emergingTrends: Trend[];
    decliningTrends: Trend[];
    stableTrends: Trend[];
  };
}

export interface TrendPrediction {
  keyword: string;
  currentVolume: number;
  predictedVolume: number;
  confidence: number;
  factors: {
    seasonal: number;
    viral: number;
    industry: number;
    competition: number;
  };
  recommendations: string[];
}

export interface TrendReport {
  period: {
    startDate: Date;
    endDate: Date;
    days: number;
  };
  platform: string;
  topTrends: Trend[];
  categoryBreakdown: Record<string, number>;
  platformBreakdown: Record<string, number>;
  growthAnalysis: {
    fastestGrowing: Trend[];
    declining: Trend[];
    stable: Trend[];
  };
  insights: string[];
  recommendations: string[];
}

export interface Platform {
  value: string;
  label: string;
}

export interface Category {
  value: string;
  label: string;
}

export interface CustomAnalysisParams {
  platform?: string;
  category?: string;
  keywords?: string[];
  timeRange?: {
    start?: string;
    end?: string;
  };
}

export interface TrendsFilters {
  platform?: string;
  category?: string;
  timeRange?: 'today' | 'week' | 'month' | 'quarter' | 'year' | 'custom';
  customStartDate?: string;
  customEndDate?: string;
  minVolume?: number;
  minGrowth?: number;
  sentiment?: 'positive' | 'negative' | 'neutral' | 'all';
}

export interface TrendsState {
  currentTrends: TrendAnalysis | null;
  historicalData: TrendReport | null;
  predictions: TrendPrediction[];
  relatedTrends: Trend[];
  filters: TrendsFilters;
  isLoading: boolean;
  error: string | null;
  platforms: Platform[];
  categories: Category[];
}
