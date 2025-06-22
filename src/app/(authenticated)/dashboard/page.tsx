'use client';

import React, { useState, useEffect } from 'react';
import {
  FiCalendar,
  FiFileText,
  FiMessageSquare,
  FiBarChart2,
  FiTrendingUp,
  FiLoader,
} from 'react-icons/fi';
import Link from 'next/link';
import { contentAPI } from '../../../lib/api';
import { Content } from '../../../types/content';
import { format, isToday, isTomorrow, parseISO } from 'date-fns';
import { toast } from 'react-hot-toast';
import CreateContentModal from '../../../components/content/content-creation-modal';
import { ContentFormData } from '../../../types/modal';
import { useUserData } from '@/src/context/UserDataContext';

interface DashboardStats {
  totalContent: number;
  scheduledPosts: number;
  avgEngagement: number;
  contentIdeas: number;
}

interface AIContentSuggestion {
  id: string;
  title: string;
  description: string;
  tags: string[];
  difficulty?: 'easy' | 'medium' | 'hard';
  estimatedTime?: string;
  trendingScore?: number;
  relevanceScore?: number;
  type?: string;
  suggestedDate?: string;
  trendingTopic?: boolean;
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalContent: 0,
    scheduledPosts: 0,
    avgEngagement: 0,
    contentIdeas: 0,
  });
  const [upcomingContent, setUpcomingContent] = useState<Content[]>([]);
  const [showModal, setShowModal] = useState(false);

  // Use cached user data instead of fetching directly
  const {
    userStats,
    userContent,
    aiSuggestions,
    loading: contextLoading,
    addContent,
    refreshAISuggestions,
  } = useUserData();

  // Format date for display
  const formatScheduledDate = (dateString: string) => {
    try {
      const date = parseISO(dateString);

      if (isToday(date)) {
        return `Today at ${format(date, 'h:mm a')}`;
      } else if (isTomorrow(date)) {
        return `Tomorrow at ${format(date, 'h:mm a')}`;
      } else {
        return format(date, 'MMM d, yyyy at h:mm a');
      }
    } catch {
      return dateString;
    }
  };

  // Process cached data instead of making API calls
  useEffect(() => {
    console.log('Dashboard: Processing cached data', {
      userContent,
      userStats,
      aiSuggestions,
      contextLoading,
    });

    if (contextLoading) return;

    // Use cached user content with null safety
    const contentData: Content[] = userContent || [];

    // Filter upcoming scheduled content
    const now = new Date();
    const upcoming = contentData
      .filter(
        (content: Content) =>
          content.status === 'scheduled' &&
          content.metadata?.scheduledDate &&
          new Date(content.metadata.scheduledDate) > now
      )
      .sort(
        (a: Content, b: Content) =>
          new Date(a.metadata?.scheduledDate || 0).getTime() -
          new Date(b.metadata?.scheduledDate || 0).getTime()
      )
      .slice(0, 3); // Only show first 3

    setUpcomingContent(upcoming);

    // Use cached stats when available
    if (userStats) {
      setStats({
        totalContent: userStats.totalContent,
        scheduledPosts: userStats.scheduledContent,
        avgEngagement: userStats.engagementRate,
        contentIdeas: aiSuggestions?.length || 0,
      });
    } else {
      // Fallback calculation if cached data not available
      const scheduledCount = contentData.filter(
        (content: Content) => content.status === 'scheduled'
      ).length;

      setStats({
        totalContent: contentData.length,
        scheduledPosts: scheduledCount,
        avgEngagement: 0, // Default to 0 if no cached stats
        contentIdeas: aiSuggestions?.length || 0,
      });
    }
  }, [userStats, userContent, aiSuggestions, contextLoading]);

  const getPlatformIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'twitter':
      case 'x':
        return '𝕏';
      case 'instagram':
        return '📷';
      case 'linkedin':
        return '💼';
      case 'facebook':
        return '📘';
      case 'youtube':
        return '🎥';
      case 'tiktok':
        return '🎵';
      default:
        return '📱';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'blog_post':
      case 'article':
        return '📝';
      case 'video':
        return '🎥';
      case 'social':
        return '📱';
      case 'podcast':
        return '🎙️';
      case 'newsletter':
        return '📧';
      default:
        return '📄';
    }
  };

  const truncateDescription = (
    description: string,
    maxLength: number = 120
  ) => {
    if (description.length <= maxLength) return description;
    return description.substring(0, maxLength).trim() + '...';
  };

  const handleCreateFromSuggestion = (suggestion: AIContentSuggestion) => {
    // Store suggestion in sessionStorage and navigate to content creation
    sessionStorage.setItem(
      'aiSuggestion',
      JSON.stringify({
        title: suggestion.title,
        description: suggestion.description,
        tags: suggestion.tags,
      })
    );
    window.location.href = '/content';
  };

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

      // Close modal immediately
      setShowModal(false);

      // Show creating toast
      toast.loading('Creating your content...', {
        duration: 2000,
      });

      // Prepare the payload for API
      const newContentPayload: {
        title: string;
        type: string;
        platform: string[];
        description?: string;
        tags?: string[];
        scheduledDate?: string;
      } = {
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
        toast.success('Content created successfully!');

        // Add the new content to the cached data instead of refetching everything
        if (response.data?.data) {
          addContent(response.data.data);
        }
      } else {
        throw new Error(response.data?.message || 'Failed to create content');
      }
    } catch (error) {
      console.error('Failed to create content:', error);
      toast.error('Failed to create content. Please try again.');
    }
  };

  // Get AI suggestions from cached data or empty array
  const displaySuggestions = aiSuggestions?.slice(0, 3) || [];

  return (
    <div className='p-6 min-h-screen bg-white dark:bg-slate-900 transition-colors duration-200'>
      <h1 className='text-2xl font-semibold text-purple-800 dark:text-blue-300'>
        Khronos Dashboard
      </h1>

      {/* Quick stats */}
      <div className='mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4'>
        <div className='bg-white dark:bg-slate-800 overflow-hidden shadow dark:shadow-slate-700/20 rounded-lg border border-gray-200 dark:border-slate-700'>
          <div className='px-4 py-5 sm:p-6'>
            <div className='flex items-center'>
              <div className='flex-shrink-0 bg-indigo-500 dark:bg-blue-600 rounded-md p-3'>
                <FiFileText className='h-6 w-6 text-white' />
              </div>
              <div className='ml-5 w-0 flex-1'>
                <dl>
                  <dt className='text-sm font-medium text-gray-500 dark:text-slate-400 truncate'>
                    Total Content
                  </dt>
                  <dd className='flex items-baseline'>
                    <div className='text-2xl font-semibold text-gray-900 dark:text-slate-100'>
                      {contextLoading ? (
                        <FiLoader className='h-6 w-6 animate-spin' />
                      ) : (
                        stats.totalContent
                      )}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className='bg-white dark:bg-slate-800 overflow-hidden shadow dark:shadow-slate-700/20 rounded-lg border border-gray-200 dark:border-slate-700'>
          <div className='px-4 py-5 sm:p-6'>
            <div className='flex items-center'>
              <div className='flex-shrink-0 bg-green-500 dark:bg-emerald-600 rounded-md p-3'>
                <FiCalendar className='h-6 w-6 text-white' />
              </div>
              <div className='ml-5 w-0 flex-1'>
                <dl>
                  <dt className='text-sm font-medium text-gray-500 dark:text-slate-400 truncate'>
                    Scheduled Posts
                  </dt>
                  <dd className='flex items-baseline'>
                    <div className='text-2xl font-semibold text-gray-900 dark:text-slate-100'>
                      {contextLoading ? (
                        <FiLoader className='h-6 w-6 animate-spin' />
                      ) : (
                        stats.scheduledPosts
                      )}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className='bg-white dark:bg-slate-800 overflow-hidden shadow dark:shadow-slate-700/20 rounded-lg border border-gray-200 dark:border-slate-700'>
          <div className='px-4 py-5 sm:p-6'>
            <div className='flex items-center'>
              <div className='flex-shrink-0 bg-purple-500 dark:bg-violet-600 rounded-md p-3'>
                <FiBarChart2 className='h-6 w-6 text-white' />
              </div>
              <div className='ml-5 w-0 flex-1'>
                <dl>
                  <dt className='text-sm font-medium text-gray-500 dark:text-slate-400 truncate'>
                    Avg. Engagement
                  </dt>
                  <dd className='flex items-baseline'>
                    <div className='text-2xl font-semibold text-gray-900 dark:text-slate-100'>
                      {contextLoading ? (
                        <FiLoader className='h-6 w-6 animate-spin' />
                      ) : (
                        `${stats.avgEngagement}%`
                      )}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className='bg-white dark:bg-slate-800 overflow-hidden shadow dark:shadow-slate-700/20 rounded-lg border border-gray-200 dark:border-slate-700'>
          <div className='px-4 py-5 sm:p-6'>
            <div className='flex items-center'>
              <div className='flex-shrink-0 bg-blue-500 dark:bg-sky-600 rounded-md p-3'>
                <FiTrendingUp className='h-6 w-6 text-white' />
              </div>
              <div className='ml-5 w-0 flex-1'>
                <dl>
                  <dt className='text-sm font-medium text-gray-500 dark:text-slate-400 truncate'>
                    Content Ideas
                  </dt>
                  <dd className='flex items-baseline'>
                    <div className='text-2xl font-semibold text-gray-900 dark:text-slate-100'>
                      {contextLoading ? (
                        <FiLoader className='h-6 w-6 animate-spin' />
                      ) : (
                        stats.contentIdeas
                      )}
                    </div>
                    <span className='ml-2 text-sm font-medium text-blue-600 dark:text-sky-400'>
                      AI Generated
                    </span>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content sections */}
      <div className='mt-6 grid grid-cols-1 gap-5 lg:grid-cols-2'>
        {/* Upcoming content */}
        <div className='bg-white dark:bg-slate-800 shadow dark:shadow-slate-700/20 rounded-lg border border-gray-200 dark:border-slate-700'>
          <div className='px-4 py-5 border-b border-gray-200 dark:border-slate-700 sm:px-6'>
            <h3 className='text-lg font-medium leading-6 text-gray-900 dark:text-slate-100'>
              Upcoming Content
            </h3>
          </div>

          {contextLoading ? (
            <div className='px-4 py-8 text-center'>
              <FiLoader className='h-8 w-8 animate-spin mx-auto text-indigo-600 dark:text-blue-400' />
              <p className='mt-2 text-sm text-gray-500 dark:text-slate-400'>
                Loading upcoming content...
              </p>
            </div>
          ) : upcomingContent.length === 0 ? (
            <div className='px-4 py-8 text-center'>
              <div className='mx-auto h-12 w-12 rounded-full bg-gray-100 dark:bg-slate-700 flex items-center justify-center'>
                <FiCalendar className='h-6 w-6 text-gray-400 dark:text-slate-400' />
              </div>
              <h3 className='mt-2 text-sm font-medium text-gray-900 dark:text-slate-100'>
                No scheduled content
              </h3>
              <p className='mt-1 text-sm text-gray-500 dark:text-slate-400'>
                You don&apos;t have any content scheduled yet. Create your first
                piece of content to get started!
              </p>
              <div className='mt-4'>
                <button
                  onClick={() => setShowModal(true)}
                  className='inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-blue-600 dark:hover:bg-blue-700 transition-colors duration-150'
                >
                  <FiFileText className='h-4 w-4 mr-2' />
                  Create Content
                </button>
              </div>
            </div>
          ) : (
            <ul className='divide-y divide-gray-200 dark:divide-slate-700'>
              {upcomingContent.map((content) => (
                <li
                  key={content._id}
                  className='px-4 py-4 sm:px-6 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors duration-150'
                >
                  <div className='flex items-center justify-between'>
                    <div className='flex items-center'>
                      <div className='flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 dark:bg-blue-900/50 flex items-center justify-center'>
                        <span className='text-lg'>
                          {getTypeIcon(content.type)}
                        </span>
                      </div>
                      <div className='ml-4'>
                        <div className='text-sm font-medium text-indigo-600 dark:text-blue-400 truncate max-w-xs'>
                          {content.title}
                        </div>
                        <div className='text-sm text-gray-500 dark:text-slate-400'>
                          {content.metadata?.scheduledDate &&
                            formatScheduledDate(content.metadata.scheduledDate)}
                        </div>
                        {content.platform && content.platform.length > 0 && (
                          <div className='text-xs text-gray-400 dark:text-slate-500 mt-1'>
                            {content.platform
                              .map((p) => getPlatformIcon(p))
                              .join(' ')}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className='px-2 py-1 text-xs rounded-full bg-green-100 dark:bg-emerald-900/50 text-green-800 dark:text-emerald-300'>
                      Scheduled
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}

          <div className='px-4 py-4 border-t border-gray-200 dark:border-slate-700 sm:px-6'>
            <Link
              href='/calendar'
              className='text-sm font-medium text-indigo-600 dark:text-blue-400 hover:text-indigo-500 dark:hover:text-blue-300 transition-colors duration-150'
            >
              View full calendar
            </Link>
          </div>
        </div>

        {/* AI Content Suggestions */}
        <div className='bg-white dark:bg-slate-800 shadow dark:shadow-slate-700/20 rounded-lg border border-gray-200 dark:border-slate-700'>
          <div className='px-4 py-5 border-b border-gray-200 dark:border-slate-700 sm:px-6 flex items-center justify-between'>
            <h3 className='text-lg font-medium leading-6 text-gray-900 dark:text-slate-100'>
              AI Content Suggestions
            </h3>
            {!contextLoading && (
              <button
                onClick={refreshAISuggestions}
                className='text-sm text-purple-600 dark:text-violet-400 hover:text-purple-500 dark:hover:text-violet-300 transition-colors duration-150'
              >
                Refresh
              </button>
            )}
          </div>

          {contextLoading ? (
            <div className='px-4 py-8 text-center'>
              <FiLoader className='h-8 w-8 animate-spin mx-auto text-purple-600 dark:text-violet-400' />
              <p className='mt-2 text-sm text-gray-500 dark:text-slate-400'>
                Loading AI suggestions...
              </p>
            </div>
          ) : displaySuggestions.length === 0 ? (
            <div className='px-4 py-8 text-center'>
              <div className='mx-auto h-12 w-12 rounded-full bg-purple-100 dark:bg-violet-900/50 flex items-center justify-center'>
                <FiMessageSquare className='h-6 w-6 text-purple-600 dark:text-violet-400' />
              </div>
              <h3 className='mt-2 text-sm font-medium text-gray-900 dark:text-slate-100'>
                No suggestions available
              </h3>
              <p className='mt-1 text-sm text-gray-500 dark:text-slate-400'>
                AI content suggestions will appear here. Try creating some
                content first to get personalized recommendations.
              </p>
              <div className='mt-4'>
                <button
                  onClick={refreshAISuggestions}
                  className='text-sm text-purple-600 dark:text-violet-400 hover:text-purple-500 dark:hover:text-violet-300 transition-colors duration-150'
                >
                  Refresh Suggestions
                </button>
              </div>
            </div>
          ) : (
            <ul className='divide-y divide-gray-200 dark:divide-slate-700'>
              {displaySuggestions.map((suggestion) => (
                <li
                  key={suggestion.id}
                  className='px-4 py-4 sm:px-6 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors duration-150'
                >
                  <div>
                    <div className='flex items-center'>
                      <div className='flex-shrink-0 h-10 w-10 rounded-full bg-purple-100 dark:bg-violet-900/50 flex items-center justify-center'>
                        <FiMessageSquare className='h-5 w-5 text-purple-600 dark:text-violet-400' />
                      </div>
                      <div className='ml-4'>
                        <div className='text-sm font-medium text-purple-600 dark:text-violet-400'>
                          {suggestion.title}
                        </div>
                        <div className='mt-1 text-sm text-gray-500 dark:text-slate-400'>
                          {truncateDescription(suggestion.description)}
                        </div>
                        <div className='mt-1 text-sm text-gray-500 dark:text-slate-400 flex items-center'>
                          {suggestion.trendingScore &&
                            suggestion.trendingScore > 70 && (
                              <span className='px-2 py-1 text-xs rounded-full bg-purple-100 dark:bg-violet-900/50 text-purple-800 dark:text-violet-300 mr-2'>
                                Trending Topic
                              </span>
                            )}
                          <span>Est. {suggestion.estimatedTime} to create</span>
                        </div>
                      </div>
                    </div>
                    <div className='mt-2 flex'>
                      <button
                        onClick={() => handleCreateFromSuggestion(suggestion)}
                        className='mr-2 bg-white dark:bg-slate-700 hover:bg-gray-50 dark:hover:bg-slate-600 text-purple-700 dark:text-violet-300 font-semibold py-1 px-3 border border-purple-500 dark:border-violet-500 rounded text-sm transition-colors duration-150'
                      >
                        Create Content
                      </button>
                      <button className='bg-white dark:bg-slate-700 hover:bg-gray-50 dark:hover:bg-slate-600 text-gray-500 dark:text-slate-300 font-semibold py-1 px-3 border border-gray-300 dark:border-slate-600 rounded text-sm transition-colors duration-150'>
                        Save Idea
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}

          <div className='px-4 py-4 border-t border-gray-200 dark:border-slate-700 sm:px-6'>
            <span className='text-sm font-medium text-purple-600 dark:text-violet-400'>
              Chat with AI using the floating button! ✨
            </span>
          </div>
        </div>
      </div>

      {/* Quick access */}
      <div className='mt-6'>
        <h2 className='text-lg font-medium text-gray-900 dark:text-slate-100'>
          Quick Access
        </h2>
        <div className='mt-3 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4'>
          <button
            onClick={() => setShowModal(true)}
            className='bg-white dark:bg-slate-800 overflow-hidden shadow dark:shadow-slate-700/20 rounded-lg p-6 hover:bg-gray-50 dark:hover:bg-slate-700/50 border border-gray-200 dark:border-slate-700 transition-colors duration-150 text-left w-full'
          >
            <div className='flex items-center'>
              <div className='flex-shrink-0 bg-indigo-500 dark:bg-blue-600 rounded-md p-3'>
                <FiFileText className='h-6 w-6 text-white' />
              </div>
              <div className='ml-4'>
                <h3 className='text-lg font-medium text-gray-900 dark:text-slate-100'>
                  Create Content
                </h3>
                <p className='text-sm text-gray-500 dark:text-slate-400'>
                  Add new content to your calendar
                </p>
              </div>
            </div>
          </button>

          <Link
            href='/calendar'
            className='bg-white dark:bg-slate-800 overflow-hidden shadow dark:shadow-slate-700/20 rounded-lg p-6 hover:bg-gray-50 dark:hover:bg-slate-700/50 border border-gray-200 dark:border-slate-700 transition-colors duration-150'
          >
            <div className='flex items-center'>
              <div className='flex-shrink-0 bg-green-500 dark:bg-emerald-600 rounded-md p-3'>
                <FiCalendar className='h-6 w-6 text-white' />
              </div>
              <div className='ml-4'>
                <h3 className='text-lg font-medium text-gray-900 dark:text-slate-100'>
                  View Calendar
                </h3>
                <p className='text-sm text-gray-500 dark:text-slate-400'>
                  Manage your content schedule
                </p>
              </div>
            </div>
          </Link>

          <div className='bg-white dark:bg-slate-800 overflow-hidden shadow dark:shadow-slate-700/20 rounded-lg p-6 border-2 border-purple-200 dark:border-violet-600/50 transition-colors duration-150'>
            <div className='flex items-center'>
              <div className='flex-shrink-0 bg-purple-500 dark:bg-violet-600 rounded-md p-3'>
                <FiMessageSquare className='h-6 w-6 text-white' />
              </div>
              <div className='ml-4'>
                <h3 className='text-lg font-medium text-gray-900 dark:text-slate-100'>
                  AI Chat
                </h3>
                <p className='text-sm text-gray-500 dark:text-slate-400'>
                  Use the floating button for AI assistance ✨
                </p>
              </div>
            </div>
          </div>

          <Link
            href='/analytics'
            className='bg-white dark:bg-slate-800 overflow-hidden shadow dark:shadow-slate-700/20 rounded-lg p-6 hover:bg-gray-50 dark:hover:bg-slate-700/50 border border-gray-200 dark:border-slate-700 transition-colors duration-150'
          >
            <div className='flex items-center'>
              <div className='flex-shrink-0 bg-blue-500 dark:bg-sky-600 rounded-md p-3'>
                <FiBarChart2 className='h-6 w-6 text-white' />
              </div>
              <div className='ml-4'>
                <h3 className='text-lg font-medium text-gray-900 dark:text-slate-100'>
                  Analytics
                </h3>
                <p className='text-sm text-gray-500 dark:text-slate-400'>
                  Track content performance
                </p>
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* Create Content Modal */}
      <CreateContentModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleCreateContent}
      />
    </div>
  );
}
