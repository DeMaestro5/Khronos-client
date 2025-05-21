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
}

export interface Content {
  id: string;
  title: string;
  description?: string;
  body?: string;
  status: ContentStatus;
  type: ContentType;
  platforms: ContentPlatform[];
  scheduledDate?: string;
  publishedDate?: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  tags: string[];
  attachments?: string[];
  createdAt: string;
  updatedAt: string;
  aiGenerated: boolean;
  aiSuggestions?: {
    title?: string;
    description?: string;
    keywords?: string[];
    improvements?: string[];
  };
}
