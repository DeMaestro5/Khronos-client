'use client';

import React, { useState } from 'react';
import { Grid3X3, List, Filter, ChevronDown, ChevronUp, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ContentStatus, ContentType } from '@/src/types/content';

type ViewMode = 'grid' | 'list';
type StatusFilter = 'all' | ContentStatus;
type TypeFilter = 'all' | ContentType;

interface ContentFilterProps {
  statusFilter: StatusFilter;
  setStatusFilter: (filter: StatusFilter) => void;
  typeFilter: TypeFilter;
  setTypeFilter: (filter: TypeFilter) => void;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  filteredCount: number;
  totalCount: number;
  archivedCount: number;
  searchQuery: string;
}

const ContentFilter: React.FC<ContentFilterProps> = ({
  statusFilter,
  setStatusFilter,
  typeFilter,
  setTypeFilter,
  viewMode,
  setViewMode,
  filteredCount,
  totalCount,
  archivedCount,
  searchQuery,
}) => {
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilterSection, setActiveFilterSection] = useState<
    'status' | 'type' | null
  >(null);

  const getTypeIcon = (contentType: string) => {
    switch (contentType) {
      case 'blog_post':
        return '📝';
      case 'social':
        return '📱';
      case 'video':
        return '🎥';
      case 'podcast':
        return '🎧';
      case 'newsletter':
        return '📧';
      case 'article':
        return '📄';
      default:
        return '📋';
    }
  };

  const getTypeName = (contentType: string) => {
    switch (contentType) {
      case 'blog_post':
        return 'Blog';
      case 'social':
        return 'Social';
      case 'video':
        return 'Video';
      case 'podcast':
        return 'Podcast';
      case 'newsletter':
        return 'Newsletter';
      case 'article':
        return 'Article';
      default:
        return 'Other';
    }
  };

  const getActiveFiltersText = () => {
    const filters = [];
    if (statusFilter !== 'all') {
      filters.push(
        statusFilter.charAt(0).toUpperCase() +
          statusFilter.slice(1).toLowerCase()
      );
    }
    if (typeFilter !== 'all') {
      filters.push(getTypeName(typeFilter));
    }
    return filters.length > 0 ? filters.join(' + ') : null;
  };

  const hasActiveFilters = statusFilter !== 'all' || typeFilter !== 'all';

  const clearAllFilters = () => {
    setStatusFilter('all');
    setTypeFilter('all');
  };

  return (
    <div className='space-y-4'>
      {/* Mobile Filter Header */}
      <div className='flex items-center justify-between'>
        {/* Filter Toggle Button */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className='flex items-center gap-2 px-4 py-2.5 bg-theme-card border border-theme-primary rounded-xl text-sm font-medium text-theme-primary hover:bg-theme-hover transition-all duration-200 shadow-theme-sm'
        >
          <Filter className='w-4 h-4' />
          <span>Filters</span>
          {hasActiveFilters && (
            <span className='w-2 h-2 bg-accent-primary rounded-full'></span>
          )}
          {showFilters ? (
            <ChevronUp className='w-4 h-4' />
          ) : (
            <ChevronDown className='w-4 h-4' />
          )}
        </button>

        {/* View Mode Toggle - Hidden on mobile */}
        <div className='hidden md:flex items-center bg-theme-card border border-theme-primary rounded-xl p-1 shadow-theme-sm'>
          <button
            onClick={() => setViewMode('grid')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              viewMode === 'grid'
                ? 'bg-accent-primary text-white shadow-sm'
                : 'text-theme-secondary hover:text-theme-primary'
            }`}
            title='Grid View'
          >
            <Grid3X3 className='w-4 h-4' />
            <span>Grid</span>
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              viewMode === 'list'
                ? 'bg-accent-primary text-white shadow-sm'
                : 'text-theme-secondary hover:text-theme-primary'
            }`}
            title='List View'
          >
            <List className='w-4 h-4' />
            <span>List</span>
          </button>
        </div>
      </div>

      {/* Mobile Filter Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.4, 0.0, 0.2, 1] }}
            className='bg-theme-card border border-theme-primary rounded-2xl shadow-theme-sm overflow-hidden'
          >
            {/* Active Filters Display */}
            {hasActiveFilters && (
              <div className='p-4 border-b border-theme-primary/20 bg-theme-secondary/30'>
                <div className='flex items-center justify-between'>
                  <div className='flex items-center gap-2 flex-wrap'>
                    <span className='text-sm font-medium text-theme-primary'>
                      Active Filters:
                    </span>
                    {getActiveFiltersText() && (
                      <span className='px-3 py-1 bg-accent-primary/10 text-accent-primary text-sm font-medium rounded-full'>
                        {getActiveFiltersText()}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={clearAllFilters}
                    className='flex items-center gap-1 px-2 py-1 text-xs text-theme-secondary hover:text-accent-primary transition-colors duration-200'
                  >
                    <X className='w-3 h-3' />
                    <span>Clear all</span>
                  </button>
                </div>
              </div>
            )}

            {/* Filter Sections */}
            <div className='p-4 space-y-4'>
              {/* Status Filter Section */}
              <div className='space-y-3'>
                <button
                  onClick={() =>
                    setActiveFilterSection(
                      activeFilterSection === 'status' ? null : 'status'
                    )
                  }
                  className='flex items-center justify-between w-full p-3 bg-theme-secondary/30 rounded-xl hover:bg-theme-secondary/50 transition-all duration-200'
                >
                  <div className='flex items-center gap-2'>
                    <div className='w-2 h-2 rounded-full bg-blue-500'></div>
                    <span className='font-medium text-theme-primary'>
                      Status
                    </span>
                    {statusFilter !== 'all' && (
                      <span className='px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs rounded-full'>
                        {statusFilter}
                      </span>
                    )}
                  </div>
                  {activeFilterSection === 'status' ? (
                    <ChevronUp className='w-4 h-4 text-theme-secondary' />
                  ) : (
                    <ChevronDown className='w-4 h-4 text-theme-secondary' />
                  )}
                </button>

                <AnimatePresence>
                  {activeFilterSection === 'status' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className='pl-4 space-y-2'
                    >
                      <button
                        onClick={() => setStatusFilter('all')}
                        className={`w-full flex items-center justify-between p-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                          statusFilter === 'all'
                            ? 'bg-accent-primary text-white shadow-sm'
                            : 'bg-theme-card text-theme-primary hover:bg-theme-hover'
                        }`}
                      >
                        <span>All Status</span>
                        {statusFilter === 'all' && (
                          <div className='w-2 h-2 bg-white rounded-full'></div>
                        )}
                      </button>
                      {Object.values(ContentStatus).map((status) => (
                        <button
                          key={status}
                          onClick={() => setStatusFilter(status)}
                          className={`w-full flex items-center justify-between p-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                            statusFilter === status
                              ? 'bg-accent-primary text-white shadow-sm'
                              : 'bg-theme-card text-theme-primary hover:bg-theme-hover'
                          }`}
                        >
                          <span>
                            {status.charAt(0).toUpperCase() +
                              status.slice(1).toLowerCase()}
                          </span>
                          {statusFilter === status && (
                            <div className='w-2 h-2 bg-white rounded-full'></div>
                          )}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Type Filter Section */}
              <div className='space-y-3'>
                <button
                  onClick={() =>
                    setActiveFilterSection(
                      activeFilterSection === 'type' ? null : 'type'
                    )
                  }
                  className='flex items-center justify-between w-full p-3 bg-theme-secondary/30 rounded-xl hover:bg-theme-secondary/50 transition-all duration-200'
                >
                  <div className='flex items-center gap-2'>
                    <div className='w-2 h-2 rounded-full bg-purple-500'></div>
                    <span className='font-medium text-theme-primary'>
                      Content Type
                    </span>
                    {typeFilter !== 'all' && (
                      <span className='px-2 py-0.5 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 text-xs rounded-full'>
                        {getTypeName(typeFilter)}
                      </span>
                    )}
                  </div>
                  {activeFilterSection === 'type' ? (
                    <ChevronUp className='w-4 h-4 text-theme-secondary' />
                  ) : (
                    <ChevronDown className='w-4 h-4 text-theme-secondary' />
                  )}
                </button>

                <AnimatePresence>
                  {activeFilterSection === 'type' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className='pl-4 space-y-2'
                    >
                      <button
                        onClick={() => setTypeFilter('all')}
                        className={`w-full flex items-center justify-between p-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                          typeFilter === 'all'
                            ? 'bg-accent-primary text-white shadow-sm'
                            : 'bg-theme-card text-theme-primary hover:bg-theme-hover'
                        }`}
                      >
                        <span>All Types</span>
                        {typeFilter === 'all' && (
                          <div className='w-2 h-2 bg-white rounded-full'></div>
                        )}
                      </button>
                      {Object.values(ContentType).map((type) => (
                        <button
                          key={type}
                          onClick={() => setTypeFilter(type)}
                          className={`w-full flex items-center justify-between p-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                            typeFilter === type
                              ? 'bg-accent-primary text-white shadow-sm'
                              : 'bg-theme-card text-theme-primary hover:bg-theme-hover'
                          }`}
                        >
                          <div className='flex items-center gap-2'>
                            <span className='text-lg'>{getTypeIcon(type)}</span>
                            <span>{getTypeName(type)}</span>
                          </div>
                          {typeFilter === type && (
                            <div className='w-2 h-2 bg-white rounded-full'></div>
                          )}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results Summary */}
      <div className='bg-theme-secondary/10 rounded-xl p-4'>
        <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3'>
          <div className='flex items-center gap-2 flex-wrap'>
            <p className='text-sm font-medium text-theme-secondary'>
              Showing{' '}
              <span className='text-accent-primary font-semibold'>
                {filteredCount}
              </span>{' '}
              of{' '}
              <span className='text-theme-primary font-semibold'>
                {statusFilter === 'all'
                  ? totalCount - archivedCount
                  : totalCount}
              </span>{' '}
              {statusFilter === 'all' ? 'active ' : ''}content items
              {statusFilter === 'all' && archivedCount > 0 && (
                <span className='text-xs text-theme-secondary ml-1'>
                  ({archivedCount} archived)
                </span>
              )}
            </p>
          </div>
          <div className='flex items-center gap-2 flex-wrap'>
            {getActiveFiltersText() && (
              <span className='px-3 py-1 bg-accent-primary/10 text-accent-primary text-xs font-medium rounded-full'>
                {getActiveFiltersText()}
              </span>
            )}
            {searchQuery && (
              <span className='px-3 py-1 bg-accent-primary/10 text-accent-primary text-xs font-medium rounded-full'>
                Search: &ldquo;{searchQuery}&rdquo;
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentFilter;
