'use client';

import React, { useState, useEffect } from 'react';
import { ArrowLeft, Edit, Share2, FileText } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import { contentAPI } from '@/src/lib/api';
import { ContentData } from '@/src/types/content';
import {
  HeroSection,
  ContentTabs,
  Sidebar,
} from '@/src/components/content-detail';
import ContentEditModal from '@/src/components/content/content-edit-modal';

const ContentDetailPage = () => {
  const [content, setContent] = useState<ContentData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const router = useRouter();
  const params = useParams();
  const contentId = params.id as string;

  useEffect(() => {
    const fetchContent = async () => {
      if (!contentId) return;

      setIsLoading(true);

      try {
        const response = await contentAPI.getById(contentId);

        // Try different response structures
        let contentData = null;

        if (response.data?.statusCode === '10000') {
          // Structure 1: response.data.data.content (nested) + other fields
          if (response.data?.data?.content) {
            // Merge the content object with other fields at the same level
            contentData = {
              ...response.data.data.content,
              contentIdeas: response.data.data.contentIdeas,
              optimizedContent: response.data.data.optimizedContent,
              aiSuggestions: response.data.data.aiSuggestions,
              platforms: response.data.data.platforms,
              author: response.data.data.author,
              recommendations: response.data.data.recommendations,
              insights: response.data.data.insights,
            };
          }
          // Structure 2: response.data.data (direct content object)
          else if (response.data?.data) {
            contentData = response.data.data;
          }
        }
        // Structure 3: Direct content object in response.data
        else if (response.data && response.data._id) {
          contentData = response.data;
        }

        if (contentData) {
          setContent(contentData);
        } else {
          console.error(
            'Content not found. Response structure:',
            response.data
          );
        }
      } catch (error) {
        console.error('Failed to fetch content:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchContent();
  }, [contentId]);

  const handleEditClick = () => {
    setIsEditModalOpen(true);
  };

  const handleEditSuccess = async () => {
    setIsEditModalOpen(false);
    try {
      const response = await contentAPI.getById(contentId);
      if (response.data?.data) {
        setContent(response.data.data);
      }
    } catch (error) {
      console.error('Failed to refresh content after edit:', error);
    }
  };

  const handleEditCancel = () => {
    setIsEditModalOpen(false);
  };

  if (isLoading) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-blue-950 dark:to-indigo-950'>
        <div className='max-w-7xl mx-auto px-6 py-8'>
          <div className='animate-pulse space-y-8'>
            <div className='flex items-center gap-4'>
              <div className='w-10 h-10 bg-gray-200 dark:bg-slate-700 rounded-lg'></div>
              <div className='h-6 bg-gray-200 dark:bg-slate-700 rounded w-32'></div>
            </div>
            <div className='bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-sm'>
              <div className='space-y-6'>
                <div className='h-8 bg-gray-200 dark:bg-slate-700 rounded w-3/4'></div>
                <div className='h-20 bg-gray-200 dark:bg-slate-700 rounded-lg'></div>
                <div className='grid grid-cols-3 gap-4'>
                  <div className='h-16 bg-gray-200 dark:bg-slate-700 rounded-lg'></div>
                  <div className='h-16 bg-gray-200 dark:bg-slate-700 rounded-lg'></div>
                  <div className='h-16 bg-gray-200 dark:bg-slate-700 rounded-lg'></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!content) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-blue-950 dark:to-indigo-950 flex items-center justify-center'>
        <div className='text-center'>
          <div className='w-16 h-16 bg-gray-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4'>
            <FileText className='w-8 h-8 text-gray-400 dark:text-slate-500' />
          </div>
          <h2 className='text-xl font-semibold text-gray-900 dark:text-slate-100 mb-2'>
            Content Not Found
          </h2>
          <p className='text-gray-600 dark:text-slate-400 mb-6'>
            The content you&apos;re looking for doesn&apos;t exist or has been
            removed.
          </p>
          <button className='inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl'>
            <ArrowLeft className='w-4 h-4' />
            Back to Content
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-blue-950 dark:to-indigo-950'>
      <div className='max-w-7xl mx-auto px-6 py-8'>
        {/* Header */}
        <div className='flex items-center justify-between mb-8'>
          <button
            onClick={() => router.back()}
            className='inline-flex items-center cursor-pointer gap-2 px-4 py-2 text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-slate-100 hover:bg-white/60 dark:hover:bg-slate-800/60 rounded-xl transition-all duration-200 backdrop-blur-sm'
          >
            <ArrowLeft className='w-4 h-4' />
            <span className='font-medium'>Back to Content</span>
          </button>
          <div className='flex items-center gap-3'>
            <button className='p-3 text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-slate-100 hover:bg-white/60 dark:hover:bg-slate-800/60 rounded-xl transition-all duration-200 backdrop-blur-sm'>
              <Share2 className='w-5 h-5' />
            </button>
            <button
              onClick={handleEditClick}
              className='inline-flex items-center gap-2 px-5 py-3 bg-purple-600 text-white hover:bg-purple-700 dark:bg-purple-600 dark:hover:bg-purple-700 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl'
            >
              <Edit className='w-4 h-4' />
              <span className='font-medium'>Edit Content</span>
            </button>
          </div>
        </div>

        {/* Hero Section */}
        <HeroSection content={content} />

        {/* Stats Bar */}
        {/* <div className='bg-white rounded-2xl shadow-sm border border-white/20 backdrop-blur-sm mb-8 overflow-hidden'>
          <StatsBar stats={content.stats} />
        </div> */}

        {/* Main Content Grid */}
        <div className='grid lg:grid-cols-3 gap-8'>
          <div className='lg:col-span-2'>
            <ContentTabs content={content} />
          </div>
          <div className='lg:col-span-1'>
            <Sidebar content={content} />
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {isEditModalOpen && content && (
        <ContentEditModal
          isOpen={isEditModalOpen}
          onClose={handleEditCancel}
          onSuccess={handleEditSuccess}
          contentId={content._id}
          currentStatus={content.status as 'draft' | 'scheduled' | 'published'}
          currentPriority='medium'
          currentScheduledDate={content.metadata?.scheduledDate}
          contentTitle={content.title}
        />
      )}
    </div>
  );
};

export default ContentDetailPage;
