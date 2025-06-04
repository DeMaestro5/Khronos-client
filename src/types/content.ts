export enum ContentStatus {
  DRAFT = 'draft',
  SCHEDULED = 'scheduled',
  PUBLISHED = 'published',
  ARCHIVED = 'archived',
}

export enum ContentType {
  BLOG_POST = 'blog_post',
  SOCIAL_POST = 'social_post',
  EMAIL = 'email',
  VIDEO = 'video',
  PODCAST = 'podcast',
  OTHER = 'other',
}

export interface ContentPlatform {
  id: string;
  name: string;
  icon: string;
  color: string;
  _id?: string;
}

export interface ContentSection {
  type: 'heading' | 'paragraph' | 'list' | 'callout' | 'section';
  level?: number;
  content?: string | ContentSection[];
  style?: string;
  title?: string;
  items?: string[];
}

export interface ContentBody {
  sections: ContentSection[];
  wordCount?: number;
  readingTime?: string;
  summary?: string;
}

export interface ContentAuthor {
  id: string;
  name: string;
  avatar?: string;
  role?: string;
}

export interface ContentAttachment {
  name: string;
  type: 'image' | 'document' | 'video' | 'audio';
  size: string;
  url?: string;
}

export interface ContentStats {
  views: number;
  engagement: number;
  shares: number;
  saves?: number;
  clicks?: number;
}

export interface AIContentSuggestions {
  title?: string;
  description?: string;
  keywords?: string[];
  improvements?: string[];
  hashtags?: string[];
  optimalPostingTimes?: string[];
  estimatedReach?: number;
  competitorAnalysis?: string[];
}

export interface ContentIdea {
  title: string;
  description: string;
  excerpt?: string;
  targetAudience?: string;
  keyPoints?: string[];
  callToAction?: string;
  estimatedEngagement?: number;
  difficulty?: 'easy' | 'moderate' | 'advanced';
  timeToCreate?: string;
  trendingScore?: number;
  body?: ContentBody;
}

export interface ContentData {
  _id: string;
  userId: string;
  metadata: {
    title: string;
    description: string;
    type:
      | 'article'
      | 'video'
      | 'social'
      | 'podcast'
      | 'blog_post'
      | 'newsletter';
    status: 'draft' | 'scheduled' | 'published' | 'archived';
    scheduledDate?: string;
    publishedDate?: string;
    platform: string[];
    tags: string[];
    category?: string;
    language?: string;
    targetAudience?: string[];
    contentPillars?: string[];
  };
  title: string;
  description: string;
  excerpt?: string;
  body?: ContentBody;
  type: 'article' | 'video' | 'social' | 'podcast' | 'blog_post' | 'newsletter';
  status: 'draft' | 'scheduled' | 'published' | 'archived';
  platform: string[];
  tags: string[];
  platforms?: ContentPlatform[];
  author?: ContentAuthor;
  attachments?: ContentAttachment[];
  stats?: ContentStats;
  aiSuggestions?: AIContentSuggestions;
  aiGenerated?: boolean;
  contentIdeas?: ContentIdea[];
  optimizedContent?: Record<string, string>;
  recommendations?: ContentIdea[];
  engagement?: {
    likes?: number;
    shares?: number;
    comments?: number;
    views?: number;
    saves?: number;
    clicks?: number;
  };
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
    canonicalUrl?: string;
  };
  scheduling?: {
    timezone?: string;
    optimalTimes?: string[];
    frequency?: 'once' | 'daily' | 'weekly' | 'monthly';
  };
  analytics?: {
    impressions?: number;
    reach?: number;
    clickThroughRate?: number;
    conversionRate?: number;
    engagementRate?: number;
  };
  createdAt: string;
  updatedAt: string;
}

// Type alias for backward compatibility
export type Content = ContentData;
