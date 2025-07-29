'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { ArrowLeft, Edit, Share2, FileText } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import { contentAPI } from '@/src/lib/api';
import { ContentData } from '@/src/types/content';
import { useUserData } from '@/src/context/UserDataContext';
import {
  HeroSection,
  ContentTabs,
  Sidebar,
} from '@/src/components/content-detail';
import ContentEditModal from '@/src/components/content/content-edit-modal';
import PageLoading from '@/src/components/ui/page-loading';

const ContentDetailPage = () => {
  const [content, setContent] = useState<ContentData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const router = useRouter();
  const params = useParams();
  const contentId = params.id as string;

  // Use cached data from UserDataContext
  const { userContent, loading: contextLoading } = useUserData();

  // Find content in cached data
  const cachedContent = useMemo(() => {
    if (!userContent || !contentId) return null;
    return userContent.find((content) => content._id === contentId) || null;
  }, [userContent, contentId]);

  useEffect(() => {
    const loadContent = async () => {
      if (!contentId) return;

      // If we have cached data, use it immediately
      if (cachedContent) {
        console.log('✅ Using cached content data');
        setContent(cachedContent as ContentData);
        setIsLoading(false);
        return;
      }

      // If context is still loading, wait for it
      if (contextLoading) {
        console.log('⏳ Waiting for context to load...');
        setIsLoading(true);
        return;
      }

      // If no cached data and context is done loading, fetch from API as fallback
      console.log('📡 No cached data found, fetching from API as fallback...');
      setIsLoading(true);

      try {
        const response = await contentAPI.getById(contentId);

        // Try different response structures
        let contentData = null;

        if (response.data?.statusCode === '10000') {
          // Structure 1: response.data.data.content (nested) + other fields
          if (response.data?.data?.content) {
            // Merge the content object with other fields at the same level
            contentData = {
              ...response.data.data.content,
              contentIdeas: response.data.data.contentIdeas,
              optimizedContent: response.data.data.optimizedContent,
              aiSuggestions: response.data.data.aiSuggestions,
              platforms: response.data.data.platforms,
              author: response.data.data.author,
              recommendations: response.data.data.recommendations,
              insights: response.data.data.insights,
            };
          }
          // Structure 2: response.data.data (direct content object)
          else if (response.data?.data) {
            contentData = response.data.data;
          }
        }
        // Structure 3: Direct content object in response.data
        else if (response.data && response.data._id) {
          contentData = response.data;
        }

        if (contentData) {
          setContent(contentData);
        } else {
          console.error(
            'Content not found. Response structure:',
            response.data
          );
        }
      } catch (error) {
        console.error('Failed to fetch content:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadContent();
  }, [contentId, cachedContent, contextLoading]);

  const handleEditClick = () => {
    setIsEditModalOpen(true);
  };

  const handleEditSuccess = async () => {
    setIsEditModalOpen(false);

    // Try to use cached data first after edit
    if (cachedContent) {
      // The edit modal should have updated the cache via updateContent
      console.log('✅ Using updated cached content data');
      const updatedCachedContent = userContent?.find(
        (content) => content._id === contentId
      );
      if (updatedCachedContent) {
        setContent(updatedCachedContent as ContentData);
        return;
      }
    }

    // Fallback to API call if cached data not available
    try {
      const response = await contentAPI.getById(contentId);
      if (response.data?.data) {
        setContent(response.data.data);
      }
    } catch (error) {
      console.error('Failed to refresh content after edit:', error);
    }
  };

  const handleEditCancel = () => {
    setIsEditModalOpen(false);
  };

  if (isLoading) {
    // Determine loading state based on available data
    let loadingTitle = 'Loading Content';
    let loadingSubtitle = "We're fetching your content details...";

    if (cachedContent?.title) {
      loadingTitle = cachedContent.title;
      loadingSubtitle = `Loading details for "${cachedContent.title}"...`;
    } else if (contentId) {
      loadingTitle = 'Loading Content Details';
      loadingSubtitle = `Fetching content information...`;
    }

    return (
      <div className='min-h-screen bg-theme-primary pb-20'>
        <div className='max-w-7xl mx-auto px-4 py-4'>
          {/* Show back button even during loading */}
          <div className='flex items-center justify-between mb-6'>
            <button
              onClick={() => router.back()}
              className='inline-flex items-center cursor-pointer gap-2 px-3 py-2 text-theme-secondary hover:text-theme-primary hover:bg-theme-card/60 rounded-xl transition-all duration-200 backdrop-blur-sm'
            >
              <ArrowLeft className='w-4 h-4' />
              <span className='font-medium text-sm'>Back</span>
            </button>

            {/* Show skeleton edit button */}
            <div className='h-10 w-20 shimmer-theme rounded-xl'></div>
          </div>

          {/* Enhanced PageLoading with content context */}
          <PageLoading
            title={loadingTitle}
            subtitle={loadingSubtitle}
            contentType='content'
            showGrid={false}
            isContentDetail={true}
            contentPreview={
              cachedContent
                ? {
                    title: cachedContent.title,
                    type: cachedContent.type,
                    status: cachedContent.status,
                    tags: cachedContent.tags,
                  }
                : undefined
            }
          />
        </div>
      </div>
    );
  }

  if (!content) {
    return (
      <div className='min-h-screen bg-theme-primary flex items-center justify-center pb-20'>
        <div className='text-center px-4'>
          <div className='w-16 h-16 bg-gray-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4'>
            <FileText className='w-8 h-8 text-gray-400 dark:text-slate-500' />
          </div>
          <h2 className='text-xl font-semibold text-theme-primary mb-2'>
            Content Not Found
          </h2>
          <p className='text-theme-secondary mb-6'>
            The content you&apos;re looking for doesn&apos;t exist or has been
            removed.
          </p>
          <button
            onClick={() => router.push('/content')}
            className='inline-flex items-center gap-2 px-6 py-3 bg-accent-primary hover:bg-accent-secondary text-white rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl'
          >
            <ArrowLeft className='w-4 h-4' />
            Back to Content
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-theme-primary pb-20'>
      {/* Mobile Header - Fixed at top */}
      <div className='sticky top-0 z-40 bg-theme-primary/95 backdrop-blur-md border-b border-theme-tertiary/50'>
        <div className='flex items-center justify-between px-4 py-3'>
          <button
            onClick={() => router.back()}
            className='inline-flex items-center cursor-pointer gap-2 px-3 py-2 text-theme-secondary hover:text-theme-primary hover:bg-theme-card/60 rounded-xl transition-all duration-200 backdrop-blur-sm'
          >
            <ArrowLeft className='w-4 h-4' />
            <span className='font-medium text-sm'>Back</span>
          </button>

          <div className='flex items-center gap-2'>
            <button className='p-2 text-theme-secondary hover:text-theme-primary hover:bg-theme-card/60 rounded-xl transition-all duration-200 backdrop-blur-sm'>
              <Share2 className='w-4 h-4' />
            </button>
            <button
              onClick={handleEditClick}
              className='inline-flex items-center gap-2 px-3 py-2 bg-accent-primary text-white hover:bg-accent-secondary rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl text-sm'
            >
              <Edit className='w-3 h-3' />
              <span className='font-medium'>Edit</span>
            </button>
            {/* <button className='p-2 text-theme-secondary hover:text-theme-primary hover:bg-theme-card/60 rounded-xl transition-all duration-200 backdrop-blur-sm'>
              <MoreVertical className='w-4 h-4' />
            </button> */}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className='max-w-7xl mx-auto px-4 py-4'>
        {/* Hero Section */}
        <HeroSection content={content} />

        {/* Content Layout - Two columns on desktop, stacked on mobile */}
        <div className='grid grid-cols-1 lg:grid-cols-5 gap-6'>
          {/* Main Content Area - Takes 3 columns on desktop */}
          <div className='lg:col-span-3'>
            <ContentTabs content={content} />
          </div>

          {/* Sidebar - Takes 2 columns on desktop, full width on mobile */}
          <div className='lg:col-span-2'>
            <Sidebar content={content} />
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {isEditModalOpen && content && (
        <ContentEditModal
          isOpen={isEditModalOpen}
          onClose={handleEditCancel}
          onSuccess={handleEditSuccess}
          contentId={content._id}
          currentStatus={content.status as 'draft' | 'scheduled' | 'published'}
          currentPriority='medium'
          currentScheduledDate={content.metadata?.scheduledDate}
          contentTitle={content.title}
        />
      )}
    </div>
  );
};

export default ContentDetailPage;
