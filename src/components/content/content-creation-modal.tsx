import React, { useState, useEffect, useCallback } from 'react';
import { CreateContentModalProps, CreatedContent } from '../../types/modal';
import {
  ContentFormData,
  FormErrors,
  ContentType,
  Platform,
  Priority,
} from '../../types/modal';
import {
  FileText,
  Video,
  Instagram,
  Twitter,
  Facebook,
  Linkedin,
  Youtube,
  Hash,
  Tag,
  X,
  Mail,
  Podcast,
  Share,
} from 'lucide-react';
import { Modal } from '../modal';
import AISuggestionButton from '../ai/ai-suggestion-button';
import { contentAPI } from '../../lib/api';
import toast from 'react-hot-toast';
import { AxiosResponse } from 'axios';

interface AISuggestionResult {
  title: string;
  description: string;
  tags: string[];
}

interface ContentCreateRequest {
  title: string;
  description?: string;
  type: string;
  platform: string[];
  tags?: string[];
  scheduledDate?: string;
}

interface ContentResponseData {
  _id?: string;
  title?: string;
  description?: string;
  type?: string;
  platform?: string[];
  tags?: string[];
  status?: string;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: unknown;
}

interface APIResponseData {
  content?: ContentResponseData;
  [key: string]: unknown;
}

interface APIResponse {
  statusCode?: string;
  success?: boolean;
  message?: string;
  data?: APIResponseData;
  content?: ContentResponseData;
}

// Simple Animated Loading Toast Component
interface SimpleAnimatedToastProps {
  onClose?: () => void;
}

const SimpleAnimatedToast: React.FC<SimpleAnimatedToastProps> = ({
  onClose,
}) => {
  const [dotCount, setDotCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setDotCount((prev) => (prev + 1) % 4);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className='bg-theme-card rounded-xl shadow-theme-lg border border-theme-primary p-4 flex items-center space-x-3 min-w-[280px]'>
      {/* Simple rotating spinner */}
      <div className='relative'>
        <div className='w-6 h-6 border-2 border-accent-primary/20 border-t-accent-primary rounded-full animate-spin' />
        <div className='absolute inset-0 w-6 h-6 border border-accent-primary/30 rounded-full animate-ping opacity-30' />
      </div>

      {/* Simple text with animated dots */}
      <div className='flex-1'>
        <p className='text-sm font-medium text-theme-primary'>
          Creating content{'.'.repeat(dotCount + 1)}
        </p>
        <p className='text-xs text-theme-secondary'>
          This will just take a moment
        </p>
      </div>

      {/* Simple close button */}
      {onClose && (
        <button
          onClick={onClose}
          className='text-theme-secondary hover:text-theme-primary transition-colors p-1'
        >
          <X className='w-4 h-4' />
        </button>
      )}
    </div>
  );
};

