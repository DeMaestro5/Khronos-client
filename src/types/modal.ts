import { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  showCloseButton?: boolean;
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
}

export interface Platform {
  id: 'instagram' | 'twitter' | 'facebook' | 'linkedin' | 'youtube' | 'tiktok';
  label: string;
  icon: LucideIcon;
  color: string;
}

export interface Priority {
  id: 'low' | 'medium' | 'high';
  label: string;
  color: string;
}

export interface ContentType {
  id: 'article' | 'video' | 'social' | 'podcast' | 'newsletter' | 'blog_post';
  label: string;
  icon: LucideIcon;
}

export interface ContentFormData {
  title: string;
  description: string;
  contentType: ContentType['id'];
  platforms: Platform['id'][];
  scheduledDate: string;
  scheduledTime: string;
  tags: string[];
  priority: Priority['id'];
  status: 'draft' | 'scheduled' | 'published';
}

export interface ContentItem extends ContentFormData {
  id: number;
  createdAt: string;
}

export interface FormErrors {
  title?: string;
  description?: string;
  contentType?: string;
  platforms?: string; // Changed from Platform['id'][] to string for error messages
  scheduledDate?: string;
  scheduledTime?: string;
  tags?: string[];
  priority?: string;
}

// Type for content returned from API
export interface CreatedContent {
  _id: string;
  userId: string; // Required for ContentData compatibility
  title: string;
  description: string; // Required - removed the ? to make it non-optional
  type: 'article' | 'video' | 'social' | 'podcast' | 'newsletter' | 'blog_post'; // Required with specific types
  status: 'draft' | 'scheduled' | 'published' | 'archived';
  platform: string[];
  tags: string[];
  author: {
    id: string;
    name: string;
    avatar?: string;
    role: string;
  };
  metadata: {
    title: string; // Required
    description: string; // Required
    type:
      | 'article'
      | 'video'
      | 'social'
      | 'podcast'
      | 'newsletter'
      | 'blog_post'; // Required with specific types
    status: 'draft' | 'scheduled' | 'published' | 'archived'; // Required
    platform: string[]; // Required
    tags: string[]; // Required
    scheduledDate?: string;
    category?: string;
    language?: string;
    targetAudience?: string[];
    contentPillars?: string[];
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateContentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (createdContent?: CreatedContent) => void; // Now properly typed
  initialData?: {
    title?: string;
    description?: string;
    tags?: string[];
  } | null;
}
