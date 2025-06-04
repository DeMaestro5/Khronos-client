// src/lib/api.ts
import axios from 'axios';
import { Content } from '../types/content';
import { AIChatMessage } from '../types/ai';

interface ContentCreateRequest {
  metadata: {
    title: string;
    description: string;
    type: string;
    status: string;
    platform: string[];
    tags: string[];
    language?: string;
  };
  title: string;
  description: string;
  type: string;
  status: string;
  platform: string[];
  tags: string[];
}

// Create axios instance with base configuration
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000',
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': process.env.NEXT_PUBLIC_API_KEY,
  },
});

// Request interceptor for adding auth token
api.interceptors.request.use(
  (config) => {
    // Get token from local storage
    const token =
      typeof window !== 'undefined' ? localStorage.getItem('token') : null;

    // If token exists, add it to request headers
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle authentication errors
    if (error.response?.status === 401) {
      // Only redirect to login if we're not already on the login page
      // and the error is not from a login attempt
      if (
        typeof window !== 'undefined' &&
        !window.location.pathname.includes('/auth/login') &&
        !error.config.url.includes('/api/v1/login')
      ) {
        localStorage.removeItem('token');
        window.location.href = '/auth/login';
      }
    }

    return Promise.reject(error);
  }
);

// Auth API methods
export const authAPI = {
  login: (email: string, password: string) =>
    api.post('/api/v1/login', { email, password }),

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

  forgotPassword: (email: string) =>
    api.post('/api/v1/forgot-password', { email }),
};

// Content API methods
export const contentAPI = {
  getAll: (filters = {}) => api.get('/api/v1/content', { params: filters }),

  getById: (id: string) => api.get(`/api/v1/content/${id}`),

  create: (contentData: ContentCreateRequest) =>
    api.post('/api/v1/content', contentData),

  update: (id: string, contentData: Content) =>
    api.put(`/api/v1/content/${id}`, contentData),

  delete: (id: string) => api.delete(`/api/v1/content/${id}`),
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
};

// Analytics API methods
export const analyticsAPI = {
  getContentPerformance: (contentId?: string, dateRange?: string) =>
    api.get('/analytics/content', { params: { contentId, dateRange } }),

  getAudienceInsights: () => api.get('/analytics/audience'),

  getOverallStats: (dateRange?: string) =>
    api.get('/analytics/stats', { params: { dateRange } }),
};

export default api;
