'use client';

import React, { useState, useEffect } from 'react';
import {
  FiCalendar,
  FiFileText,
  FiMessageSquare,
  FiBarChart2,
  FiTrendingUp,
  FiLoader,
  FiRefreshCw,
} from 'react-icons/fi';
import Link from 'next/link';
import { Content } from '../../../types/content';
import { format, isToday, isTomorrow, parseISO } from 'date-fns';
import toast from 'react-hot-toast';
import CreateContentModal from '../../../components/content/content-creation-modal';
import { useUserData } from '@/src/context/UserDataContext';
import { useGlobalConfetti } from '@/src/context/ConfettiContext';
import { CreatedContent } from '../../../types/modal';

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

// Type for modal initial data
interface ModalInitialData {
  title: string;
  description: string;
  tags: string[];
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
  const [modalInitialData, setModalInitialData] =
    useState<ModalInitialData | null>(null);
  const [isRefreshingSuggestions, setIsRefreshingSuggestions] = useState(false);

  // Use cached user data instead of fetching directly
  const {
    userStats,
    userContent,
    aiSuggestions,
    loading: contextLoading,
    addContent,
    refreshAISuggestions,
  } = useUserData();

  const { triggerContentCreationCelebration } = useGlobalConfetti();

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

  // const truncateDescription = (
  //   description: string | undefined,
  //   maxLength: number = 120
  // ) => {
  //   if (!description) return 'No description available';
  //   if (description.length <= maxLength) return description;
  //   return description.substring(0, maxLength).trim() + '...';
  // };

  // Updated function to open modal with prefilled data instead of creating content directly
  const handleCreateFromSuggestion = (suggestion: AIContentSuggestion) => {
    // Set the initial data for the modal
    setModalInitialData({
      title: suggestion.title || '',
      description: suggestion.description || '',
      tags: Array.isArray(suggestion.tags) ? suggestion.tags : [],
    });

    // Open the modal
    setShowModal(true);

    // Show a helpful toast
    toast.success(
      '✨ AI suggestion loaded! Complete the form to create your content.',
      {
        duration: 4000,
        style: {
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          border: 'none',
          fontWeight: '500',
        },
        icon: '🚀',
      }
    );
  };

  const handleRefreshSuggestions = async () => {
    setIsRefreshingSuggestions(true);
    try {
      await refreshAISuggestions();
      toast.success('✨ AI suggestions refreshed!', {
        duration: 3000,
        style: {
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          border: 'none',
          fontWeight: '500',
        },
      });
    } catch (error) {
      console.error('Failed to refresh suggestions:', error);
      toast.error('Failed to refresh suggestions. Please try again.', {
        duration: 4000,
      });
    } finally {
      setIsRefreshingSuggestions(false);
    }
  };

  const handleContentCreated = (createdContent?: CreatedContent) => {
    // Clear modal initial data
    setModalInitialData(null);

    // Add the new content to the cached data
    if (createdContent) {
      addContent(createdContent);
    }

    // Celebrate with confetti
    setTimeout(() => {
      triggerContentCreationCelebration();
    }, 100);
  };

  // Function to handle opening the modal without prefilled data
  const handleOpenEmptyModal = () => {
    setModalInitialData(null);
    setShowModal(true);
  };

  // Function to handle closing the modal
  const handleCloseModal = () => {
    setShowModal(false);
    setModalInitialData(null);
  };

  // Get AI suggestions from cached data or empty array
  const displaySuggestions = aiSuggestions?.slice(0, 3) || [];

