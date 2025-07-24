'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Filter as FilterIcon,
  ChevronDown,
  X,
  Calendar,
  Globe,
  Tag,
  Heart,
} from 'lucide-react';
import {
  TrendsFilters as FiltersType,
  Platform,
  Category,
} from '@/src/types/trends';

interface TrendsFiltersProps {
  showFilters: boolean;
  filters: FiltersType;
  setFilters: React.Dispatch<React.SetStateAction<FiltersType>>;
  platforms: Platform[];
  categories: Category[];
}

interface DropdownProps {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
  icon: React.ReactNode;
}

const CustomDropdown: React.FC<DropdownProps> = ({
  label,
  value,
  options,
  onChange,
  icon,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <div className='relative'>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className='w-full flex items-center justify-between px-4 py-3 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-600 rounded-xl hover:border-blue-300 dark:hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm hover:shadow-md'
      >
        <div className='flex items-center space-x-3'>
          <div className='text-blue-600 dark:text-blue-400'>{icon}</div>
          <div className='text-left'>
            <div className='text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wide'>
              {label}
            </div>
            <div className='text-sm font-semibold text-gray-900 dark:text-slate-100'>
              {selectedOption?.label || 'Select...'}
            </div>
          </div>
        </div>
        <ChevronDown
          className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <div
              className='fixed inset-0 z-[99998]'
              onClick={() => setIsOpen(false)}
            />

            {/* Dropdown Menu */}
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className='absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-600 rounded-xl shadow-xl z-[99999] max-h-64 overflow-y-auto'
            >
              <div className='py-2'>
                {options.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      onChange(option.value);
                      setIsOpen(false);
                    }}
                    className={`w-full px-4 py-3 text-left hover:bg-blue-50 dark:hover:bg-slate-700 transition-colors duration-150 ${
                      option.value === value
                        ? 'bg-blue-50 dark:bg-slate-700 text-blue-600 dark:text-blue-400 font-medium'
                        : 'text-gray-700 dark:text-slate-300'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

const TrendsFilters: React.FC<TrendsFiltersProps> = ({
  showFilters,
  filters,
  setFilters,
  platforms,
  categories,
}) => {
  const timeRangeOptions = [
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'quarter', label: 'This Quarter' },
    { value: 'year', label: 'This Year' },
  ];

  const sentimentOptions = [
    { value: 'all', label: 'All Sentiments' },
    { value: 'positive', label: 'Positive' },
    { value: 'neutral', label: 'Neutral' },
    { value: 'negative', label: 'Negative' },
  ];

  const clearFilters = () => {
    setFilters({
      platform: 'all',
      category: 'all',
      timeRange: 'week',
      sentiment: 'all',
    });
  };

  const hasActiveFilters =
    filters.platform !== 'all' ||
    filters.category !== 'all' ||
    filters.timeRange !== 'week' ||
    filters.sentiment !== 'all';

  if (!showFilters) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className='mb-8'
    >
      <div className='bg-gradient-to-r from-white to-blue-50 dark:from-slate-800 dark:to-slate-700 rounded-2xl border border-theme-tertiary shadow-lg backdrop-blur-sm'>
        {/* Header */}
        <div className='px-6 py-4 border-b border-theme-tertiary'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-3'>
              <div className='p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg'>
                <FilterIcon className='w-5 h-5 text-blue-600 dark:text-blue-400' />
              </div>
              <div>
                <h3 className='text-lg font-semibold text-gray-900 dark:text-slate-100'>
                  Advanced Filters
                </h3>
                <p className='text-sm text-gray-500 dark:text-slate-400'>
                  Customize your trends analysis
                </p>
              </div>
            </div>

            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className='flex items-center space-x-2 px-3 py-1.5 text-sm text-gray-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors duration-200'
              >
                <X className='w-4 h-4' />
                <span>Clear All</span>
              </button>
            )}
          </div>
        </div>

        {/* Filter Controls */}
        <div className='p-6'>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
            <CustomDropdown
              label='Platform'
              value={filters.platform || 'all'}
              options={platforms}
              onChange={(value) =>
                setFilters((prev) => ({ ...prev, platform: value }))
              }
              icon={<Globe className='w-4 h-4' />}
            />

            <CustomDropdown
              label='Category'
              value={filters.category || 'all'}
              options={categories}
              onChange={(value) =>
                setFilters((prev) => ({ ...prev, category: value }))
              }
              icon={<Tag className='w-4 h-4' />}
            />

            <CustomDropdown
              label='Time Range'
              value={filters.timeRange || 'week'}
              options={timeRangeOptions}
              onChange={(value) =>
                setFilters((prev) => ({
                  ...prev,
                  timeRange: value as FiltersType['timeRange'],
                }))
              }
              icon={<Calendar className='w-4 h-4' />}
            />

            <CustomDropdown
              label='Sentiment'
              value={filters.sentiment || 'all'}
              options={sentimentOptions}
              onChange={(value) =>
                setFilters((prev) => ({
                  ...prev,
                  sentiment: value as FiltersType['sentiment'],
                }))
              }
              icon={<Heart className='w-4 h-4' />}
            />
          </div>

          {/* Active Filters Display */}
          {hasActiveFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className='mt-6 pt-4 border-t border-theme-tertiary'
            >
              <div className='flex flex-wrap gap-2'>
                <span className='text-sm font-medium text-gray-600 dark:text-slate-400'>
                  Active filters:
                </span>
                {filters.platform !== 'all' && (
                  <span className='inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200'>
                    {platforms.find((p) => p.value === filters.platform)
                      ?.label || filters.platform}
                  </span>
                )}
                {filters.category !== 'all' && (
                  <span className='inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-200'>
                    {categories.find((c) => c.value === filters.category)
                      ?.label || filters.category}
                  </span>
                )}
                {filters.timeRange !== 'week' && (
                  <span className='inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-purple-100 dark:bg-purple-900/50 text-purple-800 dark:text-purple-200'>
                    {timeRangeOptions.find((t) => t.value === filters.timeRange)
                      ?.label || filters.timeRange}
                  </span>
                )}
                {filters.sentiment !== 'all' && (
                  <span className='inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-pink-100 dark:bg-pink-900/50 text-pink-800 dark:text-pink-200'>
                    {sentimentOptions.find((s) => s.value === filters.sentiment)
                      ?.label || filters.sentiment}
                  </span>
                )}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default TrendsFilters;
