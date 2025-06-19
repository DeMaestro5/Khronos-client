'use client';

import React, { useState, useEffect } from 'react';
import { trendsAPI } from '@/src/lib/api';
import {
  Trend,
  TrendAnalysis,
  TrendPrediction,
  TrendReport,
  Platform,
  Category,
  TrendsFilters,
} from '@/src/types/trends';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import PageLoading from '@/src/components/ui/page-loading';

import {
  TrendingUp,
  Search,
  BarChart3,
  Calendar,
  Target,
  Globe,
  Hash,
  TrendingUpIcon,
  TrendingDownIcon,
  Filter as FilterIcon,
  RefreshCw as RefreshCwIcon,
  AlertCircle,
  CheckCircle,
  XCircle,
  Sparkles,
  Minus as MinusIcon,
  Eye,
  Users,
  Activity,
} from 'lucide-react';
import { Modal } from '@/src/components/modal';
import Label from '@/src/components/ui/label';

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

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return <CheckCircle className='w-4 h-4 text-emerald-500' />;
      case 'negative':
        return <XCircle className='w-4 h-4 text-red-500' />;
      default:
        return <MinusIcon className='w-4 h-4 text-gray-500' />;
    }
  };

  const getGrowthIcon = (growth: number) => {
    if (growth > 0) {
      return <TrendingUpIcon className='w-4 h-4 text-emerald-500' />;
    } else if (growth < 0) {
      return <TrendingDownIcon className='w-4 h-4 text-red-500' />;
    } else {
      return <MinusIcon className='w-4 h-4 text-gray-500' />;
    }
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  const formatPercentage = (num: number): string => {
    return `${num > 0 ? '+' : ''}${num.toFixed(1)}%`;
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
      {/* Modern Header */}
      <div className='bg-white/90 backdrop-blur-sm border-b border-gray-200/60 shadow-sm'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-4'>
              <div className='p-3 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-lg'>
                <TrendingUp className='w-7 h-7 text-white' />
              </div>
              <div>
                <h1 className='text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent'>
                  Trends & Analytics
                </h1>
                <p className='text-gray-600 mt-1 font-medium'>
                  Real-time social media insights
                </p>
              </div>
            </div>
            <div className='flex items-center space-x-3'>
              <Button
                variant='outline'
                size='sm'
                onClick={() => setShowFilters(!showFilters)}
                className='flex items-center space-x-2 bg-white/80 backdrop-blur-sm border-gray-200 hover:bg-white hover:shadow-md transition-all duration-200'
              >
                <FilterIcon className='w-4 h-4' />
                <span>Filters</span>
              </Button>
              <Button
                variant='outline'
                size='sm'
                onClick={loadTrendsData}
                disabled={isRefreshing}
                className='flex items-center space-x-2 bg-white/80 backdrop-blur-sm border-gray-200 hover:bg-white hover:shadow-md transition-all duration-200'
              >
                <RefreshCwIcon
                  className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`}
                />
                <span>{isRefreshing ? 'Refreshing...' : 'Refresh'}</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

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

        {/* Enhanced Search Bar */}
        <div className='mb-8'>
          <div className='relative max-w-3xl mx-auto'>
            <div className='absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none z-10'>
              <Search className='h-6 w-6 text-gray-400' />
            </div>
            <Input
              placeholder='Search for trends, keywords, or topics...'
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              onKeyPress={(e) =>
                e.key === 'Enter' &&
                handlePrediction((e.target as HTMLInputElement).value)
              }
              className='pl-16 pr-32 py-5 text-lg text-gray-900 bg-gray-100 border-2 border-gray-200 focus:bg-white focus:ring-4 focus:ring-blue-100 focus:border-blue-500 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 placeholder:text-gray-500'
            />
            <Button
              onClick={() => handlePrediction(searchKeyword)}
              disabled={isRefreshing}
              className='absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 font-semibold'
            >
              <Search
                className={`w-5 h-5 mr-2 ${isRefreshing ? 'animate-spin' : ''}`}
              />
              {isRefreshing ? 'Searching...' : 'Search'}
            </Button>
          </div>
          <div className='mt-4 text-center'>
            <p className='text-sm text-gray-600'>
              Try searching for topics like &quot;AI&quot;, &quot;crypto&quot;,
              or &quot;sports&quot;
            </p>
          </div>
        </div>

        {/* Enhanced Filters */}
        {showFilters && (
          <Card className='mb-8 bg-white/90 backdrop-blur-sm border border-gray-200 shadow-lg'>
            <CardHeader className='pb-4'>
              <CardTitle className='flex items-center space-x-2 text-gray-900'>
                <FilterIcon className='w-5 h-5 text-blue-600' />
                <span>Advanced Filters</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
                <div>
                  <Label
                    htmlFor='platform'
                    className='text-gray-700 font-medium'
                  >
                    Platform
                  </Label>
                  <select
                    id='platform'
                    value={filters.platform}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        platform: e.target.value,
                      }))
                    }
                    className='w-full mt-2 p-3 border border-gray-200 rounded-lg bg-white/80 backdrop-blur-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm'
                  >
                    {platforms.map((platform) => (
                      <option key={platform.value} value={platform.value}>
                        {platform.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label
                    htmlFor='category'
                    className='text-gray-700 font-medium'
                  >
                    Category
                  </Label>
                  <select
                    id='category'
                    value={filters.category}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        category: e.target.value,
                      }))
                    }
                    className='w-full mt-2 p-3 border border-gray-200 rounded-lg bg-white/80 backdrop-blur-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm'
                  >
                    {categories.map((category) => (
                      <option key={category.value} value={category.value}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label
                    htmlFor='timeRange'
                    className='text-gray-700 font-medium'
                  >
                    Time Range
                  </Label>
                  <select
                    id='timeRange'
                    value={filters.timeRange}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        timeRange: e.target.value as
                          | 'today'
                          | 'week'
                          | 'month'
                          | 'quarter'
                          | 'year',
                      }))
                    }
                    className='w-full mt-2 p-3 border border-gray-200 rounded-lg bg-white/80 backdrop-blur-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm'
                  >
                    <option value='today'>Today</option>
                    <option value='week'>This Week</option>
                    <option value='month'>This Month</option>
                    <option value='quarter'>This Quarter</option>
                    <option value='year'>This Year</option>
                  </select>
                </div>
                <div>
                  <Label
                    htmlFor='sentiment'
                    className='text-gray-700 font-medium'
                  >
                    Sentiment
                  </Label>
                  <select
                    id='sentiment'
                    value={filters.sentiment}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        sentiment: e.target.value as
                          | 'positive'
                          | 'negative'
                          | 'neutral',
                      }))
                    }
                    className='w-full mt-2 p-3 border border-gray-200 rounded-lg bg-white/80 backdrop-blur-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm'
                  >
                    <option value='all'>All Sentiments</option>
                    <option value='positive'>Positive</option>
                    <option value='neutral'>Neutral</option>
                    <option value='negative'>Negative</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Error Display */}
        {error && (
          <div className='mb-8 p-4 bg-red-50 border border-red-200 rounded-2xl'>
            <div className='flex items-center space-x-3'>
              <AlertCircle className='w-5 h-5 text-red-500' />
              <span className='text-red-700 font-medium'>{error}</span>
            </div>
          </div>
        )}

        {/* Enhanced Summary Cards */}
        {currentTrends && currentTrends.summary && (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
            <Card className='bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1'>
              <CardContent className='p-6'>
                <div className='flex items-center justify-between'>
                  <div>
                    <p className='text-blue-100 text-sm font-medium mb-1'>
                      Total Trends
                    </p>
                    <p className='text-3xl font-bold'>
                      {currentTrends.summary.totalTrends}
                    </p>
                  </div>
                  <div className='p-3 bg-blue-400/20 rounded-2xl'>
                    <TrendingUp className='w-8 h-8 text-blue-100' />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className='bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1'>
              <CardContent className='p-6'>
                <div className='flex items-center justify-between'>
                  <div>
                    <p className='text-emerald-100 text-sm font-medium mb-1'>
                      Avg Growth
                    </p>
                    <p className='text-3xl font-bold'>
                      {formatPercentage(currentTrends.summary.averageGrowth)}
                    </p>
                  </div>
                  <div className='p-3 bg-emerald-400/20 rounded-2xl'>
                    <BarChart3 className='w-8 h-8 text-emerald-100' />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className='bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1'>
              <CardContent className='p-6'>
                <div className='flex items-center justify-between'>
                  <div>
                    <p className='text-purple-100 text-sm font-medium mb-1'>
                      Top Category
                    </p>
                    <p className='text-xl font-bold capitalize'>
                      {currentTrends.summary.topCategory}
                    </p>
                  </div>
                  <div className='p-3 bg-purple-400/20 rounded-2xl'>
                    <Hash className='w-8 h-8 text-purple-100' />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className='bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1'>
              <CardContent className='p-6'>
                <div className='flex items-center justify-between'>
                  <div>
                    <p className='text-orange-100 text-sm font-medium mb-1'>
                      Top Platform
                    </p>
                    <p className='text-xl font-bold capitalize'>
                      {currentTrends.summary.topPlatform}
                    </p>
                  </div>
                  <div className='p-3 bg-orange-400/20 rounded-2xl'>
                    <Globe className='w-8 h-8 text-orange-100' />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Enhanced Trends Grid */}
        {currentTrends && currentTrends.trends && (
          <div className='mb-8'>
            <div className='flex items-center justify-between mb-6'>
              <h2 className='text-2xl font-bold text-gray-900'>
                Current Trends
              </h2>
              <div className='flex items-center space-x-2 text-sm text-gray-600 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-xl'>
                <Activity className='w-4 h-4' />
                <span>Showing {currentTrends.trends.length} trends</span>
              </div>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
              {currentTrends.trends.map((trend) => (
                <Card
                  key={trend._id}
                  className='bg-white/90 backdrop-blur-sm border border-gray-200 hover:shadow-xl transition-all duration-300 cursor-pointer group transform hover:-translate-y-2'
                  onClick={() => handleTrendClick(trend)}
                >
                  <CardContent className='p-6'>
                    <div className='flex items-start justify-between mb-4'>
                      <div className='flex-1'>
                        <h3 className='font-bold text-gray-900 group-hover:text-blue-600 transition-colors text-lg'>
                          #{trend.keyword}
                        </h3>
                        <p className='text-sm text-gray-600 capitalize mt-1'>
                          {trend.category}
                        </p>
                      </div>
                      <div className='flex items-center space-x-2'>
                        {getSentimentIcon(trend.sentiment)}
                        {getGrowthIcon(trend.growth)}
                      </div>
                    </div>

                    <div className='space-y-4'>
                      <div className='flex items-center justify-between p-3 bg-gray-50 rounded-xl'>
                        <div className='flex items-center space-x-2'>
                          <Users className='w-4 h-4 text-gray-500' />
                          <span className='text-sm text-gray-600'>Volume</span>
                        </div>
                        <span className='font-bold text-gray-900'>
                          {formatNumber(trend.volume)}
                        </span>
                      </div>

                      <div className='flex items-center justify-between p-3 bg-gray-50 rounded-xl'>
                        <div className='flex items-center space-x-2'>
                          <TrendingUp className='w-4 h-4 text-gray-500' />
                          <span className='text-sm text-gray-600'>Growth</span>
                        </div>
                        <span
                          className={`font-bold ${
                            trend.growth > 0
                              ? 'text-emerald-600'
                              : trend.growth < 0
                              ? 'text-red-600'
                              : 'text-gray-600'
                          }`}
                        >
                          {formatPercentage(trend.growth)}
                        </span>
                      </div>

                      <div className='flex items-center justify-between p-3 bg-gray-50 rounded-xl'>
                        <div className='flex items-center space-x-2'>
                          <Globe className='w-4 h-4 text-gray-500' />
                          <span className='text-sm text-gray-600'>
                            Platform
                          </span>
                        </div>
                        <span className='text-sm font-medium text-gray-900 capitalize'>
                          {trend.platform}
                        </span>
                      </div>
                    </div>

                    {trend.relatedTopics && trend.relatedTopics.length > 0 && (
                      <div className='mt-4 pt-4 border-t border-gray-100'>
                        <p className='text-xs text-gray-500 mb-2 font-medium'>
                          Related Topics
                        </p>
                        <div className='flex flex-wrap gap-1'>
                          {trend.relatedTopics
                            .slice(0, 3)
                            .map((topic, index) => (
                              <span
                                key={index}
                                className='px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-medium'
                              >
                                {topic}
                              </span>
                            ))}
                          {trend.relatedTopics.length > 3 && (
                            <span className='px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full font-medium'>
                              +{trend.relatedTopics.length - 3}
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Enhanced No Trends Message */}
        {currentTrends &&
          (!currentTrends.trends || currentTrends.trends.length === 0) && (
            <div className='text-center py-16'>
              <div className='text-gray-400 mb-6'>
                <TrendingUp className='w-20 h-20 mx-auto' />
              </div>
              <h3 className='text-xl font-bold text-gray-900 mb-3'>
                No trends found
              </h3>
              <p className='text-gray-600 max-w-md mx-auto'>
                Try adjusting your filters or search for specific keywords to
                discover trending topics.
              </p>
            </div>
          )}

        {/* Enhanced Predictions */}
        {predictions.length > 0 && (
          <div className='mb-8'>
            <h2 className='text-2xl font-bold text-gray-900 mb-6'>
              AI Predictions
            </h2>
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
              {predictions.map((prediction, index) => (
                <Card
                  key={index}
                  className='bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200 shadow-lg'
                >
                  <CardHeader>
                    <CardTitle className='flex items-center space-x-2'>
                      <div className='p-2 bg-indigo-100 rounded-xl'>
                        <Target className='w-5 h-5 text-indigo-600' />
                      </div>
                      <span className='text-gray-900'>
                        Prediction for &quot;{prediction.keyword}&quot;
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className='space-y-6'>
                      <div className='grid grid-cols-2 gap-4'>
                        <div className='p-4 bg-white rounded-xl shadow-sm'>
                          <p className='text-sm text-gray-600 mb-1'>
                            Predicted Volume
                          </p>
                          <p className='text-lg font-bold text-indigo-600'>
                            {formatNumber(prediction.predictedVolume)}
                          </p>
                        </div>
                        <div className='p-4 bg-white rounded-xl shadow-sm'>
                          <p className='text-sm text-gray-600 mb-1'>
                            Confidence
                          </p>
                          <p className='text-lg font-bold'>
                            {Math.round(prediction.confidence * 100)}%
                          </p>
                        </div>
                      </div>

                      <div className='p-4 bg-white rounded-xl shadow-sm'>
                        <p className='text-sm text-gray-600 mb-2'>
                          Confidence Level
                        </p>
                        <div className='flex items-center space-x-3'>
                          <div className='flex-1 bg-gray-200 rounded-full h-3'>
                            <div
                              className='bg-gradient-to-r from-indigo-500 to-purple-500 h-3 rounded-full transition-all duration-500'
                              style={{
                                width: `${prediction.confidence * 100}%`,
                              }}
                            ></div>
                          </div>
                          <span className='text-sm font-bold text-gray-900'>
                            {Math.round(prediction.confidence * 100)}%
                          </span>
                        </div>
                      </div>

                      {prediction.recommendations &&
                        prediction.recommendations.length > 0 && (
                          <div>
                            <p className='text-sm text-gray-600 mb-3 font-medium'>
                              Recommendations
                            </p>
                            <div className='space-y-2'>
                              {prediction.recommendations.map((rec, idx) => (
                                <div
                                  key={idx}
                                  className='flex items-start space-x-2 p-3 bg-white rounded-lg'
                                >
                                  <Sparkles className='w-4 h-4 text-indigo-500 mt-0.5 flex-shrink-0' />
                                  <p className='text-sm text-gray-700'>{rec}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Enhanced Historical Data */}
        {historicalData && (
          <div className='mb-8'>
            <h2 className='text-2xl font-bold text-gray-900 mb-6'>
              Historical Analysis
            </h2>
            <Card className='bg-white/70 backdrop-blur-sm border-gray-200 shadow-lg'>
              <CardHeader>
                <CardTitle className='flex items-center space-x-2'>
                  <div className='p-2 bg-blue-100 rounded-xl'>
                    <Calendar className='w-5 h-5 text-blue-600' />
                  </div>
                  <span className='text-gray-900'>
                    {historicalData.period?.days} Day Analysis for{' '}
                    {historicalData.platform}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className='space-y-8'>
                  {historicalData.insights &&
                    historicalData.insights.length > 0 && (
                      <div>
                        <h4 className='font-bold text-gray-900 mb-4 flex items-center space-x-2'>
                          <Eye className='w-5 h-5 text-blue-600' />
                          <span>Key Insights</span>
                        </h4>
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                          {historicalData.insights.map((insight, index) => (
                            <div
                              key={index}
                              className='p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100'
                            >
                              <p className='text-sm text-gray-700'>{insight}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                  {historicalData.recommendations &&
                    historicalData.recommendations.length > 0 && (
                      <div>
                        <h4 className='font-bold text-gray-900 mb-4 flex items-center space-x-2'>
                          <Sparkles className='w-5 h-5 text-purple-600' />
                          <span>Recommendations</span>
                        </h4>
                        <div className='space-y-3'>
                          {historicalData.recommendations.map(
                            (recommendation, index) => (
                              <div
                                key={index}
                                className='flex items-start space-x-3 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-100'
                              >
                                <div className='p-1 bg-purple-100 rounded-full'>
                                  <Sparkles className='w-4 h-4 text-purple-600' />
                                </div>
                                <p className='text-sm text-gray-700'>
                                  {recommendation}
                                </p>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Enhanced Trend Detail Modal */}
      <Modal
        isOpen={showTrendDetail}
        onClose={() => setShowTrendDetail(false)}
        title={`Trend Details: #${selectedTrend?.keyword}`}
      >
        {selectedTrend && (
          <div className='space-y-6'>
            <div className='grid grid-cols-2 gap-4'>
              <div className='p-4 bg-blue-50 rounded-xl'>
                <p className='text-sm text-gray-600 mb-1'>Volume</p>
                <p className='text-2xl font-bold text-blue-600'>
                  {formatNumber(selectedTrend.volume)}
                </p>
              </div>
              <div className='p-4 bg-emerald-50 rounded-xl'>
                <p className='text-sm text-gray-600 mb-1'>Growth</p>
                <p
                  className={`text-2xl font-bold ${
                    selectedTrend.growth > 0
                      ? 'text-emerald-600'
                      : selectedTrend.growth < 0
                      ? 'text-red-600'
                      : 'text-gray-600'
                  }`}
                >
                  {formatPercentage(selectedTrend.growth)}
                </p>
              </div>
              <div className='p-4 bg-purple-50 rounded-xl'>
                <p className='text-sm text-gray-600 mb-1'>Platform</p>
                <p className='text-lg font-bold text-purple-600 capitalize'>
                  {selectedTrend.platform}
                </p>
              </div>
              <div className='p-4 bg-orange-50 rounded-xl'>
                <p className='text-sm text-gray-600 mb-1'>Category</p>
                <p className='text-lg font-bold text-orange-600 capitalize'>
                  {selectedTrend.category}
                </p>
              </div>
            </div>

            <div className='p-4 bg-gray-50 rounded-xl'>
              <p className='text-sm text-gray-600 mb-2'>Sentiment</p>
              <div className='flex items-center space-x-2'>
                {getSentimentIcon(selectedTrend.sentiment)}
                <span className='capitalize font-bold text-gray-900'>
                  {selectedTrend.sentiment}
                </span>
              </div>
            </div>

            {selectedTrend.relatedTopics &&
              selectedTrend.relatedTopics.length > 0 && (
                <div className='p-4 bg-indigo-50 rounded-xl'>
                  <p className='text-sm text-gray-600 mb-3 font-medium'>
                    Related Topics
                  </p>
                  <div className='flex flex-wrap gap-2'>
                    {selectedTrend.relatedTopics.map((topic, index) => (
                      <span
                        key={index}
                        className='px-3 py-1 bg-indigo-100 text-indigo-800 text-sm rounded-full font-medium'
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>
              )}

            <div className='flex space-x-3'>
              <Button
                variant='outline'
                onClick={() => {
                  setSearchKeyword(selectedTrend.keyword);
                  setShowTrendDetail(false);
                  handlePrediction(selectedTrend.keyword);
                }}
                className='flex-1 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 hover:from-blue-100 hover:to-indigo-100'
              >
                <Target className='w-4 h-4 mr-2' />
                Get Prediction
              </Button>
              <Button
                variant='outline'
                onClick={() => {
                  setSearchKeyword(selectedTrend.keyword);
                  setShowTrendDetail(false);
                  handleRelated(selectedTrend.keyword);
                }}
                className='flex-1 bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200 hover:from-purple-100 hover:to-pink-100'
              >
                <Hash className='w-4 h-4 mr-2' />
                Find Related
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default TrendsPage;
