// src/lib/api.ts
import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { Content } from '../types/content';
import { AIChatMessage, AIFormFillResponse } from '../types/ai';
import { AuthUtils } from './auth-utils';
import {
  NotificationFilters,
  NotificationSettings,
} from '../types/notification';
import { PartialSettingsUpdate } from '../types/settings';

interface ContentCreateRequest {
  title: string;
  description?: string;
  type: string;
  platform: string[];
  tags?: string[];
  scheduledDate?: string;
}

// Track if we're currently refreshing to avoid multiple refresh attempts
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (error?: unknown) => void;
}> = [];

const processQueue = (error: AxiosError | null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve();
    }
  });

  failedQueue = [];
};

// Create axios instance with base configuration
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000',
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': process.env.NEXT_PUBLIC_API_KEY,
  },
});

// Create separate axios instance for OAuth routes (no API key required)
const oauthApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth token
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Get token from AuthUtils instead of localStorage directly
    const token = AuthUtils.getAccessToken();

    // If token exists, add it to request headers
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for handling errors and automatic token refresh
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // Handle authentication errors
    if (error.response?.status === 401 && originalRequest) {
      // Avoid infinite refresh loops
      if (originalRequest._retry) {
        AuthUtils.clearTokens();
        if (typeof window !== 'undefined') {
          window.location.href = '/auth/login';
        }
        return Promise.reject(error);
      }

      // Don't try to refresh token for login/signup requests
      if (
        originalRequest.url?.includes('/api/v1/login') ||
        originalRequest.url?.includes('/api/v1/signup') ||
        originalRequest.url?.includes('/api/v1/token/refresh-token')
      ) {
        return Promise.reject(error);
      }

      // If we have a refresh token, try to refresh
      const refreshToken = AuthUtils.getRefreshToken();
      if (refreshToken && !isRefreshing) {
        if (isRefreshing) {
          // If already refreshing, queue this request
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then(() => {
              originalRequest.headers.Authorization = `Bearer ${AuthUtils.getAccessToken()}`;
              return api(originalRequest);
            })
            .catch((err) => {
              return Promise.reject(err);
            });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          // Use oauthApi for refresh token (no API key required)
          const refreshResponse = await oauthApi.post(
            '/api/v1/token/refresh-token',
            { refreshToken }
          );

          if (refreshResponse.data?.data?.tokens) {
            const newTokens = refreshResponse.data.data.tokens;
            AuthUtils.storeTokens(newTokens);

            // Update the authorization header
            originalRequest.headers.Authorization = `Bearer ${newTokens.accessToken}`;

            processQueue(null);

            // Retry the original request
            return api(originalRequest);
          } else {
            throw new Error('Invalid refresh response');
          }
        } catch (refreshError) {
          console.error('Token refresh failed:', refreshError);
          processQueue(refreshError as AxiosError);
          AuthUtils.clearTokens();

          // Only redirect to login if we're not already on the login page
          if (
            typeof window !== 'undefined' &&
            !window.location.pathname.includes('/auth/login')
          ) {
            window.location.href = '/auth/login';
          }

          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      } else {
        // No refresh token available, redirect to login
        AuthUtils.clearTokens();
        if (
          typeof window !== 'undefined' &&
          !window.location.pathname.includes('/auth/login')
        ) {
          window.location.href = '/auth/login';
        }
      }
    }

    return Promise.reject(error);
  }
);

// Auth API methods
export const authAPI = {
  login: (email: string, password: string, rememberMe: boolean = false) =>
    api.post('/api/v1/login', { email, password, rememberMe }),

  signup: (name: string, email: string, password: string) => {
    const [firstName, lastName] = name.split(' ');
    return api.post('/api/v1/signup', {
      firstName,
      lastName,
      email,
      password,
      role: 'CONTENT_CREATOR',
    });
  },

  refreshToken: (refreshToken: string) =>
    oauthApi.post('/api/v1/token/refresh-token', { refreshToken }),

  logout: () => {
    const refreshToken = AuthUtils.getRefreshToken();
    if (refreshToken) {
      // Optional: notify server about logout
      api.post('/api/v1/logout', { refreshToken }).catch(() => {
        // Ignore logout errors
      });
    }
    AuthUtils.clearTokens();
  },

  forgotPassword: (email: string) =>
    api.post('/api/v1/forgot-password', { email }),

  resetPassword: (code: string, password: string) =>
    api.post('/api/v1/reset-password', { code, password }),

  // Google Auth endpoints
  googleAuth: {
    // Initiate Google OAuth flow - redirects to backend login route
    initiate: () => {
      const baseUrl =
        process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
      return `${baseUrl}/api/v1/auth/google/login`;
    },

    // Handle Google OAuth callback (no API key required)
    callback: (code: string, state?: string) =>
      oauthApi.get('/api/v1/auth/google/callback', { params: { code, state } }),

    // Get Google auth URL (alternative approach)
    getAuthUrl: () => oauthApi.get('/api/v1/auth/google/url'),

    // Get direct Google OAuth URL with state
    getDirectAuthUrl: (state: string) => {
      const baseUrl =
        process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
      return `${baseUrl}/api/v1/auth/google/login?state=${state}`;
    },
  },
};

