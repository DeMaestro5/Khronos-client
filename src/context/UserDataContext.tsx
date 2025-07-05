'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
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

  // Add ref to track if initial data load has completed for this user
  const initialLoadCompleteRef = useRef<string | null>(null);

  // Add mount/unmount logging
  useEffect(() => {
    console.log('🔧 UserDataProvider: Component mounted');
    return () => {
      console.log('🔧 UserDataProvider: Component unmounting');
    };
  }, []);

  // Check if cached data is still valid
  const isCacheValid = useCallback(
    (cacheKey: string, duration: number = CACHE_DURATION) => {
      const lastFetch = localStorage.getItem(cacheKey);
      if (!lastFetch) {
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
        return false;
      }

      const cachedProfile = localStorage.getItem(STORAGE_KEYS.PROFILE_DATA);
      const cachedStats = localStorage.getItem(STORAGE_KEYS.USER_STATS);
      const cachedContent = localStorage.getItem(STORAGE_KEYS.USER_CONTENT);

      if (cachedProfile && cachedStats && cachedContent) {
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

  // Save data to localStorage
  const saveToCache = useCallback(
    (profile: ExtendedUserData, stats: UserStats, content: Content[]) => {
      try {
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
        localStorage.setItem(
          STORAGE_KEYS.AI_SUGGESTIONS,
          JSON.stringify(suggestions)
        );
        localStorage.setItem(STORAGE_KEYS.AI_LAST_FETCH, Date.now().toString());
      } catch (error) {
        console.error('❌ Error saving AI suggestions to cache:', error);
      }
    },
    []
  );

  // Calculate real user stats using the Content type structure
  const calculateUserStats = useCallback((content: Content[]): UserStats => {
    // Defensive check: ensure content is an array
    if (!Array.isArray(content)) {
      console.warn('calculateUserStats: content is not an array:', content);
      return {
        totalContent: 0,
        scheduledContent: 0,
        engagementRate: 0,
        streak: 0,
        lastUpdated: new Date().toISOString(),
      };
    }

    // Count scheduled content using the ContentStatus enum values
    const scheduled = content.filter(
      (item) =>
        item.status === 'scheduled' || item.metadata?.status === 'scheduled'
    ).length;

    // Calculate engagement rate based on published content
    const published = content.filter(
      (item) =>
        item.status === 'published' || item.metadata?.status === 'published'
    );

    let engagementRate = 0;
    if (published.length > 0) {
      const totalEngagement = published.reduce((sum, item) => {
        // Use engagement object or stats object for metrics
        const engagement = item.engagement;
        const stats = item.stats;
        return (
          sum +
          (engagement?.likes || 0) +
          (engagement?.comments || 0) +
          (engagement?.shares || stats?.shares || 0)
        );
      }, 0);

      const totalViews = published.reduce((sum, item) => {
        const engagement = item.engagement;
        const stats = item.stats;
        return sum + (engagement?.views || stats?.views || 1); // Avoid division by zero
      }, 0);

      engagementRate =
        totalViews > 0 ? Math.round((totalEngagement / totalViews) * 100) : 0;
    }

    // Calculate streak based on content creation frequency
    const sortedContent = content
      .filter((item) => item.createdAt)
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

    let streak = 0;
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    for (const item of sortedContent) {
      const itemDate = new Date(item.createdAt);
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

    console.log('📊 Stats calculated:', {
      total: content.length,
      scheduled,
      published: published.length,
      engagementRate,
      streak,
    });

    return {
      totalContent: content.length,
      scheduledContent: scheduled,
      engagementRate: Math.max(0, Math.min(100, engagementRate)),
      streak: streak,
      lastUpdated: new Date().toISOString(),
    };
  }, []);

  // Fetch fresh user data from API
  const fetchUserData = useCallback(async () => {
    if (!user || !isAuthenticated) return;

    setLoading(true);
    setError(null);

    try {
      // Fetch profile and content data in parallel
      const [profileResponse, contentResponse] = await Promise.all([
        profileAPI.getProfile(),
        contentAPI.getUserContent(),
      ]);

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

      // Handle the contentAPI.getUserContent response structure
      console.log('Content API Response:', contentResponse.data);

      if (contentResponse.data) {
        const apiResponse = contentResponse.data;

        // Check if this matches your API structure: { statusCode: '10000', message: '...', data: {...} }
        if (
          apiResponse.statusCode === '10000' &&
          apiResponse.data !== undefined
        ) {
          const responseData = apiResponse.data;

          if (Array.isArray(responseData)) {
            content = responseData;
            console.log(
              '✅ UserDataContext: Found content array with',
              content.length,
              'items'
            );
          } else if (responseData && typeof responseData === 'object') {
            // Check for contents property (this is the actual structure from your API)
            if (Array.isArray(responseData.contents)) {
              content = responseData.contents;
              console.log(
                '✅ UserDataContext: Found content in contents property with',
                content.length,
                'items'
              );
            } else if (Array.isArray(responseData.content)) {
              content = responseData.content;
              console.log(
                '✅ UserDataContext: Found content in content property with',
                content.length,
                'items'
              );
            } else if (Array.isArray(responseData.items)) {
              content = responseData.items;
              console.log(
                '✅ UserDataContext: Found content in items property with',
                content.length,
                'items'
              );
            } else if (Array.isArray(responseData.results)) {
              content = responseData.results;
              console.log(
                '✅ UserDataContext: Found content in results property with',
                content.length,
                'items'
              );
            } else {
              console.warn(
                '❌ UserDataContext: Could not find content array in response data:',
                responseData
              );
              content = [];
            }
          } else if (responseData === null || responseData === undefined) {
            // Handle null/undefined data (empty result)
            content = [];
            console.log(
              '✅ UserDataContext: API returned null/undefined data, using empty array'
            );
          } else {
            console.warn(
              '❌ UserDataContext: API data is not an array or object:',
              responseData
            );
            content = [];
          }
        } else {
          // Fallback: try to find array in different response structures
          const fallbackData = apiResponse.data || apiResponse;

          if (Array.isArray(fallbackData)) {
            content = fallbackData;
          } else if (fallbackData && typeof fallbackData === 'object') {
            // Check common array property names including 'contents'
            if (Array.isArray(fallbackData.contents)) {
              content = fallbackData.contents;
              console.log(
                '✅ UserDataContext: Found content in fallback contents property with',
                content.length,
                'items'
              );
            } else if (Array.isArray(fallbackData.content)) {
              content = fallbackData.content;
            } else if (Array.isArray(fallbackData.items)) {
              content = fallbackData.items;
            } else if (Array.isArray(fallbackData.results)) {
              content = fallbackData.results;
            } else {
              console.warn(
                '❌ UserDataContext: Could not find content array in fallback response:',
                fallbackData
              );
              content = [];
            }
          } else {
            console.warn(
              '❌ UserDataContext: Unexpected response structure:',
              apiResponse
            );
            content = [];
          }
        }
      } else {
        console.warn('❌ UserDataContext: No data in content response');
        content = [];
      }

      // Calculate stats only if we have content
      if (content.length > 0) {
        stats = calculateUserStats(content);
        console.log(
          '✅ UserDataContext: Calculated stats for',
          content.length,
          'content items'
        );
      } else {
        console.log(
          '✅ UserDataContext: No content found, using default stats'
        );
      }

      // Update state
      setProfileData(profile);
      setUserStats(stats);
      setUserContent(content);

      // Save to cache
      saveToCache(profile, stats, content);

      console.log('✅ UserDataContext: User data updated successfully');
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
      console.log('🤖 Fetching AI suggestions...');
      const response = await aiAPI.getContentFeed();
      console.log('🤖 AI API Response:', response.data);

      // Handle the correct response structure
      let suggestions: AIContentSuggestion[] = [];

      if (response.data) {
        const apiResponse = response.data;

        // Check for standard API response structure
        if (
          apiResponse.statusCode === '10000' &&
          apiResponse.data !== undefined
        ) {
          const responseData = apiResponse.data;

          if (Array.isArray(responseData)) {
            suggestions = responseData;
          } else if (responseData && typeof responseData === 'object') {
            // Check for suggestions in nested object
            if (Array.isArray(responseData.suggestions)) {
              suggestions = responseData.suggestions;
            } else if (Array.isArray(responseData.items)) {
              suggestions = responseData.items;
            } else if (Array.isArray(responseData.feed)) {
              suggestions = responseData.feed;
            } else {
              console.warn(
                '❌ AI suggestions: Could not find suggestions array:',
                responseData
              );
              suggestions = [];
            }
          }
        } else {
          // Fallback for different response structures
          if (Array.isArray(apiResponse.suggestions)) {
            suggestions = apiResponse.suggestions;
          } else if (Array.isArray(apiResponse.data)) {
            suggestions = apiResponse.data;
          } else if (Array.isArray(apiResponse)) {
            suggestions = apiResponse;
          } else {
            console.warn(
              '❌ AI suggestions: Unexpected response structure:',
              apiResponse
            );
            suggestions = [];
          }
        }
      }

      console.log(
        '✅ AI suggestions processed:',
        suggestions.length,
        'suggestions found'
      );
      setAiSuggestions(suggestions);
      saveAISuggestionsToCache(suggestions);
    } catch (error) {
      console.error('❌ Failed to fetch AI suggestions:', error);
      // Don't throw error for AI suggestions as it's not critical
      // Try to load from cache if available
      try {
        const cachedAI = localStorage.getItem(STORAGE_KEYS.AI_SUGGESTIONS);
        if (cachedAI) {
          console.log('💾 Loading AI suggestions from cache as fallback');
          setAiSuggestions(JSON.parse(cachedAI));
        }
      } catch (cacheError) {
        console.error(
          '❌ Failed to load AI suggestions from cache:',
          cacheError
        );
      }
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
        console.log('➕ Adding content:', content._id, content.title);

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
        if (!prev) {
          console.warn('❌ updateContent: No content array to update');
          return prev;
        }

        const newContent = prev.map((content) =>
          content._id === contentId ? { ...content, ...updates } : content
        );

        console.log('✏️ Updating content:', contentId, Object.keys(updates));

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
        if (!prev) {
          console.warn('❌ removeContent: No content array to remove from');
          return prev;
        }

        const newContent = prev.filter((content) => content._id !== contentId);
        console.log('🗑️ Removing content:', contentId);

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

  // Load data when user authenticates - simplified to avoid callback dependency hell
  useEffect(() => {
    if (!isAuthenticated || !user) {
      // Clear data when user logs out
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
      initialLoadCompleteRef.current = null;
      return;
    }

    const currentUserId = (user.id || user._id) as string;

    // Check if we've already loaded data for this user
    if (initialLoadCompleteRef.current === currentUserId) {
      return;
    }

    // Check user data cache validity
    const isUserDataCacheValid = (() => {
      const lastFetch = localStorage.getItem(STORAGE_KEYS.LAST_FETCH);
      if (!lastFetch) return false;

      const lastFetchTime = parseInt(lastFetch, 10);
      const now = Date.now();
      const isValid = now - lastFetchTime < CACHE_DURATION;
      console.log('🔧 Cache Validity Check:', {
        isValid,
        ageMs: now - lastFetchTime,
        maxAge: CACHE_DURATION,
      });
      return isValid;
    })();

    // Check AI cache validity
    const isAICacheValid = (() => {
      const lastFetch = localStorage.getItem(STORAGE_KEYS.AI_LAST_FETCH);
      if (!lastFetch) return false;
      const lastFetchTime = parseInt(lastFetch, 10);
      const now = Date.now();
      return now - lastFetchTime < AI_CACHE_DURATION;
    })();

    // Check analytics cache validity
    const isAnalyticsCacheValid = (() => {
      const lastFetch = localStorage.getItem(STORAGE_KEYS.ANALYTICS_LAST_FETCH);
      if (!lastFetch) return false;
      const lastFetchTime = parseInt(lastFetch, 10);
      const now = Date.now();
      return now - lastFetchTime < CACHE_DURATION;
    })();

    // Check trends cache validity
    const isTrendsCacheValid = (() => {
      const lastFetch = localStorage.getItem(STORAGE_KEYS.TRENDS_LAST_FETCH);
      if (!lastFetch) return false;
      const lastFetchTime = parseInt(lastFetch, 10);
      const now = Date.now();
      return now - lastFetchTime < CACHE_DURATION;
    })();

    // Load user data cache
    if (isUserDataCacheValid) {
      try {
        const cachedProfile = localStorage.getItem(STORAGE_KEYS.PROFILE_DATA);
        const cachedStats = localStorage.getItem(STORAGE_KEYS.USER_STATS);
        const cachedContent = localStorage.getItem(STORAGE_KEYS.USER_CONTENT);

        if (cachedProfile && cachedStats && cachedContent) {
          setProfileData(JSON.parse(cachedProfile));
          setUserStats(JSON.parse(cachedStats));
          setUserContent(JSON.parse(cachedContent));
        } else {
          // Cache invalid, fetch fresh data
          fetchUserData();
        }
      } catch (error) {
        console.error('Error loading cached user data:', error);
        fetchUserData();
      }
    } else {
      // Cache expired or missing, fetch fresh data
      console.log(
        '🌐 UserDataContext: No valid user data cache found, fetching fresh data...'
      );
      fetchUserData();
    }

    // Load AI suggestions cache
    if (isAICacheValid) {
      try {
        const cachedAI = localStorage.getItem(STORAGE_KEYS.AI_SUGGESTIONS);
        if (cachedAI) {
          console.log('💾 Cache: Loading cached AI suggestions');
          setAiSuggestions(JSON.parse(cachedAI));
        } else {
          fetchAISuggestions();
        }
      } catch (error) {
        console.error('Error loading cached AI suggestions:', error);
        fetchAISuggestions();
      }
    } else {
      console.log(
        '🤖 UserDataContext: No valid AI cache found, fetching AI suggestions...'
      );
      fetchAISuggestions();
    }

    // Load analytics cache
    if (isAnalyticsCacheValid) {
      try {
        const cachedAnalytics = localStorage.getItem(
          STORAGE_KEYS.ANALYTICS_DATA
        );
        if (cachedAnalytics) {
          setAnalyticsData(JSON.parse(cachedAnalytics));
        } else {
          fetchAnalyticsData();
        }
      } catch (error) {
        console.error('Error loading cached analytics data:', error);
        fetchAnalyticsData();
      }
    } else {
      fetchAnalyticsData();
    }

    // Load trends cache
    if (isTrendsCacheValid) {
      try {
        const cachedTrends = localStorage.getItem(STORAGE_KEYS.TRENDS_DATA);
        if (cachedTrends) {
          console.log('💾 Cache: Loading cached trends data');
          setTrendsData(JSON.parse(cachedTrends));
        } else {
          fetchTrendsData();
        }
      } catch (error) {
        console.error('Error loading cached trends data:', error);
        fetchTrendsData();
      }
    } else {
      console.log(
        '📈 UserDataContext: No valid trends cache found, fetching trends data...'
      );
      fetchTrendsData();
    }

    // Mark initial load as complete for this user
    initialLoadCompleteRef.current = currentUserId;
  }, [isAuthenticated, user?.id, user?._id]); // Only depend on authentication and user ID

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
