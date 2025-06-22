'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react';
import { useAuth } from './AuthContext';
import { User } from '@/src/types/auth';
import { Content } from '@/src/types/content';
import {
  profileAPI,
  contentAPI,
  aiAPI,
  analyticsAPI,
  trendsAPI,
} from '@/src/lib/api';
import {
  ComprehensiveAnalyticsResponse,
  DashboardResponse,
  TrendsAnalyticsResponse,
  PerformanceAnalyticsResponse,
  EngagementAnalyticsResponse,
} from '@/src/types/analytics';
import {
  TrendAnalysis,
  TrendPrediction,
  TrendReport,
  Platform,
  Category,
} from '@/src/types/trends';

interface UserStats {
  totalContent: number;
  scheduledContent: number;
  engagementRate: number;
  streak: number;
  lastUpdated: string;
}

interface ExtendedUserData extends User {
  // Add any additional profile fields that might come from the profile API
  bio?: string;
  location?: string;
  website?: string;
  socialLinks?: {
    twitter?: string;
    instagram?: string;
    linkedin?: string;
  };
}

interface AIContentSuggestion {
  id: string;
  title: string;
  description: string;
  tags: string[];
  difficulty?: 'easy' | 'medium' | 'hard';
  estimatedTime?: string;
  trendingScore?: number;
  relevanceScore?: number;
  type?: string;
  suggestedDate?: string;
  trendingTopic?: boolean;
}

interface AnalyticsData {
  overview: ComprehensiveAnalyticsResponse['data'] | null;
  dashboard: DashboardResponse['data'] | null;
  performance: PerformanceAnalyticsResponse['data'] | null;
  engagement: EngagementAnalyticsResponse['data'] | null;
  trends: TrendsAnalyticsResponse['data'] | null;
  lastUpdated: string;
}

interface TrendsData {
  analysis: TrendAnalysis | null;
  predictions: TrendPrediction[];
  historicalData: TrendReport | null;
  platforms: Platform[];
  categories: Category[];
  lastUpdated: string;
}

interface UserDataContextType {
  profileData: ExtendedUserData | null;
  userStats: UserStats | null;
  userContent: Content[] | null;
  aiSuggestions: AIContentSuggestion[] | null;
  analyticsData: AnalyticsData | null;
  trendsData: TrendsData | null;
  loading: boolean;
  error: string | null;
  refreshUserData: () => Promise<void>;
  refreshAISuggestions: () => Promise<void>;
  refreshAnalyticsData: () => Promise<void>;
  refreshTrendsData: () => Promise<void>;
  clearUserData: () => void;
  addContent: (content: Content) => void;
  updateContent: (contentId: string, updates: Partial<Content>) => void;
  removeContent: (contentId: string) => void;
}

const UserDataContext = createContext<UserDataContextType | undefined>(
  undefined
);

// Storage keys
const STORAGE_KEYS = {
  PROFILE_DATA: 'khronos_user_profile',
  USER_STATS: 'khronos_user_stats',
  USER_CONTENT: 'khronos_user_content',
  AI_SUGGESTIONS: 'khronos_ai_suggestions',
  ANALYTICS_DATA: 'khronos_analytics_data',
  TRENDS_DATA: 'khronos_trends_data',
  LAST_FETCH: 'khronos_data_last_fetch',
  AI_LAST_FETCH: 'khronos_ai_last_fetch',
  ANALYTICS_LAST_FETCH: 'khronos_analytics_last_fetch',
  TRENDS_LAST_FETCH: 'khronos_trends_last_fetch',
} as const;

// Cache duration (24 hours for user data, 1 hour for AI suggestions)
const CACHE_DURATION = 24 * 60 * 60 * 1000;
const AI_CACHE_DURATION = 60 * 60 * 1000;