export default function CreateContentModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}: CreateContentModalProps) {
  const [formData, setFormData] = useState<ContentFormData>({
    title: '',
    description: '',
    contentType: 'article',
    platforms: [],
    scheduledDate: '',
    scheduledTime: '',
    tags: [],
    priority: 'medium',
    status: 'draft',
  });

  const [newTag, setNewTag] = useState<string>('');
  const [errors, setErrors] = useState<FormErrors>({});

  const resetForm = useCallback(() => {
    const newFormData: ContentFormData = {
      title: initialData?.title || '',
      description: initialData?.description || '',
      contentType: 'article',
      platforms: [],
      scheduledDate: '',
      scheduledTime: '',
      tags: initialData?.tags || [],
      priority: 'medium',
      status: 'draft',
    };
    setFormData(newFormData);
    setErrors({});
    setNewTag('');
  }, [initialData]);

  // Reset form when modal opens or closes
  useEffect(() => {
    if (isOpen) {
      resetForm();
    } else {
      resetForm();
    }
  }, [isOpen, resetForm]);

  // AI Suggestion Handler
  const handleAISuggestion = (suggestion: AISuggestionResult) => {
    if (!suggestion || typeof suggestion !== 'object') {
      toast.error('Invalid AI suggestion received');
      return;
    }

    const { title, description, tags } = suggestion;

    setFormData((prev) => ({
      ...prev,
      title: title || prev.title,
      description: description || prev.description,
      tags: [
        ...prev.tags,
        ...(Array.isArray(tags)
          ? tags.filter((tag) => tag && !prev.tags.includes(tag))
          : []),
      ],
    }));

    // Clear any existing errors for the fields we just populated
    setErrors((prev) => ({
      ...prev,
      title: undefined,
      description: undefined,
    }));
  };

  const contentTypes: ContentType[] = [
    { id: 'article', label: 'Article', icon: FileText },
    { id: 'blog_post', label: 'Blog Post', icon: FileText },
    { id: 'video', label: 'Video', icon: Video },
    { id: 'social', label: 'Social Post', icon: Share },
    { id: 'podcast', label: 'Podcast', icon: Podcast },
    { id: 'newsletter', label: 'Newsletter', icon: Mail },
  ];

  const platforms: Platform[] = [
    {
      id: 'instagram',
      label: 'Instagram',
      icon: Instagram,
      color: 'from-pink-500 to-purple-500',
    },
    {
      id: 'twitter',
      label: 'Twitter',
      icon: Twitter,
      color: 'from-blue-400 to-blue-600',
    },
    {
      id: 'facebook',
      label: 'Facebook',
      icon: Facebook,
      color: 'from-blue-600 to-blue-800',
    },
    {
      id: 'linkedin',
      label: 'LinkedIn',
      icon: Linkedin,
      color: 'from-blue-700 to-blue-900',
    },
    {
      id: 'youtube',
      label: 'YouTube',
      icon: Youtube,
      color: 'from-red-500 to-red-700',
    },
    {
      id: 'tiktok',
      label: 'TikTok',
      icon: Hash,
      color: 'from-gray-800 to-black',
    },
  ];

  const priorities: Priority[] = [
    { id: 'low', label: 'Low', color: 'bg-green-500' },
    { id: 'medium', label: 'Medium', color: 'bg-yellow-500' },
    { id: 'high', label: 'High', color: 'bg-red-500' },
  ];

  const handleInputChange = (
    field: keyof ContentFormData,
    value: string | string[]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (field in errors) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handlePlatformToggle = (platformId: Platform['id']) => {
    setFormData((prev) => ({
      ...prev,
      platforms: prev.platforms.includes(platformId)
        ? prev.platforms.filter((p) => p !== platformId)
        : [...prev.platforms, platformId],
    }));
  };

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()],
      }));
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && (e.target as HTMLInputElement).name === 'newTag') {
      e.preventDefault();
      handleAddTag();
    }
  };

  // Add the missing validateForm function
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (formData.platforms.length === 0) {
      newErrors.platforms = 'Please select at least one platform';
    }

    // Validate scheduled date is not in the past
    if (formData.scheduledDate) {
      const today = new Date();
      const scheduledDate = new Date(formData.scheduledDate);

      // Set time to beginning of day for accurate comparison
      today.setHours(0, 0, 0, 0);
      scheduledDate.setHours(0, 0, 0, 0);

      if (scheduledDate < today) {
        newErrors.scheduledDate = 'Cannot schedule content for past dates';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Close the modal immediately when creation starts
    onClose();

    // Show simple animated loading toast
    const loadingToastId = toast.custom(
      (t) => <SimpleAnimatedToast onClose={() => toast.dismiss(t.id)} />,
      {
        duration: Infinity, // Persist until dismissed
        position: 'top-center',
      }
    );

    try {
      // Prepare the payload for API - matching the exact structure the API expects
      const newContentPayload: ContentCreateRequest = {
        title: formData.title.trim(),
        type: formData.contentType, // API expects 'type', not 'contentType'
        platform: formData.platforms, // API expects 'platform', not 'platforms'
        description: formData.description?.trim() || undefined,
        tags:
          formData.tags.length > 0
            ? formData.tags.filter((tag) => tag.trim())
            : undefined,
      };

      // Add scheduled date if provided
      if (formData.scheduledDate && formData.scheduledTime) {
        const scheduledDateTime = `${formData.scheduledDate}T${formData.scheduledTime}:00.000Z`;
        newContentPayload.scheduledDate = scheduledDateTime;
      }

      // Call the API directly from the modal
      const response: AxiosResponse<APIResponse> = await contentAPI.create(
        newContentPayload
      );

      // Fixed response checking - properly access properties from response.data
      const isSuccessful =
        response?.data?.statusCode === '10000' ||
        response?.status === 200 ||
        response?.status === 201 ||
        response?.data?.success === true ||
        (response?.data && Object.keys(response.data).length > 0);

      if (isSuccessful) {
        // Dismiss the loading toast
        toast.dismiss(loadingToastId);

        // Determine if content was scheduled
        const hasScheduledDate = !!(
          formData.scheduledDate && formData.scheduledTime
        );

        // Show simple success toast
        if (hasScheduledDate) {
          toast.custom(
            (t) => (
              <div className='bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-xl p-4 flex items-center space-x-3 min-w-[280px]'>
                <div className='w-6 h-6 bg-green-500 rounded-full flex items-center justify-center animate-bounce'>
                  <svg
                    className='w-4 h-4 text-white'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M5 13l4 4L19 7'
                    />
                  </svg>
                </div>
                <div className='flex-1'>
                  <p className='text-sm font-medium text-green-900 dark:text-green-100'>
                    Content scheduled!
                  </p>
                  <p className='text-xs text-green-700 dark:text-green-300'>
                    Check your calendar
                  </p>
                </div>
                <button
                  onClick={() => toast.dismiss(t.id)}
                  className='text-green-500 hover:text-green-700'
                >
                  <X className='w-4 h-4' />
                </button>
              </div>
            ),
            { duration: 5000, position: 'top-center' }
          );
        } else {
          toast.custom(
            (t) => (
              <div className='bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-700 rounded-xl p-4 flex items-center space-x-3 min-w-[280px]'>
                <div className='w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center animate-bounce'>
                  <svg
                    className='w-4 h-4 text-white'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M5 13l4 4L19 7'
                    />
                  </svg>
                </div>
                <div className='flex-1'>
                  <p className='text-sm font-medium text-purple-900 dark:text-purple-100'>
                    Content created!
                  </p>
                  <p className='text-xs text-purple-700 dark:text-purple-300'>
                    Saved as draft
                  </p>
                </div>
                <button
                  onClick={() => toast.dismiss(t.id)}
                  className='text-purple-500 hover:text-purple-700'
                >
                  <X className='w-4 h-4' />
                </button>
              </div>
            ),
            { duration: 5000, position: 'top-center' }
          );
        }

        // Call the parent callback with the created content data
        // Try multiple possible response structures
        let createdContentData = null;
        if (response.data?.data?.content) {
          createdContentData = response.data.data.content;
        } else if (response.data?.content) {
          createdContentData = response.data.content;
        } else if (response.data) {
          createdContentData = response.data;
        }

        if (createdContentData && onSubmit) {
          onSubmit(createdContentData as CreatedContent);
        } else if (onSubmit) {
          // Still call onSubmit even if we don't have the exact content data
          // This ensures confetti still triggers
          onSubmit();
        }
      } else {
        throw new Error(response.data?.message || 'Failed to create content');
      }
    } catch (error: unknown) {
      // Dismiss the loading toast
      toast.dismiss(loadingToastId);

      // Show error message
      let errorMessage = 'Failed to create content. Please try again.';

      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (
        typeof error === 'object' &&
        error !== null &&
        'response' in error
      ) {
        const axiosError = error as {
          response?: { data?: { message?: string } };
        };
        errorMessage = axiosError.response?.data?.message || errorMessage;
      }

      toast.custom(
        (t) => (
          <div className='bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-xl p-4 flex items-center space-x-3 min-w-[280px]'>
            <div className='w-6 h-6 bg-red-500 rounded-full flex items-center justify-center animate-pulse'>
              <svg
                className='w-4 h-4 text-white'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M6 18L18 6M6 6l12 12'
                />
              </svg>
            </div>
            <div className='flex-1'>
              <p className='text-sm font-medium text-red-900 dark:text-red-100'>
                Creation failed
              </p>
              <p className='text-xs text-red-700 dark:text-red-300'>
                {errorMessage}
              </p>
            </div>
            <button
              onClick={() => toast.dismiss(t.id)}
              className='text-red-500 hover:text-red-700'
            >
              <X className='w-4 h-4' />
            </button>
          </div>
        ),
        { duration: 6000, position: 'top-center' }
      );
    }
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title='Create New Content'
        size='lg'
      >
        <div className='p-4 sm:p-6 space-y-4 sm:space-y-6'>
          {/* Title and Description */}
          <div className='grid grid-cols-1 gap-4 sm:gap-6'>
            <div>
              <label className='block text-sm font-medium text-theme-primary mb-2'>
                Content Title *
              </label>
              <input
                type='text'
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-theme-tertiary border ${
                  errors.title ? 'border-accent-error' : 'border-theme-primary'
                } rounded-xl text-theme-primary placeholder-theme-secondary focus:outline-none focus:ring-2 focus:ring-accent-primary focus:border-transparent transition-all duration-200 text-base sm:text-base`}
                placeholder='Enter content title...'
              />
              {errors.title && (
                <p className='text-accent-error text-xs sm:text-sm mt-1'>
                  {errors.title}
                </p>
              )}
            </div>

            <div>
              <label className='block text-sm font-medium text-theme-primary mb-2'>
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  handleInputChange('description', e.target.value)
                }
                rows={3}
                className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-theme-tertiary border ${
                  errors.description
                    ? 'border-accent-error'
                    : 'border-theme-primary'
                } rounded-xl text-theme-primary placeholder-theme-secondary focus:outline-none focus:ring-2 focus:ring-accent-primary focus:border-transparent transition-all duration-200 resize-none text-base sm:text-base`}
                placeholder='Describe your content... (AI will generate if left empty)'
              />
              {errors.description && (
                <p className='text-accent-error text-xs sm:text-sm mt-1'>
                  {errors.description}
                </p>
              )}
            </div>
          </div>

          {/* Content Type */}
          <div>
            <label className='block text-sm font-medium text-theme-primary mb-3'>
              Content Type
            </label>
            <div className='grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3'>
              {contentTypes.map((type) => {
                const Icon = type.icon;
                return (
                  <button
                    key={type.id}
                    type='button'
                    onClick={() => handleInputChange('contentType', type.id)}
                    className={`p-3 sm:p-4 rounded-xl border-2 transition-all duration-200 ${
                      formData.contentType === type.id
                        ? 'border-accent-primary bg-accent-primary/10'
                        : 'border-theme-primary bg-theme-tertiary hover:border-accent-primary hover:bg-theme-hover'
                    }`}
                  >
                    <Icon className='h-5 w-5 sm:h-6 sm:w-6 mx-auto mb-1 sm:mb-2 text-theme-primary' />
                    <span className='text-xs sm:text-sm text-theme-primary block'>
                      {type.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Platforms */}
          <div>
            <label className='block text-sm font-medium text-theme-primary mb-3'>
              Platforms *
            </label>
            <div className='grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3'>
              {platforms.map((platform) => {
                const Icon = platform.icon;
                const isSelected = formData.platforms.includes(platform.id);
                return (
                  <button
                    key={platform.id}
                    type='button'
                    onClick={() => handlePlatformToggle(platform.id)}
                    className={`p-2.5 sm:p-3 rounded-xl border-2 transition-all duration-200 ${
                      isSelected
                        ? 'border-accent-primary bg-accent-primary/10'
                        : 'border-theme-primary bg-theme-tertiary hover:border-accent-primary hover:bg-theme-hover'
                    }`}
                  >
                    <div className='flex items-center space-x-2'>
                      <Icon className='h-4 w-4 sm:h-5 sm:w-5 text-theme-primary flex-shrink-0' />
                      <span className='text-xs sm:text-sm text-theme-primary truncate'>
                        {platform.label}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
            {errors.platforms && (
              <p className='text-accent-error text-xs sm:text-sm mt-1'>
                {errors.platforms}
              </p>
            )}
          </div>

          {/* Schedule */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4'>
            <div>
              <label className='block text-sm font-medium text-theme-primary mb-2'>
                Scheduled Date
              </label>
              <input
                type='date'
                value={formData.scheduledDate}
                min={new Date().toISOString().split('T')[0]}
                onChange={(e) =>
                  handleInputChange('scheduledDate', e.target.value)
                }
                className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-theme-tertiary border ${
                  errors.scheduledDate
                    ? 'border-accent-error'
                    : 'border-theme-primary'
                } rounded-xl text-theme-primary focus:outline-none focus:ring-2 focus:ring-accent-primary focus:border-transparent transition-all duration-200 text-base sm:text-base`}
              />
              {errors.scheduledDate && (
                <p className='text-accent-error text-xs sm:text-sm mt-1'>
                  {errors.scheduledDate}
                </p>
              )}
            </div>

            <div>
              <label className='block text-sm font-medium text-theme-primary mb-2'>
                Scheduled Time
              </label>
              <input
                type='time'
                value={formData.scheduledTime}
                onChange={(e) =>
                  handleInputChange('scheduledTime', e.target.value)
                }
                className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-theme-tertiary border ${
                  errors.scheduledTime
                    ? 'border-accent-error'
                    : 'border-theme-primary'
                } rounded-xl text-theme-primary focus:outline-none focus:ring-2 focus:ring-accent-primary focus:border-transparent transition-all duration-200 text-base sm:text-base`}
              />
              {errors.scheduledTime && (
                <p className='text-accent-error text-xs sm:text-sm mt-1'>
                  {errors.scheduledTime}
                </p>
              )}
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className='block text-sm font-medium text-theme-primary mb-2'>
              Tags
            </label>
            <div className='flex flex-wrap gap-1.5 sm:gap-2 mb-3'>
              {formData.tags.map((tag) => (
                <span
                  key={tag}
                  className='inline-flex items-center px-2.5 sm:px-3 py-1 bg-accent-primary/10 text-accent-primary rounded-full text-xs sm:text-sm border border-accent-primary/20'
                >
                  <Tag className='h-3 w-3 mr-1' />
                  {tag}
                  <button
                    type='button'
                    onClick={() => handleRemoveTag(tag)}
                    className='ml-1.5 sm:ml-2 hover:text-accent-primary transition-colors'
                  >
                    <X className='h-3 w-3' />
                  </button>
                </span>
              ))}
            </div>
            <div className='flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2'>
              <input
                type='text'
                name='newTag'
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={handleKeyPress}
                className='flex-1 px-3 sm:px-4 py-2 bg-theme-tertiary border border-theme-primary rounded-xl text-theme-primary placeholder-theme-secondary focus:outline-none focus:ring-2 focus:ring-accent-primary focus:border-transparent transition-all duration-200 text-base sm:text-base'
                placeholder='Add a tag...'
              />
              <button
                type='button'
                onClick={handleAddTag}
                className='px-4 py-2 bg-accent-primary hover:bg-accent-secondary rounded-xl text-white transition-colors duration-200 text-sm sm:text-base w-full sm:w-auto'
              >
                Add
              </button>
            </div>
          </div>

          {/* Priority */}
          <div>
            <label className='block text-sm font-medium text-theme-primary mb-3'>
              Priority
            </label>
            <div className='flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3'>
              {priorities.map((priority) => (
                <button
                  key={priority.id}
                  type='button'
                  onClick={() => handleInputChange('priority', priority.id)}
                  className={`flex items-center space-x-2 px-3 sm:px-4 py-2 rounded-xl border-2 transition-all duration-200 ${
                    formData.priority === priority.id
                      ? 'border-accent-primary bg-accent-primary/10'
                      : 'border-theme-primary bg-theme-tertiary hover:border-accent-primary hover:bg-theme-hover'
                  }`}
                >
                  <div className={`w-3 h-3 rounded-full ${priority.color}`} />
                  <span className='text-xs sm:text-sm text-theme-primary'>
                    {priority.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Form Actions */}
          <div className='flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4 pt-4 sm:pt-6 border-t border-theme-primary'>
            <button
              type='button'
              onClick={onClose}
              className='px-4 sm:px-6 py-2.5 sm:py-3 bg-theme-tertiary hover:bg-theme-hover rounded-xl text-theme-primary transition-colors duration-200 text-sm sm:text-base w-full sm:w-auto order-2 sm:order-1'
            >
              Cancel
            </button>
            <button
              type='button'
              onClick={handleSubmit}
              className='px-4 sm:px-6 py-2 sm:py-3 bg-accent-primary hover:bg-accent-secondary rounded-xl text-white font-medium transition-all duration-200 text-sm sm:text-base w-full sm:w-auto order-1 sm:order-2'
            >
              Create Content
            </button>
          </div>
        </div>
      </Modal>

      {/* AI Suggestion Floating Button */}
      {isOpen && <AISuggestionButton onSuggestion={handleAISuggestion} />}
    </>
  );
}
