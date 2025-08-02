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
import FloatingAIButton from '@/src/components/ai/floating-ai-button';

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
              className='inline-flex items-center cursor-pointer gap-2 px-3 py-2 text-theme-secondary hover:text-theme-primary hover:bg-theme-card/60 rounded-xl transition-all duration-200'
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
      {/* Mobile Header - Fixed at top with solid background */}
      <div className='sticky top-0 z-40 bg-theme-primary border-b border-theme-tertiary/50 shadow-sm'>
        <div className='flex items-center justify-between px-4 py-3'>
          <button
            onClick={() => router.back()}
            className='inline-flex items-center cursor-pointer gap-2 px-3 py-2 text-theme-secondary hover:text-theme-primary hover:bg-theme-card/60 rounded-xl transition-all duration-200'
          >
            <ArrowLeft className='w-4 h-4' />
            <span className='font-medium text-sm'>Back</span>
          </button>

          <div className='flex items-center gap-2'>
            <button className='p-2 text-theme-secondary hover:text-theme-primary hover:bg-theme-card/60 rounded-xl transition-all duration-200'>
              <Share2 className='w-4 h-4' />
            </button>
            <button
              onClick={handleEditClick}
              className='inline-flex items-center gap-2 px-3 py-2 bg-accent-primary text-white hover:bg-accent-secondary rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl text-sm'
            >
              <Edit className='w-3 h-3' />
              <span className='font-medium'>Edit</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className='max-w-7xl mx-auto px-4 py-4'>
        {/* Hero Section */}
        <HeroSection content={content} />

        {/* Content Layout - Responsive design */}
        <div className='grid grid-cols-1 lg:grid-cols-5 gap-6'>
          {/* Main Content Area - Takes full width on mobile, 3 columns on desktop */}
          <div className='lg:col-span-3'>
            <ContentTabs content={content} />
          </div>

          {/* Sidebar - Hidden on mobile, takes 2 columns on desktop */}
          <div className='hidden lg:block lg:col-span-2'>
            <Sidebar content={content} />
          </div>
        </div>

        {/* Mobile Sidebar Content - Displayed as cards below main content */}
        <div className='lg:hidden mt-6 space-y-4'>
          <MobileSidebarContent content={content} />
        </div>
      </div>

      {/* Floating AI Button for Mobile */}
      <FloatingAIButton contentId={content._id} contentTitle={content.title} />

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

// Mobile Sidebar Content Component
const MobileSidebarContent: React.FC<{ content: ContentData }> = ({
  content,
}) => {
  return (
    <>
      {/* Author Card */}
      <div className='bg-theme-card/95 rounded-xl shadow-sm border border-theme-tertiary p-4'>
        <h3 className='font-bold text-theme-primary mb-3 text-sm'>Author</h3>
        <div className='flex items-center gap-3'>
          <div className='w-10 h-10 bg-accent-primary rounded-full flex items-center justify-center text-white font-bold text-sm'>
            {content.author?.name?.charAt(0) || 'U'}
          </div>
          <div>
            <div className='font-medium text-theme-primary text-sm'>
              {content.author?.name || 'Unknown Author'}
            </div>
            <div className='text-theme-secondary text-xs'>
              {content.author?.role || 'Content Creator'}
            </div>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className='bg-theme-card/95 rounded-xl shadow-sm border border-theme-tertiary p-4'>
        <h3 className='font-bold text-theme-primary mb-3 text-sm'>Timeline</h3>
        <div className='space-y-2'>
          <div className='flex items-center gap-3 text-xs'>
            <div className='w-2 h-2 bg-green-500 rounded-full'></div>
            <span className='text-theme-secondary'>Created</span>
            <span className='text-theme-primary ml-auto'>
              {new Date(content.createdAt).toLocaleDateString()}
            </span>
          </div>
          {content.updatedAt && (
            <div className='flex items-center gap-3 text-xs'>
              <div className='w-2 h-2 bg-blue-500 rounded-full'></div>
              <span className='text-theme-secondary'>Updated</span>
              <span className='text-theme-primary ml-auto'>
                {new Date(content.updatedAt).toLocaleDateString()}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Tags */}
      {content.tags && content.tags.length > 0 && (
        <div className='bg-theme-card/95 rounded-xl shadow-sm border border-theme-tertiary p-4'>
          <h3 className='font-bold text-theme-primary mb-3 text-sm'>Tags</h3>
          <div className='flex flex-wrap gap-2'>
            {content.tags.map((tag, index) => (
              <span
                key={index}
                className='px-2 py-1 bg-accent-primary/10 text-accent-primary rounded-full text-xs font-medium'
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Platforms */}
      {content.platforms && content.platforms.length > 0 && (
        <div className='bg-theme-card/95 rounded-xl shadow-sm border border-theme-tertiary p-4'>
          <h3 className='font-bold text-theme-primary mb-3 text-sm'>
            Platforms
          </h3>
          <div className='flex flex-wrap gap-2'>
            {content.platforms.map((platform, index) => (
              <span
                key={index}
                className='px-2 py-1 bg-theme-secondary/20 text-theme-primary rounded-full text-xs font-medium'
              >
                {platform.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Attachments */}
      {content.attachments && content.attachments.length > 0 && (
        <div className='bg-theme-card/95 rounded-xl shadow-sm border border-theme-tertiary p-4'>
          <h3 className='font-bold text-theme-primary mb-3 text-sm'>
            Attachments
          </h3>
          <div className='space-y-2'>
            {content.attachments.slice(0, 3).map((attachment, index) => (
              <div
                key={index}
                className='flex items-center gap-3 p-2 bg-theme-secondary rounded-lg'
              >
                <div className='w-6 h-6 bg-blue-100 dark:bg-blue-900/50 rounded flex items-center justify-center'>
                  <span className='text-xs font-bold text-blue-700 dark:text-blue-300'>
                    {attachment.name.split('.').pop()?.toUpperCase()}
                  </span>
                </div>
                <div className='flex-1 min-w-0'>
                  <div className='font-medium text-theme-primary truncate text-xs'>
                    {attachment.name}
                  </div>
                  <div className='text-theme-secondary text-xs'>
                    {attachment.size}
                  </div>
                </div>
              </div>
            ))}
            {content.attachments.length > 3 && (
              <div className='text-center'>
                <span className='text-xs text-theme-secondary'>
                  +{content.attachments.length - 3} more attachments
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Recommendations */}
      {content.recommendations && content.recommendations.length > 0 && (
        <div className='bg-theme-card/95 rounded-xl shadow-sm border border-theme-tertiary p-4'>
          <h3 className='font-bold text-theme-primary mb-3 text-sm'>
            Recommended Ideas
          </h3>
          <div className='space-y-2'>
            {content.recommendations.slice(0, 2).map((rec, index) => (
              <div
                key={index}
                className='p-3 bg-accent-primary/5 rounded-lg border border-accent-primary/20'
              >
                <h4 className='font-semibold text-theme-primary mb-1 text-xs break-words'>
                  {rec.title}
                </h4>
                <p className='text-theme-secondary text-xs mb-2 line-clamp-2 break-words'>
                  {rec.description}
                </p>
                {rec.difficulty && (
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      rec.difficulty === 'easy'
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
                        : rec.difficulty === 'moderate'
                        ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300'
                        : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
                    }`}
                  >
                    {rec.difficulty}
                  </span>
                )}
              </div>
            ))}
            {content.recommendations.length > 2 && (
              <div className='text-center'>
                <span className='text-xs text-theme-secondary'>
                  +{content.recommendations.length - 2} more recommendations
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ContentDetailPage;
