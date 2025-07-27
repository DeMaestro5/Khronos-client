'use client';

import React from 'react';
import { Button } from '@/src/components/ui/button';
import {
  TrendingUp,
  Filter as FilterIcon,
  RefreshCw as RefreshCwIcon,
} from 'lucide-react';

interface TrendsHeaderProps {
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
  isRefreshing: boolean;
  onRefresh: () => void;
}

const TrendsHeader: React.FC<TrendsHeaderProps> = ({
  showFilters,
  setShowFilters,
  isRefreshing,
  onRefresh,
}) => {
  return (
    <div className='bg-theme-card/90 backdrop-blur-sm border-b border-theme-tertiary shadow-sm transition-colors duration-300'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8'>
        {/* Mobile Layout */}
        <div className='block sm:hidden'>
          <div className='flex items-center justify-between mb-4'>
            <div className='flex items-center space-x-3'>
              <div className='p-2 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-indigo-700 rounded-lg shadow-lg'>
                <TrendingUp className='w-5 h-5 text-white' />
              </div>
              <div>
                <h1 className='text-xl font-bold text-theme-primary'>
                  Trends & Analytics
                </h1>
                <p className='text-xs text-theme-secondary font-medium'>
                  Real-time insights
                </p>
              </div>
            </div>
            <div className='flex items-center space-x-2'>
              <Button
                variant='outline'
                size='sm'
                onClick={() => setShowFilters(!showFilters)}
                className='flex items-center space-x-1 text-theme-secondary bg-theme-card/80 backdrop-blur-sm border-theme-primary hover:bg-theme-card hover:shadow-md transition-all duration-200 px-2 py-1 text-xs'
              >
                <FilterIcon className='w-3 h-3' />
                <span className='hidden xs:inline'>Filters</span>
              </Button>
              <Button
                variant='outline'
                size='sm'
                onClick={onRefresh}
                disabled={isRefreshing}
                className='flex items-center space-x-1 text-theme-secondary bg-theme-card/80 backdrop-blur-sm border-theme-primary hover:bg-theme-card hover:shadow-md transition-all duration-200 px-2 py-1 text-xs'
              >
                <RefreshCwIcon
                  className={`w-3 h-3 ${isRefreshing ? 'animate-spin' : ''}`}
                />
                <span className='hidden xs:inline'>
                  {isRefreshing ? 'Refreshing...' : 'Refresh'}
                </span>
              </Button>
            </div>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className='hidden sm:flex items-center justify-between'>
          <div className='flex items-center space-x-4'>
            <div className='p-3 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-indigo-700 rounded-xl shadow-lg'>
              <TrendingUp className='w-7 h-7 text-white' />
            </div>
            <div>
              <h1 className='text-3xl font-bold text-theme-primary'>
                Trends & Analytics
              </h1>
              <p className='text-theme-secondary mt-1 font-medium'>
                Real-time social media insights
              </p>
            </div>
          </div>
          <div className='flex items-center space-x-3'>
            <Button
              variant='outline'
              size='sm'
              onClick={() => setShowFilters(!showFilters)}
              className='flex items-center space-x-2 text-theme-secondary bg-theme-card/80 backdrop-blur-sm border-theme-primary hover:bg-theme-card hover:shadow-md transition-all duration-200'
            >
              <FilterIcon className='w-4 h-4' />
              <span>Filters</span>
            </Button>
            <Button
              variant='outline'
              size='sm'
              onClick={onRefresh}
              disabled={isRefreshing}
              className='flex items-center space-x-2 text-theme-secondary bg-theme-card/80 backdrop-blur-sm border-theme-primary hover:bg-theme-card hover:shadow-md transition-all duration-200'
            >
              <RefreshCwIcon
                className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`}
              />
              <span>{isRefreshing ? 'Refreshing...' : 'Refresh'}</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrendsHeader;
