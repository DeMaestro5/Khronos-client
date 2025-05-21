import { ContentType } from './content';

export interface AIContentSuggestion {
  id: string;
  title: string;
  description: string;
  type: ContentType;
  suggestedTags: string[];
  suggestedDate?: string;
  relevanceScore: number;
  trendingTopic?: boolean;
  generatedAt: string;
}

export interface AITrendInsight {
  topic: string;
  score: number;
  growthRate: number;
  relatedKeywords: string[];
  sources: string[];
}

export interface AIChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
}

export interface AIChat {
  id: string;
  title: string;
  messages: AIChatMessage[];
  createdAt: string;
  updatedAt: string;
}
