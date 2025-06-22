'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  FiBell,
  FiMenu,
  FiX,
  FiChevronDown,
  FiActivity,
  FiUser,
  FiSettings,
  FiCreditCard,
  FiLogOut,
  FiEdit3,
  FiTrendingUp,
  FiCalendar,
  FiFileText,
  FiZap,
  FiSun,
  FiMoon,
  FiMonitor,
} from 'react-icons/fi';
import { useTheme } from 'next-themes';
import { profileAPI, contentAPI } from '@/src/lib/api';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/src/context/AuthContext';
import { User } from '@/src/types/auth';
import { useNotifications } from '@/src/context/NotificationContext';
import NotificationDropdown from '@/src/components/notifications/NotificationDropdown';

interface UserStats {
  totalContent: number;
  scheduledContent: number;
  engagementRate: number;
  streak: number;
}

export default function Navbar() {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileData, setProfileData] = useState<User | null>(null);
  const [userStats, setUserStats] = useState<UserStats>({
    totalContent: 0,
    scheduledContent: 0,
    engagementRate: 0,
    streak: 0,
  });
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [loadingStats, setLoadingStats] = useState(false);
  const [mounted, setMounted] = useState(false);

  const router = useRouter();
  const { user: contextUser, logout } = useAuth();
  const { unreadCount } = useNotifications();
  const { theme, setTheme } = useTheme();

  // Handle theme mounting
  useEffect(() => {
    setMounted(true);
  }, []);

  // Close notifications and profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;

      // Close notifications dropdown
      if (
        !target.closest('.notification-dropdown') &&
        !target.closest('.notification-button')
      ) {
        setNotificationsOpen(false);
      }

      // Close profile dropdown
      if (
        !target.closest('.profile-dropdown') &&
        !target.closest('.profile-button')
      ) {
        setProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch user profile data and stats
  useEffect(() => {
    const fetchUserData = async () => {
      if (!contextUser) return;

      setLoadingProfile(true);
      setLoadingStats(true);

      try {
        // Fetch profile data
        const profileResponse = await profileAPI.getProfile();
        if (profileResponse.data?.data) {
          setProfileData(profileResponse.data.data);
        }

        // Fetch user stats
        const contentResponse = await contentAPI.getUserContent();
        if (contentResponse.data?.data) {
          const content = contentResponse.data.data;
          const scheduled = content.filter(
            (item: { status: string }) => item.status === 'scheduled'
          ).length;

          // Calculate real engagement rate based on content performance
          const published = content.filter(
            (item: { status: string }) => item.status === 'published'
          );
          let engagementRate = 0;
          if (published.length > 0) {
            const totalEngagement = published.reduce(
              (
                sum: number,
                item: { likes?: number; comments?: number; shares?: number }
              ) => {
                return (
                  sum +
                  (item.likes || 0) +
                  (item.comments || 0) +
                  (item.shares || 0)
                );
              },
              0
            );
            const totalViews = published.reduce(
              (sum: number, item: { views?: number }) => {
                return sum + (item.views || 1); // Avoid division by zero
              },
              0
            );
            engagementRate = Math.round((totalEngagement / totalViews) * 100);
          }

          // Calculate streak based on content creation frequency
          const sortedContent = content
            .filter((item: { createdAt?: string }) => item.createdAt)
            .sort(
              (a: { createdAt: string }, b: { createdAt: string }) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
            );

          let streak = 0;
          const currentDate = new Date();
          currentDate.setHours(0, 0, 0, 0);

          for (const item of sortedContent) {
            const itemDate = new Date(item.createdAt);
            itemDate.setHours(0, 0, 0, 0);

            const daysDiff = Math.floor(
              (currentDate.getTime() - itemDate.getTime()) /
                (1000 * 60 * 60 * 24)
            );

            if (daysDiff === streak) {
              streak++;
            } else if (daysDiff > streak) {
              break;
            }
          }

          setUserStats({
            totalContent: content.length,
            scheduledContent: scheduled,
            engagementRate: Math.max(0, Math.min(100, engagementRate)), // Ensure 0-100 range
            streak: streak,
          });
        }
      } catch (error) {
        console.error('Failed to fetch user data:', error);
        setProfileData(contextUser);
      } finally {
        setLoadingProfile(false);
        setLoadingStats(false);
      }
    };

    fetchUserData();
  }, [contextUser]);

  // Use profile data or fallback to context user
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

  const handleLogout = () => {
    setProfileOpen(false);
    logout();
    router.push('/auth/login');
  };

  const getThemeIcon = () => {
    if (!mounted) return <FiSun className='h-4 w-4' />;

    switch (theme) {
      case 'light':
        return <FiSun className='h-4 w-4' />;
      case 'dark':
        return <FiMoon className='h-4 w-4' />;
      case 'system':
        return <FiMonitor className='h-4 w-4' />;
      default:
        return <FiSun className='h-4 w-4' />;
    }
  };

  const cycleTheme = () => {
    if (theme === 'light') {
      setTheme('dark');
    } else if (theme === 'dark') {
      setTheme('system');
    } else {
      setTheme('light');
    }
  };

  return (
    <nav className='bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 shadow-lg sticky top-0 z-50 transition-colors duration-200'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-between items-center h-16'>
          {/* Enhanced Logo/Branding */}
          <div className='flex items-center space-x-4'>
            <Link
              href='/dashboard'
              className='flex items-center space-x-3 group'
            >
              <div className='relative'>
                <div className='w-10 h-10 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 dark:from-blue-600 dark:via-indigo-600 dark:to-violet-700 rounded-xl flex items-center justify-center shadow-xl group-hover:shadow-2xl transition-all duration-300 transform group-hover:scale-105'>
                  <span className='text-white font-bold text-sm'>KH</span>
                </div>
                <div className='absolute -inset-1 bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-blue-600 dark:to-indigo-600 rounded-xl blur opacity-25 group-hover:opacity-75 transition duration-300'></div>
              </div>
              <div className='hidden sm:block'>
                <div className='flex flex-col'>
                  <span className='text-xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-blue-400 dark:via-indigo-400 dark:to-violet-500 bg-clip-text text-transparent'>
                    KHRONOS
                  </span>
                  <span className='text-xs text-gray-500 dark:text-slate-400 -mt-1'>
                    Content Calendar
                  </span>
                </div>
              </div>
            </Link>
          </div>

          {/* Center Section - Status/Activity Indicator */}
          <div className='hidden md:flex items-center space-x-3 bg-gray-50 dark:bg-slate-800 backdrop-blur-sm rounded-full px-4 py-2 border border-slate-200 dark:border-slate-700 shadow-sm'>
            <div className='flex items-center space-x-2'>
              <div className='relative'>
                <FiActivity className='h-4 w-4 text-green-600 dark:text-green-400' />
                <div className='absolute -top-1 -right-1 w-2 h-2 bg-green-400 dark:bg-green-500 rounded-full animate-pulse'></div>
              </div>
              <span className='text-sm font-medium text-gray-700 dark:text-slate-200'>
                All Systems Operational
              </span>
            </div>
          </div>

          {/* Right side actions */}
          <div className='flex items-center space-x-2'>
            {/* Theme Toggle Button */}
            {mounted && (
              <button
                onClick={cycleTheme}
                className='p-3 text-gray-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-50 dark:hover:bg-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:focus:ring-blue-500/20 transition-all duration-200 shadow-sm hover:shadow-md group'
                title={`Switch to ${
                  theme === 'light'
                    ? 'dark'
                    : theme === 'dark'
                    ? 'system'
                    : 'light'
                } mode`}
              >
                <div className='group-hover:scale-110 transition-transform duration-200'>
                  {getThemeIcon()}
                </div>
              </button>
            )}

            {/* Enhanced Notifications */}
            <div className='relative'>
              <button
                className='notification-button relative p-3 text-gray-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-50 dark:hover:bg-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:focus:ring-blue-500/20 transition-all duration-200 shadow-sm hover:shadow-md group'
                onClick={() => setNotificationsOpen(!notificationsOpen)}
              >
                <FiBell className='h-5 w-5 group-hover:scale-110 transition-transform duration-200' />
                {unreadCount > 0 && (
                  <span className='absolute -top-1 -right-1 flex h-4 w-4'>
                    <span className='animate-ping absolute inline-flex h-full w-full rounded-full bg-gradient-to-r from-red-400 to-pink-500 opacity-75'></span>
                    <span className='relative inline-flex rounded-full h-4 w-4 bg-gradient-to-r from-red-500 to-pink-600 text-white text-xs items-center justify-center font-bold shadow-lg'>
                      {unreadCount}
                    </span>
                  </span>
                )}
              </button>

              <div className='notification-dropdown'>
                <NotificationDropdown
                  isOpen={notificationsOpen}
                  onClose={() => setNotificationsOpen(false)}
                />
              </div>
            </div>

            {/* Enhanced Profile Dropdown */}
            <div className='relative'>
              <button
                className='profile-button flex items-center space-x-3 p-2 text-sm rounded-xl hover:bg-gray-50 dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:focus:ring-blue-500/20 transition-all duration-200 shadow-sm hover:shadow-md group'
                onClick={() => setProfileOpen(!profileOpen)}
                disabled={loadingProfile}
              >
                <div className='relative'>
                  {user?.profilePicUrl || user?.avatar ? (
                    <Image
                      className='h-9 w-9 rounded-xl object-cover ring-2 ring-white dark:ring-slate-700 shadow-lg group-hover:ring-indigo-200 dark:group-hover:ring-indigo-400 transition-all duration-200'
                      src={user.profilePicUrl || user.avatar || ''}
                      width={36}
                      height={36}
                      alt={user.name || 'User'}
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  ) : null}
                  {(!user?.profilePicUrl && !user?.avatar) || loadingProfile ? (
                    <div className='h-9 w-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 dark:from-blue-600 dark:to-indigo-700 flex items-center justify-center ring-2 ring-white dark:ring-slate-700 shadow-lg group-hover:ring-indigo-200 dark:group-hover:ring-indigo-400 transition-all duration-200'>
                      <span className='text-white font-semibold text-sm'>
                        {user?.name ? getInitials(user.name) : 'U'}
                      </span>
                    </div>
                  ) : null}
                  <div className='absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-slate-900 shadow-sm'></div>
                </div>
                <div className='hidden lg:block text-left'>
                  <p className='text-sm font-semibold text-gray-800 dark:text-slate-100 group-hover:text-indigo-700 dark:group-hover:text-indigo-400 transition-colors duration-200'>
                    {loadingProfile ? 'Loading...' : user?.name || 'User'}
                  </p>
                  <div className='flex items-center space-x-1'>
                    <span className='text-xs'>
                      {getRoleIcon(getDisplayRole(user?.role))}
                    </span>
                    <span className='text-xs text-gray-500 dark:text-slate-400 capitalize'>
                      {getDisplayRole(user?.role)}
                    </span>
                  </div>
                </div>
                <FiChevronDown className='h-4 w-4 text-gray-400 dark:text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-all duration-200 group-hover:rotate-180' />
              </button>

              {profileOpen && user && (
                <div className='profile-dropdown origin-top-right absolute right-0 mt-3 w-96 rounded-2xl shadow-2xl bg-white dark:bg-slate-800 backdrop-blur-2xl ring-1 ring-black ring-opacity-5 dark:ring-slate-600 z-20 border border-slate-200 dark:border-slate-600 overflow-hidden'>
                  {/* Enhanced Profile Header */}
                  <div className='relative p-6 bg-gray-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-600'>
                    <div className='absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-200/20 to-purple-200/20 dark:from-indigo-500/10 dark:to-purple-500/10 rounded-full -translate-y-16 translate-x-16'></div>
                    <div className='relative flex items-start space-x-4'>
                      <div className='relative'>
                        {user.profilePicUrl || user.avatar ? (
                          <Image
                            className='h-20 w-20 rounded-2xl object-cover ring-4 ring-white dark:ring-slate-700 shadow-xl'
                            src={user.profilePicUrl || user.avatar || ''}
                            width={80}
                            height={80}
                            alt={user.name}
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display =
                                'none';
                            }}
                          />
                        ) : null}
                        {!user.profilePicUrl && !user.avatar ? (
                          <div className='h-20 w-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 dark:from-blue-600 dark:to-indigo-700 flex items-center justify-center ring-4 ring-white dark:ring-slate-700 shadow-xl'>
                            <span className='text-white font-bold text-2xl'>
                              {getInitials(user.name)}
                            </span>
                          </div>
                        ) : null}
                        <div className='absolute -bottom-2 -right-2 w-6 h-6 bg-green-500 rounded-full border-4 border-white dark:border-slate-900 shadow-lg flex items-center justify-center'>
                          <div className='w-2 h-2 bg-white rounded-full'></div>
                        </div>
                      </div>
                      <div className='flex-1 min-w-0'>
                        <div className='flex items-start justify-between'>
                          <div>
                            <h3 className='text-xl font-bold text-gray-900 dark:text-slate-100 truncate'>
                              {user.name}
                            </h3>
                            <p className='text-sm text-gray-600 dark:text-slate-400 truncate mt-1'>
                              {user.email}
                            </p>
                            <div className='flex items-center space-x-2 mt-3'>
                              <span className='inline-flex items-center px-3 py-1 bg-gradient-to-r from-emerald-100 to-teal-100 dark:from-emerald-900/50 dark:to-teal-900/50 text-emerald-700 dark:text-emerald-300 text-xs font-semibold rounded-full ring-1 ring-emerald-200 dark:ring-emerald-700'>
                                <span className='mr-2'>
                                  {getRoleIcon(getDisplayRole(user.role))}
                                </span>
                                {getDisplayRole(user.role)}
                              </span>
                            </div>
                          </div>
                          <Link
                            href='/profile/edit'
                            className='p-2 text-gray-400 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-50 dark:hover:bg-slate-700 rounded-lg transition-all duration-200'
                            onClick={() => setProfileOpen(false)}
                          >
                            <FiEdit3 className='h-4 w-4' />
                          </Link>
                        </div>
                        <div className='mt-3 flex items-center space-x-4 text-xs text-gray-500 dark:text-slate-400'>
                          <div className='flex items-center space-x-1'>
                            <FiCalendar className='h-3 w-3' />
                            <span>
                              Joined{' '}
                              {user.createdAt &&
                              !isNaN(new Date(user.createdAt).getTime())
                                ? new Date(user.createdAt).getFullYear()
                                : 'Recently'}
                            </span>
                          </div>
                          <div className='flex items-center space-x-1'>
                            <FiZap className='h-3 w-3 text-orange-500' />
                            <span>{userStats.streak} day streak</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Enhanced Stats Grid */}
                  <div className='px-6 py-5 bg-gray-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-600'>
                    <div className='grid grid-cols-3 gap-6'>
                      <div className='text-center group'>
                        <div className='flex items-center justify-center w-12 h-12 mx-auto mb-2 bg-gradient-to-br from-blue-500 to-indigo-600 dark:from-blue-600 dark:to-indigo-700 rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-200'>
                          <FiFileText className='h-6 w-6 text-white' />
                        </div>
                        <div className='text-2xl font-bold text-gray-900 dark:text-slate-100 mb-1'>
                          {loadingStats ? '...' : userStats.totalContent}
                        </div>
                        <div className='text-xs text-gray-500 dark:text-slate-400 font-medium'>
                          Total Content
                        </div>
                      </div>
                      <div className='text-center group'>
                        <div className='flex items-center justify-center w-12 h-12 mx-auto mb-2 bg-gradient-to-br from-purple-500 to-pink-600 dark:from-purple-600 dark:to-pink-700 rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-200'>
                          <FiCalendar className='h-6 w-6 text-white' />
                        </div>
                        <div className='text-2xl font-bold text-gray-900 dark:text-slate-100 mb-1'>
                          {loadingStats ? '...' : userStats.scheduledContent}
                        </div>
                        <div className='text-xs text-gray-500 dark:text-slate-400 font-medium'>
                          Scheduled
                        </div>
                      </div>
                      <div className='text-center group'>
                        <div className='flex items-center justify-center w-12 h-12 mx-auto mb-2 bg-gradient-to-br from-green-500 to-emerald-600 dark:from-green-600 dark:to-emerald-700 rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-200'>
                          <FiTrendingUp className='h-6 w-6 text-white' />
                        </div>
                        <div className='text-2xl font-bold text-gray-900 dark:text-slate-100 mb-1'>
                          {loadingStats ? '...' : userStats.engagementRate}%
                        </div>
                        <div className='text-xs text-gray-500 dark:text-slate-400 font-medium'>
                          Engagement
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className='py-2'>
                    <Link
                      href='/profile'
                      className='flex items-center px-6 py-3 text-sm text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all duration-200 group'
                      onClick={() => setProfileOpen(false)}
                    >
                      <FiUser className='mr-3 h-4 w-4 group-hover:text-indigo-600 dark:group-hover:text-indigo-400' />
                      Your Profile
                      <div className='ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-200'>
                        <span className='text-xs text-indigo-500 dark:text-indigo-400'>
                          →
                        </span>
                      </div>
                    </Link>
                    <Link
                      href='/settings'
                      className='flex items-center px-6 py-3 text-sm text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all duration-200 group'
                      onClick={() => setProfileOpen(false)}
                    >
                      <FiSettings className='mr-3 h-4 w-4 group-hover:text-indigo-600 dark:group-hover:text-indigo-400' />
                      Settings
                      <div className='ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-200'>
                        <span className='text-xs text-indigo-500 dark:text-indigo-400'>
                          →
                        </span>
                      </div>
                    </Link>
                    <Link
                      href='/billing'
                      className='flex items-center px-6 py-3 text-sm text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all duration-200 group'
                      onClick={() => setProfileOpen(false)}
                    >
                      <FiCreditCard className='mr-3 h-4 w-4 group-hover:text-indigo-600 dark:group-hover:text-indigo-400' />
                      Billing & Plans
                      <div className='ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-200'>
                        <span className='text-xs text-indigo-500 dark:text-indigo-400'>
                          →
                        </span>
                      </div>
                    </Link>
                  </div>

                  {/* Logout */}
                  <div className='border-t border-slate-200 dark:border-slate-600 py-2'>
                    <button
                      className='flex items-center w-full px-6 py-3 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200 group'
                      onClick={handleLogout}
                    >
                      <FiLogOut className='mr-3 h-4 w-4 group-hover:text-red-700 dark:group-hover:text-red-300' />
                      Sign out
                      <div className='ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-200'>
                        <span className='text-xs text-red-500 dark:text-red-400'>
                          →
                        </span>
                      </div>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Enhanced Mobile menu button */}
            <button
              className='md:hidden p-3 rounded-xl text-gray-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-50 dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:focus:ring-blue-500/20 transition-all duration-200 shadow-sm hover:shadow-md'
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <FiX className='h-6 w-6' />
              ) : (
                <FiMenu className='h-6 w-6' />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Enhanced Mobile menu */}
      {mobileMenuOpen && (
        <div className='md:hidden border-t border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 shadow-lg'>
          {/* Mobile Profile Section */}
          {user && (
            <div className='px-6 py-4 border-b border-slate-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-900'>
              <div className='flex items-center space-x-3'>
                <div className='relative'>
                  {user.profilePicUrl || user.avatar ? (
                    <Image
                      className='h-12 w-12 rounded-xl object-cover ring-2 ring-white dark:ring-slate-700 shadow-lg'
                      src={user.profilePicUrl || user.avatar || ''}
                      width={48}
                      height={48}
                      alt={user.name}
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  ) : null}
                  {!user.profilePicUrl && !user.avatar ? (
                    <div className='h-12 w-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 dark:from-blue-600 dark:to-indigo-700 flex items-center justify-center ring-2 ring-white dark:ring-slate-700 shadow-lg'>
                      <span className='text-white font-bold text-lg'>
                        {getInitials(user.name)}
                      </span>
                    </div>
                  ) : null}
                  <div className='absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-slate-900 shadow-sm'></div>
                </div>
                <div>
                  <p className='text-base font-semibold text-gray-900 dark:text-slate-100'>
                    {user.name}
                  </p>
                  <div className='flex items-center space-x-1'>
                    <span className='text-sm'>
                      {getRoleIcon(getDisplayRole(user.role))}
                    </span>
                    <span className='text-sm text-gray-500 dark:text-slate-400 capitalize'>
                      {getDisplayRole(user.role)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Mobile Navigation */}
          <div className='py-3 space-y-1'>
            <Link
              href='/dashboard'
              className='flex items-center px-6 py-4 text-base font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 border-l-4 border-indigo-500 transition-all duration-200'
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className='mr-3'>🏠</span>
              Dashboard
            </Link>
            <Link
              href='/calendar'
              className='flex items-center px-6 py-4 text-base font-medium text-gray-600 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-700 hover:text-gray-900 dark:hover:text-slate-100 transition-all duration-200'
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className='mr-3'>📅</span>
              Calendar
            </Link>
            <Link
              href='/content'
              className='flex items-center px-6 py-4 text-base font-medium text-gray-600 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-700 hover:text-gray-900 dark:hover:text-slate-100 transition-all duration-200'
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className='mr-3'>📝</span>
              Content
            </Link>
            <Link
              href='/ai-chat'
              className='flex items-center px-6 py-4 text-base font-medium text-gray-600 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-700 hover:text-gray-900 dark:hover:text-slate-100 transition-all duration-200'
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className='mr-3'>🤖</span>
              AI Chat
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