// Profile API methods
export const profileAPI = {
  // Get current user profile
  getProfile: () => api.get('/api/v1/profile/my'),

  // Update current user profile
  updateProfile: (data: { name?: string; profilePicUrl?: string }) =>
    api.put('/api/v1/profile', data),

  // Delete current user account
  deleteAccount: () => api.delete('/api/v1/profile'),

  // Verify user email
  verifyEmail: () => api.post('/api/v1/profile/verify-email'),
};

// Content API methods
export const contentAPI = {
  getAll: (filters = {}) => api.get('/api/v1/content', { params: filters }),

  getAllByUser: (userId?: string, filters = {}) => {
    const currentUserId = userId || AuthUtils.getUserId();
    if (!currentUserId) {
      console.warn('No user ID available for content filtering');
      return Promise.resolve({
        data: {
          statusCode: '10000',
          message: 'No user authenticated',
          data: [],
        },
      });
    }
    // Use the correct backend endpoint: /api/v1/content/user/:userId
    return api.get(`/api/v1/content/user/${currentUserId}`, {
      params: filters,
    });
  },

  getUserContent: async (filters = {}) => {
    const userId = AuthUtils.getUserId();
    if (!userId) {
      console.warn('No user ID available for content filtering');
      // Return empty response structure to match expected format
      return Promise.resolve({
        data: {
          statusCode: '10000',
          message: 'No user authenticated',
          data: [],
        },
      });
    }

    // Use the correct backend endpoint: /api/v1/content/user/:userId
    try {
      return await api.get(`/api/v1/content/user/${userId}`, {
        params: filters,
      });
    } catch (error) {
      console.error('Failed to fetch user content:', error);
      // If there's an error, return empty array rather than all content
      return Promise.resolve({
        data: {
          statusCode: '10000',
          message: 'Failed to fetch user content',
          data: [],
        },
      });
    }
  },

  getMyContent: (filters = {}) => {
    return contentAPI.getUserContent(filters);
  },

  getById: (id: string) => api.get(`/api/v1/content/${id}`),

  create: (contentData: ContentCreateRequest) =>
    api.post('/api/v1/content', contentData),

  update: (id: string, contentData: Partial<Content>) =>
    api.put(`/api/v1/content/${id}`, contentData),

  updateSchedule: (
    id: string,
    scheduleData: { scheduledDate: string; priority?: string }
  ) => api.put(`/api/v1/content/${id}/schedule`, scheduleData),

  updatePriority: (id: string, priorityData: { priority: string }) =>
    api.put(`/api/v1/content/${id}/priority`, priorityData),

  delete: (id: string) => api.delete(`/api/v1/content/${id}`),

  archive: (
    id: string,
    archiveData: { reason?: string; preserveCalendarEvents?: boolean }
  ) => api.put(`/api/v1/content/${id}/archive`, archiveData),

  unarchive: (
    id: string,
    unarchiveData: {
      restoreStatus?: 'draft' | 'scheduled' | 'published';
      restoreCalendarEvents?: boolean;
    }
  ) => api.put(`/api/v1/content/${id}/unarchive`, unarchiveData),

  // Get user content by platform
  getUserPlatformContent: async (platform: string) => {
    const userId = AuthUtils.getUserId();
    if (!userId) {
      console.warn('No user ID available for platform content');
      return Promise.resolve({
        data: {
          statusCode: '10000',
          message: 'No user authenticated',
          data: {
            total: 0,
            userPlatformContents: [],
          },
        },
      });
    }

    try {
      return await api.get(`/api/v1/content/user/${userId}/${platform}`);
    } catch (error) {
      console.error(`Failed to fetch user ${platform} content:`, error);
      return Promise.resolve({
        data: {
          statusCode: '10000',
          message: `Failed to fetch user ${platform} content`,
          data: {
            total: 0,
            userPlatformContents: [],
          },
        },
      });
    }
  },

  // Get all user platform content (for platform performance)
  getUserPlatformData: async () => {
    const userId = AuthUtils.getUserId();
    if (!userId) {
      console.warn('No user ID available for platform data');
      return Promise.resolve({
        data: {
          statusCode: '10000',
          message: 'No user authenticated',
          data: {},
        },
      });
    }

    const platforms = [
      'youtube',
      'instagram',
      'linkedin',
      'twitter',
      'facebook',
      'tiktok',
      'medium',
    ];

    try {
      const platformDataPromises = platforms.map(async (platform) => {
        try {
          const response = await api.get(
            `/api/v1/content/user/${userId}/${platform}`
          );
          const data = response.data?.data || {
            total: 0,
            userPlatformContents: [],
          };
          return {
            platform,
            total: data.total || 0,
            contents: data.userPlatformContents || [],
          };
        } catch (error) {
          console.warn(`Failed to fetch ${platform} data:`, error);
          return {
            platform,
            total: 0,
            contents: [],
          };
        }
      });

      const platformResults = await Promise.all(platformDataPromises);

      const platformData = platformResults.reduce((acc, result) => {
        acc[result.platform] = {
          total: result.total,
          contents: result.contents,
        };
        return acc;
      }, {} as Record<string, { total: number; contents: Content[] }>);

      return Promise.resolve({
        data: {
          statusCode: '10000',
          message: 'Platform data retrieved successfully',
          data: platformData,
        },
      });
    } catch (error) {
      console.error('Failed to fetch user platform data:', error);
      return Promise.resolve({
        data: {
          statusCode: '10000',
          message: 'Failed to fetch user platform data',
          data: {},
        },
      });
    }
  },
};

