import { useState, useEffect } from 'react';
import { CreateContentModalProps } from '../../types/modal';
import {
  ContentFormData,
  FormErrors,
  ContentType,
  Platform,
  Priority,
  ContentItem,
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

interface AISuggestionResult {
  title: string;
  description: string;
  tags: string[];
}

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

  // Reset form when modal opens or closes
  useEffect(() => {
    if (isOpen) {
      console.log('Modal opened, resetting form to initial state');
      resetForm();
    } else {
      console.log('Modal closed, resetting form to default state');
      resetForm();
    }
  }, [isOpen]);

  const resetForm = () => {
    console.log('Resetting form with initialData:', initialData);
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
    console.log('Setting form data to:', newFormData);
    setFormData(newFormData);
    setErrors({});
    setNewTag('');
  };

  // AI Suggestion Handler
  const handleAISuggestion = (suggestion: AISuggestionResult) => {
    console.log('AI Suggestion received:', suggestion);
    console.log('Current form data before update:', formData);

    setFormData((prev) => {
      console.log('Previous form data:', prev);
      const newFormData = {
        ...prev,
        title: suggestion.title || '',
        description: suggestion.description || '',
        tags: [
          ...prev.tags,
          ...suggestion.tags.filter((tag) => !prev.tags.includes(tag)),
        ],
      };
      console.log('New form data after AI suggestion:', newFormData);
      return newFormData;
    });

    // Clear any existing errors for the fields we just populated
    setErrors((prev) => ({
      ...prev,
      title: undefined,
      description: undefined,
    }));

    console.log('AI suggestion handler completed');

    // Add a small delay to check if data persists
    setTimeout(() => {
      console.log('Form data after 1 second:', formData);
    }, 1000);
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

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (validateForm()) {
      // Determine status based on whether scheduled date and time are provided
      const hasScheduledDateTime = !!(
        formData.scheduledDate && formData.scheduledTime
      );
      const determinedStatus = hasScheduledDateTime ? 'scheduled' : 'draft';

      const contentItem: ContentItem = {
        ...formData,
        status: determinedStatus, // Use determined status instead of form status
        id: Date.now(), // Generate a temporary ID
        createdAt: new Date().toISOString(),
      };
      onSubmit(contentItem);
      // Modal will be closed by parent component
      // Form will be reset when modal reopens
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
        <div className='p-4 sm:p-6 space-y-4 sm:space-y-6 max-h-[80vh] overflow-y-auto'>
          {/* Title and Description */}
          <div className='grid grid-cols-1 gap-4 sm:gap-6'>
            <div>
              <label className='block text-sm font-medium text-slate-300 mb-2'>
                Content Title *
              </label>
              <input
                type='text'
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-slate-700/50 border ${
                  errors.title ? 'border-red-500' : 'border-slate-600'
                } rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-sm sm:text-base`}
                placeholder='Enter content title...'
              />
              {errors.title && (
                <p className='text-red-400 text-xs sm:text-sm mt-1'>
                  {errors.title}
                </p>
              )}
            </div>

            <div>
              <label className='block text-sm font-medium text-slate-300 mb-2'>
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  handleInputChange('description', e.target.value)
                }
                rows={3}
                className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-slate-700/50 border ${
                  errors.description ? 'border-red-500' : 'border-slate-600'
                } rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 resize-none text-sm sm:text-base`}
                placeholder='Describe your content... (AI will generate if left empty)'
              />
              {errors.description && (
                <p className='text-red-400 text-xs sm:text-sm mt-1'>
                  {errors.description}
                </p>
              )}
            </div>
          </div>

          {/* Content Type */}
          <div>
            <label className='block text-sm font-medium text-slate-300 mb-3'>
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
                        ? 'border-purple-500 bg-purple-500/20'
                        : 'border-slate-600 bg-slate-700/30 hover:border-slate-500'
                    }`}
                  >
                    <Icon className='h-5 w-5 sm:h-6 sm:w-6 mx-auto mb-1 sm:mb-2 text-white' />
                    <span className='text-xs sm:text-sm text-slate-300 block'>
                      {type.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Platforms */}
          <div>
            <label className='block text-sm font-medium text-slate-300 mb-3'>
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
                        ? 'border-purple-500 bg-purple-500/20'
                        : 'border-slate-600 bg-slate-700/30 hover:border-slate-500'
                    }`}
                  >
                    <div className='flex items-center space-x-2'>
                      <Icon className='h-4 w-4 sm:h-5 sm:w-5 text-white flex-shrink-0' />
                      <span className='text-xs sm:text-sm text-slate-300 truncate'>
                        {platform.label}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
            {errors.platforms && (
              <p className='text-red-400 text-xs sm:text-sm mt-1'>
                {errors.platforms}
              </p>
            )}
          </div>

          {/* Schedule */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4'>
            <div>
              <label className='block text-sm font-medium text-slate-300 mb-2'>
                Scheduled Date
              </label>
              <input
                type='date'
                value={formData.scheduledDate}
                min={new Date().toISOString().split('T')[0]}
                onChange={(e) =>
                  handleInputChange('scheduledDate', e.target.value)
                }
                className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-slate-700/50 border ${
                  errors.scheduledDate ? 'border-red-500' : 'border-slate-600'
                } rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-sm sm:text-base`}
              />
              {errors.scheduledDate && (
                <p className='text-red-400 text-xs sm:text-sm mt-1'>
                  {errors.scheduledDate}
                </p>
              )}
            </div>

            <div>
              <label className='block text-sm font-medium text-slate-300 mb-2'>
                Scheduled Time
              </label>
              <input
                type='time'
                value={formData.scheduledTime}
                onChange={(e) =>
                  handleInputChange('scheduledTime', e.target.value)
                }
                className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-slate-700/50 border ${
                  errors.scheduledTime ? 'border-red-500' : 'border-slate-600'
                } rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-sm sm:text-base`}
              />
              {errors.scheduledTime && (
                <p className='text-red-400 text-xs sm:text-sm mt-1'>
                  {errors.scheduledTime}
                </p>
              )}
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className='block text-sm font-medium text-slate-300 mb-2'>
              Tags
            </label>
            <div className='flex flex-wrap gap-1.5 sm:gap-2 mb-3'>
              {formData.tags.map((tag) => (
                <span
                  key={tag}
                  className='inline-flex items-center px-2.5 sm:px-3 py-1 bg-purple-500/20 text-purple-200 rounded-full text-xs sm:text-sm'
                >
                  <Tag className='h-3 w-3 mr-1' />
                  {tag}
                  <button
                    type='button'
                    onClick={() => handleRemoveTag(tag)}
                    className='ml-1.5 sm:ml-2 hover:text-white transition-colors'
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
                className='flex-1 px-3 sm:px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-sm sm:text-base'
                placeholder='Add a tag...'
              />
              <button
                type='button'
                onClick={handleAddTag}
                className='px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-xl text-white transition-colors duration-200 text-sm sm:text-base w-full sm:w-auto'
              >
                Add
              </button>
            </div>
          </div>

          {/* Priority */}
          <div>
            <label className='block text-sm font-medium text-slate-300 mb-3'>
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
                      ? 'border-purple-500 bg-purple-500/20'
                      : 'border-slate-600 bg-slate-700/30 hover:border-slate-500'
                  }`}
                >
                  <div className={`w-3 h-3 rounded-full ${priority.color}`} />
                  <span className='text-xs sm:text-sm text-slate-300'>
                    {priority.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Form Actions */}
          <div className='flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4 pt-4 sm:pt-6 border-t border-white/10'>
            <button
              type='button'
              onClick={onClose}
              className='px-4 sm:px-6 py-2.5 sm:py-3 bg-slate-700 hover:bg-slate-600 rounded-xl text-white transition-colors duration-200 text-sm sm:text-base w-full sm:w-auto order-2 sm:order-1'
            >
              Cancel
            </button>
            <button
              type='button'
              onClick={handleSubmit}
              className='px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-xl text-white font-medium transition-all duration-200 text-sm sm:text-base w-full sm:w-auto order-1 sm:order-2'
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
