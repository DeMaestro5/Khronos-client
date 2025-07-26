'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  FiHome,
  FiCalendar,
  FiFileText,
  FiBarChart2,
  FiTrendingUp,
} from 'react-icons/fi';

interface MobileNavItemProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
}

const MobileNavItem: React.FC<MobileNavItemProps> = ({
  href,
  icon,
  label,
  isActive,
}) => {
  return (
    <Link
      href={href}
      className={`flex flex-col items-center justify-center py-2 px-3 text-xs font-medium rounded-lg transition-all duration-200 ${
        isActive
          ? 'text-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400'
          : 'text-theme-secondary hover:text-theme-primary hover:bg-theme-hover'
      }`}
    >
      <span
        className={`h-5 w-5 mb-1 transition-colors duration-200 ${
          isActive
            ? 'text-blue-600 dark:text-blue-400'
            : 'text-theme-muted group-hover:text-theme-primary'
        }`}
      >
        {icon}
      </span>
      <span className='text-xs'>{label}</span>
    </Link>
  );
};

export default function MobileBottomNav() {
  const pathname = usePathname();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: <FiHome /> },
    { name: 'Calendar', href: '/calendar', icon: <FiCalendar /> },
    { name: 'Content', href: '/content', icon: <FiFileText /> },
    { name: 'Analytics', href: '/analytics', icon: <FiBarChart2 /> },
    { name: 'Trends', href: '/trends', icon: <FiTrendingUp /> },
  ];

  return (
    <div className='md:hidden fixed bottom-0 left-0 right-0 z-50 bg-theme-card border-t border-theme-primary shadow-theme-lg'>
      <div className='flex items-center justify-around px-2 py-1'>
        {navigation.map((item) => (
          <MobileNavItem
            key={item.name}
            href={item.href}
            icon={item.icon}
            label={item.name}
            isActive={
              pathname === item.href || pathname?.startsWith(`${item.href}/`)
            }
          />
        ))}
      </div>
    </div>
  );
}