  return (
    <div className='p-6 min-h-screen bg-theme-primary transition-colors duration-200'>
      <h1 className='text-2xl font-semibold text-accent-primary font-bold'>
        Khronos Dashboard
      </h1>

      {/* Quick stats */}
      <div className='mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4'>
        <div className='bg-theme-card overflow-hidden shadow-theme-md rounded-lg border border-theme-primary hover:shadow-theme-lg transition-shadow duration-200'>
          <div className='px-4 py-5 sm:p-6'>
            <div className='flex items-center'>
              <div className='flex-shrink-0 bg-accent-primary rounded-md p-3'>
                <FiFileText className='h-6 w-6 text-white' />
              </div>
              <div className='ml-5 w-0 flex-1'>
                <dl>
                  <dt className='text-sm font-medium text-theme-secondary truncate'>
                    Total Content
                  </dt>
                  <dd className='flex items-baseline'>
                    <div className='text-2xl font-semibold text-theme-primary'>
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

        <div className='bg-theme-card overflow-hidden shadow-theme-md rounded-lg border border-theme-primary'>
          <div className='px-4 py-5 sm:p-6'>
            <div className='flex items-center'>
              <div className='flex-shrink-0 bg-accent-success rounded-md p-3'>
                <FiCalendar className='h-6 w-6 text-white' />
              </div>
              <div className='ml-5 w-0 flex-1'>
                <dl>
                  <dt className='text-sm font-medium text-theme-secondary truncate'>
                    Scheduled Posts
                  </dt>
                  <dd className='flex items-baseline'>
                    <div className='text-2xl font-semibold text-theme-primary'>
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

        <div className='bg-theme-card overflow-hidden shadow-theme-md rounded-lg border border-theme-primary'>
          <div className='px-4 py-5 sm:p-6'>
            <div className='flex items-center'>
              <div className='flex-shrink-0 bg-accent-secondary rounded-md p-3'>
                <FiBarChart2 className='h-6 w-6 text-white' />
              </div>
              <div className='ml-5 w-0 flex-1'>
                <dl>
                  <dt className='text-sm font-medium text-theme-secondary truncate'>
                    Avg. Engagement
                  </dt>
                  <dd className='flex items-baseline'>
                    <div className='text-2xl font-semibold text-theme-primary'>
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

        <div className='bg-theme-card overflow-hidden shadow-theme-md rounded-lg border border-theme-primary'>
          <div className='px-4 py-5 sm:p-6'>
            <div className='flex items-center'>
              <div className='flex-shrink-0 bg-accent-info rounded-md p-3'>
                <FiTrendingUp className='h-6 w-6 text-white' />
              </div>
              <div className='ml-5 w-0 flex-1'>
                <dl>
                  <dt className='text-sm font-medium text-theme-secondary truncate'>
                    Content Ideas
                  </dt>
                  <dd className='flex items-baseline'>
                    <div className='text-2xl font-semibold text-theme-primary'>
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
        <div className='bg-theme-card shadow-theme-md rounded-lg border border-theme-primary overflow-hidden'>
          <div className='px-4 py-5 border-b border-theme-primary sm:px-6'>
            <h3 className='text-lg font-medium leading-6 text-theme-primary'>
              Upcoming Content
            </h3>
          </div>

          {contextLoading ? (
            <div className='px-4 py-6 text-center'>
              <FiLoader className='h-6 w-6 animate-spin mx-auto text-indigo-600 dark:text-blue-400' />
              <p className='mt-2 text-sm text-theme-secondary'>
                Loading upcoming content...
              </p>
            </div>
          ) : upcomingContent.length === 0 ? (
            <div className='px-4 py-6 text-center'>
              <div className='mx-auto h-10 w-10 rounded-full bg-gray-100 dark:bg-slate-700 flex items-center justify-center mb-3'>
                <FiCalendar className='h-5 w-5 text-gray-400 dark:text-slate-400' />
              </div>
              <h3 className='text-sm font-medium text-theme-primary mb-1'>
                No scheduled content
              </h3>
              <p className='text-xs text-theme-secondary mb-4'>
                Create your first piece of content to get started!
              </p>
              <button
                onClick={handleOpenEmptyModal}
                className='inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-accent-primary hover:bg-accent-secondary transition-colors duration-150'
              >
                <FiFileText className='h-4 w-4 mr-2' />
                Create Content
              </button>
            </div>
          ) : (
            <div className='max-h-80 overflow-y-auto'>
              <ul className='divide-y divide-gray-200 dark:divide-slate-700'>
                {upcomingContent.map((content) => (
                  <li
                    key={content._id}
                    className='px-4 py-3 hover:bg-theme-hover transition-colors duration-150'
                  >
                    <div className='flex items-center justify-between'>
                      <div className='flex items-center min-w-0 flex-1'>
                        <div className='flex-shrink-0 h-8 w-8 rounded-full bg-indigo-100 dark:bg-blue-900/50 flex items-center justify-center'>
                          <span className='text-sm'>
                            {getTypeIcon(content.type)}
                          </span>
                        </div>
                        <div className='ml-3 min-w-0 flex-1'>
                          <div className='text-sm font-medium text-accent-primary truncate'>
                            {content.title}
                          </div>
                          <div className='text-xs text-theme-secondary'>
                            {content.metadata?.scheduledDate &&
                              formatScheduledDate(
                                content.metadata.scheduledDate
                              )}
                          </div>
                          {content.platform && content.platform.length > 0 && (
                            <div className='text-xs text-theme-tertiary mt-1'>
                              {content.platform
                                .map((p) => getPlatformIcon(p))
                                .join(' ')}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className='flex-shrink-0 ml-2'>
                        <span className='inline-flex items-center px-2 py-1 text-xs rounded-full bg-green-100 dark:bg-emerald-900/50 text-green-800 dark:text-emerald-300'>
                          Scheduled
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className='px-4 py-3 border-t border-theme-primary bg-theme-secondary'>
            <Link
              href='/calendar'
              className='text-sm font-medium text-accent-primary hover:text-accent-secondary transition-colors duration-150'
            >
              View full calendar →
            </Link>
          </div>
        </div>

        {/* AI Content Suggestions */}
        <div className='bg-theme-card shadow-theme-md rounded-lg border border-theme-primary overflow-hidden hover:shadow-theme-lg transition-shadow duration-200'>
          <div className='px-4 py-5 border-b border-theme-primary sm:px-6 flex items-center justify-between'>
            <h3 className='text-lg font-medium leading-6 text-theme-primary'>
              AI Content Suggestions
            </h3>
            {!contextLoading && (
              <button
                onClick={handleRefreshSuggestions}
                disabled={isRefreshingSuggestions}
                className='inline-flex items-center gap-2 text-sm text-accent-primary hover:text-accent-secondary transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed'
              >
                {isRefreshingSuggestions ? (
                  <>
                    <FiLoader className='h-4 w-4 animate-spin' />
                    Refreshing...
                  </>
                ) : (
                  <>
                    <FiRefreshCw className='h-4 w-4' />
                    Refresh
                  </>
                )}
              </button>
            )}
          </div>

          {contextLoading || isRefreshingSuggestions ? (
            <div className='px-4 py-6 text-center'>
              <FiLoader className='h-6 w-6 animate-spin mx-auto text-purple-600 dark:text-violet-400' />
              <p className='mt-2 text-sm text-gray-500 dark:text-slate-400'>
                {isRefreshingSuggestions
                  ? 'Refreshing AI suggestions...'
                  : 'Loading AI suggestions...'}
              </p>
            </div>
          ) : displaySuggestions.length === 0 ? (
            <div className='px-4 py-6 text-center'>
              <div className='mx-auto h-10 w-10 rounded-full bg-purple-100 dark:bg-violet-900/50 flex items-center justify-center mb-3'>
                <FiMessageSquare className='h-5 w-5 text-purple-600 dark:text-violet-400' />
              </div>
              <h3 className='text-sm font-medium text-gray-900 dark:text-slate-100 mb-1'>
                No suggestions available
              </h3>
              <p className='text-xs text-gray-500 dark:text-slate-400 mb-4'>
                AI content suggestions will appear here. Create some content
                first to get personalized recommendations.
              </p>
              <button
                onClick={handleRefreshSuggestions}
                disabled={isRefreshingSuggestions}
                className='inline-flex items-center gap-2 text-sm text-purple-600 dark:text-violet-400 hover:text-purple-500 dark:hover:text-violet-300 transition-colors duration-150 disabled:opacity-50'
              >
                {isRefreshingSuggestions ? (
                  <>
                    <FiLoader className='h-4 w-4 animate-spin' />
                    Refreshing...
                  </>
                ) : (
                  <>
                    <FiRefreshCw className='h-4 w-4' />
                    Refresh Suggestions
                  </>
                )}
              </button>
            </div>
          ) : (
            <div className='max-h-80 overflow-y-auto'>
              <ul className='divide-y divide-gray-200 dark:divide-slate-700'>
                {displaySuggestions.map((suggestion) => (
                  <li
                    key={suggestion.id}
                    className='px-4 py-4 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors duration-150'
                  >
                    <div className='flex items-start space-x-3'>
                      <div className='flex-shrink-0 h-8 w-8 rounded-full bg-purple-100 dark:bg-violet-900/50 flex items-center justify-center'>
                        <FiMessageSquare className='h-4 w-4 text-purple-600 dark:text-violet-400' />
                      </div>
                      <div className='min-w-0 flex-1'>
                        <div className='text-sm font-medium text-purple-600 dark:text-violet-400 mb-2 leading-tight'>
                          {suggestion.title}
                        </div>
                        {/* Display full description */}
                        <div className='text-xs text-gray-600 dark:text-slate-400 mb-3 leading-relaxed'>
                          {suggestion.description || 'No description available'}
                        </div>
                        <div className='flex items-center justify-between'>
                          <div className='flex items-center gap-2 text-xs text-gray-500 dark:text-slate-400'>
                            {suggestion.trendingScore &&
                              suggestion.trendingScore > 70 && (
                                <span className='inline-flex items-center px-2 py-1 text-xs rounded-full bg-orange-100 dark:bg-orange-900/50 text-orange-800 dark:text-orange-300'>
                                  🔥 Trending
                                </span>
                              )}
                            {suggestion.estimatedTime && (
                              <span className='text-xs text-gray-500 dark:text-slate-400'>
                                ⏱️ {suggestion.estimatedTime}
                              </span>
                            )}
                            {suggestion.difficulty && (
                              <span
                                className={`inline-flex items-center px-2 py-1 text-xs rounded-full ${
                                  suggestion.difficulty === 'easy'
                                    ? 'bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300'
                                    : suggestion.difficulty === 'medium'
                                    ? 'bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-300'
                                    : 'bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-300'
                                }`}
                              >
                                {suggestion.difficulty}
                              </span>
                            )}
                          </div>
                          <button
                            onClick={() =>
                              handleCreateFromSuggestion(suggestion)
                            }
                            className='inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-md bg-purple-100 dark:bg-violet-900/50 text-purple-700 dark:text-violet-300 hover:bg-purple-200 dark:hover:bg-violet-800/50 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-1'
                          >
                            <FiFileText className='h-3 w-3 mr-1' />
                            Use Suggestion
                          </button>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className='px-4 py-3 border-t border-theme-primary bg-theme-secondary'>
            <span className='text-sm font-medium text-accent-primary'>
              Chat with AI using the floating button! ✨
            </span>
          </div>
        </div>
      </div>

      {/* Quick access */}
      <div className='mt-6'>
        <h2 className='text-lg font-medium text-theme-primary'>Quick Access</h2>
        <div className='mt-3 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4'>
          <button
            onClick={handleOpenEmptyModal}
            className='bg-theme-card overflow-hidden shadow-theme-md rounded-lg p-6 hover:bg-theme-hover border border-theme-primary transition-colors duration-150 text-left w-full'
          >
            <div className='flex items-center'>
              <div className='flex-shrink-0 bg-accent-primary rounded-md p-3'>
                <FiFileText className='h-6 w-6 text-white' />
              </div>
              <div className='ml-4'>
                <h3 className='text-lg font-medium text-theme-primary cursor-pointer'>
                  Create Content
                </h3>
                <p className='text-sm text-theme-secondary'>
                  Add new content to your calendar
                </p>
              </div>
            </div>
          </button>

          <Link
            href='/calendar'
            className='bg-theme-card overflow-hidden shadow-theme-md rounded-lg p-6 hover:bg-theme-hover border border-theme-primary transition-colors duration-150'
          >
            <div className='flex items-center'>
              <div className='flex-shrink-0 bg-green-500 dark:bg-emerald-600 rounded-md p-3'>
                <FiCalendar className='h-6 w-6 text-white' />
              </div>
              <div className='ml-4'>
                <h3 className='text-lg font-medium text-theme-primary'>
                  View Calendar
                </h3>
                <p className='text-sm text-theme-secondary'>
                  Manage your content schedule
                </p>
              </div>
            </div>
          </Link>

          <div className='bg-theme-card overflow-hidden shadow-theme-md rounded-lg p-6 border-2 border-accent-primary/30 transition-colors duration-150'>
            <div className='flex items-center'>
              <div className='flex-shrink-0 bg-purple-500 dark:bg-violet-600 rounded-md p-3'>
                <FiMessageSquare className='h-6 w-6 text-white' />
              </div>
              <div className='ml-4'>
                <h3 className='text-lg font-medium text-theme-primary'>
                  AI Chat
                </h3>
                <p className='text-sm text-theme-secondary'>
                  Use the floating button for AI assistance ✨
                </p>
              </div>
            </div>
          </div>

          <Link
            href='/analytics'
            className='bg-theme-card overflow-hidden shadow-theme-md rounded-lg p-6 hover:bg-theme-hover border border-theme-primary transition-colors duration-150'
          >
            <div className='flex items-center'>
              <div className='flex-shrink-0 bg-blue-500 dark:bg-sky-600 rounded-md p-3'>
                <FiBarChart2 className='h-6 w-6 text-white' />
              </div>
              <div className='ml-4'>
                <h3 className='text-lg font-medium text-theme-primary'>
                  Analytics
                </h3>
                <p className='text-sm text-theme-secondary'>
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
        onClose={handleCloseModal}
        onSubmit={handleContentCreated}
        initialData={modalInitialData}
      />
    </div>
  );
}
