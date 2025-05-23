import { ReactNode } from 'react';

type LucideIcon = React.ComponentType<{ className?: string }>;

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

export interface ContentType {
  id: 'post' | 'story' | 'video' | 'article';
  label: string;
  icon: LucideIcon;
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

export type FormErrors = Partial<ContentFormData>;

export interface CreateContentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ContentFormData) => void;
}
