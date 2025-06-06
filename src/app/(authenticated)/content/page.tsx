'use client';

import React, { useState, useEffect } from 'react';
import { Search, Plus, FileText, Grid3X3, List } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { useGlobalConfetti } from '@/src/context/ConfettiContext';
import { Content, ContentStatus, ContentType } from '@/src/types/content';
import { ContentCard } from '@/src/components/content/content-card';
import { ContentListItem } from '@/src/components/content/content-list-items';
import CreateContentModal from '@/src/components/content/content-creation-modal';
import { ContentFormData } from '@/src/types/modal';
import { contentAPI } from '@/src/lib/api';
import { AuthUtils } from '@/src/lib/auth-utils';
import ContentLoading from '@/src/components/ui/content-loading';
// import AuthDebug from '@/src/components/debug/AuthDebug';

type ViewMode = 'grid' | 'list';
type FilterType = 'all' | ContentStatus | ContentType;

interface ContentCreatePayload {
  title: string;
  description?: string;
  type: string;
  platform: string[];
  tags?: string[];
  scheduledDate?: string;
}

export default function ContentPage() {
  const [contents, setContents] = useState<Content[]>([]);
  const [filteredContents, setFilteredContents] = useState<Content[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<FilterType>('all');
  const [showModal, setShowModal] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [isLoading, setIsLoading] = useState(true);

  const { triggerContentCreationCelebration } = useGlobalConfetti();

  // No calendar context needed in this component

  useEffect(() => {
    const fetchContents = async () => {
      setIsLoading(true);
      try {
        // Debug: Check if valid tokens exist using AuthUtils
        const hasValidTokens = AuthUtils.hasValidTokens();
        const currentUser = AuthUtils.getUser();
        const userId = AuthUtils.getUserId();
        console.log('Has valid tokens:', hasValidTokens);
        console.log('Current user:', currentUser);
        console.log('User ID from getUserId():', userId);
        console.log('User object id field:', currentUser?.id);
        console.log('User object _id field:', currentUser?._id);

        if (!hasValidTokens) {
          console.error('No valid authentication tokens found');
          window.location.href = '/auth/login';
          return;
        }

        const response = await contentAPI.getUserContent();
        console.log('Content API Response:', response.data);

        if (response.data?.statusCode === '10000' && response.data?.data) {
          setContents(response.data.data);
          setFilteredContents(response.data.data);
        } else {
          console.error('Failed to fetch contents', response.data);
          setContents([]);
          setFilteredContents([]);
        }
      } catch (error: unknown) {
        console.error('Failed to fetch contents:', error);

        const errorObj = error as {
          response?: { status?: number; data?: unknown };
        };
        if (errorObj?.response?.status === 401) {
          console.error('Authentication failed - redirecting to login');
          // Automatic token refresh will be handled by axios interceptors
          // If we get here, it means refresh failed, so clear tokens and redirect
          AuthUtils.clearTokens();
          window.location.href = '/auth/login';
          return;
        }

        console.error('Error response:', errorObj?.response?.data);
        console.error('Error status:', errorObj?.response?.status);
        setContents([]);
        setFilteredContents([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchContents();
  }, []);

  const handleCreateContent = async (contentData: ContentFormData) => {
    // Validate required fields first
    if (!contentData.title.trim()) {
      toast.error('Content title is required');
      return;
    }

    if (contentData.platforms.length === 0) {
      toast.error('Please select at least one platform');
      return;
    }

    // Close modal immediately and reset states
    setShowModal(false);

    // Show creating toast with loading indicator
    const creatingToastId = toast.loading(
      '🚀 Creating your content... AI is working its magic!',
      {
        style: {
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          border: 'none',
          fontWeight: '500',
        },
      }
    );

    try {
      // Determine status based on whether scheduled date/time is provided
      const hasScheduledDateTime = !!(
        contentData.scheduledDate && contentData.scheduledTime
      );

      // Prepare the payload for API
      const newContentPayload: ContentCreatePayload = {
        title: contentData.title.trim(),
        type: contentData.contentType,
        platform: contentData.platforms,
      };

      // Add optional fields only if they have values
      if (contentData.description?.trim()) {
        newContentPayload.description = contentData.description.trim();
      }

      if (contentData.tags.length > 0) {
        newContentPayload.tags = contentData.tags.filter((tag) => tag.trim());
      }

      // Add scheduled date if both date and time are provided
      if (hasScheduledDateTime) {
        const scheduledDateTime = `${contentData.scheduledDate}T${contentData.scheduledTime}:00.000Z`;
        newContentPayload.scheduledDate = scheduledDateTime;
      }

      console.log('Creating content with payload:', newContentPayload);

      // ALWAYS call the API to create content
      const response = await contentAPI.create(newContentPayload);

      console.log('Content creation response:', response.data);

      // Check if the creation was successful
      if (
        response.data?.statusCode === '10000' ||
        response.status === 200 ||
        response.status === 201
      ) {
        // Dismiss the creating toast
        toast.dismiss(creatingToastId);

        // Show appropriate success message based on whether it's scheduled or draft
        if (hasScheduledDateTime) {
          toast.success(
            '🎉 Content created and scheduled successfully! Check your calendar!',
            {
              duration: 5000,
              style: {
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                border: 'none',
                fontWeight: '500',
                fontSize: '16px',
              },
              icon: '📅',
            }
          );
        } else {
          toast.success('🎉 Content created as draft successfully!', {
            duration: 5000,
            style: {
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              fontWeight: '500',
              fontSize: '16px',
            },
            icon: '📝',
          });
        }

        // Celebrate with confetti immediately after toast
        setTimeout(() => {
          triggerContentCreationCelebration();
        }, 100);

        // Refresh the content list to show the new content
        const refreshResponse = await contentAPI.getUserContent();
        if (
          refreshResponse.data?.statusCode === '10000' &&
          refreshResponse.data?.data
        ) {
          setContents(refreshResponse.data.data);
          setFilteredContents(refreshResponse.data.data);
        }
      } else {
        throw new Error(response.data?.message || 'Failed to create content');
      }
    } catch (error: unknown) {
      console.error('Failed to create content:', error);

      // Dismiss the creating toast
      toast.dismiss(creatingToastId);

      // Show error notification with specific message
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

      toast.error(`❌ ${errorMessage}`, {
        duration: 6000,
        style: {
          background: '#ef4444',
          color: 'white',
          border: 'none',
          fontWeight: '500',
        },
      });
    }
  };

  const handleContentDeleted = (deletedContentId: string) => {
    // Remove the deleted content from both contents and filteredContents arrays
    setContents((prev) =>
      prev.filter((content) => content._id !== deletedContentId)
    );
    setFilteredContents((prev) =>
      prev.filter((content) => content._id !== deletedContentId)
    );
  };

  useEffect(() => {
    let filtered = contents;

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (content) =>
          content.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          content.description
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          content.tags.some((tag) =>
            tag.toLowerCase().includes(searchQuery.toLowerCase())
          )
      );
    }

    // Apply status/type filter
    if (filterType !== 'all') {
      filtered = filtered.filter(
        (content) =>
          content.status === filterType || content.type === filterType
      );
    }

    setFilteredContents(filtered);
  }, [contents, searchQuery, filterType]);

  if (isLoading) {
    return <ContentLoading />;
  }

  return (
    <div className='p-3 sm:p-4 lg:p-6 space-y-4 sm:space-y-6'>
      {/* Header */}
      <div className='flex flex-col space-y-3 sm:space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0 gap-4'>
        <div className='text-center sm:text-left'>
          <h1 className='text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900'>
            Content Library
          </h1>
          <p className='text-sm sm:text-base text-gray-600 mt-1'>
            Manage and organize all your content in one place
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className='group flex items-center justify-center space-x-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-xl sm:rounded-2xl text-white font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/50 w-full sm:w-auto'
        >
          <Plus className='h-4 w-4 sm:h-5 sm:w-5 group-hover:rotate-90 transition-transform duration-300' />
          <span className='text-sm sm:text-base'>Create Content</span>
        </button>
      </div>

      {/* Enhanced Controls Section */}
      <div className='space-y-4'>
        {/* Search Bar */}
        <div className='relative max-w-md'>
          <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400' />
          <input
            type='text'
            placeholder='Search content...'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className='w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 text-gray-900 focus:ring-purple-500 focus:border-transparent placeholder:text-gray-500 text-sm bg-white shadow-sm transition-all duration-200'
          />
        </div>

        {/* Modern Filter Section */}
        <div className='bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden'>
          {/* Filter Header */}
          <div className='px-6 py-4 border-b border-gray-100 bg-gray-50/50'>
            <div className='flex items-center justify-between'>
              <h3 className='text-sm font-semibold text-gray-900'>
                Filter Content
              </h3>
              <div className='flex items-center gap-3'>
                <span className='text-xs text-gray-500'>View:</span>
                <div className='flex bg-gray-100 rounded-lg p-0.5'>
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-all duration-200 ${
                      viewMode === 'grid'
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                    title='Grid View'
                  >
                    <Grid3X3 className='w-3.5 h-3.5' />
                    <span>Grid</span>
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-all duration-200 ${
                      viewMode === 'list'
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                    title='List View'
                  >
                    <List className='w-3.5 h-3.5' />
                    <span>List</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Filter Content */}
          <div className='p-6'>
            <div className='flex flex-wrap items-center gap-6'>
              {/* Status Section */}
              <div className='flex items-center gap-3'>
                <div className='flex items-center gap-2'>
                  <div className='w-2 h-2 rounded-full bg-purple-500'></div>
                  <span className='text-sm font-medium text-gray-700'>
                    Status
                  </span>
                </div>
                <div className='flex items-center gap-2'>
                  <button
                    onClick={() => setFilterType('all')}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                      filterType === 'all'
                        ? 'bg-purple-100 text-purple-700 border border-purple-200'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    All
                  </button>
                  {Object.values(ContentStatus).map((status) => (
                    <button
                      key={status}
                      onClick={() => setFilterType(status)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                        filterType === status
                          ? 'bg-purple-100 text-purple-700 border border-purple-200'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                      }`}
                    >
                      {status.charAt(0).toUpperCase() +
                        status.slice(1).toLowerCase()}
                    </button>
                  ))}
                </div>
              </div>

              {/* Vertical Separator */}
              <div className='h-8 w-px bg-gray-200'></div>

              {/* Type Section */}
              <div className='flex items-center gap-3'>
                <div className='flex items-center gap-2'>
                  <div className='w-2 h-2 rounded-full bg-blue-500'></div>
                  <span className='text-sm font-medium text-gray-700'>
                    Type
                  </span>
                </div>
                <div className='flex items-center gap-2'>
                  {Object.values(ContentType).map((type) => {
                    const getTypeIcon = (contentType: string) => {
                      switch (contentType) {
                        case 'blog_post':
                          return '📝';
                        case 'social_post':
                          return '📱';
                        case 'video':
                          return '🎥';
                        case 'podcast':
                          return '🎧';
                        case 'email':
                          return '📧';
                        case 'other':
                          return '📋';
                        default:
                          return '📄';
                      }
                    };

                    const getTypeName = (contentType: string) => {
                      switch (contentType) {
                        case 'blog_post':
                          return 'Blog';
                        case 'social_post':
                          return 'Social';
                        case 'video':
                          return 'Video';
                        case 'podcast':
                          return 'Podcast';
                        case 'email':
                          return 'Email';
                        case 'other':
                          return 'Other';
                        default:
                          return 'Article';
                      }
                    };

                    return (
                      <button
                        key={type}
                        onClick={() => setFilterType(type)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                          filterType === type
                            ? 'bg-blue-100 text-blue-700 border border-blue-200'
                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                        }`}
                      >
                        <span className='text-xs'>{getTypeIcon(type)}</span>
                        <span>{getTypeName(type)}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Count and Stats */}
      <div className='flex items-center justify-between bg-gray-50 rounded-lg px-4 py-3'>
        <div className='flex items-center gap-4'>
          <p className='text-sm font-medium text-gray-700'>
            Showing{' '}
            <span className='text-purple-600 font-semibold'>
              {filteredContents.length}
            </span>{' '}
            of{' '}
            <span className='text-gray-900 font-semibold'>
              {contents.length}
            </span>{' '}
            content items
          </p>
          {filterType !== 'all' && (
            <span className='px-2 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded-full'>
              Filtered by:{' '}
              {filterType.charAt(0).toUpperCase() +
                filterType.slice(1).replace('_', ' ')}
            </span>
          )}
        </div>
        {searchQuery && (
          <span className='px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full'>
            Search: &ldquo;{searchQuery}&rdquo;
          </span>
        )}
      </div>

      {/* Content Grid/List */}
      <AnimatePresence mode='wait'>
        {filteredContents.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className='text-center py-8 sm:py-12'
          >
            <div className='max-w-md mx-auto px-4'>
              <div className='w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                <FileText className='w-6 h-6 sm:w-8 sm:h-8 text-gray-400' />
              </div>
              <h3 className='text-base sm:text-lg font-medium text-gray-900 mb-2'>
                No content found
              </h3>
              <p className='text-sm sm:text-base text-gray-600 mb-4'>
                {searchQuery || filterType !== 'all'
                  ? 'Try adjusting your search or filters'
                  : 'Get started by creating your first piece of content. You will only see content that you have created.'}
              </p>
            </div>
          </motion.div>
        ) : viewMode === 'grid' ? (
          <motion.div
            key='grid'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6'
          >
            <AnimatePresence>
              {filteredContents.map((content) => (
                <ContentCard
                  key={content._id}
                  content={content}
                  onContentDeleted={handleContentDeleted}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <motion.div
            key='list'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className='space-y-3 sm:space-y-4'
          >
            <AnimatePresence>
              {filteredContents.map((content) => (
                <ContentListItem key={content._id} content={content} />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      <CreateContentModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleCreateContent}
      />
    </div>
  );
}
