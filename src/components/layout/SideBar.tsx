'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  FiHome,
  FiCalendar,
  FiFileText,
  FiBarChart2,
  FiSettings,
  FiTrendingUp,
  FiChevronLeft,
  FiChevronRight,
} from 'react-icons/fi';

interface SidebarLinkProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  collapsed: boolean;
  onClick?: () => void;
}

const SidebarLink: React.FC<SidebarLinkProps> = ({
  href,
  icon,
  label,
  isActive,
  collapsed,
  onClick,
}) => {
  return (
    <Link
      href={href}
      className={`relative flex items-center px-3 py-3 mx-2 text-sm font-medium rounded-xl group transition-all duration-300 ease-in-out ${
        isActive
          ? 'bg-gradient-to-r from-indigo-500 to-purple-600 dark:from-blue-600 dark:to-indigo-700 text-white shadow-lg transform scale-105'
          : 'text-gray-600 dark:text-slate-300 hover:bg-white/80 dark:hover:bg-slate-700/60 hover:shadow-md hover:text-gray-900 dark:hover:text-slate-100 backdrop-blur-sm'
      }`}
      onClick={onClick}
    >
      <span
        className={`flex-shrink-0 h-5 w-5 transition-colors duration-200 ${
          isActive
            ? 'text-white'
            : 'text-gray-500 dark:text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400'
        }`}
      >
        {icon}
      </span>
      {!collapsed && (
        <span
          className={`ml-3 transition-all duration-300 whitespace-nowrap ${
            isActive
              ? 'text-white'
              : 'group-hover:text-gray-900 dark:group-hover:text-slate-100'
          }`}
        >
          {label}
        </span>
      )}
      {isActive && (
        <div className='absolute right-2 top-1/2 transform -translate-y-1/2'>
          <div className='w-2 h-2 bg-white rounded-full opacity-80'></div>
        </div>
      )}
    </Link>
  );
};

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: <FiHome /> },
    { name: 'Calendar', href: '/calendar', icon: <FiCalendar /> },
    { name: 'Contents', href: '/content', icon: <FiFileText /> },
    { name: 'Analytics', href: '/analytics', icon: <FiBarChart2 /> },
    {
      name: 'Trend Insights',
      href: '/trends',
      icon: <FiTrendingUp />,
    },
  ];

  const settingsItem = {
    name: 'Settings',
    href: '/settings',
    icon: <FiSettings />,
  };

  return (
    <div
      className={`${
        collapsed ? 'w-20' : 'w-72'
      } flex flex-col bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 border-r border-slate-200/60 dark:border-slate-700/60 shadow-lg backdrop-blur-xl transition-all duration-300 ease-in-out relative`}
    >
      {/* Background decoration */}
      <div className='absolute inset-0 bg-gradient-to-br from-indigo-50/50 via-transparent to-purple-50/50 dark:from-blue-950/20 dark:via-transparent dark:to-indigo-950/20 pointer-events-none'></div>

      <div className='relative h-full flex flex-col'>
        {/* Header */}
        <div className='flex items-center justify-between p-6 border-b border-slate-200/60 dark:border-slate-700/60'>
          {!collapsed && (
            <div className='flex items-center space-x-3'>
              <div className='w-8 h-8 bg-gradient-to-br from-indigo-600 to-purple-600 dark:from-blue-600 dark:to-indigo-700 rounded-lg flex items-center justify-center shadow-lg'>
                <span className='text-white font-bold text-sm'>KH</span>
              </div>
              <span className='text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-blue-400 dark:to-indigo-500 bg-clip-text text-transparent'>
                KHRONOS
              </span>
            </div>
          )}
          {collapsed && (
            <div className='w-8 h-8 bg-gradient-to-br from-indigo-600 to-purple-600 dark:from-blue-600 dark:to-indigo-700 rounded-lg flex items-center justify-center shadow-lg mx-auto'>
              <span className='text-white font-bold text-sm'>KH</span>
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className='p-2 rounded-lg text-gray-400 dark:text-slate-500 hover:text-gray-600 dark:hover:text-slate-300 hover:bg-white/80 dark:hover:bg-slate-700/60 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:focus:ring-blue-500/20 transition-all duration-200 shadow-sm hover:shadow-md'
          >
            {collapsed ? (
              <FiChevronRight className='h-4 w-4' />
            ) : (
              <FiChevronLeft className='h-4 w-4' />
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav className='flex-1 py-6 space-y-2 overflow-y-auto'>
          {navigation.map((item) => (
            <SidebarLink
              key={item.name}
              href={item.href}
              icon={item.icon}
              label={item.name}
              collapsed={collapsed}
              isActive={
                pathname === item.href || pathname?.startsWith(`${item.href}/`)
              }
            />
          ))}
        </nav>

        {/* Settings at bottom */}
        <div className='border-t border-slate-200/60 dark:border-slate-700/60 pt-4 pb-6'>
          <SidebarLink
            href={settingsItem.href}
            icon={settingsItem.icon}
            label={settingsItem.name}
            collapsed={collapsed}
            isActive={
              pathname === settingsItem.href ||
              pathname?.startsWith(`${settingsItem.href}/`)
            }
          />
        </div>
      </div>
    </div>
  );
}