export function UserDataProvider({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated } = useAuth();
  const [profileData, setProfileData] = useState<ExtendedUserData | null>(null);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [userContent, setUserContent] = useState<Content[] | null>(null);
  const [aiSuggestions, setAiSuggestions] = useState<
    AIContentSuggestion[] | null
  >(null);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(
    null
  );
  const [trendsData, setTrendsData] = useState<TrendsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check if cached data is still valid
  const isCacheValid = useCallback(
    (cacheKey: string, duration: number = CACHE_DURATION) => {
      const lastFetch = localStorage.getItem(cacheKey);
      if (!lastFetch) {
        console.log(`📅 Cache: No last fetch timestamp found for ${cacheKey}`);
        return false;
      }

      const lastFetchTime = parseInt(lastFetch, 10);
      const now = Date.now();
      const ageHours =
        Math.round(((now - lastFetchTime) / (1000 * 60 * 60)) * 100) / 100;

      const isValid = now - lastFetchTime < duration;
      console.log(`📅 Cache ${cacheKey}: Age ${ageHours}h, Valid: ${isValid}`);

      return isValid;
    },
    []
  );

  // Load cached data from localStorage
  const loadCachedData = useCallback(() => {
    try {
      if (!isCacheValid(STORAGE_KEYS.LAST_FETCH)) {
        console.log('🗑️ Cache: Clearing expired user data cache');
        localStorage.removeItem(STORAGE_KEYS.PROFILE_DATA);
        localStorage.removeItem(STORAGE_KEYS.USER_STATS);
        localStorage.removeItem(STORAGE_KEYS.USER_CONTENT);
        localStorage.removeItem(STORAGE_KEYS.LAST_FETCH);
        return false;
      }

      const cachedProfile = localStorage.getItem(STORAGE_KEYS.PROFILE_DATA);
      const cachedStats = localStorage.getItem(STORAGE_KEYS.USER_STATS);
      const cachedContent = localStorage.getItem(STORAGE_KEYS.USER_CONTENT);

      if (cachedProfile && cachedStats && cachedContent) {
        console.log(
          '💾 Cache: Loading cached profile, stats, and content data'
        );
        setProfileData(JSON.parse(cachedProfile));
        setUserStats(JSON.parse(cachedStats));
        setUserContent(JSON.parse(cachedContent));
        return true;
      } else {
        console.log(
          '❌ Cache: Missing profile, stats, or content data in cache'
        );
      }
    } catch (error) {
      console.error('Error loading cached user data:', error);
    }
    return false;
  }, [isCacheValid]);

  // Load cached AI suggestions
  const loadCachedAISuggestions = useCallback(() => {
    try {
      if (!isCacheValid(STORAGE_KEYS.AI_LAST_FETCH, AI_CACHE_DURATION)) {
        console.log('🗑️ Cache: Clearing expired AI suggestions cache');
        localStorage.removeItem(STORAGE_KEYS.AI_SUGGESTIONS);
        localStorage.removeItem(STORAGE_KEYS.AI_LAST_FETCH);
        return false;
      }

      const cachedSuggestions = localStorage.getItem(
        STORAGE_KEYS.AI_SUGGESTIONS
      );

      if (cachedSuggestions) {
        console.log('💾 Cache: Loading cached AI suggestions');
        setAiSuggestions(JSON.parse(cachedSuggestions));
        return true;
      }
    } catch (error) {
      console.error('Error loading cached AI suggestions:', error);
    }
    return false;
  }, [isCacheValid]);

  // Save data to localStorage
  const saveToCache = useCallback(
    (profile: ExtendedUserData, stats: UserStats, content: Content[]) => {
      try {
        console.log('💾 UserDataContext: Saving user data to cache...');
        localStorage.setItem(
          STORAGE_KEYS.PROFILE_DATA,
          JSON.stringify(profile)
        );
        localStorage.setItem(STORAGE_KEYS.USER_STATS, JSON.stringify(stats));
        localStorage.setItem(
          STORAGE_KEYS.USER_CONTENT,
          JSON.stringify(content)
        );
        localStorage.setItem(STORAGE_KEYS.LAST_FETCH, Date.now().toString());
        console.log(
          '✅ UserDataContext: User data saved to cache successfully'
        );
      } catch (error) {
        console.error('❌ Error saving user data to cache:', error);
      }
    },
    []
  );

  // Save AI suggestions to cache
  const saveAISuggestionsToCache = useCallback(
    (suggestions: AIContentSuggestion[]) => {
      try {
        console.log('💾 UserDataContext: Saving AI suggestions to cache...');
        localStorage.setItem(
          STORAGE_KEYS.AI_SUGGESTIONS,
          JSON.stringify(suggestions)
        );
        localStorage.setItem(STORAGE_KEYS.AI_LAST_FETCH, Date.now().toString());
        console.log(
          '✅ UserDataContext: AI suggestions saved to cache successfully'
        );
      } catch (error) {
        console.error('❌ Error saving AI suggestions to cache:', error);
      }
    },
    []
  );

  // Calculate real user stats
  const calculateUserStats = useCallback(
    (
      content: {
        status: string;
        likes?: number;
        comments?: number;
        shares?: number;
        views?: number;
        createdAt?: string;
      }[]
    ): UserStats => {
      const scheduled = content.filter(
        (item: { status: string }) => item.status === 'scheduled'
      ).length;

      // Calculate real engagement rate based on content performance
      const published = content.filter(
        (item: { status: string }) => item.status === 'published'
      );
      let engagementRate = 0;
      if (published.length > 0) {
        const totalEngagement = published.reduce(
          (
            sum: number,
            item: { likes?: number; comments?: number; shares?: number }
          ) => {
            return (
              sum +
              (item.likes || 0) +
              (item.comments || 0) +
              (item.shares || 0)
            );
          },
          0
        );
        const totalViews = published.reduce(
          (sum: number, item: { views?: number }) => {
            return sum + (item.views || 1); // Avoid division by zero
          },
          0
        );
        engagementRate = Math.round((totalEngagement / totalViews) * 100);
      }

      // Calculate streak based on content creation frequency
      const sortedContent = content
        .filter((item) => item.createdAt)
        .sort(
          (a, b) =>
            new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()
        );

      let streak = 0;
      const currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0);

      for (const item of sortedContent) {
        const itemDate = new Date(item.createdAt!);
        itemDate.setHours(0, 0, 0, 0);

        const daysDiff = Math.floor(
          (currentDate.getTime() - itemDate.getTime()) / (1000 * 60 * 60 * 24)
        );

        if (daysDiff === streak) {
          streak++;
        } else if (daysDiff > streak) {
          break;
        }
      }

      return {
        totalContent: content.length,
        scheduledContent: scheduled,
        engagementRate: Math.max(0, Math.min(100, engagementRate)),
        streak: streak,
        lastUpdated: new Date().toISOString(),
      };
    },
    []
  );

  // Fetch fresh user data from API
  const fetchUserData = useCallback(async () => {
    if (!user || !isAuthenticated) return;

    console.log('🌐 UserDataContext: Fetching fresh user data from API...');
    setLoading(true);
    setError(null);

    try {
      // Fetch profile and content data in parallel
      const [profileResponse, contentResponse] = await Promise.all([
        profileAPI.getProfile(),
        contentAPI.getUserContent(),
      ]);

      console.log(
        '📡 UserDataContext: User data API fetch completed, processing data...'
      );

      let profile: ExtendedUserData = user; // Fallback to auth user
      if (profileResponse.data?.data) {
        profile = { ...user, ...profileResponse.data.data };
      }

      let stats: UserStats = {
        totalContent: 0,
        scheduledContent: 0,
        engagementRate: 0,
        streak: 0,
        lastUpdated: new Date().toISOString(),
      };

      let content: Content[] = [];
      if (contentResponse.data?.data) {
        content = contentResponse.data.data;
        stats = calculateUserStats(content);
      }

      // Update state
      setProfileData(profile);
      setUserStats(stats);
      setUserContent(content);

      // Save to cache
      saveToCache(profile, stats, content);
    } catch (error) {
      console.error('Failed to fetch user data:', error);
      setError('Failed to load user data');

      // Try to load cached data as fallback
      loadCachedData();
    } finally {
      setLoading(false);
    }
  }, [user, isAuthenticated, calculateUserStats, saveToCache, loadCachedData]);

  // Fetch AI suggestions
  const fetchAISuggestions = useCallback(async () => {
    try {
      console.log('🤖 UserDataContext: Fetching AI suggestions...');
      const response = await aiAPI.getContentFeed();
      console.log('AI API Response:', response.data);

      // Handle the correct response structure
      let suggestions = [];
      if (
        response.data?.data?.suggestions &&
        Array.isArray(response.data.data.suggestions)
      ) {
        suggestions = response.data.data.suggestions;
      } else if (response.data?.data && Array.isArray(response.data.data)) {
        suggestions = response.data.data;
      } else if (Array.isArray(response.data)) {
        suggestions = response.data;
      } else if (
        response.data?.suggestions &&
        Array.isArray(response.data.suggestions)
      ) {
        suggestions = response.data.suggestions;
      } else {
        console.warn('AI suggestions response is not an array:', response.data);
        suggestions = [];
      }

      setAiSuggestions(suggestions);
      saveAISuggestionsToCache(suggestions);
      console.log('✅ UserDataContext: AI suggestions updated');
    } catch (error) {
      console.error('Failed to fetch AI suggestions:', error);
      // Don't throw error for AI suggestions as it's not critical
    }
  }, [saveAISuggestionsToCache]);

  // Public method to refresh user data (for manual refresh)
  const refreshUserData = useCallback(async () => {
    await fetchUserData();
  }, [fetchUserData]);

  // Public method to refresh AI suggestions
  const refreshAISuggestions = useCallback(async () => {
    await fetchAISuggestions();
  }, [fetchAISuggestions]);

  // Fetch analytics data
  const fetchAnalyticsData = useCallback(async () => {
    try {
      console.log('📊 UserDataContext: Fetching analytics data...');
      const results = {
        overview: null as ComprehensiveAnalyticsResponse['data'] | null,
        dashboard: null as DashboardResponse['data'] | null,
        performance: null as PerformanceAnalyticsResponse['data'] | null,
        engagement: null as EngagementAnalyticsResponse['data'] | null,
        trends: null as TrendsAnalyticsResponse['data'] | null,
      };

      const promises = [
        analyticsAPI
          .getOverview()
          .then((res) => {
            if (res.data?.statusCode === '10000' && res.data?.data) {
              results.overview = res.data.data;
            }
          })
          .catch(() => console.log('Overview API unavailable')),

        analyticsAPI
          .getDashboard()
          .then((res) => {
            if (res.data?.statusCode === '10000' && res.data?.data) {
              results.dashboard = res.data.data;
            }
          })
          .catch(() => console.log('Dashboard API unavailable')),

        analyticsAPI
          .getPerformance('month')
          .then((res) => {
            if (res.data?.statusCode === '10000' && res.data?.data) {
              results.performance = res.data.data;
            }
          })
          .catch(() => console.log('Performance API unavailable')),

        analyticsAPI
          .getEngagement()
          .then((res) => {
            if (res.data?.statusCode === '10000' && res.data?.data) {
              results.engagement = res.data.data;
            }
          })
          .catch(() => console.log('Engagement API unavailable')),

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

      const analyticsDataResult: AnalyticsData = {
        ...results,
        lastUpdated: new Date().toISOString(),
      };

      setAnalyticsData(analyticsDataResult);
      localStorage.setItem(
        STORAGE_KEYS.ANALYTICS_DATA,
        JSON.stringify(analyticsDataResult)
      );
      localStorage.setItem(
        STORAGE_KEYS.ANALYTICS_LAST_FETCH,
        Date.now().toString()
      );
      console.log('✅ UserDataContext: Analytics data updated and cached');
    } catch (error) {
      console.error('Failed to fetch analytics data:', error);
    }
  }, []);

  // Fetch trends data
  const fetchTrendsData = useCallback(async () => {
    try {
      console.log('📈 UserDataContext: Fetching trends data...');
      const [platformsResponse, categoriesResponse, trendsResponse] =
        await Promise.all([
          trendsAPI.getPlatforms().catch(() => null),
          trendsAPI.getCategories().catch(() => null),
          trendsAPI.getCurrentTrends({}).catch(() => null),
        ]);

      let platforms: Platform[] = [{ value: 'all', label: 'All Platforms' }];
      let categories: Category[] = [{ value: 'all', label: 'All Categories' }];
      let analysis: TrendAnalysis | null = null;

      if (platformsResponse?.data?.statusCode === '10000') {
        const platformsData = platformsResponse.data?.data?.platforms || [];
        if (Array.isArray(platformsData) && platformsData.length > 0) {
          platforms = [
            { value: 'all', label: 'All Platforms' },
            ...platformsData,
          ];
        }
      }

      if (categoriesResponse?.data?.statusCode === '10000') {
        const categoriesData = categoriesResponse.data?.data?.categories || [];
        if (Array.isArray(categoriesData) && categoriesData.length > 0) {
          categories = [
            { value: 'all', label: 'All Categories' },
            ...categoriesData,
          ];
        }
      }

      if (trendsResponse?.data?.statusCode === '10000') {
        const analysisData = trendsResponse.data?.data?.analysis;
        if (analysisData) {
          const allTrends = [
            ...(analysisData.trendingTopics || []),
            ...(analysisData.emergingTopics || []),
            ...(analysisData.decliningTopics || []),
          ];
          analysis = {
            trends: allTrends,
            summary: {
              totalTrends: allTrends.length,
              averageGrowth:
                allTrends.reduce((acc, trend) => acc + trend.growth, 0) /
                (allTrends.length || 1),
              topCategory:
                allTrends.length > 0 ? allTrends[0].category : 'general',
              topPlatform: allTrends.length > 0 ? allTrends[0].platform : 'all',
              sentimentBreakdown: {
                positive: allTrends.filter((t) => t.sentiment === 'positive')
                  .length,
                negative: allTrends.filter((t) => t.sentiment === 'negative')
                  .length,
                neutral: allTrends.filter((t) => t.sentiment === 'neutral')
                  .length,
              },
            },
            insights: {
              emergingTrends: analysisData.emergingTopics || [],
              decliningTrends: analysisData.decliningTopics || [],
              stableTrends: [],
            },
          };
        }
      }

      const trendsDataResult: TrendsData = {
        analysis,
        predictions: [],
        historicalData: null,
        platforms,
        categories,
        lastUpdated: new Date().toISOString(),
      };

      setTrendsData(trendsDataResult);
      localStorage.setItem(
        STORAGE_KEYS.TRENDS_DATA,
        JSON.stringify(trendsDataResult)
      );
      localStorage.setItem(
        STORAGE_KEYS.TRENDS_LAST_FETCH,
        Date.now().toString()
      );
      console.log('✅ UserDataContext: Trends data updated and cached');
    } catch (error) {
      console.error('Failed to fetch trends data:', error);
    }
  }, []);

  // Public method to refresh analytics data
  const refreshAnalyticsData = useCallback(async () => {
    await fetchAnalyticsData();
  }, [fetchAnalyticsData]);

  // Public method to refresh trends data
  const refreshTrendsData = useCallback(async () => {
    await fetchTrendsData();
  }, [fetchTrendsData]);

  // Helper methods for content management
  const addContent = useCallback(
    (content: Content) => {
      setUserContent((prev) => {
        const newContent = [content, ...(prev || [])];
        // Update stats
        const newStats = calculateUserStats(newContent);
        setUserStats(newStats);
        // Update cache
        if (profileData) {
          saveToCache(profileData, newStats, newContent);
        }
        return newContent;
      });
    },
    [calculateUserStats, profileData, saveToCache]
  );

  const updateContent = useCallback(
    (contentId: string, updates: Partial<Content>) => {
      setUserContent((prev) => {
        if (!prev) return prev;
        const newContent = prev.map((content) =>
          content._id === contentId ? { ...content, ...updates } : content
        );
        // Update stats
        const newStats = calculateUserStats(newContent);
        setUserStats(newStats);
        // Update cache
        if (profileData) {
          saveToCache(profileData, newStats, newContent);
        }
        return newContent;
      });
    },
    [calculateUserStats, profileData, saveToCache]
  );

  const removeContent = useCallback(
    (contentId: string) => {
      setUserContent((prev) => {
        if (!prev) return prev;
        const newContent = prev.filter((content) => content._id !== contentId);
        // Update stats
        const newStats = calculateUserStats(newContent);
        setUserStats(newStats);
        // Update cache
        if (profileData) {
          saveToCache(profileData, newStats, newContent);
        }
        return newContent;
      });
    },
    [calculateUserStats, profileData, saveToCache]
  );

  // Load cached analytics data
  const loadCachedAnalyticsData = useCallback(() => {
    try {
      if (!isCacheValid(STORAGE_KEYS.ANALYTICS_LAST_FETCH, CACHE_DURATION)) {
        console.log('🗑️ Cache: Clearing expired analytics data cache');
        localStorage.removeItem(STORAGE_KEYS.ANALYTICS_DATA);
        localStorage.removeItem(STORAGE_KEYS.ANALYTICS_LAST_FETCH);
        return false;
      }

      const cachedAnalytics = localStorage.getItem(STORAGE_KEYS.ANALYTICS_DATA);

      if (cachedAnalytics) {
        console.log('💾 Cache: Loading cached analytics data');
        setAnalyticsData(JSON.parse(cachedAnalytics));
        return true;
      }
    } catch (error) {
      console.error('Error loading cached analytics data:', error);
    }
    return false;
  }, [isCacheValid]);

  // Load cached trends data
  const loadCachedTrendsData = useCallback(() => {
    try {
      if (!isCacheValid(STORAGE_KEYS.TRENDS_LAST_FETCH, CACHE_DURATION)) {
        console.log('🗑️ Cache: Clearing expired trends data cache');
        localStorage.removeItem(STORAGE_KEYS.TRENDS_DATA);
        localStorage.removeItem(STORAGE_KEYS.TRENDS_LAST_FETCH);
        return false;
      }

      const cachedTrends = localStorage.getItem(STORAGE_KEYS.TRENDS_DATA);

      if (cachedTrends) {
        console.log('💾 Cache: Loading cached trends data');
        setTrendsData(JSON.parse(cachedTrends));
        return true;
      }
    } catch (error) {
      console.error('Error loading cached trends data:', error);
    }
    return false;
  }, [isCacheValid]);

  // Clear all cached data
  const clearUserData = useCallback(() => {
    setProfileData(null);
    setUserStats(null);
    setUserContent(null);
    setAiSuggestions(null);
    setAnalyticsData(null);
    setTrendsData(null);
    setError(null);
    localStorage.removeItem(STORAGE_KEYS.PROFILE_DATA);
    localStorage.removeItem(STORAGE_KEYS.USER_STATS);
    localStorage.removeItem(STORAGE_KEYS.USER_CONTENT);
    localStorage.removeItem(STORAGE_KEYS.AI_SUGGESTIONS);
    localStorage.removeItem(STORAGE_KEYS.ANALYTICS_DATA);
    localStorage.removeItem(STORAGE_KEYS.TRENDS_DATA);
    localStorage.removeItem(STORAGE_KEYS.LAST_FETCH);
    localStorage.removeItem(STORAGE_KEYS.AI_LAST_FETCH);
    localStorage.removeItem(STORAGE_KEYS.ANALYTICS_LAST_FETCH);
    localStorage.removeItem(STORAGE_KEYS.TRENDS_LAST_FETCH);
  }, []);

  // Load data when user authenticates
  useEffect(() => {
    if (isAuthenticated && user) {
      console.log(
        '🔍 UserDataContext: User authenticated, checking for cached data...'
      );

      // First try to load cached user data
      const hasCachedData = loadCachedData();

      // Load cached AI suggestions (independent of user data)
      const hasCachedAI = loadCachedAISuggestions();

      // Load cached analytics data
      const hasCachedAnalytics = loadCachedAnalyticsData();

      // Load cached trends data
      const hasCachedTrends = loadCachedTrendsData();

      if (hasCachedData) {
        console.log(
          '✅ UserDataContext: Using cached user data, no API call needed'
        );
      } else {
        console.log(
          '🌐 UserDataContext: No valid user data cache found, fetching fresh data...'
        );
        fetchUserData();
      }

      if (!hasCachedAI) {
        console.log(
          '🤖 UserDataContext: No valid AI cache found, fetching AI suggestions...'
        );
        fetchAISuggestions();
      }

      if (!hasCachedAnalytics) {
        console.log(
          '📊 UserDataContext: No valid analytics cache found, fetching analytics data...'
        );
        fetchAnalyticsData();
      }

      if (!hasCachedTrends) {
        console.log(
          '📈 UserDataContext: No valid trends cache found, fetching trends data...'
        );
        fetchTrendsData();
      }
    } else {
      // Clear data when user logs out
      clearUserData();
    }
  }, [
    isAuthenticated,
    user,
    loadCachedData,
    loadCachedAISuggestions,
    loadCachedAnalyticsData,
    loadCachedTrendsData,
    fetchUserData,
    fetchAISuggestions,
    fetchAnalyticsData,
    fetchTrendsData,
    clearUserData,
  ]);

  const value: UserDataContextType = {
    profileData,
    userStats,
    userContent,
    aiSuggestions,
    analyticsData,
    trendsData,
    loading,
    error,
    refreshUserData,
    refreshAISuggestions,
    refreshAnalyticsData,
    refreshTrendsData,
    clearUserData,
    addContent,
    updateContent,
    removeContent,
  };

  return (
    <UserDataContext.Provider value={value}>
      {children}
    </UserDataContext.Provider>
  );
}

export function useUserData() {
  const context = useContext(UserDataContext);
  if (context === undefined) {
    throw new Error('useUserData must be used within a UserDataProvider');
  }
  return context;
}
