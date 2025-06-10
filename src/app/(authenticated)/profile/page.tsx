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
  FiShield,
  FiZap,
  FiStar,
  FiTarget,
  FiHeart,
  FiShare2,
  FiEye,
} from 'react-icons/fi';
import { useAuth } from '@/src/context/AuthContext';
import { profileAPI, contentAPI } from '@/src/lib/api';
import { User } from '@/src/types/auth';

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
  type: 'created' | 'published' | 'scheduled' | 'edited';
  title: string;
  timestamp: string;
  platform?: string;
}

export default function ProfilePage() {
  const { user: contextUser } = useAuth();
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

  // Fetch profile data and stats
  useEffect(() => {
    const fetchProfileData = async () => {
      if (!contextUser) return;

      setLoading(true);
      setError(null);

      try {
        // Fetch profile data
        const profileResponse = await profileAPI.getProfile();
        if (profileResponse.data?.data) {
          setProfileData(profileResponse.data.data);
        }

        // Fetch user content for stats
        const contentResponse = await contentAPI.getUserContent();
        if (contentResponse.data?.data) {
          const content = contentResponse.data.data;
          const published = content.filter(
            (item: { status: string }) => item.status === 'published'
          ).length;
          const scheduled = content.filter(
            (item: { status: string }) => item.status === 'scheduled'
          ).length;

          // Generate some placeholder stats (replace with real calculations)
          const totalViews = Math.floor(Math.random() * 10000) + 1000;
          const totalShares = Math.floor(Math.random() * 1000) + 100;
          const engagementRate = Math.floor(Math.random() * 30) + 70;
          const streak = Math.floor(Math.random() * 30) + 1;

          setUserStats({
            totalContent: content.length,
            scheduledContent: scheduled,
            publishedContent: published,
            engagementRate,
            totalViews,
            totalShares,
            streak,
          });

          // Generate recent activity from content
          const recentItems: RecentActivity[] = content.slice(0, 5).map(
            (
              item: {
                _id: string;
                status: string;
                title: string;
                updatedAt: string;
                createdAt: string;
                platform: string[];
              },
              index: number
            ) => ({
              id: item._id || `activity-${index}`,
              type: item.status === 'published' ? 'published' : 'created',
              title: item.title || 'Untitled Content',
              timestamp:
                item.updatedAt || item.createdAt || new Date().toISOString(),
              platform: item.platform?.[0] || 'Instagram',
            })
          );

          setRecentActivity(recentItems);
        }
      } catch (err) {
        console.error('Failed to fetch profile data:', err);
        setError('Failed to load profile data');
        setProfileData(contextUser);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [contextUser]);

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

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'published':
        return <FiShare2 className='h-4 w-4 text-green-600' />;
      case 'scheduled':
        return <FiClock className='h-4 w-4 text-blue-600' />;
      case 'edited':
        return <FiEdit3 className='h-4 w-4 text-orange-600' />;
      default:
        return <FiFileText className='h-4 w-4 text-purple-600' />;
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Recently';

      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffDays = Math.floor(diffHours / 24);

      if (diffHours < 1) return 'Just now';
      if (diffHours < 24) return `${diffHours}h ago`;
      if (diffDays < 7) return `${diffDays}d ago`;
      return date.toLocaleDateString();
    } catch {
      return 'Recently';
    }
  };

  if (loading) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 flex items-center justify-center'>
        <div className='text-center'>
          <div className='w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4'></div>
          <p className='text-gray-600 font-medium'>Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 flex items-center justify-center'>
        <div className='text-center'>
          <div className='w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4'>
            <FiUser className='h-8 w-8 text-red-600' />
          </div>
          <p className='text-red-600 font-medium'>
            {error || 'Failed to load profile'}
          </p>
          <Link
            href='/dashboard'
            className='text-indigo-600 hover:underline mt-2 inline-block'
          >
            Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        {/* Profile Header */}
        <div className='bg-white rounded-2xl shadow-lg border border-slate-200/60 p-6 sm:p-8 mb-8'>
          <div className='flex flex-col sm:flex-row sm:items-start sm:space-x-6'>
            {/* Profile Picture */}
            <div className='relative mb-6 sm:mb-0'>
              <div className='relative'>
                {user.profilePicUrl || user.avatar ? (
                  <Image
                    className='h-20 w-20 sm:h-24 sm:w-24 rounded-2xl object-cover shadow-lg'
                    src={user.profilePicUrl || user.avatar || ''}
                    width={96}
                    height={96}
                    alt={user.name}
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                ) : null}
                {!user.profilePicUrl && !user.avatar ? (
                  <div className='h-20 w-20 sm:h-24 sm:w-24 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg'>
                    <span className='text-white font-bold text-xl sm:text-2xl'>
                      {getInitials(user.name)}
                    </span>
                  </div>
                ) : null}
                {/* Online Status */}
                <div className='absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white shadow-md flex items-center justify-center'>
                  <div className='w-2 h-2 bg-white rounded-full'></div>
                </div>
              </div>
            </div>

            {/* Profile Info & Actions */}
            <div className='flex-1 min-w-0'>
              <div className='flex flex-col sm:flex-row sm:items-start sm:justify-between space-y-4 sm:space-y-0'>
                {/* User Details */}
                <div className='min-w-0'>
                  <h1 className='text-2xl sm:text-3xl font-bold text-gray-900 truncate'>
                    {user.name}
                  </h1>
                  <p className='text-gray-600 text-base truncate mt-1'>
                    {user.email}
                  </p>

                  {/* Tags & Info */}
                  <div className='flex flex-col sm:flex-row sm:items-center gap-3 mt-4'>
                    <div className='flex items-center gap-3 flex-wrap'>
                      <span className='inline-flex items-center px-3 py-1.5 bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-700 text-sm font-medium rounded-lg border border-emerald-200'>
                        <span className='mr-1.5 text-base'>
                          {getRoleIcon(getDisplayRole(user.role))}
                        </span>
                        {getDisplayRole(user.role)}
                      </span>

                      <div className='flex items-center space-x-1.5 text-sm text-gray-500'>
                        <FiCalendar className='h-4 w-4' />
                        <span>
                          Joined{' '}
                          {user.createdAt &&
                          !isNaN(new Date(user.createdAt).getTime())
                            ? new Date(user.createdAt).getFullYear()
                            : 'Recently'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className='flex items-center gap-3 shrink-0'>
                  <Link
                    href='/profile/edit'
                    className='inline-flex items-center px-4 sm:px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-lg hover:shadow-lg hover:shadow-indigo-500/25 transition-all duration-200 text-sm'
                  >
                    <FiEdit3 className='h-4 w-4 mr-2' />
                    Edit Profile
                  </Link>
                  <Link
                    href='/settings'
                    className='inline-flex items-center px-4 sm:px-5 py-2.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 font-medium rounded-lg transition-all duration-200 text-sm'
                  >
                    <FiSettings className='h-4 w-4 mr-2' />
                    Settings
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          {/* Stats Overview */}
          <div className='lg:col-span-2'>
            <div className='bg-white rounded-2xl shadow-lg border border-slate-200/60 p-6 mb-8'>
              <div className='flex items-center justify-between mb-6'>
                <h2 className='text-xl font-bold text-gray-900'>
                  Performance Overview
                </h2>
                <FiTrendingUp className='h-5 w-5 text-indigo-600' />
              </div>

              <div className='grid grid-cols-2 md:grid-cols-4 gap-6'>
                <div className='text-center group'>
                  <div className='flex items-center justify-center w-16 h-16 mx-auto mb-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg group-hover:shadow-xl transition-all duration-200'>
                    <FiFileText className='h-8 w-8 text-white' />
                  </div>
                  <div className='text-2xl font-bold text-gray-900 mb-1'>
                    {userStats.totalContent}
                  </div>
                  <div className='text-sm text-gray-500 font-medium'>
                    Total Content
                  </div>
                </div>

                <div className='text-center group'>
                  <div className='flex items-center justify-center w-16 h-16 mx-auto mb-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-lg group-hover:shadow-xl transition-all duration-200'>
                    <FiShare2 className='h-8 w-8 text-white' />
                  </div>
                  <div className='text-2xl font-bold text-gray-900 mb-1'>
                    {userStats.publishedContent}
                  </div>
                  <div className='text-sm text-gray-500 font-medium'>
                    Published
                  </div>
                </div>

                <div className='text-center group'>
                  <div className='flex items-center justify-center w-16 h-16 mx-auto mb-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl shadow-lg group-hover:shadow-xl transition-all duration-200'>
                    <FiClock className='h-8 w-8 text-white' />
                  </div>
                  <div className='text-2xl font-bold text-gray-900 mb-1'>
                    {userStats.scheduledContent}
                  </div>
                  <div className='text-sm text-gray-500 font-medium'>
                    Scheduled
                  </div>
                </div>

                <div className='text-center group'>
                  <div className='flex items-center justify-center w-16 h-16 mx-auto mb-3 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl shadow-lg group-hover:shadow-xl transition-all duration-200'>
                    <FiZap className='h-8 w-8 text-white' />
                  </div>
                  <div className='text-2xl font-bold text-gray-900 mb-1'>
                    {userStats.streak}
                  </div>
                  <div className='text-sm text-gray-500 font-medium'>
                    Day Streak
                  </div>
                </div>
              </div>

              {/* Additional Stats */}
              <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 pt-6 border-t border-gray-200'>
                <div className='flex items-center space-x-3'>
                  <FiEye className='h-5 w-5 text-gray-400' />
                  <div>
                    <div className='font-semibold text-gray-900'>
                      {userStats.totalViews.toLocaleString()}
                    </div>
                    <div className='text-sm text-gray-500'>Total Views</div>
                  </div>
                </div>
                <div className='flex items-center space-x-3'>
                  <FiHeart className='h-5 w-5 text-gray-400' />
                  <div>
                    <div className='font-semibold text-gray-900'>
                      {userStats.engagementRate}%
                    </div>
                    <div className='text-sm text-gray-500'>Engagement Rate</div>
                  </div>
                </div>
                <div className='flex items-center space-x-3'>
                  <FiShare2 className='h-5 w-5 text-gray-400' />
                  <div>
                    <div className='font-semibold text-gray-900'>
                      {userStats.totalShares}
                    </div>
                    <div className='text-sm text-gray-500'>Total Shares</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className='bg-white rounded-2xl shadow-lg border border-slate-200/60 p-6'>
              <div className='flex items-center justify-between mb-6'>
                <h2 className='text-xl font-bold text-gray-900'>
                  Recent Activity
                </h2>
                <FiActivity className='h-5 w-5 text-indigo-600' />
              </div>

              <div className='space-y-4'>
                {recentActivity.length > 0 ? (
                  recentActivity.map((activity) => (
                    <div
                      key={activity.id}
                      className='flex items-start space-x-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200'
                    >
                      <div className='flex-shrink-0'>
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className='flex-1 min-w-0'>
                        <p className='text-sm font-medium text-gray-900 truncate'>
                          {activity.title}
                        </p>
                        <div className='flex items-center space-x-2 mt-1'>
                          <span className='text-xs text-gray-500 capitalize'>
                            {activity.type}
                          </span>
                          {activity.platform && (
                            <>
                              <span className='text-xs text-gray-300'>•</span>
                              <span className='text-xs text-gray-500'>
                                {activity.platform}
                              </span>
                            </>
                          )}
                          <span className='text-xs text-gray-300'>•</span>
                          <span className='text-xs text-gray-500'>
                            {formatDate(activity.timestamp)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className='text-center py-8'>
                    <FiActivity className='h-12 w-12 text-gray-300 mx-auto mb-4' />
                    <p className='text-gray-500'>No recent activity</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className='space-y-6'>
            {/* Quick Actions */}
            <div className='bg-white rounded-2xl shadow-lg border border-slate-200/60 p-6'>
              <h3 className='text-lg font-bold text-gray-900 mb-4'>
                Quick Actions
              </h3>
              <div className='space-y-3'>
                <Link
                  href='/content/create'
                  className='flex items-center p-3 bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 rounded-xl hover:shadow-md transition-all duration-200 group'
                >
                  <FiFileText className='h-5 w-5 mr-3 group-hover:scale-110 transition-transform duration-200' />
                  Create New Content
                </Link>
                <Link
                  href='/calendar'
                  className='flex items-center p-3 bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 rounded-xl hover:shadow-md transition-all duration-200 group'
                >
                  <FiCalendar className='h-5 w-5 mr-3 group-hover:scale-110 transition-transform duration-200' />
                  Schedule Content
                </Link>
                <Link
                  href='/analytics'
                  className='flex items-center p-3 bg-gradient-to-r from-orange-50 to-red-50 text-orange-700 rounded-xl hover:shadow-md transition-all duration-200 group'
                >
                  <FiTrendingUp className='h-5 w-5 mr-3 group-hover:scale-110 transition-transform duration-200' />
                  View Analytics
                </Link>
              </div>
            </div>

            {/* Account Info */}
            <div className='bg-white rounded-2xl shadow-lg border border-slate-200/60 p-6'>
              <h3 className='text-lg font-bold text-gray-900 mb-4'>
                Account Information
              </h3>
              <div className='space-y-4'>
                <div className='flex items-center space-x-3'>
                  <FiMail className='h-5 w-5 text-gray-400' />
                  <div>
                    <div className='text-sm font-medium text-gray-900'>
                      Email
                    </div>
                    <div className='text-sm text-gray-600'>{user.email}</div>
                  </div>
                </div>
                <div className='flex items-center space-x-3'>
                  <FiShield className='h-5 w-5 text-gray-400' />
                  <div>
                    <div className='text-sm font-medium text-gray-900'>
                      Role
                    </div>
                    <div className='text-sm text-gray-600 capitalize'>
                      {getDisplayRole(user.role)}
                    </div>
                  </div>
                </div>
                <div className='flex items-center space-x-3'>
                  <FiCalendar className='h-5 w-5 text-gray-400' />
                  <div>
                    <div className='text-sm font-medium text-gray-900'>
                      Member Since
                    </div>
                    <div className='text-sm text-gray-600'>
                      {user.createdAt &&
                      !isNaN(new Date(user.createdAt).getTime())
                        ? new Date(user.createdAt).toLocaleDateString()
                        : 'Recently joined'}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Achievements */}
            <div className='bg-white rounded-2xl shadow-lg border border-slate-200/60 p-6'>
              <h3 className='text-lg font-bold text-gray-900 mb-4'>
                Achievements
              </h3>
              <div className='space-y-3'>
                <div className='flex items-center space-x-3 p-3 bg-yellow-50 rounded-xl'>
                  <FiStar className='h-5 w-5 text-yellow-600' />
                  <div>
                    <div className='text-sm font-medium text-gray-900'>
                      Content Creator
                    </div>
                    <div className='text-xs text-gray-600'>
                      Created your first content
                    </div>
                  </div>
                </div>
                {userStats.streak >= 7 && (
                  <div className='flex items-center space-x-3 p-3 bg-orange-50 rounded-xl'>
                    <FiZap className='h-5 w-5 text-orange-600' />
                    <div>
                      <div className='text-sm font-medium text-gray-900'>
                        On Fire!
                      </div>
                      <div className='text-xs text-gray-600'>
                        {userStats.streak} day streak
                      </div>
                    </div>
                  </div>
                )}
                {userStats.totalContent >= 10 && (
                  <div className='flex items-center space-x-3 p-3 bg-green-50 rounded-xl'>
                    <FiTarget className='h-5 w-5 text-green-600' />
                    <div>
                      <div className='text-sm font-medium text-gray-900'>
                        Prolific Creator
                      </div>
                      <div className='text-xs text-gray-600'>
                        Created {userStats.totalContent} pieces of content
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
