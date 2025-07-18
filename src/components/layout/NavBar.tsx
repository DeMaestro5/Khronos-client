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
  FiLogOut,
  FiSun,
  FiMoon,
  FiMonitor,
} from 'react-icons/fi';
import { useTheme } from 'next-themes';
// Removed profileAPI and contentAPI imports - now using cached data from UserDataContext
import { useRouter } from 'next/navigation';
import { useAuth } from '@/src/context/AuthContext';
import { useNotifications } from '@/src/context/NotificationContext';
import { useUserData } from '@/src/context/UserDataContext';
import NotificationDropdown from '@/src/components/notifications/NotificationDropdown';

export default function Navbar() {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const router = useRouter();
  const { user: contextUser, logout } = useAuth();
  const { unreadCount } = useNotifications();
  const { profileData, loading: userDataLoading } = useUserData();
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

            {/* Simplified Profile Dropdown */}
            <div className='relative'>
              <button
                className='profile-button flex items-center space-x-3 p-2 text-sm rounded-xl hover:bg-gray-50 dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:focus:ring-blue-500/20 transition-all duration-200 shadow-sm hover:shadow-md group'
                onClick={() => setProfileOpen(!profileOpen)}
                disabled={userDataLoading}
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
                  {(!user?.profilePicUrl && !user?.avatar) ||
                  userDataLoading ? (
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
                    {userDataLoading ? 'Loading...' : user?.name || 'User'}
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

              {/* Simplified Profile Dropdown Menu */}
              {profileOpen && user && (
                <div className='profile-dropdown origin-top-right absolute right-0 mt-3 w-56 rounded-xl shadow-xl bg-white dark:bg-slate-800 backdrop-blur-2xl ring-1 ring-black ring-opacity-5 dark:ring-slate-600 z-20 border border-slate-200 dark:border-slate-600 overflow-hidden'>
                  {/* Simple Menu Items */}
                  <div className='py-2'>
                    <Link
                      href='/profile'
                      className='flex items-center px-4 py-3 text-sm text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all duration-200 group'
                      onClick={() => setProfileOpen(false)}
                    >
                      <FiUser className='mr-3 h-4 w-4 group-hover:text-indigo-600 dark:group-hover:text-indigo-400' />
                      Profile
                    </Link>
                    <Link
                      href='/settings'
                      className='flex items-center px-4 py-3 text-sm text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all duration-200 group'
                      onClick={() => setProfileOpen(false)}
                    >
                      <FiSettings className='mr-3 h-4 w-4 group-hover:text-indigo-600 dark:group-hover:text-indigo-400' />
                      Settings
                    </Link>
                  </div>

                  {/* Logout */}
                  <div className='border-t border-slate-200 dark:border-slate-600 py-2'>
                    <button
                      className='flex items-center w-full px-4 py-3 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200 group'
                      onClick={handleLogout}
                    >
                      <FiLogOut className='mr-3 h-4 w-4 group-hover:text-red-700 dark:group-hover:text-red-300' />
                      Sign out
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
