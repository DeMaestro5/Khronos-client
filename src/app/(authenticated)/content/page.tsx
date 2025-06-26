'use client';

import React, { useState, useEffect } from 'react';
import { Search, Plus, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

import { useUserData } from '@/src/context/UserDataContext';
import { Content, ContentStatus, ContentType } from '@/src/types/content';
import { ContentCard } from '@/src/components/content/content-card';
import { ContentListItem } from '@/src/components/content/content-list-items';
import CreateContentModal from '@/src/components/content/content-creation-modal';
import ContentFilter from '@/src/components/content/content-filter';
import { ContentFormData } from '@/src/types/modal';
import { contentAPI } from '@/src/lib/api';
import PageLoading from '@/src/components/ui/page-loading';
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
  const [aiSuggestion, setAiSuggestion] = useState<{
    title: string;
    description: string;
    tags: string[];
  } | null>(null);

  // Use cached user data
  const {
    userContent,
    loading: contextLoading,
    addContent,
    removeContent,
  } = useUserData();

  useEffect(() => {
    console.log('Content page: Using cached data', {
      userContent,
      contextLoading,
    });

    // Use cached content data instead of API call
    if (userContent) {
      setContents(userContent);
      setFilteredContents(userContent);
      setIsLoading(false);
    } else if (!contextLoading) {
      // If no cached data and context is not loading, set empty arrays
      setContents([]);
      setFilteredContents([]);
      setIsLoading(false);
    } else {
      // Still loading context data
      setIsLoading(contextLoading);
    }

    // Check for AI suggestion passed from dashboard
    const savedSuggestion = sessionStorage.getItem('aiSuggestion');
    if (savedSuggestion) {
      try {
        const suggestion = JSON.parse(savedSuggestion);
        setAiSuggestion(suggestion);
        setShowModal(true);
        // Clear the suggestion from storage
        sessionStorage.removeItem('aiSuggestion');
      } catch (error) {
        console.error('Failed to parse AI suggestion:', error);
      }
    }
  }, [userContent, contextLoading]);

  const handleCreateContent = async (contentData: ContentFormData) => {
    // Declare creatingToastId variable at function scope
    let creatingToastId: string | undefined;

    try {
      // Validate required fields first
      if (!contentData.title.trim()) {
        toast.error('❌ Content title is required');
        return;
      }

      if (contentData.platforms.length === 0) {
        toast.error('❌ Please select at least one platform');
        return;
      }

      // Close modal immediately for better UX
      setShowModal(false);
      setAiSuggestion(null);

      // Show creating toast with loading indicator
      creatingToastId = toast.loading(
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

      // Prepare the payload for API
      const newContentPayload: ContentCreatePayload = {
        title: contentData.title.trim(),
        type: contentData.contentType,
        platform: contentData.platforms,
        description: contentData.description?.trim() || undefined,
        tags:
          contentData.tags.length > 0
            ? contentData.tags.filter((tag) => tag.trim())
            : undefined,
      };

      // Add scheduled date if provided
      if (contentData.scheduledDate && contentData.scheduledTime) {
        const scheduledDateTime = `${contentData.scheduledDate}T${contentData.scheduledTime}:00.000Z`;
        newContentPayload.scheduledDate = scheduledDateTime;
      }

      const response = await contentAPI.create(newContentPayload);

      if (
        response.data?.statusCode === '10000' ||
        response.status === 200 ||
        response.status === 201
      ) {
        // Success
        toast.dismiss(creatingToastId);

        // Determine if content was scheduled
        const hasScheduledDate = !!(
          contentData.scheduledDate && contentData.scheduledTime
        );

        if (hasScheduledDate) {
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

        // Add the new content to the cached data instead of refetching
        if (response.data?.data) {
          addContent(response.data.data);
        }
      } else {
        throw new Error(response.data?.message || 'Failed to create content');
      }
    } catch (error: unknown) {
      console.error('Failed to create content:', error);

      // Dismiss loading toast
      if (creatingToastId) {
        toast.dismiss(creatingToastId);
      }

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
    // Remove from cached data instead of local state
    removeContent(deletedContentId);
  };

  const handleContentUpdated = () => {
    // Since ContentCard doesn't pass the updated content data,
    // we rely on the cache being updated by the API calls within the component
    // The cache will be refreshed when needed
    console.log('Content updated - cache will refresh as needed');
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
    return (
      <PageLoading
        title='Loading Your Content'
        subtitle="We're fetching your amazing content..."
        contentType='content'
        showGrid={true}
        gridItems={8}
      />
    );
  }

  return (
    <div className='p-3 sm:p-4 lg:p-6 space-y-4 sm:space-y-6 bg-white dark:bg-slate-900 transition-colors duration-200'>
      {/* Header */}
      <div className='flex flex-col space-y-3 sm:space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0 gap-4'>
        <div className='text-center sm:text-left'>
          <h1 className='text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-slate-100'>
            Content Library
          </h1>
          <p className='text-sm sm:text-base text-gray-600 dark:text-slate-400 mt-1'>
            Manage and organize all your content in one place
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className='group flex items-center justify-center space-x-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-purple-600 to-pink-600 dark:from-blue-600 dark:to-indigo-700 hover:from-purple-500 hover:to-pink-500 dark:hover:from-blue-500 dark:hover:to-indigo-600 rounded-xl sm:rounded-2xl text-white font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/50 dark:hover:shadow-blue-500/50 w-full sm:w-auto'
        >
          <Plus className='h-4 w-4 sm:h-5 sm:w-5 group-hover:rotate-90 transition-transform duration-300' />
          <span className='text-sm sm:text-base'>Create Content</span>
        </button>
      </div>

      {/* Enhanced Controls Section */}
      <div className='space-y-4'>
        {/* Search Bar */}
        <div className='relative max-w-md'>
          <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-slate-500' />
          <input
            type='text'
            placeholder='Search content...'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className='w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-slate-600 rounded-xl focus:ring-2 text-gray-900 dark:text-slate-100 focus:ring-purple-500 dark:focus:ring-blue-500 focus:border-transparent placeholder:text-gray-500 dark:placeholder:text-slate-400 text-sm bg-white dark:bg-slate-800 shadow-sm transition-all duration-200'
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
              <div className='w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4'>
                <FileText className='w-6 h-6 sm:w-8 sm:h-8 text-gray-400 dark:text-slate-500' />
              </div>
              <h3 className='text-base sm:text-lg font-medium text-gray-900 dark:text-slate-100 mb-2'>
                No content found
              </h3>
              <p className='text-sm sm:text-base text-gray-600 dark:text-slate-400 mb-4'>
                {searchQuery || statusFilter !== 'all' || typeFilter !== 'all'
                  ? 'Try adjusting your search or filters'
                  : "You haven't created any content yet"}
              </p>
              <button
                onClick={() => setShowModal(true)}
                className='inline-flex items-center px-4 py-2 bg-purple-600 dark:bg-blue-600 hover:bg-purple-700 dark:hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors duration-200'
              >
                <Plus className='w-4 h-4 mr-2' />
                Create Your First Content
              </button>
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
        onClose={() => {
          setShowModal(false);
          setAiSuggestion(null);
        }}
        onSubmit={handleCreateContent}
        initialData={aiSuggestion}
      />
    </div>
  );
}
