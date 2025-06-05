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
  platforms?: Platform['id'][];
  scheduledDate?: string;
  scheduledTime?: string;
  tags?: string[];
  priority?: string;
}

export interface CreateContentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ContentFormData) => void;
}
