'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  FiEdit3,
  FiMail,
  FiCalendar,
  FiUser,
  FiActivity,
  FiFileText,
  FiTrendingUp,
  FiClock,
  FiSettings,
  FiZap,
  FiEye,
  FiShare2,
} from 'react-icons/fi';
import { useAuth } from '@/src/context/AuthContext';
import { useUserData } from '@/src/context/UserDataContext';
import { User } from '@/src/types/auth';
import PageLoading from '@/src/components/ui/page-loading';

interface UserStats {
  totalContent: number;
  scheduledContent: number;
  publishedContent: number;
  engagementRate: number;
  totalViews: number;
  totalShares: number;
  streak: number;
}

interface RecentActivity {
  id: string;
  type: 'published' | 'created' | 'scheduled';
  title: string;
  timestamp: string;
  platform: string;
}

export default function ProfilePage() {
  const { user: contextUser } = useAuth();
  const {
    profileData: cachedProfile,
    userStats: cachedStats,
    userContent,
    loading: contextLoading,
  } = useUserData();

  const [profileData, setProfileData] = useState<User | null>(null);
  const [userStats, setUserStats] = useState<UserStats>({
    totalContent: 0,
    scheduledContent: 0,
    publishedContent: 0,
    engagementRate: 0,
    totalViews: 0,
    totalShares: 0,
    streak: 0,
  });
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Use cached data instead of fetching
  useEffect(() => {
    console.log('Profile page: Using cached data', {
      cachedProfile,
      cachedStats,
      userContent,
      contextLoading,
    });

    if (!contextUser) return;

    setLoading(contextLoading);
    setError(null);

    // Use cached profile data
    setProfileData(cachedProfile || contextUser);

    // Use cached stats if available
    if (cachedStats) {
      setUserStats({
        totalContent: cachedStats.totalContent,
        scheduledContent: cachedStats.scheduledContent,
        publishedContent:
          cachedStats.totalContent - cachedStats.scheduledContent, // Approximate published content
        engagementRate: cachedStats.engagementRate,
        totalViews: Math.floor(Math.random() * 10000) + 1000, // Still placeholder for views
        totalShares: Math.floor(Math.random() * 1000) + 100, // Still placeholder for shares
        streak: cachedStats.streak,
      });
    }

    // Generate recent activity from cached content
    if (userContent && userContent.length > 0) {
      const recentItems: RecentActivity[] = userContent
        .slice(0, 5)
        .map((item, index) => ({
          id: item._id || `activity-${index}`,
          type: item.status === 'published' ? 'published' : 'created',
          title: item.title || 'Untitled Content',
          timestamp:
            item.updatedAt || item.createdAt || new Date().toISOString(),
          platform: item.platform?.[0] || 'Instagram',
        }));
      setRecentActivity(recentItems);
    }

    if (!contextLoading) {
      setLoading(false);
    }
  }, [contextUser, cachedProfile, cachedStats, userContent, contextLoading]);

  const user = profileData || contextUser;

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((word) => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getDisplayRole = (role: string | undefined | null) => {
    if (!role) return 'Content Creator';

    const roleStr = String(role);
    // Check if it's a MongoDB ObjectId or similar ID
    if (roleStr.length === 24 && /^[a-f\d]{24}$/i.test(roleStr)) {
      return 'Content Creator';
    }

    // Check if it's any kind of ID-like string
    if (roleStr.length > 15 && /^[a-z0-9]+$/i.test(roleStr)) {
      return 'Content Creator';
    }

    // Display the role if it looks like a proper role name
    return roleStr.toLowerCase().replace('_', ' ');
  };

  const getRoleIcon = (role: string) => {
    const lowerRole = role.toLowerCase();
    if (lowerRole.includes('admin')) return '👑';
    if (lowerRole.includes('manager')) return '🎯';
    if (lowerRole.includes('creator')) return '✨';
    return '🚀';
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return 'Not specified';
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'published':
        return <FiActivity className='w-4 h-4 text-green-500' />;
      case 'created':
        return <FiFileText className='w-4 h-4 text-blue-500' />;
      case 'scheduled':
        return <FiClock className='w-4 h-4 text-orange-500' />;
      default:
        return <FiActivity className='w-4 h-4 text-gray-500' />;
    }
  };

  const getRelativeTime = (timestamp: string) => {
    try {
      const date = new Date(timestamp);
      const now = new Date();
      const diffInHours = Math.floor(
        (now.getTime() - date.getTime()) / (1000 * 60 * 60)
      );

      if (diffInHours < 1) return 'Just now';
      if (diffInHours < 24) return `${diffInHours}h ago`;

      const diffInDays = Math.floor(diffInHours / 24);
      if (diffInDays < 7) return `${diffInDays}d ago`;

      const diffInWeeks = Math.floor(diffInDays / 7);
      return `${diffInWeeks}w ago`;
    } catch {
      return 'Recently';
    }
  };

  if (loading) {
    return (
      <PageLoading
        title='Loading Profile'
        subtitle='Getting your profile ready...'
        contentType='content'
      />
    );
  }

  if (error) {
    return (
      <div className='flex items-center justify-center min-h-screen bg-theme-primary'>
        <div className='text-center'>
          <div className='w-16 h-16 bg-red-100 dark:bg-red-900/50 rounded-full flex items-center justify-center mx-auto mb-4'>
            <FiUser className='w-8 h-8 text-red-600 dark:text-red-400' />
          </div>
          <h1 className='text-xl font-semibold text-theme-primary mb-2'>
            Failed to Load Profile
          </h1>
          <p className='text-theme-secondary mb-4'>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className='px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200'
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className='flex items-center justify-center min-h-screen bg-theme-primary'>
        <div className='text-center'>
          <div className='w-16 h-16 bg-theme-secondary rounded-full flex items-center justify-center mx-auto mb-4'>
            <FiUser className='w-8 h-8 text-theme-muted' />
          </div>
          <h1 className='text-xl font-semibold text-theme-primary mb-2'>
            No Profile Found
          </h1>
          <p className='text-theme-secondary'>
            Unable to load profile information.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-theme-secondary transition-colors duration-200'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        {/* Improved Profile Header */}
        <div className='bg-theme-card rounded-3xl shadow-theme-sm border border-theme-primary overflow-hidden mb-8'>
          <div className='p-8'>
            <div className='flex flex-col sm:flex-row sm:items-center sm:space-x-6'>
              {/* Avatar */}
              <div className='flex-shrink-0 relative mb-6 sm:mb-0'>
                {user.profilePicUrl || user.avatar ? (
                  <Image
                    src={user.profilePicUrl || user.avatar || ''}
                    alt={`${user.name}'s profile`}
                    width={120}
                    height={120}
                    className='w-24 h-24 sm:w-30 sm:h-30 rounded-2xl shadow-lg object-cover ring-4 ring-white dark:ring-slate-800'
                  />
                ) : (
                  <div className='w-24 h-24 sm:w-30 sm:h-30 rounded-2xl shadow-lg bg-gradient-to-br from-indigo-500 to-purple-600 dark:from-blue-500 dark:to-indigo-600 flex items-center justify-center ring-4 ring-white dark:ring-slate-800'>
                    <span className='text-2xl font-bold text-white'>
                      {getInitials(user.name || '')}
                    </span>
                  </div>
                )}
                <div className='absolute -bottom-2 -right-2 w-6 h-6 bg-green-500 rounded-full border-4 border-white dark:border-slate-800 shadow-lg'></div>
              </div>

              {/* Profile Info */}
              <div className='flex-1 min-w-0'>
                <div className='flex flex-col sm:flex-row sm:items-start sm:justify-between'>
                  <div className='flex-1 min-w-0'>
                    <h1 className='text-3xl font-bold text-gray-900 dark:text-slate-100 truncate mb-2'>
                      {user.name || 'Anonymous User'}
                    </h1>

                    <div className='flex flex-wrap items-center gap-4 mb-3'>
                      <div className='flex items-center text-gray-600 dark:text-slate-400'>
                        <FiMail className='w-4 h-4 mr-2 flex-shrink-0' />
                        <span className='text-sm truncate'>{user.email}</span>
                      </div>
                      <div className='flex items-center text-gray-600 dark:text-slate-400'>
                        <span className='text-lg mr-2'>
                          {getRoleIcon(getDisplayRole(user.role))}
                        </span>
                        <span className='text-sm capitalize'>
                          {getDisplayRole(user.role)}
                        </span>
                      </div>
                    </div>

                    <div className='flex items-center text-gray-500 dark:text-slate-500'>
                      <FiCalendar className='w-4 h-4 mr-2' />
                      <span className='text-sm'>
                        Joined{' '}
                        {formatDate(user.createdAt || new Date().toISOString())}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className='flex space-x-3 mt-6 sm:mt-0 sm:ml-6'>
                    <Link
                      href='/profile/edit'
                      className='inline-flex items-center px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-700 text-white rounded-xl text-sm font-medium transition-colors duration-200 shadow-sm'
                    >
                      <FiEdit3 className='w-4 h-4 mr-2' />
                      Edit Profile
                    </Link>
                    <Link
                      href='/settings'
                      className='inline-flex items-center px-4 py-2.5 border border-gray-300 dark:border-slate-600 rounded-xl text-sm font-medium text-gray-700 dark:text-slate-300 bg-white dark:bg-slate-700 hover:bg-gray-50 dark:hover:bg-slate-600 transition-colors duration-200 shadow-sm'
                    >
                      <FiSettings className='w-4 h-4 mr-2' />
                      Settings
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className='grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-8'>
          {/* Total Content */}
          <div className='bg-white dark:bg-slate-800 rounded-2xl p-5 border border-gray-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow duration-200'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider'>
                  Total Content
                </p>
                <p className='text-2xl font-bold text-gray-900 dark:text-slate-100 mt-1'>
                  {userStats.totalContent}
                </p>
              </div>
              <div className='w-10 h-10 bg-blue-100 dark:bg-blue-900/50 rounded-xl flex items-center justify-center'>
                <FiFileText className='w-5 h-5 text-blue-600 dark:text-blue-400' />
              </div>
            </div>
          </div>

          {/* Scheduled */}
          <div className='bg-white dark:bg-slate-800 rounded-2xl p-5 border border-gray-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow duration-200'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider'>
                  Scheduled
                </p>
                <p className='text-2xl font-bold text-gray-900 dark:text-slate-100 mt-1'>
                  {userStats.scheduledContent}
                </p>
              </div>
              <div className='w-10 h-10 bg-orange-100 dark:bg-orange-900/50 rounded-xl flex items-center justify-center'>
                <FiClock className='w-5 h-5 text-orange-600 dark:text-orange-400' />
              </div>
            </div>
          </div>

          {/* Published */}
          <div className='bg-white dark:bg-slate-800 rounded-2xl p-5 border border-gray-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow duration-200'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider'>
                  Published
                </p>
                <p className='text-2xl font-bold text-gray-900 dark:text-slate-100 mt-1'>
                  {userStats.publishedContent}
                </p>
              </div>
              <div className='w-10 h-10 bg-green-100 dark:bg-green-900/50 rounded-xl flex items-center justify-center'>
                <FiActivity className='w-5 h-5 text-green-600 dark:text-green-400' />
              </div>
            </div>
          </div>

          {/* Engagement Rate */}
          <div className='bg-white dark:bg-slate-800 rounded-2xl p-5 border border-gray-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow duration-200'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider'>
                  Engagement
                </p>
                <p className='text-2xl font-bold text-gray-900 dark:text-slate-100 mt-1'>
                  {userStats.engagementRate}%
                </p>
              </div>
              <div className='w-10 h-10 bg-purple-100 dark:bg-purple-900/50 rounded-xl flex items-center justify-center'>
                <FiTrendingUp className='w-5 h-5 text-purple-600 dark:text-purple-400' />
              </div>
            </div>
          </div>

          {/* Total Views */}
          <div className='bg-white dark:bg-slate-800 rounded-2xl p-5 border border-gray-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow duration-200'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider'>
                  Total Views
                </p>
                <p className='text-2xl font-bold text-gray-900 dark:text-slate-100 mt-1'>
                  {userStats.totalViews.toLocaleString()}
                </p>
              </div>
              <div className='w-10 h-10 bg-indigo-100 dark:bg-indigo-900/50 rounded-xl flex items-center justify-center'>
                <FiEye className='w-5 h-5 text-indigo-600 dark:text-indigo-400' />
              </div>
            </div>
          </div>

          {/* Total Shares */}
          <div className='bg-white dark:bg-slate-800 rounded-2xl p-5 border border-gray-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow duration-200'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider'>
                  Total Shares
                </p>
                <p className='text-2xl font-bold text-gray-900 dark:text-slate-100 mt-1'>
                  {userStats.totalShares.toLocaleString()}
                </p>
              </div>
              <div className='w-10 h-10 bg-pink-100 dark:bg-pink-900/50 rounded-xl flex items-center justify-center'>
                <FiShare2 className='w-5 h-5 text-pink-600 dark:text-pink-400' />
              </div>
            </div>
          </div>

          {/* Streak */}
          <div className='bg-white dark:bg-slate-800 rounded-2xl p-5 border border-gray-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow duration-200'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider'>
                  Streak
                </p>
                <p className='text-2xl font-bold text-gray-900 dark:text-slate-100 mt-1'>
                  {userStats.streak}
                </p>
              </div>
              <div className='w-10 h-10 bg-yellow-100 dark:bg-yellow-900/50 rounded-xl flex items-center justify-center'>
                <FiZap className='w-5 h-5 text-yellow-600 dark:text-yellow-400' />
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity - Full Width */}
        <div className='bg-white dark:bg-slate-800 rounded-3xl shadow-sm dark:shadow-slate-700/20 border border-gray-200 dark:border-slate-700'>
          <div className='px-8 py-6 border-b border-gray-200 dark:border-slate-700'>
            <h3 className='text-xl font-semibold text-gray-900 dark:text-slate-100'>
              Recent Activity
            </h3>
          </div>
          <div className='p-8'>
            {recentActivity.length > 0 ? (
              <div className='space-y-4'>
                {recentActivity.map((activity) => (
                  <div
                    key={activity.id}
                    className='flex items-center space-x-4 p-4 rounded-2xl hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors duration-200'
                  >
                    <div className='flex-shrink-0'>
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className='flex-1 min-w-0'>
                      <p className='text-sm font-medium text-gray-900 dark:text-slate-100 truncate'>
                        {activity.title}
                      </p>
                      <p className='text-sm text-gray-500 dark:text-slate-400'>
                        {activity.type === 'published'
                          ? 'Published on'
                          : activity.type === 'scheduled'
                          ? 'Scheduled for'
                          : 'Created for'}{' '}
                        {activity.platform}
                      </p>
                    </div>
                    <div className='flex-shrink-0 text-sm text-gray-500 dark:text-slate-400'>
                      {getRelativeTime(activity.timestamp)}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className='text-center py-12'>
                <div className='w-16 h-16 bg-gray-100 dark:bg-slate-700 rounded-2xl flex items-center justify-center mx-auto mb-4'>
                  <FiActivity className='w-8 h-8 text-gray-400 dark:text-slate-500' />
                </div>
                <h3 className='text-lg font-medium text-gray-900 dark:text-slate-100 mb-2'>
                  No recent activity
                </h3>
                <p className='text-gray-500 dark:text-slate-400'>
                  Your recent content activity will appear here.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
