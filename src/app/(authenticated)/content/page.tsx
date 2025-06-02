'use client';

import React, { useState, useEffect } from 'react';
import { Search, Filter, Grid3X3, List, Plus, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Content, ContentStatus, ContentType } from '@/src/types/content';
import { ContentCard } from '@/src/components/content/content-card';
import { ContentListItem } from '@/src/components/content/content-list-items';
import CreateContentModal from '@/src/components/content/content-creation-modal';
import { ContentFormData } from '@/src/types/modal';

type ViewMode = 'grid' | 'list';
type FilterType = 'all' | ContentStatus | ContentType;

export default function ContentPage() {
  const [contents, setContents] = useState<Content[]>([]);
  const [filteredContents, setFilteredContents] = useState<Content[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<FilterType>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // Mock data for development - replace with API call
  const mockContents: Content[] = [
    {
      id: '1',
      title: 'The Future of Content Creation with AI',
      description:
        'Exploring how artificial intelligence is revolutionizing the way we create and distribute content across platforms.',
      body: 'Full content body...',
      status: ContentStatus.PUBLISHED,
      type: ContentType.BLOG_POST,
      platforms: [
        { id: 'linkedin', name: 'LinkedIn', icon: 'linkedin' },
        { id: 'twitter', name: 'Twitter', icon: 'twitter' },
      ],
      scheduledDate: '2025-01-20T10:00:00Z',
      publishedDate: '2025-01-20T10:00:00Z',
      author: {
        id: 'user1',
        name: 'John Doe',
        avatar:
          'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face',
      },
      tags: ['AI', 'Content Creation', 'Technology'],
      createdAt: '2025-01-15T09:00:00Z',
      updatedAt: '2025-01-20T10:00:00Z',
      aiGenerated: true,
    },
    {
      id: '2',
      title: 'Social Media Strategy for 2025',
      description:
        'Key strategies and trends that will shape social media marketing this year.',
      status: ContentStatus.SCHEDULED,
      type: ContentType.SOCIAL_POST,
      platforms: [
        { id: 'instagram', name: 'Instagram', icon: 'instagram' },
        { id: 'facebook', name: 'Facebook', icon: 'facebook' },
      ],
      scheduledDate: '2025-01-25T14:00:00Z',
      author: {
        id: 'user1',
        name: 'John Doe',
      },
      tags: ['Social Media', 'Marketing', 'Strategy'],
      createdAt: '2025-01-18T11:00:00Z',
      updatedAt: '2025-01-18T11:00:00Z',
      aiGenerated: false,
    },
    {
      id: '3',
      title: 'Email Marketing Best Practices',
      description:
        'Comprehensive guide to effective email marketing campaigns.',
      status: ContentStatus.DRAFT,
      type: ContentType.EMAIL,
      platforms: [{ id: 'mailchimp', name: 'Mailchimp', icon: 'mail' }],
      author: {
        id: 'user1',
        name: 'John Doe',
      },
      tags: ['Email Marketing', 'Campaign', 'Conversion'],
      createdAt: '2025-01-19T16:00:00Z',
      updatedAt: '2025-01-19T16:30:00Z',
      aiGenerated: true,
    },
    {
      id: '4',
      title: 'Product Launch Video',
      description: 'Exciting video announcing our latest product features.',
      status: ContentStatus.PUBLISHED,
      type: ContentType.VIDEO,
      platforms: [
        { id: 'youtube', name: 'YouTube', icon: 'youtube' },
        { id: 'tiktok', name: 'TikTok', icon: 'video' },
      ],
      publishedDate: '2025-01-18T12:00:00Z',
      author: {
        id: 'user1',
        name: 'John Doe',
      },
      tags: ['Product Launch', 'Video', 'Announcement'],
      createdAt: '2025-01-16T10:00:00Z',
      updatedAt: '2025-01-18T12:00:00Z',
      aiGenerated: false,
    },
    {
      id: '5',
      title: 'Industry Podcast Episode 12',
      description:
        'Deep dive discussion on industry trends and future predictions.',
      status: ContentStatus.ARCHIVED,
      type: ContentType.PODCAST,
      platforms: [{ id: 'spotify', name: 'Spotify', icon: 'music' }],
      publishedDate: '2024-12-15T08:00:00Z',
      author: {
        id: 'user1',
        name: 'John Doe',
      },
      tags: ['Podcast', 'Industry', 'Trends'],
      createdAt: '2024-12-10T14:00:00Z',
      updatedAt: '2024-12-15T08:00:00Z',
      aiGenerated: false,
    },
  ];

  const handleCreateContent = (contentData: ContentFormData) => {
    const newContent = {
      id: Date.now(),
      title: contentData.title,
      platform: contentData.platforms[0], // Take the first platform for now
      time: contentData.scheduledTime,
      type: contentData.contentType,
      status: contentData.status,
      description: contentData.description,
    };

    // const dateKey = contentData.scheduledDate;

    // setScheduledContent((prev) => ({
    //   ...prev,
    //   [dateKey]: prev[dateKey] ? [...prev[dateKey], newContent] : [newContent],
    // }));

    console.log('New content created:', newContent);
  };
  useEffect(() => {
    // Simulate API call
    const fetchContents = async () => {
      setIsLoading(true);
      try {
        // Replace with actual API call
        // const response = await contentAPI.getAll();
        // setContents(response.data);

        // For now, use mock data
        setTimeout(() => {
          setContents(mockContents);
          setFilteredContents(mockContents);
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Failed to fetch contents:', error);
        setContents(mockContents);
        setFilteredContents(mockContents);
        setIsLoading(false);
      }
    };

    fetchContents();
  }, []);

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
                <ContentCard key={content.id} content={content} />
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
                <ContentListItem key={content.id} content={content} />
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
    </div>
  );
}
