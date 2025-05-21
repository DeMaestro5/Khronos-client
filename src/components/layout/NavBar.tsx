'use client';

import Link from 'next/link';
import { useState } from 'react';
import Image from 'next/image';
import { FiBell, FiMenu, FiX } from 'react-icons/fi';

export default function Navbar() {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Placeholder user - this would come from auth context in a real app
  const user = {
    name: 'Jane Doe',
    email: 'jane.doe@example.com',
    avatar: '/images/avatar-placeholder.png',
  };

  return (
    <nav className='bg-white border-b border-gray-200'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-between h-16'>
          <div className='flex'>
            <div className='flex-shrink-0 flex items-center'>
              <Link href='/dashboard' className='flex items-center'>
                <span className='h-8 w-8 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-lg'>
                  KH
                </span>
                <span className='ml-2 font-medium text-gray-900'>KHRONOS</span>
              </Link>
            </div>
          </div>

          {/* Desktop navigation links */}
          <div className='hidden sm:ml-6 sm:flex sm:items-center'>
            <div className='flex space-x-4'>
              <button
                className='text-gray-500 hover:text-gray-700 p-1 rounded-full relative'
                onClick={() => setNotificationsOpen(!notificationsOpen)}
              >
                <FiBell className='h-6 w-6' />
                <span className='absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500'></span>
              </button>

              <div className='ml-3 relative'>
                <div>
                  <button
                    className='flex text-sm border-2 border-transparent rounded-full focus:outline-none focus:border-gray-300'
                    onClick={() => setProfileOpen(!profileOpen)}
                  >
                    <Image
                      className='h-8 w-8 rounded-full'
                      src={user.avatar}
                      width={40}
                      height={40}
                      alt={user.name}
                      // onError={(e) => {
                      //   (e.target as HTMLImageElement).src =
                      //     'https://via.placeholder.com/40';
                      // }}
                    />
                  </button>
                </div>

                {profileOpen && (
                  <div className='origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 z-10'>
                    <Link
                      href='/dashboard/settings'
                      className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'
                      onClick={() => setProfileOpen(false)}
                    >
                      Settings
                    </Link>
                    <button
                      className='block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'
                      onClick={() => {
                        // Handle logout logic here
                        console.log('Logging out');
                      }}
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className='flex items-center sm:hidden'>
            <button
              className='inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none'
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <FiX className='block h-6 w-6' />
              ) : (
                <FiMenu className='block h-6 w-6' />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className='sm:hidden'>
          <div className='pt-2 pb-3 space-y-1'>
            <Link
              href='/dashboard'
              className='block pl-3 pr-4 py-2 border-l-4 border-indigo-500 text-base font-medium text-indigo-700 bg-indigo-50'
              onClick={() => setMobileMenuOpen(false)}
            >
              Dashboard
            </Link>
            <Link
              href='/dashboard/calendar'
              className='block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'
              onClick={() => setMobileMenuOpen(false)}
            >
              Calendar
            </Link>
            <Link
              href='/dashboard/content'
              className='block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'
              onClick={() => setMobileMenuOpen(false)}
            >
              Content
            </Link>
            <Link
              href='/dashboard/ai-chat'
              className='block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'
              onClick={() => setMobileMenuOpen(false)}
            >
              AI Chat
            </Link>
          </div>
          <div className='pt-4 pb-3 border-t border-gray-200'>
            <div className='flex items-center px-4'>
              <div className='flex-shrink-0'>
                <Image
                  className='h-10 w-10 rounded-full'
                  src={user.avatar}
                  width={40}
                  height={40}
                  alt={user.name}
                  // onError={(e) => {
                  //   (e.target as HTMLImageElement).src =
                  //     'https://via.placeholder.com/40';
                  // }}
                />
              </div>
              <div className='ml-3'>
                <div className='text-base font-medium text-gray-800'>
                  {user.name}
                </div>
                <div className='text-sm font-medium text-gray-500'>
                  {user.email}
                </div>
              </div>
            </div>
            <div className='mt-3 space-y-1'>
              <Link
                href='/dashboard/settings'
                className='block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100'
                onClick={() => setMobileMenuOpen(false)}
              >
                Settings
              </Link>
              <button
                className='block w-full text-left px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100'
                onClick={() => {
                  // Handle logout logic here
                  console.log('Logging out');
                }}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
