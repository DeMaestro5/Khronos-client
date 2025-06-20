'use client';

import React, { useState, useEffect } from 'react';
import { trendsAPI } from '@/src/lib/api';
import {
  TrendAnalysis,
  TrendPrediction,
  TrendReport,
  Platform,
  Category,
  TrendsFilters,
  Trend,
} from '@/src/types/trends';
import PageLoading from '@/src/components/ui/page-loading';
import { AlertCircle } from 'lucide-react';

// Import all the new components
import {
  TrendsHeader,
  TrendsSearchBar,
  TrendsFilters as TrendsFiltersComponent,
  TrendsSummaryCards,
  TrendsGrid,
  TrendsPredictions,
  TrendsHistoricalData,
  TrendDetailModal,
  calculateAverageGrowth,
  findTopCategory,
  calculateSentimentBreakdown,
  getDaysFromTimeRange,
} from '@/src/components/trends';

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
  const [filters, setFilters] = useState<TrendsFilters>({
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

  // Load initial data
  useEffect(() => {
    if (!didInitialLoad) {
      loadInitialData();
      setDidInitialLoad(true);
    }
  }, [didInitialLoad]);

  // Load data when filters change (but not on first mount)
  useEffect(() => {
    if (didInitialLoad && platforms.length > 0 && categories.length > 0) {
      loadTrendsData();
    }
  }, [filters, platforms.length, categories.length, didInitialLoad]);

  const loadInitialData = async () => {
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
  };

  const loadTrendsData = async () => {
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

  const handleGetPrediction = (keyword: string) => {
    setSearchKeyword(keyword);
    handlePrediction(keyword);
  };

  const handleFindRelated = (keyword: string) => {
    setSearchKeyword(keyword);
    handleRelated(keyword);
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
    <div className='min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-blue-950 dark:to-indigo-950 transition-colors duration-300'>
      <TrendsHeader
        showFilters={showFilters}
        setShowFilters={setShowFilters}
        isRefreshing={isRefreshing}
        onRefresh={loadTrendsData}
      />

      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        {/* Loading Overlay */}
        {isRefreshing && (
          <div className='fixed inset-0 bg-black/20 dark:bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center'>
            <div className='bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-2xl flex items-center space-x-4 border border-gray-200 dark:border-slate-700'>
              <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 dark:border-blue-400'></div>
              <div className='text-gray-700 dark:text-slate-200 font-medium'>
                Updating trends data...
              </div>
            </div>
          </div>
        )}

        <TrendsSearchBar
          searchKeyword={searchKeyword}
          setSearchKeyword={setSearchKeyword}
          onSearch={handlePrediction}
          isRefreshing={isRefreshing}
        />

        <TrendsFiltersComponent
          showFilters={showFilters}
          filters={filters}
          setFilters={setFilters}
          platforms={platforms}
          categories={categories}
        />

        {/* Error Display */}
        {error && (
          <div className='mb-8 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl'>
            <div className='flex items-center space-x-3'>
              <AlertCircle className='w-5 h-5 text-red-500 dark:text-red-400' />
              <span className='text-red-700 dark:text-red-300 font-medium'>
                {error}
              </span>
            </div>
          </div>
        )}

        <TrendsSummaryCards currentTrends={currentTrends} />

        <TrendsGrid
          currentTrends={currentTrends}
          onTrendClick={handleTrendClick}
        />

        <TrendsPredictions predictions={predictions} />

        <TrendsHistoricalData historicalData={historicalData} />
      </div>

      <TrendDetailModal
        isOpen={showTrendDetail}
        onClose={() => setShowTrendDetail(false)}
        trend={selectedTrend}
        onGetPrediction={handleGetPrediction}
        onFindRelated={handleFindRelated}
      />
    </div>
  );
};

export default TrendsPage;
