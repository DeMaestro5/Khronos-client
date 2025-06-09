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
