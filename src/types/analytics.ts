// Comprehensive Analytics Overview Response (Orchestrator)
export interface ComprehensiveAnalyticsResponse {
  statusCode: string;
  message: string;
  data: {
    overview: ComprehensiveOverview;
    realTimeData: RealTimeData;
    predictions: PredictionData;
    competitorInsights: CompetitorInsights;
    socialListening: SocialListening;
    recommendations: RecommendationData;
    dataQuality: DataQuality;
    metadata: {
      retrievedAt: string;
      userId: string;
      dataType: string;
      comprehensiveReport: boolean;
      dataQuality: DataQuality;
    };
  };
}

export interface ComprehensiveOverview {
  totalContent: number;
  totalEngagement: number;
  totalReach: number;
  averageEngagementRate: number;
  topPerformingPlatform: string;
  recentGrowth: number;
  contentPerformance: {
    excellent: number;
    good: number;
    average: number;
    needsImprovement: number;
  };
  platformBreakdown: Record<string, PlatformBreakdown>;
  timeSeriesData: TimeSeriesData[];
}

export interface RealTimeData {
  liveMetrics: LiveMetric[];
  currentTrending: TrendingItem[];
  alerts: Alert[];
  lastUpdated: string;
  updateFrequency: string;
}

export interface LiveMetric {
  metric: string;
  value: number;
  change: number;
  status: 'up' | 'down' | 'stable';
}

export interface TrendingItem {
  topic: string;
  platform: string;
  trendingScore: number;
  isViral: boolean;
}

export interface Alert {
  type: 'viral' | 'engagement_spike' | 'trending' | 'performance';
  message: string;
  urgency: 'high' | 'medium' | 'low';
  timestamp: string;
  contentId?: string;
  platform?: string;
  recommendations?: string[];
}

export interface PredictionData {
  contentPredictions: ContentPrediction[];
  trendsForecasting: TrendsForecast[];
  audienceGrowthProjections: GrowthProjection[];
}

export interface ContentPrediction {
  contentId: string;
  platform: string;
  predictedEngagement: number;
  confidence: number;
  recommendations: string[];
}

export interface TrendsForecast {
  topic: string;
  predictedVolume: number;
  timeframe: string;
  confidence: number;
}

export interface GrowthProjection {
  metric: string;
  projectedValue: number;
  timeframe: string;
  confidence: number;
}

export interface CompetitorInsights {
  analyses: CompetitorAnalysis[];
  marketPosition: string;
  industryBenchmarks: IndustryBenchmark[];
}

export interface CompetitorAnalysis {
  competitor: string;
  followers: number;
  engagementRate: number;
  contentStrategy: string[];
  strengths: string[];
  opportunities: string[];
}

export interface IndustryBenchmark {
  metric: string;
  average: number;
  topPercentile: number;
  yourValue: number;
}

export interface SocialListening {
  mentionData: MentionData[];
  sentimentTrends: SentimentTrend[];
  keywordPerformance: KeywordPerformance[];
}

export interface MentionData {
  keyword: string;
  mentions: number;
  sentiment: {
    positive: number;
    negative: number;
    neutral: number;
  };
  platforms: string[];
}

export interface SentimentTrend {
  date: string;
  sentiment: number;
  volume: number;
}

export interface KeywordPerformance {
  keyword: string;
  performance: number;
  trend: 'up' | 'down' | 'stable';
  impact: number;
}

export interface RecommendationData {
  immediate: string[];
  shortTerm: string[];
  longTerm: string[];
  contentStrategy: string[];
}

export interface DataQuality {
  overall: 'excellent' | 'good' | 'fair' | 'poor';
  sources: string[];
  confidence: number;
  lastUpdated: string;
}

// Dashboard Response Types
export interface DashboardResponse {
  statusCode: string;
  message: string;
  data: {
    dashboard: DashboardData;
    enhanced: boolean;
    metadata: {
      retrievedAt: string;
      userId: string;
      dataType: string;
      updateFrequency: string;
    };
  };
}

export interface DashboardData {
  summary: DashboardSummary;
  realTimeMetrics: RealTimeMetric[];
  trendingOpportunities: TrendingOpportunity[];
  platformPerformance: PlatformPerformance[];
  contentInsights: ContentInsight[];
  lastUpdated: string;
  updateFrequency: string;
}

export interface DashboardSummary {
  totalContent: number;
  totalEngagement: number;
  totalReach: number;
  averageEngagementRate: number;
  growth: {
    content: number;
    engagement: number;
    reach: number;
  };
}

export interface RealTimeMetric {
  name: string;
  value: number;
  change: number;
  trend: 'up' | 'down' | 'stable';
  platform?: string;
}

export interface TrendingOpportunity {
  trend: {
    topic: string;
    volume: number;
    growth: number;
    platforms: string[];
    sentiment: number;
    competitionLevel: string;
  };
  opportunity: {
    score: number;
    difficulty: 'easy' | 'medium' | 'hard';
    timeWindow: string;
    suggestedContent: string[];
  };
}

export interface PlatformPerformance {
  platform: string;
  metrics: {
    content: number;
    engagement: number;
    reach: number;
    engagementRate: number;
  };
  growth: {
    content: number;
    engagement: number;
    reach: number;
  };
  status: 'excellent' | 'good' | 'needs_improvement';
}

