'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface PageLoadingProps {
  title?: string;
  subtitle?: string;
  contentType?:
    | 'content'
    | 'analytics'
    | 'trends'
    | 'insights'
    | 'data'
    | 'settings';
  showGrid?: boolean;
  gridItems?: number;
}

const PageLoading: React.FC<PageLoadingProps> = ({
  title = 'Loading Your Content',
  subtitle = "We're fetching your amazing content...",
  contentType = 'content',
  showGrid = true,
  gridItems = 8,
}) => {
  const getIcon = () => {
    switch (contentType) {
      case 'analytics':
        return (
          <div className='absolute inset-6 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 animate-spin'></div>
        );
      case 'trends':
        return (
          <div className='absolute inset-6 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 animate-spin'></div>
        );
      case 'insights':
        return (
          <div className='absolute inset-6 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 animate-spin'></div>
        );
      default:
        return (
          <div className='absolute inset-6 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 animate-spin'></div>
        );
    }
  };

  const getGradientColors = () => {
    switch (contentType) {
      case 'analytics':
        return 'from-blue-600 to-indigo-600';
      case 'trends':
        return 'from-emerald-600 to-teal-600';
      case 'insights':
        return 'from-purple-600 to-pink-600';
      default:
        return 'from-purple-600 to-pink-600';
    }
  };

  const getBackgroundColors = () => {
    switch (contentType) {
      case 'analytics':
        return 'from-blue-400/20 to-indigo-400/20 dark:from-blue-400/15 dark:to-indigo-400/15';
      case 'trends':
        return 'from-emerald-400/20 to-teal-400/20 dark:from-emerald-400/15 dark:to-teal-400/15';
      case 'insights':
        return 'from-purple-400/20 to-pink-400/20 dark:from-purple-400/15 dark:to-pink-400/15';
      default:
        return 'from-purple-400/20 to-pink-400/20 dark:from-purple-400/15 dark:to-pink-400/15';
    }
  };

  return (
    <div className='min-h-screen bg-theme-secondary p-3 sm:p-4 lg:p-6 relative overflow-hidden transition-colors duration-300'>
      {/* Floating Background Elements - Fixed positioning */}
      <div className='absolute inset-0 overflow-hidden pointer-events-none'>
        <div
          className={`absolute -top-20 -right-20 w-60 h-60 bg-gradient-to-br ${getBackgroundColors()} rounded-full blur-3xl animate-pulse`}
        ></div>
        <div className='absolute -bottom-20 -left-20 w-60 h-60 bg-gradient-to-tr from-blue-400/25 to-indigo-400/25 dark:from-blue-600/20 dark:to-indigo-600/20 rounded-full blur-3xl animate-pulse animation-delay-1000'></div>
        <div className='absolute top-1/3 left-1/3 w-40 h-40 bg-gradient-to-r from-cyan-400/20 to-purple-400/20 dark:from-cyan-600/15 dark:to-purple-600/15 rounded-full blur-2xl animate-pulse animation-delay-500'></div>
      </div>

      <div className='relative z-10 space-y-6 max-w-7xl mx-auto'>
        {/* Header Section */}
        <div className='flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0'>
          <div className='space-y-3'>
            <div className='relative overflow-hidden rounded-lg'>
              <div className='h-8 shimmer-theme rounded-lg w-64'></div>
            </div>
            <div className='relative overflow-hidden rounded'>
              <div className='h-5 shimmer-theme rounded w-80'></div>
            </div>
          </div>

          {/* Action Button Skeleton */}
          <div className='relative'>
            <div className='h-12 w-40 shimmer-theme rounded-xl'></div>
          </div>
        </div>

        {/* Controls Section */}
        <div className='flex flex-col space-y-3 md:flex-row md:space-y-0 gap-4'>
          <div className='flex-1 relative overflow-hidden rounded-lg'>
            <div className='h-12 shimmer-theme rounded-lg'></div>
          </div>
          <div className='flex gap-3'>
            <div className='h-12 w-24 shimmer-theme rounded-lg'></div>
            <div className='h-12 w-20 shimmer-theme rounded-lg'></div>
          </div>
        </div>

        {/* Central Loading Animation */}
        <div className='text-center py-12'>
          <div className='max-w-md mx-auto space-y-6'>
            {/* Animated Loading Icon */}
            <div className='relative mx-auto w-20 h-20'>
              <div
                className={`absolute inset-0 rounded-full bg-gradient-to-r ${getGradientColors()} opacity-20 animate-ping`}
              ></div>
              <div
                className={`absolute inset-2 rounded-full bg-gradient-to-r ${getGradientColors()} opacity-40 animate-ping animation-delay-200`}
              ></div>
              <div
                className={`absolute inset-4 rounded-full bg-gradient-to-r ${getGradientColors()} opacity-60 animate-ping animation-delay-400`}
              ></div>
              {getIcon()}
              <div className='absolute inset-7 rounded-full bg-theme-card flex items-center justify-center shadow-theme-lg border border-theme-primary'>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  className={`w-3 h-3 bg-gradient-to-r ${getGradientColors()} rounded-full`}
                />
              </div>
            </div>

            {/* Loading Text */}
            <div className='space-y-2'>
              <motion.h3
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`text-xl font-semibold bg-gradient-to-r ${getGradientColors()} bg-clip-text text-transparent`}
              >
                {title}
              </motion.h3>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className='text-theme-secondary'
              >
                {subtitle}
              </motion.p>

              {/* Animated Dots */}
              <div className='flex justify-center space-x-2 pt-2'>
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.7, 1, 0.7],
                    }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      delay: i * 0.2,
                    }}
                    className={`w-2 h-2 bg-gradient-to-r ${getGradientColors()} rounded-full`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Content Grid Skeleton */}
        {showGrid && (
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
            {[...Array(gridItems)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className='relative'
              >
                <div className='bg-theme-card backdrop-blur-sm rounded-2xl shadow-theme-sm border border-theme-primary p-6 h-64 overflow-hidden relative'>
                  {/* Card Header */}
                  <div className='space-y-3 mb-4'>
                    <div className='flex justify-between items-start'>
                      <div className='space-y-2 flex-1'>
                        <div className='h-4 shimmer-theme rounded w-3/4'></div>
                        <div className='h-3 shimmer-theme rounded w-1/2'></div>
                      </div>
                      <div className='w-8 h-8 shimmer-theme rounded-full'></div>
                    </div>
                    <div className='h-6 shimmer-theme rounded'></div>
                  </div>

                  {/* Card Body */}
                  <div className='space-y-2 mb-4'>
                    <div className='h-3 shimmer-theme rounded'></div>
                    <div className='h-3 shimmer-theme rounded w-5/6'></div>
                    <div className='h-3 shimmer-theme rounded w-4/6'></div>
                  </div>

                  {/* Card Footer */}
                  <div className='absolute bottom-6 left-6 right-6'>
                    <div className='flex justify-between items-center'>
                      <div className='flex space-x-2'>
                        <div className='h-6 w-16 shimmer-theme rounded-full'></div>
                        <div className='h-6 w-12 shimmer-theme rounded-full'></div>
                      </div>
                      <div className='h-4 w-20 shimmer-theme rounded'></div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PageLoading;
