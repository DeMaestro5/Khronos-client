'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { trendsAPI } from '@/src/lib/api';
import {
  Trend,
  TrendAnalysis,
  TrendPrediction,
  TrendReport,
  Platform,
  Category,
  TrendFilters,
} from '@/src/types/trends';
import PageLoading from '@/src/components/ui/page-loading';

// Import all the new components
import TrendsHeader from '@/src/components/trends/trends-header';
import TrendsSearch from '@/src/components/trends/trends-search';
import TrendsFilters from '@/src/components/trends/trends-filters';
import TrendsSummaryCards from '@/src/components/trends/trends-summary-cards';
import TrendsGrid from '@/src/components/trends/trends-grid';
import TrendsPredictions from '@/src/components/trends/trends-predictions';
import TrendsHistorical from '@/src/components/trends/trends-historical';
import TrendDetailModal from '@/src/components/trends/trend-detail-modal';
import TrendsError from '@/src/components/trends/trends-error';

// Type for API response data
interface AnalysisData {
  trendingTopics?: Trend[];
  emergingTopics?: Trend[];
  decliningTopics?: Trend[];
  recommendations?: string[];
}

const TrendsPage: React.FC = () => {
  const [currentTrends, setCurrentTrends] = useState<TrendAnalysis | null>(
    null
  );
  const [historicalData, setHistoricalData] = useState<TrendReport | null>(
    null
  );
  const [predictions, setPredictions] = useState<TrendPrediction[]>([]);
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<TrendFilters>({
    platform: 'all',
    category: 'all',
    timeRange: 'week',
    sentiment: 'all',
  });
  const [showFilters, setShowFilters] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedTrend, setSelectedTrend] = useState<Trend | null>(null);
  const [showTrendDetail, setShowTrendDetail] = useState(false);
  const [didInitialLoad, setDidInitialLoad] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadTrendsData = useCallback(async () => {
    try {
      setError(null);
      setPredictions([]);
      setIsRefreshing(true);

      const trendsResponse = await trendsAPI.getCurrentTrends({
        platform: filters.platform === 'all' ? undefined : filters.platform,
        category: filters.category === 'all' ? undefined : filters.category,
      });

      if (trendsResponse.data?.statusCode === '10000') {
        const analysisData: AnalysisData = trendsResponse.data?.data?.analysis;

        if (analysisData) {
          const allTrends = [
            ...(analysisData.trendingTopics || []),
            ...(analysisData.emergingTopics || []),
            ...(analysisData.decliningTopics || []),
          ];

          const mappedAnalysis: TrendAnalysis = {
            trends: allTrends,
            summary: {
              totalTrends: allTrends.length,
              averageGrowth: calculateAverageGrowth(allTrends),
              topCategory: findTopCategory(allTrends),
              topPlatform:
                filters.platform === 'all'
                  ? 'All Platforms'
                  : filters.platform || 'All Platforms',
              sentimentBreakdown: calculateSentimentBreakdown(allTrends),
            },
            insights: {
              emergingTrends: analysisData.emergingTopics || [],
              decliningTrends: analysisData.decliningTopics || [],
              stableTrends: analysisData.trendingTopics || [],
            },
          };

          setCurrentTrends(mappedAnalysis);
        } else {
          setCurrentTrends(null);
        }
      } else {
        setCurrentTrends(null);
      }

      // Load historical data if needed
      if (filters.timeRange !== 'today') {
        const days = getDaysFromTimeRange(filters.timeRange || 'week');
        try {
          const historicalResponse = await trendsAPI.getHistoricalTrends(days, {
            platform: filters.platform === 'all' ? undefined : filters.platform,
          });

          if (historicalResponse.data?.statusCode === '10000') {
            setHistoricalData(historicalResponse.data?.data?.report || null);
          } else {
            setHistoricalData(null);
          }
        } catch (historicalErr) {
          console.warn('Failed to load historical data:', historicalErr);
          setHistoricalData(null);
        }
      } else {
        setHistoricalData(null);
      }
    } catch (err: unknown) {
      console.error('Failed to load trends data:', err);
      setError('Failed to load trends data. Please try again.');
    } finally {
      setIsRefreshing(false);
    }
  }, [filters]);

  const loadInitialData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const [platformsResponse, categoriesResponse] = await Promise.all([
        trendsAPI.getPlatforms(),
        trendsAPI.getCategories(),
      ]);

      // Handle platforms
      if (platformsResponse.data?.statusCode === '10000') {
        const platformsData = platformsResponse.data?.data?.platforms || [];
        if (Array.isArray(platformsData) && platformsData.length > 0) {
          setPlatforms([
            { value: 'all', label: 'All Platforms' },
            ...platformsData,
          ]);
        } else {
          setPlatforms([
            { value: 'all', label: 'All Platforms' },
            { value: 'twitter', label: 'Twitter' },
            { value: 'instagram', label: 'Instagram' },
            { value: 'facebook', label: 'Facebook' },
            { value: 'linkedin', label: 'LinkedIn' },
            { value: 'tiktok', label: 'TikTok' },
            { value: 'youtube', label: 'YouTube' },
            { value: 'reddit', label: 'Reddit' },
          ]);
        }
      } else {
        setPlatforms([{ value: 'all', label: 'All Platforms' }]);
      }

      // Handle categories
      if (categoriesResponse.data?.statusCode === '10000') {
        const categoriesData = categoriesResponse.data?.data?.categories || [];
        if (Array.isArray(categoriesData) && categoriesData.length > 0) {
          setCategories([
            { value: 'all', label: 'All Categories' },
            ...categoriesData,
          ]);
        } else {
          setCategories([
            { value: 'all', label: 'All Categories' },
            { value: 'technology', label: 'Technology' },
            { value: 'entertainment', label: 'Entertainment' },
            { value: 'sports', label: 'Sports' },
            { value: 'politics', label: 'Politics' },
            { value: 'business', label: 'Business' },
            { value: 'health', label: 'Health' },
            { value: 'lifestyle', label: 'Lifestyle' },
            { value: 'travel', label: 'Travel' },
            { value: 'food', label: 'Food' },
            { value: 'fashion', label: 'Fashion' },
            { value: 'science', label: 'Science' },
            { value: 'education', label: 'Education' },
            { value: 'finance', label: 'Finance' },
            { value: 'gaming', label: 'Gaming' },
            { value: 'music', label: 'Music' },
            { value: 'general', label: 'General' },
          ]);
        }
      } else {
        setCategories([{ value: 'all', label: 'All Categories' }]);
      }

      await loadTrendsData();
    } catch (err: unknown) {
      console.error('Failed to load initial data:', err);
      setError('Failed to load initial data. Please try again.');

      // Set fallback data
      setPlatforms([
        { value: 'all', label: 'All Platforms' },
        { value: 'twitter', label: 'Twitter' },
        { value: 'instagram', label: 'Instagram' },
        { value: 'facebook', label: 'Facebook' },
        { value: 'linkedin', label: 'LinkedIn' },
        { value: 'tiktok', label: 'TikTok' },
        { value: 'youtube', label: 'YouTube' },
      ]);

      setCategories([
        { value: 'all', label: 'All Categories' },
        { value: 'technology', label: 'Technology' },
        { value: 'entertainment', label: 'Entertainment' },
        { value: 'business', label: 'Business' },
        { value: 'health', label: 'Health' },
        { value: 'lifestyle', label: 'Lifestyle' },
      ]);
    } finally {
      setIsLoading(false);
    }
  }, [loadTrendsData]);

  // Load initial data
  useEffect(() => {
    if (!didInitialLoad) {
      loadInitialData();
      setDidInitialLoad(true);
    }
  }, [didInitialLoad, loadInitialData]);

  // Load data when filters change (but not on first mount)
  useEffect(() => {
    if (didInitialLoad && platforms.length > 0 && categories.length > 0) {
      loadTrendsData();
    }
  }, [
    filters,
    platforms.length,
    categories.length,
    didInitialLoad,
    loadTrendsData,
  ]);

  const calculateAverageGrowth = (trends: Trend[]): number => {
    if (trends.length === 0) return 0;
    const totalGrowth = trends.reduce((sum, trend) => sum + trend.growth, 0);
    return Math.round((totalGrowth / trends.length) * 10) / 10;
  };

  const findTopCategory = (trends: Trend[]): string => {
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

  const calculateSentimentBreakdown = (trends: Trend[]) => {
    const breakdown = { positive: 0, negative: 0, neutral: 0 };
    trends.forEach((trend) => {
      breakdown[trend.sentiment]++;
    });
    return breakdown;
  };

  const getDaysFromTimeRange = (timeRange: string): number => {
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

  const handlePrediction = async (keyword: string) => {
    if (!keyword.trim()) return;
    try {
      setError(null);
      setPredictions([]);
      setIsRefreshing(true);

      const predictionResponse = await trendsAPI.getTrendPrediction(
        keyword.trim(),
        {
          platform: filters.platform === 'all' ? undefined : filters.platform,
        }
      );

      if (predictionResponse.data?.statusCode === '10000') {
        const predictionData = predictionResponse.data?.data?.prediction;
        if (predictionData) {
          setPredictions([predictionData]);
        }
      }
    } catch (err: unknown) {
      console.error('Failed to get prediction:', err);
      setError('Failed to get prediction. Please try again.');
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleRelated = async (keyword: string) => {
    if (!keyword.trim()) return;
    try {
      setError(null);
      setIsRefreshing(true);

      const relatedResponse = await trendsAPI.getRelatedTrends(keyword.trim(), {
        platform: filters.platform === 'all' ? undefined : filters.platform,
      });

      if (relatedResponse.data?.statusCode === '10000') {
        const relatedTrends = relatedResponse.data?.data?.relatedTrends;
        if (relatedTrends && Array.isArray(relatedTrends)) {
          setCurrentTrends((prev) =>
            prev
              ? {
                  ...prev,
                  trends: relatedTrends,
                  summary: {
                    ...prev.summary,
                    totalTrends: relatedTrends.length,
                  },
                }
              : null
          );
        }
      }
    } catch (err: unknown) {
      console.error('Failed to get related trends:', err);
      setError('Failed to get related trends. Please try again.');
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleTrendClick = (trend: Trend) => {
    setSelectedTrend(trend);
    setShowTrendDetail(true);
  };

  if (isLoading) {
    return (
      <PageLoading
        title='Loading Trending Insights'
        subtitle="We're analyzing social media trends and gathering real-time data..."
        contentType='trends'
        showGrid={true}
        gridItems={6}
      />
    );
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50'>
      {/* Header */}
      <TrendsHeader
        onToggleFilters={() => setShowFilters(!showFilters)}
        onRefresh={loadTrendsData}
        isRefreshing={isRefreshing}
      />

      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        {/* Loading Overlay */}
        {isRefreshing && (
          <div className='fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center'>
            <div className='bg-white rounded-2xl p-8 shadow-2xl flex items-center space-x-4'>
              <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600'></div>
              <div className='text-gray-700 font-medium'>
                Updating trends data...
              </div>
            </div>
          </div>
        )}

        {/* Search */}
        <TrendsSearch
          searchKeyword={searchKeyword}
          onSearchChange={setSearchKeyword}
          onSearch={() => handlePrediction(searchKeyword)}
          isRefreshing={isRefreshing}
        />

        {/* Filters */}
        <TrendsFilters
          showFilters={showFilters}
          filters={filters}
          platforms={platforms}
          categories={categories}
          onFilterChange={setFilters}
        />

        {/* Error Display */}
        <TrendsError error={error} />

        {/* Summary Cards */}
        {currentTrends && currentTrends.summary && (
          <TrendsSummaryCards summary={currentTrends.summary} />
        )}

        {/* Trends Grid */}
        {currentTrends && currentTrends.trends && (
          <TrendsGrid
            trends={currentTrends.trends}
            onTrendClick={handleTrendClick}
          />
        )}

        {/* Predictions */}
        <TrendsPredictions predictions={predictions} />

        {/* Historical Data */}
        <TrendsHistorical historicalData={historicalData} />
      </div>

      {/* Trend Detail Modal */}
      <TrendDetailModal
        isOpen={showTrendDetail}
        onClose={() => setShowTrendDetail(false)}
        trend={selectedTrend}
        onGetPrediction={handlePrediction}
        onFindRelated={handleRelated}
      />
    </div>
  );
};

export default TrendsPage;
