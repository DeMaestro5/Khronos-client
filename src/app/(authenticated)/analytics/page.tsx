'use client';

import React, { useState, useEffect } from 'react';
import { contentAPI } from '@/src/lib/api';
import { Content } from '@/src/types/content';
import { AnalyticsData, PlatformMetrics } from '@/src/types/analytics';
import ContentLoading from '@/src/components/ui/content-loading';
import AnalyticsHeader from '@/src/components/analytics/analytics-header';
import AnalyticsStats from '@/src/components/analytics/analytics-stats';
import GrowthMetrics from '@/src/components/analytics/growth-metrics';
import EngagementChart from '@/src/components/analytics/engagement-chart';
import ContentHeatmap from '@/src/components/analytics/content-heatmap';
import PlatformPerformance from '@/src/components/analytics/platform-performance';
import EngagementTrends from '@/src/components/analytics/engagement-trends';
import TopPerformingContent from '@/src/components/analytics/top-performing-content';
import AIInsights from '@/src/components/analytics/ai-insights';

export default function AnalyticsPage() {
  const [contents, setContents] = useState<Content[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState<'7d' | '30d' | '90d' | '1y'>(
    '30d'
  );
  const [refreshing, setRefreshing] = useState(false);

  // Mock analytics data - in a real app, this would come from your API
  const [analyticsData] = useState<AnalyticsData>({
    totalViews: 127430,
    totalEngagement: 15892,
    avgEngagementRate: 12.5,
    totalFollowers: 8547,
    contentCreated: 0, // Will be updated from API
    scheduledContent: 0, // Will be updated from API
    topPerformingPlatform: 'Instagram',
    growthRate: 18.5,
    weeklyGrowth: 3.2,
    monthlyGrowth: 15.8,
  });

  const platformMetrics: PlatformMetrics[] = [
    {
      platform: 'Instagram',
      views: 45600,
      engagement: 5680,
      posts: 24,
      growth: 22.5,
      color: 'from-pink-500 to-rose-500',
    },
    {
      platform: 'LinkedIn',
      views: 32400,
      engagement: 4120,
      posts: 18,
      growth: 15.8,
      color: 'from-blue-500 to-blue-600',
    },
    {
      platform: 'TikTok',
      views: 28700,
      engagement: 3890,
      posts: 16,
      growth: 31.2,
      color: 'from-black to-gray-600',
    },
    {
      platform: 'Twitter',
      views: 20730,
      engagement: 2202,
      posts: 12,
      growth: 8.4,
      color: 'from-sky-400 to-sky-500',
    },
  ];

  useEffect(() => {
    const fetchContents = async () => {
      setIsLoading(true);
      try {
        const response = await contentAPI.getUserContent();
        if (response.data?.statusCode === '10000' && response.data?.data) {
          setContents(response.data.data);
        }
      } catch (error) {
        console.error('Failed to fetch contents:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchContents();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate API refresh
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setRefreshing(false);
  };

  if (isLoading) {
    return <ContentLoading />;
  }

  return (
    <div className='p-3 sm:p-4 lg:p-6 space-y-6 min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100'>
      {/* Header */}
      <AnalyticsHeader
        timeFilter={timeFilter}
        setTimeFilter={setTimeFilter}
        onRefresh={handleRefresh}
        refreshing={refreshing}
      />

      {/* Stats Grid */}
      <AnalyticsStats analyticsData={analyticsData} contents={contents} />

      {/* Growth Metrics */}
      <GrowthMetrics />

      {/* Engagement Chart */}
      <EngagementChart />

      {/* Content Activity Heatmap */}
      <ContentHeatmap />

      {/* Platform Performance & Engagement Trends */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        <PlatformPerformance platformMetrics={platformMetrics} />
        <EngagementTrends />
      </div>

      {/* Recent Content Performance */}
      <TopPerformingContent contents={contents} timeFilter={timeFilter} />

      {/* Performance Insights */}
      <AIInsights />
    </div>
  );
}
