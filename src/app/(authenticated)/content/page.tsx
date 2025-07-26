'use client';

import React, { useState, useEffect } from 'react';
import { Search, Plus, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUserData } from '@/src/context/UserDataContext';
import { useGlobalConfetti } from '@/src/context/ConfettiContext';
import { Content, ContentStatus, ContentType } from '@/src/types/content';
import { ContentCard } from '@/src/components/content/content-card';
import { ContentListItem } from '@/src/components/content/content-list-items';
import CreateContentModal from '@/src/components/content/content-creation-modal';
import ContentFilter from '@/src/components/content/content-filter';
import PageLoading from '@/src/components/ui/page-loading';
import { CreatedContent } from '@/src/types/modal';

type ViewMode = 'grid' | 'list';
type StatusFilter = 'all' | ContentStatus;
type TypeFilter = 'all' | ContentType;

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

  // Add confetti context
  const { triggerContentCreationCelebration } = useGlobalConfetti();

  useEffect(() => {
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

  const handleContentCreated = (createdContent?: CreatedContent) => {
    // Clear AI suggestion
    setAiSuggestion(null);

    // Add the new content to the cached data
    if (createdContent) {
      addContent(createdContent);
    }

    // Celebrate with confetti - Add this!
    setTimeout(() => {
      triggerContentCreationCelebration();
    }, 100);
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
    <div className='p-3 sm:p-4 lg:p-6 space-y-4 sm:space-y-6 bg-theme-primary transition-colors duration-200'>
      {/* Header */}
      <div className='flex flex-col space-y-3 sm:space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0 gap-4'>
        <div className='text-center sm:text-left'>
          <h1 className='text-xl sm:text-2xl lg:text-3xl font-bold text-theme-primary'>
            Content Library
          </h1>
          <p className='text-sm sm:text-base text-theme-secondary mt-1'>
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
            className='w-full pl-10 pr-4 py-3 border border-theme-primary rounded-xl focus:ring-2 text-theme-primary focus:ring-accent-primary focus:border-transparent placeholder:text-theme-muted text-sm bg-theme-card shadow-theme-sm transition-all duration-200'
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
              <div className='w-12 h-12 sm:w-16 sm:h-16 bg-theme-secondary rounded-full flex items-center justify-center mx-auto mb-4'>
                <FileText className='w-6 h-6 sm:w-8 sm:h-8 text-gray-400 dark:text-slate-500' />
              </div>
              <h3 className='text-base sm:text-lg font-medium text-theme-primary mb-2'>
                No content found
              </h3>
              <p className='text-sm sm:text-base text-theme-secondary mb-4'>
                {searchQuery || statusFilter !== 'all' || typeFilter !== 'all'
                  ? 'Try adjusting your search or filters'
                  : "You haven't created any content yet"}
              </p>
              <button
                onClick={() => setShowModal(true)}
                className='inline-flex items-center px-4 py-2 bg-accent-primary hover:bg-accent-secondary text-theme-inverse text-sm font-medium rounded-lg transition-colors duration-200'
              >
                <Plus className='w-4 h-4 mr-2' />
                Create Your First Content
              </button>
            </div>
          </motion.div>
        ) : (
          <>
            {/* Grid View - Desktop Only */}
            {viewMode === 'grid' && (
              <motion.div
                key='grid'
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className='hidden md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6'
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
            )}

            {/* List View - Always visible on mobile, conditional on desktop */}
            {viewMode === 'list' && (
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

            {/* Mobile List View - Always shown on mobile */}
            <motion.div
              key='mobile-list'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className='md:hidden space-y-3 sm:space-y-4'
            >
              <AnimatePresence>
                {filteredContents.map((content) => (
                  <ContentListItem key={content._id} content={content} />
                ))}
              </AnimatePresence>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <CreateContentModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setAiSuggestion(null);
        }}
        onSubmit={handleContentCreated}
        initialData={aiSuggestion}
      />
    </div>
  );
}
