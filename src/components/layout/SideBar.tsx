'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  FiHome,
  FiCalendar,
  FiFileText,
  FiMessageSquare,
  FiBarChart2,
  FiSettings,
  FiTrendingUp,
} from 'react-icons/fi';
import Image from 'next/image';

interface SidebarLinkProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick?: () => void;
}

const SidebarLink: React.FC<SidebarLinkProps> = ({
  href,
  icon,
  label,
  isActive,
  onClick,
}) => {
  return (
    <Link
      href={href}
      className={`flex items-center px-4 py-3 text-sm font-medium rounded-md group ${
        isActive
          ? 'bg-indigo-50 text-indigo-700'
          : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
      }`}
      onClick={onClick}
    >
      <span
        className={`mr-3 h-5 w-5 ${
          isActive
            ? 'text-indigo-500'
            : 'text-gray-500 group-hover:text-gray-600'
        }`}
      >
        {icon}
      </span>
      {label}
    </Link>
  );
};

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: <FiHome /> },
    { name: 'Calendar', href: '/calender', icon: <FiCalendar /> },
    { name: 'Content', href: '/content', icon: <FiFileText /> },
    { name: 'AI Chat', href: '/ai-chat', icon: <FiMessageSquare /> },
    { name: 'Analytics', href: '/analytics', icon: <FiBarChart2 /> },
    {
      name: 'Trend Insights',
      href: '/dashboard/trends',
      icon: <FiTrendingUp />,
    },
    { name: 'Settings', href: '/settings', icon: <FiSettings /> },
  ];

  return (
    <div
      className={`w-16 flex flex-col border-r border-gray-200 bg-white ${
        collapsed ? 'w-16' : 'w-64'
      } transition-all duration-300`}
    >
      <div className='h-0 flex-1 flex flex-col pt-5 pb-4 overflow-y-auto'>
        <div className='flex items-center justify-between flex-shrink-0 px-4'>
          {!collapsed && (
            <span className='text-lg font-semibold text-gray-700'>KHRONOS</span>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className='p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500'
          >
            {collapsed ? '→' : '←'}
          </button>
        </div>
        <nav className='mt-5 flex-1 px-2 space-y-1'>
          {navigation.map((item) => (
            <SidebarLink
              key={item.name}
              href={item.href}
              icon={item.icon}
              label={collapsed ? '' : item.name}
              isActive={
                pathname === item.href || pathname?.startsWith(`${item.href}/`)
              }
            />
          ))}
        </nav>
      </div>
      <div className='flex-shrink-0 flex border-t border-gray-200 p-4'>
        <div className='flex-shrink-0 w-full group block'>
          <div className='flex items-center'>
            <div>
              <Image
                className='h-8 w-8 rounded-full'
                src='https://via.placeholder.com/40'
                alt='User avatar'
                width={40}
                height={40}
              />
            </div>
            {!collapsed && (
              <div className='ml-3 w-50'>
                <p className='text-sm font-medium text-gray-700 group-hover:text-gray-900'>
                  Jane Doe
                </p>
                <p className='text-xs font-medium text-gray-500 group-hover:text-gray-700'>
                  View profile
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
