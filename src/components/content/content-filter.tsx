'use client';

import React from 'react';
import { Grid3X3, List } from 'lucide-react';
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

  return (
    <div className='space-y-4'>
      {/* Filter Controls */}
      <div className='bg-theme-card rounded-2xl border border-theme-primary shadow-theme-sm p-4'>
        <div className='flex items-center justify-between gap-4'>
          {/* Status Filters */}
          <div className='flex items-center gap-3 flex-1'>
            <div className='flex items-center gap-2 flex-shrink-0'>
              <div className='w-2 h-2 rounded-full bg-accent-primary'></div>
              <span className='text-sm font-medium text-theme-primary'>
                Status
              </span>
            </div>
            <div className='flex items-center gap-1.5 flex-wrap'>
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  statusFilter === 'all'
                    ? 'bg-accent-primary/10 text-accent-primary border border-accent-primary/20'
                    : 'text-theme-secondary hover:text-theme-primary hover:bg-theme-secondary/10 border border-transparent'
                }`}
              >
                All
              </button>
              {Object.values(ContentStatus).map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 border ${
                    statusFilter === status
                      ? 'bg-accent-primary/10 text-accent-primary border-accent-primary/20'
                      : 'text-theme-secondary hover:text-theme-primary hover:bg-theme-secondary/10 border-transparent'
                  }`}
                >
                  {status.charAt(0).toUpperCase() +
                    status.slice(1).toLowerCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Vertical Separator */}
          <div className='h-8 w-px bg-theme-primary/20 flex-shrink-0'></div>

          {/* Type Filters */}
          <div className='flex items-center gap-3 flex-1'>
            <div className='flex items-center gap-2 flex-shrink-0'>
              <div className='w-2 h-2 rounded-full bg-accent-primary'></div>
              <span className='text-sm font-medium text-theme-primary'>
                Type
              </span>
            </div>
            <div className='flex items-center gap-1.5 flex-wrap'>
              <button
                onClick={() => setTypeFilter('all')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 border ${
                  typeFilter === 'all'
                    ? 'bg-accent-primary/10 text-accent-primary border border-accent-primary/20'
                    : 'text-theme-secondary hover:text-theme-primary hover:bg-theme-secondary/10 border border-transparent'
                }`}
              >
                All
              </button>
              {Object.values(ContentType).map((type) => (
                <button
                  key={type}
                  onClick={() => setTypeFilter(type)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 border ${
                    typeFilter === type
                      ? 'bg-accent-primary/10 text-accent-primary border-accent-primary/20'
                      : 'text-theme-secondary hover:text-theme-primary hover:bg-theme-secondary/10 border-transparent'
                  }`}
                >
                  <span className='text-xs'>{getTypeIcon(type)}</span>
                  <span>{getTypeName(type)}</span>
                </button>
              ))}
            </div>
          </div>

          {/* View Mode Toggle */}
          <div className='flex items-center gap-3 flex-shrink-0'>
            <span className='text-xs text-theme-secondary'>View:</span>
            <div className='flex bg-theme-secondary/20 rounded-lg p-0.5'>
              <button
                onClick={() => setViewMode('grid')}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-all duration-200 ${
                  viewMode === 'grid'
                    ? 'bg-theme-card text-theme-primary shadow-sm'
                    : 'text-theme-secondary hover:text-theme-primary'
                }`}
                title='Grid View'
              >
                <Grid3X3 className='w-3.5 h-3.5' />
                <span>Grid</span>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-all duration-200 ${
                  viewMode === 'list'
                    ? 'bg-theme-card text-theme-primary shadow-sm'
                    : 'text-theme-secondary hover:text-theme-primary'
                }`}
                title='List View'
              >
                <List className='w-3.5 h-3.5' />
                <span>List</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Results Summary */}
      <div className='flex items-center justify-between bg-theme-secondary/10 rounded-xl px-4 py-3'>
        <div className='flex items-center gap-4'>
          <p className='text-sm font-medium text-theme-secondary'>
            Showing{' '}
            <span className='text-accent-primary font-semibold'>
              {filteredCount}
            </span>{' '}
            of{' '}
            <span className='text-theme-primary font-semibold'>
              {statusFilter === 'all' ? totalCount - archivedCount : totalCount}
            </span>{' '}
            {statusFilter === 'all' ? 'active ' : ''}content items
            {statusFilter === 'all' && archivedCount > 0 && (
              <span className='text-xs text-theme-secondary ml-1'>
                ({archivedCount} archived)
              </span>
            )}
          </p>
          {getActiveFiltersText() && (
            <span className='px-2 py-1 bg-accent-primary/10 text-accent-primary text-xs font-medium rounded-full'>
              Filtered by: {getActiveFiltersText()}
            </span>
          )}
        </div>
        {searchQuery && (
          <span className='px-2 py-1 bg-accent-primary/10 text-accent-primary text-xs font-medium rounded-full'>
            Search: &ldquo;{searchQuery}&rdquo;
          </span>
        )}
      </div>
    </div>
  );
};

export default ContentFilter;