export interface ContentInsight {
  contentId: string;
  title: string;
  performance: {
    engagement: number;
    reach: number;
    score: number;
  };
  platforms: string[];
  insights: string[];
}

// Legacy types for backward compatibility
export interface AnalyticsOverviewResponse {
  statusCode: string;
  message: string;
  data: {
    overview: AnalyticsOverview;
    metadata: {
      retrievedAt: string;
      userId: string;
      dataType: string;
    };
  };
}

export interface AnalyticsOverview {
  totalContent: number;
  totalEngagement: number;
  totalReach: number;
  averageEngagementRate: number;
  topPerformingPlatform: string;
  recentGrowth: number;
  contentPerformance: {
    excellent: number;
    good: number;
    average: number;
    needsImprovement: number;
  };
  platformBreakdown: Record<string, PlatformBreakdown>;
  timeSeriesData: TimeSeriesData[];
}

export interface PlatformBreakdown {
  count: number;
  engagement: number;
  reach: number;
  trend: 'up' | 'down' | 'stable';
}

export interface TimeSeriesData {
  date: string;
  engagement: number;
  reach: number;
  content: number;
}

// Simplified types for components
export interface AnalyticsData {
  totalViews: number;
  totalEngagement: number;
  avgEngagementRate: number;
  totalFollowers: number;
  contentCreated: number;
  scheduledContent: number;
  topPerformingPlatform: string;
  growthRate: number;
  weeklyGrowth: number;
  monthlyGrowth: number;
}

export interface PlatformMetrics {
  platform: string;
  views: number;
  engagement: number;
  posts: number;
  growth: number;
  color: string;
}

// Additional response types
export interface PerformanceAnalyticsResponse {
  statusCode: string;
  message: string;
  data: {
    period: string;
    analytics: PerformanceAnalytics;
    insights: PerformanceInsights;
    metadata: {
      retrievedAt: string;
      userId: string;
      dataType: string;
      periodDays: number;
    };
  };
}

export interface PerformanceAnalytics {
  metrics: {
    averageEngagementRate: number;
    totalReach: number;
    totalEngagement: number;
  };
  trends: {
    engagement: number;
    reach: number;
  };
  totalContent: number;
}

export interface PerformanceInsights {
  topGrowthMetric: string;
  performanceStatus: string;
  contentRecommendation: string;
}

export interface EngagementAnalyticsResponse {
  statusCode: string;
  message: string;
  data: {
    engagement: EngagementAnalytics;
    insights: EngagementInsights;
    recommendations: string[];
    metadata: {
      retrievedAt: string;
      userId: string;
      dataType: string;
    };
  };
}

export interface EngagementAnalytics {
  totalEngagement: number;
  engagementGrowth: number;
  qualityScore: number;
  breakdown: Record<string, number>;
  hourlyEngagement: Record<string, number>;
  dailyEngagement: Record<string, number>;
  topEngagingContent: TopEngagingContent[];
}

export interface TopEngagingContent {
  contentId: string;
  title: string;
  engagement: number;
  platform: string;
  type: string;
}

export interface EngagementInsights {
  peakEngagementHour: string;
  peakEngagementDay: string;
  engagementTrend: string;
  engagementHealth: string;
  dominantEngagementType: string;
  averageEngagementPerPost: number;
}

export interface TrendsAnalyticsResponse {
  statusCode: string;
  message: string;
  data: {
    trends: TrendsAnalytics;
    recommendations: string[];
    metadata: {
      retrievedAt: string;
      userId: string;
      dataType: string;
      updateFrequency: string;
    };
  };
}

export interface TrendsAnalytics {
  highOpportunityTrends: HighOpportunityTrend[];
  emergingTrends: EmergingTrend[];
  marketContext: MarketContext;
  socialInsights: SocialInsights;
  personalTrends: PersonalTrends | null;
  actionableOpportunities: ActionableOpportunity[];
}

export interface HighOpportunityTrend {
  topic: string;
  volume: number;
  growth: string;
  sentiment: number;
  platforms: string[];
  opportunityScore: number;
  difficulty: string;
  timeWindow: string;
  competitionLevel: string;
  suggestedContent: string[];
}

export interface EmergingTrend {
  topic: string;
  opportunityScore: number;
  difficulty: string;
  platforms: string[];
  recommendation: string;
}

export interface MarketContext {
  competitorCount: number;
  averageFollowers: number;
  marketPosition: string;
  industryBenchmarks: IndustryBenchmark[];
}

export interface SocialInsights {
  totalMentions: number;
  overallSentiment: SentimentTrend | null;
  keywordPerformance: KeywordPerformance[];
}

export interface PersonalTrends {
  trendingTopics: PersonalTrendingTopic[];
  totalContent: number;
  avgContentPerWeek: number;
}

export interface PersonalTrendingTopic {
  topic: string;
  score: number;
  usage: number;
  growth: string;
}

export interface ActionableOpportunity {
  topic: string;
  action: string;
  expectedImpact: string;
  timeWindow: string;
  platforms: string[];
}
