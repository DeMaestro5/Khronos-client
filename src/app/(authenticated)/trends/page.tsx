'use client';

import React, { useState, useEffect, useRef } from 'react';
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
import { useUserData } from '@/src/context/UserDataContext';
import toast from 'react-hot-toast';

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
} from '@/src/components/trends';

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

  // Use cached trends data from UserDataContext
  const {
    trendsData,
    loading: userDataLoading,
    refreshTrendsData,
  } = useUserData();
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

  // Add ref to track previous filters to detect actual changes
  const previousFiltersRef = useRef<TrendsFilters | null>(null);

  // Add refs to track ongoing operations and prevent duplicate toasts
  const ongoingFilterOperationRef = useRef<string | null>(null);
  const ongoingRefreshOperationRef = useRef<string | null>(null);
  const activeToastIdsRef = useRef<Set<string>>(new Set());

  // Cleanup function to dismiss all active toasts when component unmounts
  const cleanupToasts = () => {
    activeToastIdsRef.current.forEach((toastId) => {
      toast.dismiss(toastId);
    });
    activeToastIdsRef.current.clear();
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanupToasts();
    };
  }, []);

  // Use cached trends data instead of fetching directly
  useEffect(() => {
    if (userDataLoading) {
      setIsLoading(true);
      return;
    }

    if (trendsData) {
      setCurrentTrends(trendsData.analysis);
      setHistoricalData(trendsData.historicalData);
      setPredictions(trendsData.predictions);
      setPlatforms(trendsData.platforms);
      setCategories(trendsData.categories);
      setIsLoading(false);
      setError(null);
      setDidInitialLoad(true);
    } else {
      // Set fallback data if no cached data
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
      setIsLoading(false);
      setDidInitialLoad(true);
    }
  }, [trendsData, userDataLoading]);

  // Refresh trends data only when filters actually change (not on component remount)
  useEffect(() => {
    // Skip if initial load hasn't completed yet
    if (!didInitialLoad || !refreshTrendsData) {
      return;
    }

    // Check if filters have actually changed
    const previousFilters = previousFiltersRef.current;
    const filtersChanged =
      !previousFilters ||
      JSON.stringify(previousFilters) !== JSON.stringify(filters);

    if (filtersChanged) {
      // Check if there's already an ongoing filter operation
      if (ongoingFilterOperationRef.current) {
        return;
      }

      // Update the ref with current filters
      previousFiltersRef.current = { ...filters };

      setIsRefreshing(true);

      // Create unique operation ID
      const operationId = `filter-${Date.now()}`;
      ongoingFilterOperationRef.current = operationId;

      const toastId = toast.loading(
        <div className='flex items-center space-x-3'>
          <div>
            <p className='font-semibold text-white'>Applying filters</p>
            <p className='text-xs text-blue-100 opacity-90'>
              Please wait while we update your trends...
            </p>
          </div>
        </div>,
        {
          id: `filter-toast-${operationId}`,
          style: {
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '16px',
            padding: '16px 20px',
            boxShadow:
              '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            backdropFilter: 'blur(10px)',
            minWidth: '320px',
            maxWidth: '400px',
          },
          duration: Infinity,
        }
      );

      // Track the toast ID for cleanup
      activeToastIdsRef.current.add(toastId);

      refreshTrendsData()
        .then(() => {
          toast.success(
            <div className='flex items-center space-x-3'>
              <div className='flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center'>
                <svg
                  className='w-5 h-5 text-green-600'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M5 13l4 4L19 7'
                  />
                </svg>
              </div>
              <div>
                <p className='font-semibold text-gray-900'>
                  Filters applied successfully!
                </p>
                <p className='text-xs text-gray-600'>
                  Your trends data has been updated
                </p>
              </div>
            </div>,
            {
              id: toastId,
              duration: 3000,
              style: {
                background: 'linear-gradient(135deg, #d4ffd4 0%, #a8e6a8 100%)',
                color: '#1f2937',
                border: '1px solid #10b981',
                borderRadius: '16px',
                padding: '16px 20px',
                boxShadow:
                  '0 20px 25px -5px rgba(16, 185, 129, 0.1), 0 10px 10px -5px rgba(16, 185, 129, 0.04)',
                minWidth: '320px',
                maxWidth: '400px',
              },
            }
          );
        })
        .catch((error) => {
          console.error('Failed to apply filters:', error);
          toast.error(
            <div className='flex items-center space-x-3'>
              <div className='flex-shrink-0 w-8 h-8 bg-red-100 rounded-full flex items-center justify-center'>
                <svg
                  className='w-5 h-5 text-red-600'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M6 18L18 6M6 6l12 12'
                  />
                </svg>
              </div>
              <div>
                <p className='font-semibold text-gray-900'>
                  Failed to apply filters
                </p>
                <p className='text-xs text-gray-600'>
                  Please try again or check your connection
                </p>
              </div>
            </div>,
            {
              id: toastId,
              duration: 4000,
              style: {
                background: 'linear-gradient(135deg, #ffd4d4 0%, #ffa8a8 100%)',
                color: '#1f2937',
                border: '1px solid #ef4444',
                borderRadius: '16px',
                padding: '16px 20px',
                boxShadow:
                  '0 20px 25px -5px rgba(239, 68, 68, 0.1), 0 10px 10px -5px rgba(239, 68, 68, 0.04)',
                minWidth: '320px',
                maxWidth: '400px',
              },
            }
          );
        })
        .finally(() => {
          setIsRefreshing(false);
          ongoingFilterOperationRef.current = null;
          activeToastIdsRef.current.delete(toastId);
        });
    } else {
      console.log('Trends page: No filter changes detected, skipping refresh');
    }
  }, [filters, didInitialLoad, refreshTrendsData]);

  // Initialize the filters ref when component mounts
  useEffect(() => {
    if (didInitialLoad && !previousFiltersRef.current) {
      previousFiltersRef.current = { ...filters };
    }
  }, [didInitialLoad, filters]);

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
    <div className='min-h-screen bg-theme-primary transition-colors duration-300'>
      <TrendsHeader
        showFilters={showFilters}
        setShowFilters={setShowFilters}
        isRefreshing={isRefreshing}
        onRefresh={async () => {
          // Check if there's already an ongoing refresh operation
          if (ongoingRefreshOperationRef.current) {
            console.log(
              'Trends page: Refresh operation already in progress, skipping'
            );
            return;
          }

          setIsRefreshing(true);

          // Create unique operation ID
          const operationId = `refresh-${Date.now()}`;
          ongoingRefreshOperationRef.current = operationId;

          const toastId = toast.loading(
            <div className='flex items-center space-x-3'>
              <div>
                <p className='font-semibold text-white'>
                  Refreshing trends data
                </p>
                <p className='text-xs text-indigo-100 opacity-90'>
                  Fetching the latest insights for you...
                </p>
              </div>
            </div>,
            {
              id: `refresh-toast-${operationId}`,
              style: {
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '16px',
                padding: '16px 20px',
                boxShadow:
                  '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                backdropFilter: 'blur(10px)',
                minWidth: '320px',
                maxWidth: '400px',
              },
              duration: Infinity,
            }
          );

          // Track the toast ID for cleanup
          activeToastIdsRef.current.add(toastId);

          try {
            await refreshTrendsData();
            toast.success(
              <div className='flex items-center space-x-3'>
                <div className='flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center'>
                  <svg
                    className='w-5 h-5 text-green-600'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15'
                    />
                  </svg>
                </div>
                <div>
                  <p className='font-semibold text-gray-900'>
                    Trends data updated!
                  </p>
                  <p className='text-xs text-gray-600'>
                    All insights are now up to date
                  </p>
                </div>
              </div>,
              {
                id: toastId,
                duration: 3000,
                style: {
                  background:
                    'linear-gradient(135deg, #d4ffd4 0%, #a8e6a8 100%)',
                  color: '#1f2937',
                  border: '1px solid #10b981',
                  borderRadius: '16px',
                  padding: '16px 20px',
                  boxShadow:
                    '0 20px 25px -5px rgba(16, 185, 129, 0.1), 0 10px 10px -5px rgba(16, 185, 129, 0.04)',
                  minWidth: '320px',
                  maxWidth: '400px',
                },
              }
            );
          } catch (error) {
            console.error('Failed to refresh trends data:', error);
            toast.error(
              <div className='flex items-center space-x-3'>
                <div className='flex-shrink-0 w-8 h-8 bg-red-100 rounded-full flex items-center justify-center'>
                  <svg
                    className='w-5 h-5 text-red-600'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z'
                    />
                  </svg>
                </div>
                <div>
                  <p className='font-semibold text-gray-900'>
                    Failed to refresh data
                  </p>
                  <p className='text-xs text-gray-600'>
                    Please check your connection and try again
                  </p>
                </div>
              </div>,
              {
                id: toastId,
                duration: 4000,
                style: {
                  background:
                    'linear-gradient(135deg, #ffd4d4 0%, #ffa8a8 100%)',
                  color: '#1f2937',
                  border: '1px solid #ef4444',
                  borderRadius: '16px',
                  padding: '16px 20px',
                  boxShadow:
                    '0 20px 25px -5px rgba(239, 68, 68, 0.1), 0 10px 10px -5px rgba(239, 68, 68, 0.04)',
                  minWidth: '320px',
                  maxWidth: '400px',
                },
              }
            );
          } finally {
            setIsRefreshing(false);
            ongoingRefreshOperationRef.current = null;
            activeToastIdsRef.current.delete(toastId);
          }
        }}
      />

      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
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
