'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3,
  Target,
  Zap,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Info,
  Eye,
  Heart,
} from 'lucide-react';
import { contentAPI, analyticsAPI } from '@/src/lib/api';
import { Content } from '@/src/types/content';
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

interface AnalyticsState {
  // Core data sources
  overview: ComprehensiveAnalyticsResponse['data'] | null;
  dashboard: DashboardResponse['data'] | null;
  performance: PerformanceAnalyticsResponse['data'] | null;
  engagement: EngagementAnalyticsResponse['data'] | null;
  trends: TrendsAnalyticsResponse['data'] | null;

  // Content data
  contents: Content[];

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
    contents: [],
    loading: true,
    error: null,
    refreshing: false,
    lastUpdated: null,
  });

  useEffect(() => {
    fetchAllAnalyticsData();
  }, []);

  const fetchAllAnalyticsData = async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    const results = {
      overview: null as ComprehensiveAnalyticsResponse['data'] | null,
      dashboard: null as DashboardResponse['data'] | null,
      performance: null as PerformanceAnalyticsResponse['data'] | null,
      engagement: null as EngagementAnalyticsResponse['data'] | null,
      trends: null as TrendsAnalyticsResponse['data'] | null,
      contents: [] as Content[],
    };

    try {
      // Fetch all data in parallel with error handling for each endpoint
      const promises = [
        // Content data (always needed)
        contentAPI
          .getUserContent()
          .then((res) => {
            if (res.data?.statusCode === '10000' && res.data?.data) {
              results.contents = res.data.data;
            }
          })
          .catch(() => console.log('Content API unavailable')),

        // Try overview/comprehensive endpoint
        analyticsAPI
          .getOverview()
          .then((res) => {
            console.log('Overview API Response:', res.data);
            if (res.data?.statusCode === '10000' && res.data?.data) {
              results.overview = res.data.data;
            }
          })
          .catch(() => console.log('Overview API unavailable')),

        // Try dashboard endpoint
        analyticsAPI
          .getDashboard()
          .then((res) => {
            console.log('Dashboard API Response:', res.data);
            if (res.data?.statusCode === '10000' && res.data?.data) {
              results.dashboard = res.data.data;
            }
          })
          .catch(() => console.log('Dashboard API unavailable')),

        // Try performance endpoint
        analyticsAPI
          .getPerformance('month')
          .then((res) => {
            if (res.data?.statusCode === '10000' && res.data?.data) {
              results.performance = res.data.data;
            }
          })
          .catch(() => console.log('Performance API unavailable')),

        // Try engagement endpoint
        analyticsAPI
          .getEngagement()
          .then((res) => {
            if (res.data?.statusCode === '10000' && res.data?.data) {
              results.engagement = res.data.data;
            }
          })
          .catch(() => console.log('Engagement API unavailable')),

        // Try trends endpoint
        analyticsAPI
          .getTrends()
          .then((res) => {
            if (res.data?.statusCode === '10000' && res.data?.data) {
              results.trends = res.data.data;
            }
          })
          .catch(() => console.log('Trends API unavailable')),
      ];

      await Promise.allSettled(promises);

      // Check if we have any data at all
      if (
        !results.overview &&
        !results.dashboard &&
        !results.performance &&
        !results.engagement
      ) {
        throw new Error('No analytics endpoints are available');
      }

      console.log('Final analytics results:', results);
      setState((prev) => ({
        ...prev,
        ...results,
        loading: false,
        lastUpdated: new Date().toISOString(),
      }));
    } catch (error) {
      console.error('Failed to fetch analytics data:', error);
      setState((prev) => ({
        ...prev,
        loading: false,
        error:
          'Unable to load analytics data. Please check your connection and try again.',
      }));
    }
  };

  const handleRefresh = async () => {
    setState((prev) => ({ ...prev, refreshing: true }));
    await fetchAllAnalyticsData();
    setState((prev) => ({ ...prev, refreshing: false }));
  };

  // Smart data extraction - use the best available data source
  const getMetric = (metricName: string): number => {
    switch (metricName) {
      case 'totalContent':
        return (
          state.dashboard?.dashboard?.summary?.totalContent ||
          state.overview?.overview?.totalContent ||
          state.performance?.analytics?.totalContent ||
          state.contents.length ||
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
    if (state.overview?.realTimeData?.alerts) {
      return state.overview.realTimeData.alerts;
    }
    return [];
  };

  const getDataQuality = () => {
    if (state.overview?.dataQuality) {
      return state.overview.dataQuality;
    }

    // Calculate basic data quality based on available endpoints
    const availableEndpoints = [
      state.overview && 'comprehensive',
      state.dashboard && 'dashboard',
      state.performance && 'performance',
      state.engagement && 'engagement',
      state.trends && 'trends',
    ].filter(Boolean);

    return {
      overall:
        availableEndpoints.length >= 3
          ? 'good'
          : availableEndpoints.length >= 2
          ? 'fair'
          : 'poor',
      sources: availableEndpoints,
      confidence: Math.min(100, availableEndpoints.length * 20),
      lastUpdated: state.lastUpdated || new Date().toISOString(),
    } as const;
  };

  if (state.loading) {
    return (
      <PageLoading
        title='Loading Analytics Dashboard'
        subtitle="We're gathering your performance metrics and insights..."
        contentType='analytics'
        showGrid={true}
        gridItems={8}
      />
    );
  }

  if (state.error) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex items-center justify-center p-6 transition-colors duration-300'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className='bg-white/60 dark:bg-slate-800/60 backdrop-blur-lg border border-red-200 dark:border-red-800 rounded-2xl p-8 shadow-lg max-w-md w-full text-center'
        >
          <AlertTriangle className='h-12 w-12 text-red-500 dark:text-red-400 mx-auto mb-4' />
          <h3 className='text-xl font-bold text-slate-900 dark:text-slate-100 mb-2'>
            Analytics Unavailable
          </h3>
          <p className='text-slate-600 dark:text-slate-400 mb-6'>
            {state.error}
          </p>
          <button
            onClick={handleRefresh}
            className='px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 dark:from-blue-600 dark:to-indigo-700 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-200'
          >
            Try Again
          </button>
        </motion.div>
      </div>
    );
  }

  const platformData = getPlatformData();
  const opportunities = getOpportunities();
  const alerts = getAlerts();
  const dataQuality = getDataQuality();

  return (
    <div className='p-3 sm:p-4 lg:p-6 space-y-6 min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 transition-colors duration-300'>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className='flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4'
      >
        <div>
          <h1 className='text-3xl lg:text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-slate-100 dark:to-slate-400 bg-clip-text text-transparent'>
            Analytics Dashboard
          </h1>
          <p className='text-slate-600 dark:text-slate-400 mt-2 flex items-center gap-2'>
            <CheckCircle className='h-4 w-4 text-green-500 dark:text-green-400' />
            Live data from server • {dataQuality.sources.length} data source
            {dataQuality.sources.length !== 1 ? 's' : ''}
          </p>
        </div>

        <div className='flex items-center gap-3'>
          <button
            onClick={handleRefresh}
            disabled={state.refreshing}
            className='p-3 bg-white/60 dark:bg-slate-800/60 backdrop-blur-lg border border-white/20 dark:border-slate-600/20 rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-white/80 dark:hover:bg-slate-800/80 transition-all duration-200 shadow-lg disabled:opacity-50'
          >
            <RefreshCw
              className={`h-5 w-5 ${state.refreshing ? 'animate-spin' : ''}`}
            />
          </button>
        </div>
      </motion.div>

      {/* Data Quality Indicator */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className='bg-white/60 dark:bg-slate-800/60 backdrop-blur-lg border border-white/20 dark:border-slate-600/20 rounded-xl p-4 shadow-lg'
      >
        <div className='flex items-center gap-3'>
          <Info className='h-5 w-5 text-blue-500 dark:text-blue-400' />
          <div>
            <span className='font-medium text-slate-900 dark:text-slate-100'>
              Data Quality:{' '}
            </span>
            <span
              className={`font-semibold ${
                dataQuality.overall === 'excellent'
                  ? 'text-green-600 dark:text-green-400'
                  : dataQuality.overall === 'good'
                  ? 'text-blue-600 dark:text-blue-400'
                  : dataQuality.overall === 'fair'
                  ? 'text-yellow-600 dark:text-yellow-400'
                  : 'text-red-600 dark:text-red-400'
              }`}
            >
              {dataQuality.overall}
            </span>
            <span className='text-slate-600 dark:text-slate-400 ml-2'>
              • {dataQuality.confidence}% confidence • Sources:{' '}
              {dataQuality.sources.join(', ')}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Main Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'
      >
        {[
          {
            title: 'Total Content',
            value: getMetric('totalContent').toString(),
            icon: <BarChart3 className='h-6 w-6' />,
            gradient: 'from-blue-500 to-cyan-500',
            description: 'Content pieces created',
          },
          {
            title: 'Total Engagement',
            value: getMetric('totalEngagement').toLocaleString(),
            icon: <Heart className='h-6 w-6' />,
            gradient: 'from-pink-500 to-rose-500',
            description: 'Likes, comments, shares',
          },
          {
            title: 'Total Reach',
            value: getMetric('totalReach').toLocaleString(),
            icon: <Eye className='h-6 w-6' />,
            gradient: 'from-purple-500 to-indigo-500',
            description: 'People reached',
          },
          {
            title: 'Engagement Rate',
            value: `${getMetric('engagementRate').toFixed(1)}%`,
            icon: <Target className='h-6 w-6' />,
            gradient: 'from-emerald-500 to-green-500',
            description: 'Average performance',
          },
        ].map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + index * 0.1 }}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className='bg-white/60 dark:bg-slate-800/60 backdrop-blur-lg border border-white/20 dark:border-slate-600/20 rounded-2xl p-6 hover:bg-white/80 dark:hover:bg-slate-800/80 transition-all duration-300 shadow-lg hover:shadow-xl'
          >
            <div className='flex items-start justify-between mb-4'>
              <div
                className={`p-3 rounded-xl bg-gradient-to-r ${stat.gradient} shadow-lg`}
              >
                <div className='text-white'>{stat.icon}</div>
              </div>
            </div>
            <div className='space-y-2'>
              <h3 className='text-slate-600 dark:text-slate-400 text-sm font-medium'>
                {stat.title}
              </h3>
              <p className='text-3xl font-bold text-slate-900 dark:text-slate-100'>
                {stat.value}
              </p>
              <p className='text-xs text-slate-500 dark:text-slate-400'>
                {stat.description}
              </p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Platform Performance */}
      <PlatformPerformance platforms={platformData} isLoading={state.loading} />

      {/* Trending Opportunities */}
      <TrendingOpportunities
        opportunities={opportunities}
        isLoading={state.loading}
      />

      {/* Real-Time Alerts */}
      {alerts.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className='bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-6 text-white shadow-lg'
        >
          <div className='flex items-center gap-3 mb-4'>
            <div className='p-2 bg-white/20 rounded-lg'>
              <Zap className='h-6 w-6' />
            </div>
            <div>
              <h3 className='text-xl font-bold'>Real-Time Alerts</h3>
              <p className='text-white/80 text-sm'>
                Important updates about your content
              </p>
            </div>
          </div>

          <div className='space-y-3'>
            {alerts.slice(0, 5).map((alert, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + index * 0.1 }}
                className='bg-white/10 backdrop-blur-sm rounded-xl p-4'
              >
                <div className='flex items-start justify-between'>
                  <div>
                    <h4 className='font-medium mb-1'>{alert.message}</h4>
                    <p className='text-xs text-white/70'>
                      {new Date(alert.timestamp).toLocaleString()}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      alert.urgency === 'high'
                        ? 'bg-red-500/20 text-red-200'
                        : alert.urgency === 'medium'
                        ? 'bg-yellow-500/20 text-yellow-200'
                        : 'bg-blue-500/20 text-blue-200'
                    }`}
                  >
                    {alert.urgency}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Performance Insights */}
      <PerformanceInsights
        performance={state.performance}
        isLoading={state.loading}
      />

      {/* No Data Fallback */}
      {!platformData.length &&
        !opportunities.length &&
        !alerts.length &&
        !state.performance &&
        !state.engagement &&
        !state.trends && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className='bg-white/60 dark:bg-slate-800/60 backdrop-blur-lg border border-white/20 dark:border-slate-600/20 rounded-2xl p-12 shadow-lg text-center'
          >
            <BarChart3 className='h-16 w-16 text-slate-400 dark:text-slate-500 mx-auto mb-4' />
            <h3 className='text-xl font-bold text-slate-900 dark:text-slate-100 mb-2'>
              Limited Analytics Data
            </h3>
            <p className='text-slate-600 dark:text-slate-400 mb-6'>
              Some analytics features are not available yet. This could be
              because:
            </p>
            <ul className='text-left text-slate-600 dark:text-slate-400 mb-6 max-w-md mx-auto space-y-2'>
              <li>• Content analytics are still being processed</li>
              <li>• Platform integrations need more time to collect data</li>
              <li>• Some analytics services may not be fully configured</li>
            </ul>
            <div className='text-sm text-slate-500 dark:text-slate-400'>
              Showing data from {dataQuality.sources.length} available source
              {dataQuality.sources.length !== 1 ? 's' : ''}
            </div>
          </motion.div>
        )}
    </div>
  );
}
