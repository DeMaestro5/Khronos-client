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
  color?: string;
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

export interface ContentAttachment {
  name: string;
  type: 'image' | 'document' | 'video' | 'audio';
  size: string;
  url?: string;
}

export interface Content {
  _id: string;
  id?: string; // For backward compatibility
  userId: {
    _id: string;
    name: string;
    email: string;
  };
  metadata: {
    title: string;
    description: string;
    type: string;
    status: string;
    platform: string[];
    tags: string[];
    category?: string;
    language?: string;
    targetAudience?: string[];
    contentPillars?: string[];
    scheduledDate?: string;
    publishedDate?: string;
  };
  title: string;
  description: string;
  excerpt?: string;
  body?: {
    sections: ContentSection[];
    wordCount?: number;
    readingTime?: string;
    summary?: string;
  };
  status: string;
  type: string;
  platform: string[];
  platforms?: ContentPlatform[];
  scheduledDate?: string;
  publishedDate?: string;
  author?: {
    id: string;
    name: string;
    avatar?: string;
    role?: string;
  };
  tags: string[];
  attachments?: ContentAttachment[];
  createdAt: string;
  updatedAt: string;
  aiGenerated?: boolean;
  aiSuggestions?: {
    title?: string;
    description?: string;
    keywords?: string[];
    improvements?: string[];
    hashtags?: string[];
    optimalPostingTimes?: string[];
    estimatedReach?: number;
    competitorAnalysis?: string[];
  };
  engagement?: {
    likes?: number;
    shares?: number;
    comments?: number;
    views?: number;
    saves?: number;
    clicks?: number;
  };
  stats?: {
    views: number;
    engagement: number;
    shares: number;
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
  optimizedContent?: Record<string, string>;
  contentIdeas?: ContentSection[];
}
