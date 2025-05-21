// src/lib/api.ts
import axios from 'axios';
import { Content } from '../types/content';
import { AIChatMessage } from '../types/ai';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1',
  headers: {
    'Content-Type': 'application/json',
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
      // Clear local storage and redirect to login if unauthenticated
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

// Auth API methods
export const authAPI = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),

  register: (name: string, email: string, password: string) =>
    api.post('/auth/register', { name, email, password }),

  forgotPassword: (email: string) =>
    api.post('/auth/forgot-password', { email }),
};

// Content API methods
export const contentAPI = {
  getAll: (filters = {}) => api.get('/content', { params: filters }),

  getById: (id: string) => api.get(`/content/${id}`),

  create: (contentData: Content) => api.post('/content', contentData),

  update: (id: string, contentData: Content) =>
    api.put(`/content/${id}`, contentData),

  delete: (id: string) => api.delete(`/content/${id}`),
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
