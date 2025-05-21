import { ContentType } from './content';
import { ContentStatus } from './content';

export interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end?: string;
  contentId?: string;
  type: ContentType;
  status: ContentStatus;
  allDay?: boolean;
  color?: string;
  aiRecommended?: boolean;
}

export type CalendarView = 'month' | 'week' | 'day' | 'agenda';

// src/types/analytics.ts
export interface AnalyticsTimeframe {
  startDate: string;
  endDate: string;
}

export interface ContentPerformance {
  contentId: string;
  title: string;
  views: number;
  engagements: number;
  clicks: number;
  shares: number;
  comments: number;
  conversions: number;
  platform: string;
  publishedDate: string;
}

export interface AudienceInsight {
  category: string;
  value: number;
  trend: 'up' | 'down' | 'stable';
  percentage: number;
}
