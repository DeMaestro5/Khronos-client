'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3,
  Target,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Info,
  Eye,
  Heart,
} from 'lucide-react';

import {
  ComprehensiveAnalyticsResponse,
  DashboardResponse,
  TrendsAnalyticsResponse,
  PerformanceAnalyticsResponse,
  EngagementAnalyticsResponse,
} from '@/src/types/analytics';
import PageLoading from '@/src/components/ui/page-loading';
import PlatformPerformance from '@/src/components/analytics/platform-performance';
import TrendingOpportunities from '@/src/components/analytics/trending-opportunities';
import PerformanceInsights from '@/src/components/analytics/performance-insights';
import { useUserData } from '@/src/context/UserDataContext';

interface AnalyticsState {
  // Core data sources
  overview: ComprehensiveAnalyticsResponse['data'] | null;
  dashboard: DashboardResponse['data'] | null;
  performance: PerformanceAnalyticsResponse['data'] | null;
  engagement: EngagementAnalyticsResponse['data'] | null;
  trends: TrendsAnalyticsResponse['data'] | null;

  // State management
  loading: boolean;
  error: string | null;
  refreshing: boolean;
  lastUpdated: string | null;
}

export default function AnalyticsPage() {
  const [state, setState] = useState<AnalyticsState>({
    overview: null,
    dashboard: null,
    performance: null,
    engagement: null,
    trends: null,
    loading: true,
    error: null,
    refreshing: false,
    lastUpdated: null,
  });

  // Use cached data from UserDataContext
  const {
    userContent,
    analyticsData,
    platformData,
    loading: userDataLoading,
    refreshAnalyticsData,
    refreshPlatformData,
  } = useUserData();

  // Use cached analytics data instead of fetching directly
  useEffect(() => {
    if (userDataLoading) {
      setState((prev) => ({ ...prev, loading: true }));
      return;
    }

    if (analyticsData) {
      setState({
        overview: analyticsData.overview,
        dashboard: analyticsData.dashboard,
        performance: analyticsData.performance,
        engagement: analyticsData.engagement,
        trends: analyticsData.trends,
        loading: false,
        error: null,
        refreshing: false,
        lastUpdated: analyticsData.lastUpdated,
      });
    } else {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: 'No analytics data available',
      }));
    }
  }, [analyticsData, userDataLoading]);

  const handleRefresh = async () => {
    setState((prev) => ({ ...prev, refreshing: true }));
    await Promise.all([refreshAnalyticsData(), refreshPlatformData()]);
    setState((prev) => ({ ...prev, refreshing: false }));
  };

  // Smart data extraction - use the best available data source or cached content
  const getMetric = (metricName: string): number => {
    switch (metricName) {
      case 'totalContent':
        return (
          state.dashboard?.dashboard?.summary?.totalContent ||
          state.overview?.overview?.totalContent ||
          state.performance?.analytics?.totalContent ||
          userContent?.length ||
          0
        );

      case 'totalEngagement':
        return (
          state.dashboard?.dashboard?.summary?.totalEngagement ||
          state.overview?.overview?.totalEngagement ||
          state.engagement?.engagement?.totalEngagement ||
          state.performance?.analytics?.metrics?.totalEngagement ||
          0
        );

      case 'totalReach':
        return (
          state.dashboard?.dashboard?.summary?.totalReach ||
          state.overview?.overview?.totalReach ||
          state.performance?.analytics?.metrics?.totalReach ||
          0
        );

      case 'engagementRate':
        return (
          state.dashboard?.dashboard?.summary?.averageEngagementRate ||
          state.overview?.overview?.averageEngagementRate ||
          state.performance?.analytics?.metrics?.averageEngagementRate ||
          state.engagement?.engagement?.qualityScore ||
          0
        );

      default:
        return 0;
    }
  };

  const getPlatformData = () => {
    // Use user-specific platform data from UserDataContext
    if (platformData && platformData.platforms.length > 0) {
      return platformData.platforms.map((platform) => ({
        platform: platform.platform,
        metrics: platform.metrics,
        growth: {
          content: 0,
          engagement: 0,
          reach: 0,
        },
        status: platform.status,
      }));
    }

    // Fallback to analytics API data if platform data not available
    if (state.dashboard?.dashboard?.platformPerformance) {
      return state.dashboard.dashboard.platformPerformance;
    }

    if (state.overview?.overview?.platformBreakdown) {
      return Object.entries(state.overview.overview.platformBreakdown).map(
        ([platform, data]) => ({
          platform,
          metrics: {
            content: data.count || 0,
            engagement: data.engagement || 0,
            reach: data.reach || 0,
            engagementRate:
              ((data.engagement || 0) / Math.max(data.reach || 1, 1)) * 100,
          },
          growth: {
            content: 0,
            engagement: 0,
            reach: 0,
          },
          status: (data.trend === 'up'
            ? 'excellent'
            : data.trend === 'down'
            ? 'needs_improvement'
            : 'good') as 'excellent' | 'good' | 'needs_improvement',
        })
      );
    }

    return [];
  };

  const getOpportunities = () => {
    if (state.dashboard?.dashboard?.trendingOpportunities) {
      return state.dashboard.dashboard.trendingOpportunities;
    }

    if (state.trends?.trends?.highOpportunityTrends) {
      return state.trends.trends.highOpportunityTrends.map((trend) => ({
        trend: {
          topic: trend.topic || 'Unknown Topic',
          volume: trend.volume || 0,
          growth: parseFloat(trend.growth) || 0,
          platforms: trend.platforms || [],
          sentiment: trend.sentiment || 0,
          competitionLevel: trend.competitionLevel || 'unknown',
        },
        opportunity: {
          score: trend.opportunityScore || 0,
          difficulty:
            (trend.difficulty as 'easy' | 'medium' | 'hard') || 'medium',
          timeWindow: trend.timeWindow || 'unknown',
          suggestedContent: trend.suggestedContent || [],
        },
      }));
    }

    return [];
  };

  const getAlerts = () => {
    // Generate default alerts based on cached content data
    const alerts = [];

    if (userContent) {
      const totalContent = userContent.length;
      const scheduledContent = userContent.filter(
        (c) => c.status === 'scheduled'
      ).length;

      if (totalContent === 0) {
        alerts.push({
          type: 'info' as const,
          title: 'Start Creating Content',
          message:
            'Create your first piece of content to begin tracking analytics.',
          action: 'Create Content',
        });
      } else if (scheduledContent === 0) {
        alerts.push({
          type: 'warning' as const,
          title: 'No Scheduled Content',
          message: 'Schedule some content to maintain consistent posting.',
          action: 'Schedule Content',
        });
      }

      if (totalContent > 0 && totalContent < 5) {
        alerts.push({
          type: 'info' as const,
          title: 'Growing Your Content Library',
          message: `You have ${totalContent} piece${
            totalContent > 1 ? 's' : ''
          } of content. Keep creating!`,
          action: 'View Content',
        });
      }
    }

    return alerts;
  };

  const getDataQuality = () => {
    // Calculate data quality based on available information
    let score = 0;
    const maxScore = 4;

    if (userContent && userContent.length > 0) score += 1;
    if (state.overview || state.dashboard) score += 1;
    if (state.performance) score += 1;
    if (state.engagement) score += 1;

    return {
      score: (score / maxScore) * 100,
      issues: score < maxScore ? ['Some analytics data is unavailable'] : [],
      lastUpdated: state.lastUpdated || new Date().toISOString(),
    };
  };

  // Loading state
  if (state.loading || userDataLoading) {
    return (
      <PageLoading
        title='Loading Analytics'
        subtitle='Crunching the numbers and analyzing your content performance...'
        contentType='analytics'
        showGrid={true}
        gridItems={6}
      />
    );
  }

  // Error state
  if (state.error) {
    return (
      <div className='min-h-screen bg-white dark:bg-slate-900 flex items-center justify-center p-6'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className='text-center max-w-md'
        >
          <div className='w-16 h-16 bg-red-100 dark:bg-red-900/50 rounded-full flex items-center justify-center mx-auto mb-4'>
            <AlertTriangle className='w-8 h-8 text-red-600 dark:text-red-400' />
          </div>
          <h1 className='text-xl font-semibold text-gray-900 dark:text-slate-100 mb-2'>
            Analytics Unavailable
          </h1>
          <p className='text-gray-600 dark:text-slate-400 mb-6'>
            {state.error}
          </p>
          <button
            onClick={handleRefresh}
            className='inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200'
          >
            <RefreshCw className='w-4 h-4 mr-2' />
            Try Again
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className='p-4 lg:p-6 space-y-4 bg-white dark:bg-slate-900 min-h-screen transition-colors duration-200'>
      {/* Header */}
      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
        <div>
          <h1 className='text-2xl sm:text-3xl font-bold text-gray-900 dark:text-slate-100'>
            Analytics Dashboard
          </h1>
          <p className='text-gray-600 dark:text-slate-400 mt-1'>
            Track your content performance and discover growth opportunities
          </p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={state.refreshing}
          className='inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-lg transition-colors duration-200'
        >
          <RefreshCw
            className={`w-4 h-4 mr-2 ${state.refreshing ? 'animate-spin' : ''}`}
          />
          {state.refreshing ? 'Refreshing...' : 'Refresh Data'}
        </button>
      </div>

      {/* Key Metrics */}
      <div className='grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4'>
        {[
          {
            title: 'Total Content',
            value: getMetric('totalContent'),
            icon: BarChart3,
            color: 'blue',
            suffix: '',
          },
          {
            title: 'Total Engagement',
            value: getMetric('totalEngagement'),
            icon: Heart,
            color: 'pink',
            suffix: '',
          },
          {
            title: 'Total Reach',
            value: getMetric('totalReach'),
            icon: Eye,
            color: 'purple',
            suffix: '',
          },
          {
            title: 'Engagement Rate',
            value: getMetric('engagementRate'),
            icon: Target,
            color: 'green',
            suffix: '%',
          },
        ].map((metric) => (
          <motion.div
            key={metric.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className='bg-white dark:bg-slate-800 p-4 lg:p-5 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow duration-200'
          >
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-xs lg:text-sm font-medium text-gray-500 dark:text-slate-400'>
                  {metric.title}
                </p>
                <p className='text-lg lg:text-2xl font-bold text-gray-900 dark:text-slate-100 mt-1'>
                  {metric.value.toLocaleString()}
                  {metric.suffix}
                </p>
              </div>
              <div
                className={`w-8 h-8 lg:w-10 lg:h-10 rounded-lg flex items-center justify-center ${
                  metric.color === 'blue'
                    ? 'bg-blue-100 dark:bg-blue-900/50'
                    : metric.color === 'pink'
                    ? 'bg-pink-100 dark:bg-pink-900/50'
                    : metric.color === 'purple'
                    ? 'bg-purple-100 dark:bg-purple-900/50'
                    : 'bg-green-100 dark:bg-green-900/50'
                }`}
              >
                <metric.icon
                  className={`w-4 h-4 lg:w-5 lg:h-5 ${
                    metric.color === 'blue'
                      ? 'text-blue-600 dark:text-blue-400'
                      : metric.color === 'pink'
                      ? 'text-pink-600 dark:text-pink-400'
                      : metric.color === 'purple'
                      ? 'text-purple-600 dark:text-purple-400'
                      : 'text-green-600 dark:text-green-400'
                  }`}
                />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Data Quality & Alerts Row */}
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-4'>
        {/* Data Quality Indicator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className='lg:col-span-2 bg-white dark:bg-slate-800 p-4 rounded-xl border border-gray-200 dark:border-slate-700'
        >
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-3'>
              <div className='flex items-center space-x-2'>
                <CheckCircle className='w-5 h-5 text-green-500' />
                <span className='text-sm font-medium text-gray-900 dark:text-slate-100'>
                  Data Quality: {Math.round(getDataQuality().score)}%
                </span>
              </div>
              {getDataQuality().issues.length > 0 && (
                <div className='flex items-center space-x-1'>
                  <Info className='w-4 h-4 text-amber-500' />
                  <span className='text-xs text-amber-600 dark:text-amber-400'>
                    {getDataQuality().issues[0]}
                  </span>
                </div>
              )}
            </div>
            <span className='text-xs text-gray-500 dark:text-slate-400'>
              Last updated:{' '}
              {new Date(getDataQuality().lastUpdated).toLocaleTimeString()}
            </span>
          </div>
        </motion.div>

        {/* Trending Opportunities - Compact Version */}
        <div className='lg:col-span-1'>
          <TrendingOpportunities
            opportunities={getOpportunities()}
            isLoading={false}
            maxItems={3}
          />
        </div>
      </div>

      {/* Alerts */}
      {getAlerts().length > 0 && (
        <div className='space-y-3'>
          {getAlerts().map((alert, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-4 rounded-xl border-l-4 ${
                alert.type === 'warning'
                  ? 'bg-amber-50 dark:bg-amber-900/20 border-amber-400'
                  : 'bg-blue-50 dark:bg-blue-900/20 border-blue-400'
              }`}
            >
              <div className='flex items-center justify-between'>
                <div>
                  <h3
                    className={`font-medium ${
                      alert.type === 'warning'
                        ? 'text-amber-800 dark:text-amber-200'
                        : 'text-blue-800 dark:text-blue-200'
                    }`}
                  >
                    {alert.title}
                  </h3>
                  <p
                    className={`text-sm mt-1 ${
                      alert.type === 'warning'
                        ? 'text-amber-600 dark:text-amber-300'
                        : 'text-blue-600 dark:text-blue-300'
                    }`}
                  >
                    {alert.message}
                  </p>
                </div>
                {alert.action && (
                  <button
                    className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors duration-200 ${
                      alert.type === 'warning'
                        ? 'bg-amber-200 hover:bg-amber-300 text-amber-800 dark:bg-amber-800 dark:hover:bg-amber-700 dark:text-amber-200'
                        : 'bg-blue-200 hover:bg-blue-300 text-blue-800 dark:bg-blue-800 dark:hover:bg-blue-700 dark:text-blue-200'
                    }`}
                  >
                    {alert.action}
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Platform Performance - Full Width */}
      <PlatformPerformance platforms={getPlatformData()} isLoading={false} />

      {/* Performance Insights - Full Width */}
      <PerformanceInsights performance={state.performance} isLoading={false} />
    </div>
  );
}