// Calendar API methods
export const calendarAPI = {
  getEvents: (startDate: string, endDate: string) =>
    api.get('/calendar', { params: { startDate, endDate } }),

  scheduleContent: (contentId: string, date: string) =>
    api.post('/calendar/schedule', { contentId, date }),

  rescheduleContent: (eventId: string, newDate: string) =>
    api.put(`/calendar/${eventId}`, { date: newDate }),
};

// AI API methods
export const aiAPI = {
  getContentSuggestions: (topic: string, keywords: string[] = []) =>
    api.get('/ai/suggestions', { params: { topic, keywords } }),

  analyzeContent: (content: string) => api.post('/ai/analyze', { content }),

  chatCompletion: (messages: AIChatMessage[]) =>
    api.post('/chat', { messages }),

  getTrends: (category: string) => api.get('/trends', { params: { category } }),

  // AI form auto-fill endpoint
  getFormFillSuggestions: (): Promise<{ data: AIFormFillResponse }> =>
    api.get('/api/v1/content/ai-suggest/form-fill'),

  // AI content feed suggestions for dashboard
  getContentFeed: () => api.get('/api/v1/content/ai-suggest/feed'),

  // AI-powered content creation endpoint
  createSuggestedContent: (title: string) =>
    api.post('/api/v1/content/ai-suggest/create', { title }),
};

