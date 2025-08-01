'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ThemeToggle } from './theme-toggle';

interface MainNavbarProps {
  logoClickable?: boolean;
}

export function MainNavbar({ logoClickable = false }: MainNavbarProps) {
  const Logo = () => (
    <div className='flex items-center space-x-2'>
      <div className='w-7 h-7 sm:w-8 sm:h-8 bg-accent-primary rounded-lg flex items-center justify-center flex-shrink-0'>
        <span className='text-white font-bold text-xs sm:text-sm'>K</span>
      </div>
      <span className='text-base sm:text-xl font-bold text-theme-primary truncate'>
        KHRONOS
      </span>
    </div>
  );

  return (
    <motion.nav
      className='fixed top-0 w-full bg-theme-card border-b border-theme-primary z-50 theme-transition sm:bg-theme-card/95 sm:backdrop-blur-md'
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className='w-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto'>
        <div className='flex justify-between items-center py-3 sm:py-4'>
          <div className='flex items-center space-x-2'>
            {logoClickable ? (
              <Link href='/' className='flex items-center space-x-2'>
                <Logo />
              </Link>
            ) : (
              <Logo />
            )}
          </div>
          <div className='flex items-center space-x-2 sm:space-x-3 flex-shrink-0'>
            {/* Show theme toggle on all screen sizes */}
            <ThemeToggle variant='compact' showLabels={false} size='sm' />
            <Link
              href='/auth/login'
              className='inline-flex items-center justify-center h-9 px-3 sm:px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 text-theme-secondary hover:text-theme-primary hover:bg-theme-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none'
            >
              Login
            </Link>
            <Link
              href='/auth/signup'
              className='inline-flex items-center justify-center h-9 px-3 sm:px-6 py-2 text-sm font-semibold rounded-lg shadow-sm hover:shadow-md transition-all duration-200 bg-accent-primary hover:bg-accent-secondary text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none'
            >
              <span className='hidden sm:inline'>Get Started</span>
              <span className='sm:hidden'>Start</span>
            </Link>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
