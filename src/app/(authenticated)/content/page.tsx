'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Search, Plus, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { useContentCreation } from '@/src/context/ContentCreationContext';
import { Content, ContentStatus, ContentType } from '@/src/types/content';
import { ContentCard } from '@/src/components/content/content-card';
import { ContentListItem } from '@/src/components/content/content-list-items';
import CreateContentModal from '@/src/components/content/content-creation-modal';
import ContentFilter from '@/src/components/content/content-filter';
import { ContentFormData } from '@/src/types/modal';
import { contentAPI } from '@/src/lib/api';
import { AuthUtils } from '@/src/lib/auth-utils';
import ContentLoading from '@/src/components/ui/content-loading';
// import AuthDebug from '@/src/components/debug/AuthDebug';

type ViewMode = 'grid' | 'list';
type StatusFilter = 'all' | ContentStatus;
type TypeFilter = 'all' | ContentType;

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
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('all');
  const [showModal, setShowModal] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [isLoading, setIsLoading] = useState(true);
  const previouslyCreatingRef = useRef(false);

  const {
    startContentCreation,
    failContentCreation,
    completeContentCreation,
    setContentId,
    isCreating,
  } = useContentCreation();

  // No calendar context needed in this component

  useEffect(() => {
    const fetchContents = async () => {
      setIsLoading(true);
      try {
        const response = await contentAPI.getUserContent();

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

  // Refresh content when creation completes (user might have navigated away and back)
  useEffect(() => {
    const refreshContents = async () => {
      try {
        const response = await contentAPI.getUserContent();
        if (response.data?.statusCode === '10000' && response.data?.data) {
          setContents(response.data.data);
          setFilteredContents(response.data.data);
        }
      } catch (error) {
        console.error('Failed to refresh content after creation:', error);
      }
    };

    // If we were creating content and now we're not, refresh the list
    if (previouslyCreatingRef.current && !isCreating) {
      refreshContents();
    }

    previouslyCreatingRef.current = isCreating;
  }, [isCreating]);

  const handleCreateContent = async (contentData: ContentFormData) => {
    try {
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

      // Determine status based on whether scheduled date/time is provided
      const hasScheduledDateTime = !!(
        contentData.scheduledDate && contentData.scheduledTime
      );

      // Start the global content creation process
      startContentCreation(contentData.title.trim(), hasScheduledDateTime);

      try {
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
          // Set the content ID if available and complete the creation
          if (response.data?.data?._id) {
            setContentId(response.data.data._id);
          }
          completeContentCreation();

          // Refresh the content list
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

        // Let the global context handle error notification
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

        failContentCreation(errorMessage);
      }
    } catch (error: unknown) {
      // Catch any validation errors or other issues before content creation starts
      console.error('Error in handleCreateContent:', error);

      let errorMessage = 'An unexpected error occurred. Please try again.';
      if (error instanceof Error) {
        errorMessage = error.message;
      }

      // Only show toast for validation errors, not failContentCreation
      // since we haven't started the creation process yet
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

  const handleContentUpdated = async () => {
    // Refresh the content list when content is updated
    setIsLoading(true);
    try {
      const response = await contentAPI.getUserContent();
      console.log('Updated content response:', response.data);

      if (response.data?.statusCode === '10000' && response.data?.data) {
        setContents(response.data.data);
        setFilteredContents(response.data.data);
      }
    } catch (error) {
      console.error('Failed to refresh content after update:', error);
    } finally {
      setIsLoading(false);
    }
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

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter((content) => content.status === statusFilter);
    } else {
      // When status "all" is selected, exclude archived content by default
      filtered = filtered.filter((content) => content.status !== 'archived');
    }

    // Apply type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter((content) => content.type === typeFilter);
    }

    setFilteredContents(filtered);
  }, [contents, searchQuery, statusFilter, typeFilter]);

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
        <ContentFilter
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          typeFilter={typeFilter}
          setTypeFilter={setTypeFilter}
          viewMode={viewMode}
          setViewMode={setViewMode}
          filteredCount={filteredContents.length}
          totalCount={contents.length}
          archivedCount={contents.filter((c) => c.status === 'archived').length}
          searchQuery={searchQuery}
        />
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
                {searchQuery || statusFilter !== 'all' || typeFilter !== 'all'
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
                  onContentUpdated={handleContentUpdated}
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
