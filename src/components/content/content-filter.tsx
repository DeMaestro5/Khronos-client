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
      <div className='bg-white rounded-2xl border border-gray-200 shadow-sm p-4'>
        <div className='flex items-center justify-between gap-4'>
          {/* Status Filters */}
          <div className='flex items-center gap-3 flex-1'>
            <div className='flex items-center gap-2 flex-shrink-0'>
              <div className='w-2 h-2 rounded-full bg-purple-500'></div>
              <span className='text-sm font-medium text-gray-700'>Status</span>
            </div>
            <div className='flex items-center gap-1.5 flex-wrap'>
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  statusFilter === 'all'
                    ? 'bg-purple-100 text-purple-700 border border-purple-200'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50 border border-transparent'
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
                      ? 'bg-purple-100 text-purple-700 border-purple-200'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50 border-transparent'
                  }`}
                >
                  {status.charAt(0).toUpperCase() +
                    status.slice(1).toLowerCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Vertical Separator */}
          <div className='h-8 w-px bg-gray-200 flex-shrink-0'></div>

          {/* Type Filters */}
          <div className='flex items-center gap-3 flex-1'>
            <div className='flex items-center gap-2 flex-shrink-0'>
              <div className='w-2 h-2 rounded-full bg-blue-500'></div>
              <span className='text-sm font-medium text-gray-700'>Type</span>
            </div>
            <div className='flex items-center gap-1.5 flex-wrap'>
              <button
                onClick={() => setTypeFilter('all')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 border ${
                  typeFilter === 'all'
                    ? 'bg-blue-100 text-blue-700 border border-blue-200'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50 border border-transparent'
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
                      ? 'bg-blue-100 text-blue-700 border-blue-200'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50 border-transparent'
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
            <span className='text-xs text-gray-500'>View:</span>
            <div className='flex bg-gray-100 rounded-lg p-0.5'>
              <button
                onClick={() => setViewMode('grid')}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-all duration-200 ${
                  viewMode === 'grid'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
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
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
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
      <div className='flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3'>
        <div className='flex items-center gap-4'>
          <p className='text-sm font-medium text-gray-700'>
            Showing{' '}
            <span className='text-purple-600 font-semibold'>
              {filteredCount}
            </span>{' '}
            of{' '}
            <span className='text-gray-900 font-semibold'>
              {statusFilter === 'all' ? totalCount - archivedCount : totalCount}
            </span>{' '}
            {statusFilter === 'all' ? 'active ' : ''}content items
            {statusFilter === 'all' && archivedCount > 0 && (
              <span className='text-xs text-gray-500 ml-1'>
                ({archivedCount} archived)
              </span>
            )}
          </p>
          {getActiveFiltersText() && (
            <span className='px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full'>
              Filtered by: {getActiveFiltersText()}
            </span>
          )}
        </div>
        {searchQuery && (
          <span className='px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full'>
            Search: &ldquo;{searchQuery}&rdquo;
          </span>
        )}
      </div>
    </div>
  );
};

export default ContentFilter;