// Analytics API methods
export const analyticsAPI = {
  // Get comprehensive analytics overview (orchestrator)
  getOverview: () => api.get('/api/v1/analytics/overview'),

  // Get real-time dashboard data (orchestrator)
  getDashboard: () => api.get('/api/v1/analytics/dashboard'),

  // Get comprehensive analytics report (orchestrator)
  getComprehensiveReport: (params?: {
    includeCompetitors?: boolean;
    includePredictions?: boolean;
    includeSocialListening?: boolean;
  }) => api.get('/api/v1/analytics/comprehensive-report', { params }),

  // Get performance analytics by period
  getPerformance: (period: 'week' | 'month' | 'quarter' | 'year') =>
    api.get(`/api/v1/analytics/performance/${period}`),

  // Get engagement metrics
  getEngagement: () => api.get('/api/v1/analytics/engagement'),

  // Get audience demographics and insights
  getAudience: () => api.get('/api/v1/analytics/audience'),

  // Get trending content and topics
  getTrends: (params?: { platform?: string }) =>
    api.get('/api/v1/analytics/trends', { params }),

  // Get trending opportunities
  getTrendingOpportunities: (params?: {
    platforms?: string[];
    minScore?: number;
  }) =>
    api.get('/api/v1/analytics/trending-opportunities', {
      params: {
        ...params,
        platforms: params?.platforms?.join(','),
      },
    }),

  // Get analytics for specific content
  getContentAnalytics: (contentId: string) =>
    api.get(`/api/v1/analytics/content/${contentId}`),

  // Get competitor analysis
  getCompetitorAnalysis: (params?: {
    competitors?: string[];
    industry?: string;
  }) =>
    api.get('/api/v1/analytics/competitor-analysis', {
      params: {
        ...params,
        competitors: params?.competitors?.join(','),
      },
    }),

  // Get social listening data
  getSocialListening: (params?: { keywords?: string[]; timeframe?: string }) =>
    api.get('/api/v1/analytics/social-listening', {
      params: {
        ...params,
        keywords: params?.keywords?.join(','),
      },
    }),

  // Get platform status
  getPlatformStatus: () => api.get('/api/v1/analytics/platform-status'),

  // Export analytics data
  exportData: (
    type:
      | 'overview'
      | 'performance'
      | 'audience'
      | 'engagement'
      | 'comprehensive',
    format: 'json' | 'csv' = 'json'
  ) => api.get(`/api/v1/analytics/export/${type}`, { params: { format } }),

  // Configure analytics
  configure: (configuration: Record<string, unknown>) =>
    api.post('/api/v1/analytics/configure', { configuration }),

  // Update platform post IDs
  updatePlatformIds: (
    contentId: string,
    platformPostIds: Record<string, string>
  ) =>
    api.post('/api/v1/analytics/update-platform-ids', {
      contentId,
      platformPostIds,
    }),
};

// AI Chat API methods
export const aiChatAPI = {
  // Start enhanced chat session with content ownership validation
  startSession: (
    title: string,
    contentId: string,
    description?: string,
    templateId?: string
  ) =>
    api.post('/api/v1/chat/start', {
      title,
      description,
      contentId,
      templateId,
    }),

  // Send message with enhanced validation and responses
  sendMessage: (sessionId: string, message: string) =>
    api.post('/api/v1/chat/message', {
      sessionId,
      message,
    }),

  // Get all chat sessions with optional content filtering
  getSessions: (filters?: {
    status?: 'active' | 'archived' | 'completed';
    limit?: number;
    skip?: number;
    contentId?: string;
  }) => api.get('/api/v1/chat/sessions', { params: filters }),

  // Get enhanced session with conversation starters
  getSession: (sessionId: string) =>
    api.get(`/api/v1/chat/sessions/${sessionId}`),

  // Delete a chat session
  deleteSession: (sessionId: string) =>
    api.delete(`/api/v1/chat/sessions/${sessionId}`),

  // Get available chat templates
  getTemplates: (filters?: {
    category?:
      | 'content-optimization'
      | 'content-creation'
      | 'strategy'
      | 'analysis'
      | 'custom';
    limit?: number;
    search?: string;
  }) => api.get('/api/v1/chat/content-templates', { params: filters }),
};

export const notificationAPI = {
  getNotifications: (filters?: NotificationFilters, page = 1, limit = 20) => {
    const params: Record<string, string | number | undefined> = { page, limit };
    if (filters?.type) params.type = filters.type;
    if (filters?.status) params.status = filters.status;
    if (filters?.priority) params.priority = filters.priority;
    return api.get('/api/v1/notifications', { params });
  },
  markAsRead: (notificationId: string) =>
    api.put(`/api/v1/notifications/${notificationId}/read`),
  markAllAsRead: () => api.put('/api/v1/notifications/read-all'),
  getSettings: () => api.get('/api/v1/notifications/settings'),
  updateSettings: (settings: Partial<NotificationSettings>) => {
    if (settings.quietHours) {
      const { start, end } = settings.quietHours;
      if (
        typeof start !== 'string' ||
        typeof end !== 'string' ||
        !/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(start) ||
        !/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(end)
      ) {
        throw new Error(
          'Invalid quietHours format. Use HH:MM format (e.g., "22:00")'
        );
      }
    }
    return api.put('/api/v1/notifications/settings', settings);
  },
};

