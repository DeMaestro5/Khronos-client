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

export interface AISuggestionButtonProps {
  onSuggestion: (suggestion: AISuggestionResult) => void;
  contentType?: string;
  platforms?: string[];
  disabled?: boolean;
}

export interface AISuggestionResult {
  title: string;
  description: string;
  tags: string[];
}

export interface AITrendInsight {
  topic: string;
  score: number;
  growthRate: number;
  relatedKeywords: string[];
  sources: string[];
}

export interface AIChatMessage {
  id?: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date | string;
  metadata?: {
    tokens?: number;
    model?: string;
    inappropriate?: boolean;
    severity?: string;
    flagged?: boolean;
  };
  contentId?: string;
}

export interface ChatSession {
  id: string;
  title: string;
  description?: string;
  contentId?: string;
  content?: {
    id: string;
    title: string;
    type: string;
    platform: string;
  } | null;
  messages: AIChatMessage[];
  status: 'active' | 'archived' | 'completed';
  tags?: string[];
  settings?: {
    model?: string;
    temperature?: number;
    maxTokens?: number;
    systemPrompt?: string;
  };
  metadata: {
    totalTokens: number;
    lastActiveAt: Date | string;
  };
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface ConversationStarter {
  type: string;
  prompt: string;
  category: string;
}

export interface ChatUIAction {
  type: 'optimize' | 'ideas' | 'strategy' | 'analyze';
  label: string;
  description: string;
  icon: string;
}

export interface StartSessionResponse {
  session: ChatSession;
  conversationStarters?: ConversationStarter[];
  ui?: {
    actions: ChatUIAction[];
  };
}

export interface SendMessageResponse {
  message: {
    role: 'assistant';
    content: string;
    timestamp: Date | string;
    metadata: {
      tokens?: number;
      model?: string;
      inappropriate?: boolean;
    };
  };
  suggestions?: string[];
  actions?: ChatUIAction[];
  contentInsights?: Record<string, unknown>;
  inappropriateContentDetected?: boolean;
  warningMessage?: string;
  session: {
    id: string;
    totalMessages: number;
    totalTokens: number;
    lastActiveAt: Date | string;
  };
}

export interface GetSessionResponse {
  session: ChatSession;
  conversationStarters?: ConversationStarter[];
  ui?: {
    actions: ChatUIAction[];
  };
}

export interface ContentConversation {
  contentId: string;
  contentTitle: string;
  sessionId?: string;
  messages: AIChatMessage[];
  lastUpdated: Date;
  conversationStarters?: ConversationStarter[];
  actions?: ChatUIAction[];
}

// Backwards compatibility
export interface AIChat {
  id: string;
  title: string;
  messages: AIChatMessage[];
  createdAt: string;
  updatedAt: string;
}

// API response structure for form-fill endpoint
export interface AIFormFillResponse {
  statusCode: string;
  message: string;
  data: {
    suggestion?: {
      id: string;
      title: string;
      description: string;
      category?: string;
      trending?: boolean;
      tags?: string[];
    };
    formData?: {
      title: string;
      description: string;
      tags: string[];
      type?: string;
      platform?: string[];
      contentType?: string;
      platforms?: string[];
    };
    metadata?: {
      autoFillReady: boolean;
      source: string;
      canModify: boolean;
      timestamp: string;
    };
  };
}
