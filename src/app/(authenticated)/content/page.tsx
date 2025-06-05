'use client';

import React, { useState, useEffect } from 'react';
import { Search, Filter, Grid3X3, List, Plus, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import confetti from 'canvas-confetti';
import { Content, ContentStatus, ContentType } from '@/src/types/content';
import { ContentCard } from '@/src/components/content/content-card';
import { ContentListItem } from '@/src/components/content/content-list-items';
import CreateContentModal from '@/src/components/content/content-creation-modal';
import { ContentFormData } from '@/src/types/modal';
import { contentAPI } from '@/src/lib/api';
import AuthDebug from '@/src/components/debug/AuthDebug';

type ViewMode = 'grid' | 'list';
type FilterType = 'all' | ContentStatus | ContentType;

interface ContentCreatePayload {
  title: string;
  description?: string;
  type: string;
  platform: string[];
  tags?: string[];
  scheduledDate?: string;
}

export default function ContentPage() {
  const [contents, setContents] = useState<Content[]>([]);
  const [filteredContents, setFilteredContents] = useState<Content[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<FilterType>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchContents = async () => {
      setIsLoading(true);
      try {
        // Debug: Check if token exists
        const token = localStorage.getItem('token');
        console.log('Token exists:', !!token);

        if (!token) {
          console.error('No authentication token found');
          window.location.href = '/auth/login';
          return;
        }

        const response = await contentAPI.getAll();
        console.log('Content API Response:', response.data);

        if (response.data?.statusCode === '10000' && response.data?.data) {
          setContents(response.data.data);
          setFilteredContents(response.data.data);
        } else {
          console.error('Failed to fetch contents', response.data);
          setContents([]);
          setFilteredContents([]);
        }
      } catch (error: unknown) {
        console.error('Failed to fetch contents:', error);

        const errorObj = error as {
          response?: { status?: number; data?: unknown };
        };
        if (errorObj?.response?.status === 401) {
          console.error('Authentication failed - redirecting to login');
          localStorage.removeItem('token');
          window.location.href = '/auth/login';
          return;
        }

        console.error('Error response:', errorObj?.response?.data);
        console.error('Error status:', errorObj?.response?.status);
        setContents([]);
        setFilteredContents([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchContents();
  }, []);

  // Celebratory confetti function
  const celebrateWithConfetti = () => {
    // First burst - colorful confetti from center
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: [
        '#667eea',
        '#764ba2',
        '#f093fb',
        '#f5576c',
        '#4facfe',
        '#00f2fe',
      ],
    });

    // Second burst - stars from left
    setTimeout(() => {
      confetti({
        particleCount: 50,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.8 },
        colors: ['#ffd700', '#ffed4e', '#ff6b6b', '#4ecdc4'],
        shapes: ['star'],
      });
    }, 250);

    // Third burst - stars from right
    setTimeout(() => {
      confetti({
        particleCount: 50,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.8 },
        colors: ['#ffd700', '#ffed4e', '#ff6b6b', '#4ecdc4'],
        shapes: ['star'],
      });
    }, 400);

    // Fourth burst - glitter rain
    setTimeout(() => {
      confetti({
        particleCount: 150,
        spread: 180,
        startVelocity: 45,
        scalar: 0.8,
        origin: { y: 0.1 },
        colors: [
          '#667eea',
          '#764ba2',
          '#f093fb',
          '#f5576c',
          '#ffd700',
          '#4facfe',
        ],
      });
    }, 600);
  };

  const handleCreateContent = async (contentData: ContentFormData) => {
    // Validate required fields first
    if (!contentData.title.trim()) {
      toast.error('Content title is required');
      return;
    }

    if (contentData.platforms.length === 0) {
      toast.error('Please select at least one platform');
      return;
    }

    // Close modal immediately and reset states
    setShowModal(false);

    // Show creating toast with loading indicator
    const creatingToastId = toast.loading(
      '🚀 Creating your content... AI is working its magic!',
      {
        style: {
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          border: 'none',
          fontWeight: '500',
        },
      }
    );

    try {
      // Prepare the payload according to the server schema
      const newContentPayload: ContentCreatePayload = {
        title: contentData.title.trim(),
        type: contentData.contentType,
        platform: contentData.platforms,
      };

      // Add optional fields only if they have values
      if (contentData.description?.trim()) {
        newContentPayload.description = contentData.description.trim();
      }

      if (contentData.tags.length > 0) {
        newContentPayload.tags = contentData.tags.filter((tag) => tag.trim());
      }

      // Combine scheduled date and time if both are provided
      if (contentData.scheduledDate && contentData.scheduledTime) {
        const scheduledDateTime = `${contentData.scheduledDate}T${contentData.scheduledTime}:00.000Z`;
        newContentPayload.scheduledDate = scheduledDateTime;
      } else if (contentData.scheduledDate) {
        // If only date is provided, use it as is
        newContentPayload.scheduledDate = new Date(
          contentData.scheduledDate
        ).toISOString();
      }

      console.log('Creating content with payload:', newContentPayload);

      // Call the API to create content
      const response = await contentAPI.create(newContentPayload);

      console.log('Content creation response:', response.data);

      // Check if the creation was successful
      if (
        response.data?.statusCode === '10000' ||
        response.status === 200 ||
        response.status === 201
      ) {
        // Dismiss the creating toast
        toast.dismiss(creatingToastId);

        // Show celebratory success toast
        toast.success(
          '🎉 Content created successfully! Your masterpiece is ready!',
          {
            duration: 5000,
            style: {
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              fontWeight: '500',
              fontSize: '16px',
            },
            icon: '✨',
          }
        );

        // Celebrate with confetti immediately after toast
        setTimeout(() => {
          celebrateWithConfetti();
        }, 100);

        // Refresh the content list to show the new content
        const refreshResponse = await contentAPI.getAll();
        if (
          (refreshResponse.data?.statusCode === '10000' ||
            refreshResponse.status === 200) &&
          refreshResponse.data?.data
        ) {
          setContents(refreshResponse.data.data);
          setFilteredContents(refreshResponse.data.data);
        }
      } else {
        throw new Error(response.data?.message || 'Failed to create content');
      }
    } catch (error: unknown) {
      console.error('Failed to create content:', error);

      // Dismiss the creating toast
      toast.dismiss(creatingToastId);

      // Show error notification with specific message
      let errorMessage = 'Failed to create content. Please try again.';

      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (
        typeof error === 'object' &&
        error !== null &&
        'response' in error
      ) {
        const axiosError = error as {
          response?: { data?: { message?: string } };
        };
        errorMessage = axiosError.response?.data?.message || errorMessage;
      }

      toast.error(`❌ ${errorMessage}`, {
        duration: 6000,
        style: {
          background: '#ef4444',
          color: 'white',
          border: 'none',
          fontWeight: '500',
        },
      });
    }
  };

  useEffect(() => {
    let filtered = contents;

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (content) =>
          content.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          content.description
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          content.tags.some((tag) =>
            tag.toLowerCase().includes(searchQuery.toLowerCase())
          )
      );
    }

    // Apply status/type filter
    if (selectedFilter !== 'all') {
      filtered = filtered.filter(
        (content) =>
          content.status === selectedFilter || content.type === selectedFilter
      );
    }

    setFilteredContents(filtered);
  }, [contents, searchQuery, selectedFilter]);

  if (isLoading) {
    return (
      <div className='p-6'>
        <div className='animate-pulse space-y-6'>
          <div className='h-8 bg-gray-200 rounded w-64'></div>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {[...Array(6)].map((_, i) => (
              <div key={i} className='h-64 bg-gray-200 rounded-lg'></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='p-6 space-y-6'>
      {/* Header */}
      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
        <div>
          <h1 className='text-2xl font-bold text-gray-900'>Content Library</h1>
          <p className='text-gray-600'>
            Manage and organize all your content in one place
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className='group flex items-center justify-center space-x-2 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-xl sm:rounded-2xl text-white font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/50'
        >
          <Plus className='h-4 w-4 sm:h-5 sm:w-5 group-hover:rotate-90 transition-transform duration-300' />
          <span className='text-sm sm:text-base'>Create Content</span>
        </button>
      </div>

      {/* Controls */}
      <div className='flex flex-col sm:flex-row gap-4'>
        {/* Search */}
        <div className='relative flex-1'>
          <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-900' />
          <input
            type='text'
            placeholder='Search content...'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className='w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 text-gray-900 focus:ring-blue-500 focus:border-transparent placeholder:text-gray-500'
          />
        </div>

        {/* Filters */}
        <div className='flex items-center gap-2'>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-3 py-2 border rounded-lg transition-colors text-gray-500 ${
              showFilters
                ? 'bg-blue-50 border-blue-200 text-blue-700'
                : 'border-gray-300 hover:bg-gray-50'
            }`}
          >
            <Filter className='w-4 h-4 text-gray-500' />
            Filter
          </button>

          {/* View Mode Toggle */}
          <div className='flex border border-gray-300 rounded-lg overflow-hidden'>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 transition-colors text-gray-500 ${
                viewMode === 'grid'
                  ? 'bg-blue-600 text-white'
                  : 'hover:bg-gray-50'
              }`}
            >
              <Grid3X3 className='w-4 h-4' />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 transition-colors text-gray-500 ${
                viewMode === 'list'
                  ? 'bg-blue-600 text-white'
                  : 'hover:bg-gray-50'
              }`}
            >
              <List className='w-4 h-4' />
            </button>
          </div>
        </div>
      </div>

      {/* Filter Options */}
      {showFilters && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className='p-4 bg-gray-50 rounded-lg'
        >
          <div className='flex flex-wrap gap-2'>
            <button
              onClick={() => setSelectedFilter('all')}
              className={`px-3 py-1 rounded-full text-sm transition-colors ${
                selectedFilter === 'all'
                  ? 'bg-blue-600 text-gray-900'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              All Content
            </button>
            {Object.values(ContentStatus).map((status) => (
              <button
                key={status}
                onClick={() => setSelectedFilter(status)}
                className={`px-3 py-1 rounded-full text-sm transition-colors ${
                  selectedFilter === status
                    ? 'bg-blue-600 text-gray-900'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {status.replace('_', ' ').toUpperCase()}
              </button>
            ))}
            {Object.values(ContentType).map((type) => (
              <button
                key={type}
                onClick={() => setSelectedFilter(type)}
                className={`px-3 py-1 rounded-full text-sm transition-colors ${
                  selectedFilter === type
                    ? 'bg-blue-600 text-gray-900'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {type.replace('_', ' ')}
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Content Count */}
      <div className='flex items-center justify-between'>
        <p className='text-sm text-gray-600'>
          Showing {filteredContents.length} of {contents.length} content items
        </p>
      </div>

      {/* Content Grid/List */}
      <AnimatePresence mode='wait'>
        {filteredContents.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className='text-center py-12'
          >
            <div className='max-w-md mx-auto'>
              <div className='w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                <FileText className='w-8 h-8 text-gray-400' />
              </div>
              <h3 className='text-lg font-medium text-gray-900 mb-2'>
                No content found
              </h3>
              <p className='text-gray-600 mb-4'>
                {searchQuery || selectedFilter !== 'all'
                  ? 'Try adjusting your search or filters'
                  : 'Get started by creating your first piece of content'}
              </p>
            </div>
          </motion.div>
        ) : viewMode === 'grid' ? (
          <motion.div
            key='grid'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
          >
            <AnimatePresence>
              {filteredContents.map((content) => (
                <ContentCard key={content._id} content={content} />
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <motion.div
            key='list'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className='space-y-4'
          >
            <AnimatePresence>
              {filteredContents.map((content) => (
                <ContentListItem key={content._id} content={content} />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
      <CreateContentModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleCreateContent}
      />

      {/* Debug Component - Remove in production */}
      <AuthDebug />
    </div>
  );
}