// Trends API methods
export const trendsAPI = {
  // Get current trending topics
  getCurrentTrends: (params?: { platform?: string; category?: string }) =>
    api.get('/api/v1/trends', { params }),

  // Get trending topics by platform
  getTrendsByPlatform: (platform: string, params?: { category?: string }) =>
    api.get(`/api/v1/trends/${platform}`, { params }),

  // Get trending topics by category
  getTrendsByCategory: (category: string, params?: { platform?: string }) =>
    api.get(`/api/v1/trends/category/${category}`, { params }),

  // Get historical trend data
  getHistoricalTrends: (days: number, params?: { platform?: string }) =>
    api.get(`/api/v1/trends/historical/${days}`, { params }),

  // Get custom trend analysis
  getCustomAnalysis: (data: {
    platform?: string;
    category?: string;
    keywords?: string[];
    timeRange?: { start?: string; end?: string };
  }) => api.post('/api/v1/trends/custom', data),

  // Get trend prediction for a keyword
  getTrendPrediction: (keyword: string, params?: { platform?: string }) =>
    api.get(`/api/v1/trends/predict/${keyword}`, { params }),

  // Get related trends for a keyword
  getRelatedTrends: (keyword: string, params?: { platform?: string }) =>
    api.get(`/api/v1/trends/related/${keyword}`, { params }),

  // Generate comprehensive trend report
  getTrendReport: (platform: string, params?: { days?: number }) =>
    api.get(`/api/v1/trends/report/${platform}`, { params }),

  // Get available platforms
  getPlatforms: () => api.get('/api/v1/trends/platforms'),

  // Get available categories
  getCategories: () => api.get('/api/v1/trends/categories'),
};

export const settingsApi = {
  // Get current user settings
  getSettings: () => api.get('/api/v1/settings'),

  // Update all settings (partial updates supported)
  updateSettings: (settingsData: PartialSettingsUpdate) =>
    api.put('/api/v1/settings', settingsData),

  updateProfile: (profileData: {
    displayName?: string;
    bio?: string;
    location?: string;
    website?: string;
    timezone?: string;
    language?: string;
    dateFormat?: string;
    timeFormat?: string;
  }) => api.put('/api/v1/settings/profile', profileData),

  updateNotifications: (notificationData: {
    email?: {
      enabled?: boolean;
      marketing?: boolean;
      productUpdate?: boolean; // Backend expects "productUpdate" not "productUpdates"
      weeklyDigest?: boolean;
      contentReminders?: boolean;
      security?: boolean;
      updates?: boolean;
      messages?: boolean;
      reminders?: boolean;
      reports?: boolean;
    };

    push?: {
      enabled?: boolean;
      contentPublished?: boolean;
      trendsAlert?: boolean; // Backend expects "trendsAlert" not "trendAlert"
      collaborativeInvites?: boolean;
      security?: boolean;
      updates?: boolean;
      messages?: boolean;
      reminders?: boolean;
      marketing?: boolean;
      reports?: boolean;
    };

    inApp?: {
      enabled?: boolean;
      mentions?: boolean;
      comments?: boolean;
      likes?: boolean;
      security?: boolean;
      updates?: boolean;
      messages?: boolean;
      reminders?: boolean;
      marketing?: boolean;
      reports?: boolean;
    };

    quietHours?: {
      enabled?: boolean;
      startTime?: string;
      endTime?: string;
    };
  }) => api.put('/api/v1/settings/notifications', notificationData),

  updatePrivacy: (privacyData: {
    profileVisibility?: 'public' | 'private' | 'followers';
    showEmail?: boolean;
    showLocation?: boolean;
    allowAnalytics?: boolean;
    dataSharing?: boolean;
  }) => api.put('/api/v1/settings/privacy', privacyData),

  updateContent: (contentData: {
    defaultPlatforms?: string[];
    defaultContentType?: 'article' | 'post' | 'video';
    autoSave?: boolean;
    autoScheduling?: boolean;
    aiSuggestion?: boolean; // Backend expects "aiSuggestion" not "aiSuggestions"
    contentLanguage?: string;
  }) => api.put('/api/v1/settings/content', contentData),

  updateInterface: (interfaceData: {
    theme?: 'light' | 'dark' | 'system';
    sidebarCollapsed?: boolean;
    defaultView?: 'list' | 'grid';
    itemsPerPage?: number;
    enablesAnimation?: boolean; // Backend expects "enablesAnimation" not "enableAnimations"
    compactMode?: boolean;
  }) => api.put('/api/v1/settings/interface', interfaceData),

  resetSettings: () => api.post('/api/v1/settings/reset'),
  exportSettings: () => api.get('/api/v1/settings/export'),
  getDefaults: () => api.get('/api/v1/settings/defaults'),
};

export default api;
