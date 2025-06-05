'use client';

import Link from 'next/link';
import { useState } from 'react';
import Image from 'next/image';
import { FiBell, FiMenu, FiX, FiChevronDown, FiActivity } from 'react-icons/fi';
import { authAPI } from '@/src/lib/api';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();

  // Placeholder user - this would come from auth context in a real app
  const user = {
    name: 'Jane Doe',
    email: 'jane.doe@example.com',
    avatar: '/images/avatar-placeholder.png',
    role: 'Content Creator',
  };

  const notifications = [
    {
      id: 1,
      title: 'New content scheduled',
      message: 'Instagram post for tomorrow',
      time: '2m ago',
      type: 'success',
    },
    {
      id: 2,
      title: 'Analytics update',
      message: 'Weekly report is ready',
      time: '1h ago',
      type: 'info',
    },
    {
      id: 3,
      title: 'AI suggestion',
      message: 'Trending topic detected',
      time: '3h ago',
      type: 'warning',
    },
  ];

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return '✅';
      case 'info':
        return '📊';
      case 'warning':
        return '⚡';
      default:
        return '🔔';
    }
  };

  return (
    <nav className=' bg-gradient-to-r from-white via-slate-50/90 to-white/95 backdrop-blur-2xl border-b border-slate-200/60 shadow-lg sticky top-0 z-50'>
      {/* Subtle gradient overlay */}
      <div className='absolute inset-0 bg-gradient-to-r from-indigo-500/5 via-purple-500/5 to-pink-500/5 pointer-events-none'></div>

      <div className='relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-between items-center h-16'>
          {/* Enhanced Logo/Branding */}
          <div className='flex items-center space-x-4'>
            <Link
              href='/dashboard'
              className='flex items-center space-x-3 group'
            >
              <div className='relative'>
                <div className='w-10 h-10 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-xl flex items-center justify-center shadow-xl group-hover:shadow-2xl transition-all duration-300 transform group-hover:scale-105'>
                  <span className='text-white font-bold text-sm'>KH</span>
                </div>
                <div className='absolute -inset-1 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl blur opacity-25 group-hover:opacity-75 transition duration-300'></div>
              </div>
              <div className='hidden sm:block'>
                <div className='flex flex-col'>
                  <span className='text-xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent'>
                    KHRONOS
                  </span>
                  <span className='text-xs text-gray-500 -mt-1'>
                    Content Calendar
                  </span>
                </div>
              </div>
            </Link>
          </div>

          {/* Center Section - Status/Activity Indicator */}
          <div className='hidden md:flex items-center space-x-3 bg-white/60 backdrop-blur-sm rounded-full px-4 py-2 border border-slate-200/60 shadow-sm'>
            <div className='flex items-center space-x-2'>
              <div className='relative'>
                <FiActivity className='h-4 w-4 text-green-600' />
                <div className='absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full animate-pulse'></div>
              </div>
              <span className='text-sm font-medium text-gray-700'>
                All Systems Operational
              </span>
            </div>
          </div>

          {/* Right side actions */}
          <div className='flex items-center space-x-2'>
            {/* Enhanced Notifications */}
            <div className='relative'>
              <button
                className='relative p-3 text-gray-600 hover:text-indigo-600 hover:bg-white/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all duration-200 shadow-sm hover:shadow-md group'
                onClick={() => setNotificationsOpen(!notificationsOpen)}
              >
                <FiBell className='h-5 w-5 group-hover:scale-110 transition-transform duration-200' />
                {notifications.length > 0 && (
                  <span className='absolute -top-1 -right-1 flex h-4 w-4'>
                    <span className='animate-ping absolute inline-flex h-full w-full rounded-full bg-gradient-to-r from-red-400 to-pink-500 opacity-75'></span>
                    <span className='relative inline-flex rounded-full h-4 w-4 bg-gradient-to-r from-red-500 to-pink-600 text-white text-xs items-center justify-center font-bold shadow-lg'>
                      {notifications.length}
                    </span>
                  </span>
                )}
              </button>

              {notificationsOpen && (
                <div className='origin-top-right absolute right-0 mt-3 w-96 rounded-2xl shadow-2xl bg-white/95 backdrop-blur-2xl ring-1 ring-black ring-opacity-5 z-20 border border-slate-200/60 overflow-hidden'>
                  <div className='p-6 bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-slate-200/60'>
                    <div className='flex items-center justify-between'>
                      <h3 className='text-lg font-bold text-gray-900'>
                        Notifications
                      </h3>
                      <span className='px-2 py-1 bg-indigo-100 text-indigo-700 text-xs font-medium rounded-full'>
                        {notifications.length} new
                      </span>
                    </div>
                  </div>
                  <div className='max-h-96 overflow-y-auto'>
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className='p-4 hover:bg-gradient-to-r hover:from-slate-50 hover:to-indigo-50/50 transition-all duration-200 border-b border-slate-200/40 last:border-b-0 group cursor-pointer'
                      >
                        <div className='flex items-start space-x-3'>
                          <span className='text-lg flex-shrink-0 mt-1'>
                            {getNotificationIcon(notification.type)}
                          </span>
                          <div className='flex-1 min-w-0'>
                            <p className='text-sm font-semibold text-gray-900 group-hover:text-indigo-700 transition-colors duration-200'>
                              {notification.title}
                            </p>
                            <p className='text-sm text-gray-600 mt-1'>
                              {notification.message}
                            </p>
                            <p className='text-xs text-gray-500 mt-1 font-medium'>
                              {notification.time}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className='p-4 bg-gradient-to-r from-slate-50 to-indigo-50/50 border-t border-slate-200/60'>
                    <Link
                      href='/notifications'
                      className='block text-center text-sm text-indigo-600 hover:text-indigo-700 font-semibold py-2 hover:bg-white/60 rounded-lg transition-all duration-200'
                      onClick={() => setNotificationsOpen(false)}
                    >
                      View all notifications →
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Enhanced Profile Dropdown */}
            <div className='relative'>
              <button
                className='flex items-center space-x-3 p-2 text-sm rounded-xl hover:bg-white/80 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all duration-200 shadow-sm hover:shadow-md group'
                onClick={() => setProfileOpen(!profileOpen)}
              >
                <div className='relative'>
                  <Image
                    className='h-9 w-9 rounded-xl object-cover ring-2 ring-white shadow-lg group-hover:ring-indigo-200 transition-all duration-200'
                    src='https://via.placeholder.com/40'
                    width={36}
                    height={36}
                    alt={user.name}
                  />
                  <div className='absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white shadow-sm'></div>
                </div>
                <div className='hidden lg:block text-left'>
                  <p className='text-sm font-semibold text-gray-800 group-hover:text-indigo-700 transition-colors duration-200'>
                    {user.name}
                  </p>
                  <p className='text-xs text-gray-500'>{user.role}</p>
                </div>
                <FiChevronDown className='h-4 w-4 text-gray-400 group-hover:text-indigo-600 transition-all duration-200 group-hover:rotate-180' />
              </button>

              {profileOpen && (
                <div className='origin-top-right absolute right-0 mt-3 w-64 rounded-2xl shadow-2xl bg-white/95 backdrop-blur-2xl ring-1 ring-black ring-opacity-5 z-20 border border-slate-200/60 overflow-hidden'>
                  <div className='p-4 bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-slate-200/60'>
                    <div className='flex items-center space-x-3'>
                      <Image
                        className='h-12 w-12 rounded-xl object-cover ring-2 ring-white shadow-lg'
                        src='https://via.placeholder.com/40'
                        width={48}
                        height={48}
                        alt={user.name}
                      />
                      <div>
                        <p className='text-sm font-bold text-gray-900'>
                          {user.name}
                        </p>
                        <p className='text-xs text-gray-600'>{user.email}</p>
                        <span className='inline-block mt-1 px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full'>
                          Pro Plan
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className='py-2'>
                    <Link
                      href='/dashboard/profile'
                      className='flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-slate-50 hover:to-indigo-50/50 hover:text-indigo-600 transition-all duration-200'
                      onClick={() => setProfileOpen(false)}
                    >
                      <span className='mr-3'>👤</span>
                      Your Profile
                    </Link>
                    <Link
                      href='/dashboard/settings'
                      className='flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-slate-50 hover:to-indigo-50/50 hover:text-indigo-600 transition-all duration-200'
                      onClick={() => setProfileOpen(false)}
                    >
                      <span className='mr-3'>⚙️</span>
                      Settings
                    </Link>
                    <Link
                      href='/dashboard/billing'
                      className='flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-slate-50 hover:to-indigo-50/50 hover:text-indigo-600 transition-all duration-200'
                      onClick={() => setProfileOpen(false)}
                    >
                      <span className='mr-3'>💳</span>
                      Billing & Plans
                    </Link>
                  </div>
                  <div className='border-t border-slate-200/60 py-2'>
                    <button
                      className='flex items-center w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50/50 transition-all duration-200'
                      onClick={async () => {
                        console.log('Logging out');
                        setProfileOpen(false);

                        // Use the authAPI logout function which handles token cleanup
                        authAPI.logout();

                        // Redirect to login page
                        router.push('/auth/login');
                      }}
                    >
                      <span className='mr-3'>🚪</span>
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Enhanced Mobile menu button */}
            <button
              className='md:hidden p-3 rounded-xl text-gray-600 hover:text-indigo-600 hover:bg-white/80 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all duration-200 shadow-sm hover:shadow-md'
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
        <div className='md:hidden border-t border-slate-200/60 bg-white/95 backdrop-blur-2xl shadow-lg'>
          {/* Mobile Navigation */}
          <div className='py-3 space-y-1'>
            <Link
              href='/dashboard'
              className='flex items-center px-6 py-4 text-base font-semibold text-indigo-600 bg-gradient-to-r from-indigo-50 to-purple-50 border-l-4 border-indigo-500 transition-all duration-200'
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className='mr-3'>🏠</span>
              Dashboard
            </Link>
            <Link
              href='/calendar'
              className='flex items-center px-6 py-4 text-base font-medium text-gray-600 hover:bg-gradient-to-r hover:from-slate-50 hover:to-indigo-50/50 hover:text-gray-900 transition-all duration-200'
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className='mr-3'>📅</span>
              Calendar
            </Link>
            <Link
              href='/content'
              className='flex items-center px-6 py-4 text-base font-medium text-gray-600 hover:bg-gradient-to-r hover:from-slate-50 hover:to-indigo-50/50 hover:text-gray-900 transition-all duration-200'
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className='mr-3'>📝</span>
              Content
            </Link>
            <Link
              href='/ai-chat'
              className='flex items-center px-6 py-4 text-base font-medium text-gray-600 hover:bg-gradient-to-r hover:from-slate-50 hover:to-indigo-50/50 hover:text-gray-900 transition-all duration-200'
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
