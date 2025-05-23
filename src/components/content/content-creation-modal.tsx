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
  Image,
  Video,
  Instagram,
  Twitter,
  Facebook,
  Linkedin,
  Youtube,
  Hash,
  Tag,
  X,
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
}: CreateContentModalProps) {
  const [formData, setFormData] = useState<ContentFormData>({
    title: '',
    description: '',
    contentType: 'post',
    platforms: [],
    scheduledDate: '',
    scheduledTime: '',
    tags: [],
    priority: 'medium',
    status: 'draft',
  });

  const [newTag, setNewTag] = useState<string>('');
  const [errors, setErrors] = useState<FormErrors>({});

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setFormData({
        title: '',
        description: '',
        contentType: 'post',
        platforms: [],
        scheduledDate: '',
        scheduledTime: '',
        tags: [],
        priority: 'medium',
        status: 'draft',
      });
      setErrors({});
    }
  }, [isOpen]);

  // AI Suggestion Handler
  const handleAISuggestion = (suggestion: AISuggestionResult) => {
    setFormData((prev) => ({
      ...prev,
      title: suggestion.title,
      description: suggestion.description,
      tags: [
        ...prev.tags,
        ...suggestion.tags.filter((tag) => !prev.tags.includes(tag)),
      ],
    }));

    // Clear any existing errors for the fields we just populated
    setErrors((prev) => ({
      ...prev,
      title: undefined,
      description: undefined,
    }));
  };

  // AI Suggestion Generation

  const contentTypes: ContentType[] = [
    { id: 'post', label: 'Social Post', icon: FileText },
    { id: 'story', label: 'Story', icon: Image },
    { id: 'video', label: 'Video', icon: Video },
    { id: 'article', label: 'Article', icon: FileText },
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

  const handleInputChange = <K extends keyof ContentFormData>(
    field: K,
    value: ContentFormData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
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
    const newErrors: FormErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (formData.platforms.length === 0) {
      newErrors.platforms = [
        'Select at least one platform',
      ] as unknown as Platform['id'][];
    }

    if (!formData.scheduledDate) {
      newErrors.scheduledDate = 'Scheduled date is required';
    }

    if (!formData.scheduledTime) {
      newErrors.scheduledTime = 'Scheduled time is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (validateForm()) {
      const contentItem: ContentItem = {
        ...formData,
        id: Date.now(), // Generate a temporary ID
        createdAt: new Date().toISOString(),
      };
      onSubmit(contentItem);
      onClose();
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
        <div className='p-6 space-y-6'>
          {/* Title and Description */}
          <div className='grid grid-cols-1 gap-6'>
            <div>
              <label className='block text-sm font-medium text-slate-300 mb-2'>
                Content Title *
              </label>
              <input
                type='text'
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className={`w-full px-4 py-3 bg-slate-700/50 border ${
                  errors.title ? 'border-red-500' : 'border-slate-600'
                } rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200`}
                placeholder='Enter content title...'
              />
              {errors.title && (
                <p className='text-red-400 text-sm mt-1'>{errors.title}</p>
              )}
            </div>

            <div>
              <label className='block text-sm font-medium text-slate-300 mb-2'>
                Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  handleInputChange('description', e.target.value)
                }
                rows={4}
                className={`w-full px-4 py-3 bg-slate-700/50 border ${
                  errors.description ? 'border-red-500' : 'border-slate-600'
                } rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 resize-none`}
                placeholder='Describe your content...'
              />
              {errors.description && (
                <p className='text-red-400 text-sm mt-1'>
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
            <div className='grid grid-cols-2 md:grid-cols-4 gap-3'>
              {contentTypes.map((type) => {
                const Icon = type.icon;
                return (
                  <button
                    key={type.id}
                    type='button'
                    onClick={() => handleInputChange('contentType', type.id)}
                    className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                      formData.contentType === type.id
                        ? 'border-purple-500 bg-purple-500/20'
                        : 'border-slate-600 bg-slate-700/30 hover:border-slate-500'
                    }`}
                  >
                    <Icon className='h-6 w-6 mx-auto mb-2 text-white' />
                    <span className='text-sm text-slate-300'>{type.label}</span>
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
            <div className='grid grid-cols-2 md:grid-cols-3 gap-3'>
              {platforms.map((platform) => {
                const Icon = platform.icon;
                const isSelected = formData.platforms.includes(platform.id);
                return (
                  <button
                    key={platform.id}
                    type='button'
                    onClick={() => handlePlatformToggle(platform.id)}
                    className={`p-3 rounded-xl border-2 transition-all duration-200 ${
                      isSelected
                        ? 'border-purple-500 bg-purple-500/20'
                        : 'border-slate-600 bg-slate-700/30 hover:border-slate-500'
                    }`}
                  >
                    <div className='flex items-center space-x-2'>
                      <Icon className='h-5 w-5 text-white' />
                      <span className='text-sm text-slate-300'>
                        {platform.label}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
            {errors.platforms && (
              <p className='text-red-400 text-sm mt-1'>{errors.platforms}</p>
            )}
          </div>

          {/* Schedule */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div>
              <label className='block text-sm font-medium text-slate-300 mb-2'>
                Scheduled Date *
              </label>
              <input
                type='date'
                value={formData.scheduledDate}
                onChange={(e) =>
                  handleInputChange('scheduledDate', e.target.value)
                }
                className={`w-full px-4 py-3 bg-slate-700/50 border ${
                  errors.scheduledDate ? 'border-red-500' : 'border-slate-600'
                } rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200`}
              />
              {errors.scheduledDate && (
                <p className='text-red-400 text-sm mt-1'>
                  {errors.scheduledDate}
                </p>
              )}
            </div>

            <div>
              <label className='block text-sm font-medium text-slate-300 mb-2'>
                Scheduled Time *
              </label>
              <input
                type='time'
                value={formData.scheduledTime}
                onChange={(e) =>
                  handleInputChange('scheduledTime', e.target.value)
                }
                className={`w-full px-4 py-3 bg-slate-700/50 border ${
                  errors.scheduledTime ? 'border-red-500' : 'border-slate-600'
                } rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200`}
              />
              {errors.scheduledTime && (
                <p className='text-red-400 text-sm mt-1'>
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
            <div className='flex flex-wrap gap-2 mb-3'>
              {formData.tags.map((tag) => (
                <span
                  key={tag}
                  className='inline-flex items-center px-3 py-1 bg-purple-500/20 text-purple-200 rounded-full text-sm'
                >
                  <Tag className='h-3 w-3 mr-1' />
                  {tag}
                  <button
                    type='button'
                    onClick={() => handleRemoveTag(tag)}
                    className='ml-2 hover:text-white transition-colors'
                  >
                    <X className='h-3 w-3' />
                  </button>
                </span>
              ))}
            </div>
            <div className='flex space-x-2'>
              <input
                type='text'
                name='newTag'
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={handleKeyPress}
                className='flex-1 px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200'
                placeholder='Add a tag...'
              />
              <button
                type='button'
                onClick={handleAddTag}
                className='px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-xl text-white transition-colors duration-200'
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
            <div className='flex space-x-3'>
              {priorities.map((priority) => (
                <button
                  key={priority.id}
                  type='button'
                  onClick={() => handleInputChange('priority', priority.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl border-2 transition-all duration-200 ${
                    formData.priority === priority.id
                      ? 'border-purple-500 bg-purple-500/20'
                      : 'border-slate-600 bg-slate-700/30 hover:border-slate-500'
                  }`}
                >
                  <div className={`w-3 h-3 rounded-full ${priority.color}`} />
                  <span className='text-sm text-slate-300'>
                    {priority.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Form Actions */}
          <div className='flex justify-end space-x-4 pt-6 border-t border-white/10'>
            <button
              type='button'
              onClick={onClose}
              className='px-6 py-3 bg-slate-700 hover:bg-slate-600 rounded-xl text-white transition-colors duration-200'
            >
              Cancel
            </button>
            <button
              type='button'
              onClick={handleSubmit}
              className='px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-xl text-white font-medium transition-all duration-200'
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
