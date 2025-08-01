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
import { KhronosLogo } from '@/src/components/ui/khronos-logo';

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
      className={`relative flex items-center px-3 py-3 mx-2 text-sm font-medium rounded-lg group transition-all duration-200 ${
        isActive
          ? 'bg-blue-600 text-white'
          : 'text-theme-secondary hover:bg-theme-hover hover:text-theme-primary'
      }`}
      onClick={onClick}
    >
      <span
        className={`flex-shrink-0 h-5 w-5 transition-colors duration-200 ${
          isActive
            ? 'text-white'
            : 'text-theme-muted group-hover:text-theme-primary'
        }`}
      >
        {icon}
      </span>
      {!collapsed && (
        <span
          className={`ml-3 transition-all duration-200 whitespace-nowrap ${
            isActive ? 'text-white' : 'group-hover:text-theme-primary'
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
        collapsed ? 'w-20' : 'w-50 '
      } md:flex flex-col bg-theme-card border-r border-theme-primary transition-all duration-200 hidden`}
    >
      <div className='relative h-full flex flex-col'>
        {/* Header */}
        <div className='flex items-center justify-between p-6 border-b border-theme-primary'>
          {!collapsed && (
            <div className='flex items-center space-x-3'>
              <KhronosLogo size='md' showText={false} />
              <div>
                {/* <div className='text-xl font-bold text-theme-primary'>
                  KHRONOS
                </div> */}
                <div className='text-xs text-theme-secondary'>
                  Content Calendar
                </div>
              </div>
            </div>
          )}
          {collapsed && <KhronosLogo size='sm' showText={false} />}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className='p-2 rounded-lg text-theme-secondary hover:text-theme-primary hover:bg-theme-hover focus:outline-none transition-all duration-200'
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
        <div className='border-t border-theme-primary pt-4 pb-6'>
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
