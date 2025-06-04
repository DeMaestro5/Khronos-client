'use client';

import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Edit,
  Share2,
  Calendar,
  Tag,
  Eye,
  Clock,
  CheckCircle,
  AlertCircle,
  Archive,
  User,
  Download,
  Sparkles,
  TrendingUp,
  FileText,
  ExternalLink,
  BookOpen,
  Zap,
  Play,
  Mic,
  Mail,
  Hash,
} from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';
import { contentAPI } from '@/src/lib/api';

// Updated type definitions to match backend structure
interface ContentSection {
  type: 'heading' | 'paragraph' | 'list' | 'callout' | 'section';
  level?: number;
  content?: string | ContentSection[];
  style?: string;
  title?: string;
  items?: string[];
}

interface ContentBody {
  sections: ContentSection[];
  wordCount?: number;
  readingTime?: string;
  summary?: string;
}

interface ContentPlatform {
  id: string;
  name: string;
  icon: string;
  color: string;
  _id?: string;
}

interface ContentAuthor {
  id: string;
  name: string;
  avatar?: string;
  role?: string;
}

interface ContentAttachment {
  name: string;
  type: 'image' | 'document' | 'video' | 'audio';
  size: string;
  url?: string;
}

interface ContentStats {
  views: number;
  engagement: number;
  shares: number;
  saves?: number;
  clicks?: number;
}

interface AIContentSuggestions {
  title?: string;
  description?: string;
  keywords?: string[];
  improvements?: string[];
  hashtags?: string[];
  optimalPostingTimes?: string[];
  estimatedReach?: number;
  competitorAnalysis?: string[];
}

interface ContentIdea {
  title: string;
  description: string;
  excerpt?: string;
  targetAudience?: string;
  keyPoints?: string[];
  callToAction?: string;
  estimatedEngagement?: number;
  difficulty?: 'easy' | 'moderate' | 'advanced';
  timeToCreate?: string;
  trendingScore?: number;
  body?: ContentBody;
}

interface ContentData {
  _id: string;
  userId: string;
  metadata: {
    title: string;
    description: string;
    type:
      | 'article'
      | 'video'
      | 'social'
      | 'podcast'
      | 'blog_post'
      | 'newsletter';
    status: 'draft' | 'scheduled' | 'published' | 'archived';
    scheduledDate?: string;
    publishedDate?: string;
    platform: string[];
    tags: string[];
    category?: string;
    language?: string;
    targetAudience?: string[];
    contentPillars?: string[];
  };
  title: string;
  description: string;
  excerpt?: string;
  body?: ContentBody;
  type: 'article' | 'video' | 'social' | 'podcast' | 'blog_post' | 'newsletter';
  status: 'draft' | 'scheduled' | 'published' | 'archived';
  platform: string[];
  tags: string[];
  platforms?: ContentPlatform[];
  author?: ContentAuthor;
  attachments?: ContentAttachment[];
  stats?: ContentStats;
  aiSuggestions?: AIContentSuggestions;
  aiGenerated?: boolean;
  contentIdeas?: ContentIdea[];
  optimizedContent?: Record<string, string>;
  recommendations?: ContentIdea[];
  engagement?: {
    likes?: number;
    shares?: number;
    comments?: number;
    views?: number;
    saves?: number;
    clicks?: number;
  };
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
    canonicalUrl?: string;
  };
  scheduling?: {
    timezone?: string;
    optimalTimes?: string[];
    frequency?: 'once' | 'daily' | 'weekly' | 'monthly';
  };
  analytics?: {
    impressions?: number;
    reach?: number;
    clickThroughRate?: number;
    conversionRate?: number;
    engagementRate?: number;
  };
  createdAt: string;
  updatedAt: string;
}

// Content renderer component
const ContentRenderer = ({ body }: { body: ContentBody | undefined }) => {
  if (!body?.sections || body.sections.length === 0) {
    return (
      <div className='text-gray-500 text-center py-8'>
        <FileText className='w-12 h-12 mx-auto mb-4 text-gray-300' />
        <p>No content available</p>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      {body.sections.map((section, index) => {
        switch (section.type) {
          case 'heading':
            const level = section.level || 2;
            if (level === 1) {
              return (
                <h1 key={index} className='text-3xl font-bold text-gray-900'>
                  {typeof section.content === 'string' ? section.content : ''}
                </h1>
              );
            } else if (level === 2) {
              return (
                <h2 key={index} className='text-2xl font-bold text-gray-900'>
                  {typeof section.content === 'string' ? section.content : ''}
                </h2>
              );
            } else if (level === 3) {
              return (
                <h3 key={index} className='text-xl font-bold text-gray-900'>
                  {typeof section.content === 'string' ? section.content : ''}
                </h3>
              );
            } else {
              return (
                <h4 key={index} className='text-lg font-bold text-gray-900'>
                  {typeof section.content === 'string' ? section.content : ''}
                </h4>
              );
            }

          case 'paragraph':
            return (
              <p key={index} className='text-gray-700 leading-relaxed'>
                {typeof section.content === 'string' ? section.content : ''}
              </p>
            );

          case 'list':
            const ListTag = section.style === 'numbered' ? 'ol' : 'ul';
            return (
              <ListTag
                key={index}
                className={`space-y-2 text-gray-700 ${
                  section.style === 'numbered' ? 'list-decimal' : 'list-disc'
                } pl-6`}
              >
                {section.items?.map((item, itemIndex) => (
                  <li key={itemIndex}>{item}</li>
                ))}
              </ListTag>
            );

          case 'callout':
            return (
              <div
                key={index}
                className={`p-4 rounded-xl border ${
                  section.style === 'tip'
                    ? 'bg-blue-50 border-blue-200'
                    : section.style === 'warning'
                    ? 'bg-amber-50 border-amber-200'
                    : 'bg-gray-50 border-gray-200'
                }`}
              >
                {section.title && (
                  <h4 className='font-semibold text-gray-900 mb-2 flex items-center gap-2'>
                    {section.style === 'tip' && (
                      <Sparkles className='w-4 h-4 text-blue-600' />
                    )}
                    {section.title}
                  </h4>
                )}
                <p className='text-gray-700'>
                  {typeof section.content === 'string' ? section.content : ''}
                </p>
              </div>
            );

          case 'section':
            return (
              <section key={index} className='space-y-4'>
                {section.title && (
                  <h3 className='text-xl font-bold text-gray-900'>
                    {section.title}
                  </h3>
                )}
                {typeof section.content === 'string' ? (
                  <p className='text-gray-700 leading-relaxed'>
                    {section.content}
                  </p>
                ) : (
                  section.content &&
                  Array.isArray(section.content) && (
                    <div className='space-y-4'>
                      {(section.content as ContentSection[]).map(
                        (subSection: ContentSection, subIndex: number) => (
                          <ContentRenderer
                            key={subIndex}
                            body={{ sections: [subSection] }}
                          />
                        )
                      )}
                    </div>
                  )
                )}
              </section>
            );

          default:
            return null;
        }
      })}

      {body.wordCount && body.readingTime && (
        <div className='border-t pt-6 mt-8'>
          <div className='flex items-center gap-4 text-sm text-gray-500'>
            <span>{body.wordCount} words</span>
            <span>•</span>
            <span>{body.readingTime}</span>
          </div>
        </div>
      )}
    </div>
  );
};

const getContentTypeIcon = (type: string) => {
  switch (type) {
    case 'video':
      return <Play className='w-5 h-5' />;
    case 'podcast':
      return <Mic className='w-5 h-5' />;
    case 'newsletter':
      return <Mail className='w-5 h-5' />;
    case 'social':
      return <Hash className='w-5 h-5' />;
    case 'article':
    case 'blog_post':
    default:
      return <FileText className='w-5 h-5' />;
  }
};

const getContentTypeGradient = (type: string) => {
  switch (type) {
    case 'video':
      return 'from-red-600 via-pink-600 to-purple-600';
    case 'podcast':
      return 'from-green-600 via-teal-600 to-blue-600';
    case 'newsletter':
      return 'from-orange-600 via-red-600 to-pink-600';
    case 'social':
      return 'from-purple-600 via-pink-600 to-indigo-600';
    case 'article':
    case 'blog_post':
    default:
      return 'from-blue-600 via-purple-600 to-indigo-600';
  }
};

const ContentDetailPage = () => {
  const [content, setContent] = useState<ContentData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('content');
  const router = useRouter();
  const params = useParams();
  const contentId = params.id as string;

  useEffect(() => {
    const fetchContent = async () => {
      if (!contentId) return;

      console.log('Fetching content with ID:', contentId);

      // Debug: Check if token exists
      const token = localStorage.getItem('token');
      console.log('Token exists:', !!token);
      console.log('Token preview:', token?.substring(0, 20) + '...');

      setIsLoading(true);

      try {
        const response = await contentAPI.getById(contentId);
        console.log('API Response:', response.data);
        console.log('Full response object:', response);

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
          console.log('Content loaded successfully:', contentData);
        } else {
          console.error(
            'Content not found. Response structure:',
            response.data
          );
        }
      } catch (error) {
        console.error('Failed to fetch content:', error);
        const errorObj = error as {
          response?: { data?: unknown; status?: number };
        };
        console.error('Error response:', errorObj?.response?.data);
        console.error('Error status:', errorObj?.response?.status);
        if (error && typeof error === 'object' && 'response' in error) {
          console.error('Error details:', errorObj.response?.data);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchContent();
  }, [contentId]);

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'published':
        return <CheckCircle className='w-5 h-5 text-emerald-500' />;
      case 'scheduled':
        return <Clock className='w-5 h-5 text-blue-500' />;
      case 'draft':
        return <Edit className='w-5 h-5 text-amber-500' />;
      case 'archived':
        return <Archive className='w-5 h-5 text-gray-500' />;
      default:
        return <AlertCircle className='w-5 h-5 text-gray-400' />;
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status.toLowerCase()) {
      case 'published':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'scheduled':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'draft':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'archived':
        return 'bg-gray-50 text-gray-700 border-gray-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50'>
        <div className='max-w-7xl mx-auto px-6 py-8'>
          <div className='animate-pulse space-y-8'>
            <div className='flex items-center gap-4'>
              <div className='w-10 h-10 bg-gray-200 rounded-lg'></div>
              <div className='h-6 bg-gray-200 rounded w-32'></div>
            </div>
            <div className='bg-white rounded-2xl p-8 shadow-sm'>
              <div className='space-y-6'>
                <div className='h-8 bg-gray-200 rounded w-3/4'></div>
                <div className='h-20 bg-gray-200 rounded-lg'></div>
                <div className='grid grid-cols-3 gap-4'>
                  <div className='h-16 bg-gray-200 rounded-lg'></div>
                  <div className='h-16 bg-gray-200 rounded-lg'></div>
                  <div className='h-16 bg-gray-200 rounded-lg'></div>
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
      <div className='min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center'>
        <div className='text-center'>
          <div className='w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4'>
            <FileText className='w-8 h-8 text-gray-400' />
          </div>
          <h2 className='text-xl font-semibold text-gray-900 mb-2'>
            Content Not Found
          </h2>
          <p className='text-gray-600 mb-6'>
            The content you&apos;re looking for doesn&apos;t exist or has been
            removed.
          </p>
          <button className='inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl'>
            <ArrowLeft className='w-4 h-4' />
            Back to Content
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50'>
      <div className='max-w-7xl mx-auto px-6 py-8'>
        {/* Header */}
        <div className='flex items-center justify-between mb-8'>
          <button
            onClick={() => router.back()}
            className='inline-flex items-center cursor-pointer gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-white/60 rounded-xl transition-all duration-200 backdrop-blur-sm'
          >
            <ArrowLeft className='w-4 h-4' />
            <span className='font-medium'>Back to Content</span>
          </button>
          <div className='flex items-center gap-3'>
            <button className='p-3 text-gray-600 hover:text-gray-900 hover:bg-white/60 rounded-xl transition-all duration-200 backdrop-blur-sm'>
              <Share2 className='w-5 h-5' />
            </button>
            <button className='inline-flex items-center gap-2 px-5 py-3 bg-blue-600 text-white hover:bg-blue-700 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl'>
              <Edit className='w-4 h-4' />
              <span className='font-medium'>Edit Content</span>
            </button>
          </div>
        </div>

        {/* Hero Section */}
        <div className='bg-white rounded-2xl shadow-sm border border-white/20 backdrop-blur-sm mb-8 overflow-hidden'>
          <div
            className={`bg-gradient-to-r ${getContentTypeGradient(
              content.type
            )} p-8 text-white`}
          >
            <div className='flex items-start justify-between mb-6'>
              <div className='flex items-center gap-3'>
                {getStatusIcon(content.status)}
                <span
                  className={`px-4 py-2 rounded-full text-sm font-semibold border ${getStatusStyle(
                    content.status
                  )} bg-white/90`}
                >
                  {content.status.replace('_', ' ')}
                </span>
                <span className='px-4 py-2 bg-white/20 text-white rounded-full text-sm font-semibold backdrop-blur-sm flex items-center gap-2'>
                  {getContentTypeIcon(content.type)}
                  {content.type.replace('_', ' ')}
                </span>
                {content.aiGenerated && (
                  <span className='px-4 py-2 bg-purple-500/30 text-white rounded-full text-sm font-semibold backdrop-blur-sm flex items-center gap-2'>
                    <Sparkles className='w-4 h-4' />
                    AI Generated
                  </span>
                )}
              </div>
            </div>
            <h1 className='text-4xl font-bold mb-4 leading-tight'>
              {content.title}
            </h1>
            <p className='text-xl text-blue-100 leading-relaxed max-w-4xl'>
              {content.excerpt}
            </p>
          </div>

          {/* Stats Bar */}
          <div className='bg-white/50 backdrop-blur-sm border-t border-white/20 px-8 py-6'>
            <div className='grid grid-cols-1 sm:grid-cols-3 gap-6'>
              <div className='flex items-center gap-3'>
                <div className='p-2 bg-blue-100 rounded-lg'>
                  <Eye className='w-5 h-5 text-blue-600' />
                </div>
                <div>
                  <div className='text-2xl font-bold text-gray-900'>
                    {content.stats?.views.toLocaleString()}
                  </div>
                  <div className='text-sm text-gray-600'>Views</div>
                </div>
              </div>
              <div className='flex items-center gap-3'>
                <div className='p-2 bg-green-100 rounded-lg'>
                  <TrendingUp className='w-5 h-5 text-green-600' />
                </div>
                <div>
                  <div className='text-2xl font-bold text-gray-900'>
                    {content.stats?.engagement}%
                  </div>
                  <div className='text-sm text-gray-600'>Engagement</div>
                </div>
              </div>
              <div className='flex items-center gap-3'>
                <div className='p-2 bg-purple-100 rounded-lg'>
                  <Share2 className='w-5 h-5 text-purple-600' />
                </div>
                <div>
                  <div className='text-2xl font-bold text-gray-900'>
                    {content.stats?.shares}
                  </div>
                  <div className='text-sm text-gray-600'>Shares</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          {/* Main Content */}
          <div className='lg:col-span-2 space-y-8'>
            {/* Content Tabs */}
            <div className='bg-white rounded-2xl shadow-sm border border-white/20 overflow-hidden'>
              <div className='border-b border-gray-100'>
                <div className='flex flex-wrap'>
                  <button
                    onClick={() => setActiveTab('content')}
                    className={`px-6 py-4 font-medium transition-all duration-200 ${
                      activeTab === 'content'
                        ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <div className='flex items-center gap-2'>
                      <BookOpen className='w-4 h-4' />
                      Content
                    </div>
                  </button>
                  {content.aiSuggestions && (
                    <button
                      onClick={() => setActiveTab('ai-suggestions')}
                      className={`px-6 py-4 font-medium transition-all duration-200 ${
                        activeTab === 'ai-suggestions'
                          ? 'text-purple-600 border-b-2 border-purple-600 bg-purple-50/50'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                      }`}
                    >
                      <div className='flex items-center gap-2'>
                        <Zap className='w-4 h-4' />
                        AI Suggestions
                      </div>
                    </button>
                  )}
                  {content.optimizedContent && (
                    <button
                      onClick={() => setActiveTab('optimized-content')}
                      className={`px-6 py-4 font-medium transition-all duration-200 ${
                        activeTab === 'optimized-content'
                          ? 'text-green-600 border-b-2 border-green-600 bg-green-50/50'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                      }`}
                    >
                      <div className='flex items-center gap-2'>
                        <TrendingUp className='w-4 h-4' />
                        Platform Content
                      </div>
                    </button>
                  )}
                  {content.contentIdeas && content.contentIdeas.length > 0 && (
                    <button
                      onClick={() => setActiveTab('content-ideas')}
                      className={`px-6 py-4 font-medium transition-all duration-200 ${
                        activeTab === 'content-ideas'
                          ? 'text-orange-600 border-b-2 border-orange-600 bg-orange-50/50'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                      }`}
                    >
                      <div className='flex items-center gap-2'>
                        <Sparkles className='w-4 h-4' />
                        Content Ideas ({content.contentIdeas.length})
                      </div>
                    </button>
                  )}
                  <button
                    onClick={() => setActiveTab('analytics')}
                    className={`px-6 py-4 font-medium transition-all duration-200 ${
                      activeTab === 'analytics'
                        ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50/50'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <div className='flex items-center gap-2'>
                      <TrendingUp className='w-4 h-4' />
                      Analytics
                    </div>
                  </button>
                </div>
              </div>

              <div className='p-8'>
                {activeTab === 'content' && (
                  <ContentRenderer body={content.body} />
                )}

                {activeTab === 'ai-suggestions' && content.aiSuggestions && (
                  <div className='space-y-8'>
                    {content.aiSuggestions.title && (
                      <div className='bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6 border border-purple-100'>
                        <h3 className='font-bold text-gray-900 mb-3 flex items-center gap-2'>
                          <Sparkles className='w-5 h-5 text-purple-600' />
                          Alternative Title
                        </h3>
                        <p className='text-gray-800 text-lg font-medium'>
                          {content.aiSuggestions.title}
                        </p>
                      </div>
                    )}

                    {content.aiSuggestions.description && (
                      <div className='bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100'>
                        <h3 className='font-bold text-gray-900 mb-3'>
                          Alternative Description
                        </h3>
                        <p className='text-gray-700'>
                          {content.aiSuggestions.description}
                        </p>
                      </div>
                    )}

                    {content.aiSuggestions.keywords &&
                      content.aiSuggestions.keywords.length > 0 && (
                        <div>
                          <h3 className='font-bold text-gray-900 mb-4'>
                            Suggested Keywords
                          </h3>
                          <div className='flex flex-wrap gap-2'>
                            {content.aiSuggestions.keywords.map(
                              (keyword: string, index: number) => (
                                <span
                                  key={index}
                                  className='px-4 py-2 bg-gradient-to-r from-purple-100 to-blue-100 text-purple-800 rounded-full text-sm font-medium'
                                >
                                  {keyword}
                                </span>
                              )
                            )}
                          </div>
                        </div>
                      )}

                    {content.aiSuggestions.hashtags &&
                      content.aiSuggestions.hashtags.length > 0 && (
                        <div>
                          <h3 className='font-bold text-gray-900 mb-4'>
                            Suggested Hashtags
                          </h3>
                          <div className='flex flex-wrap gap-2'>
                            {content.aiSuggestions.hashtags.map(
                              (hashtag: string, index: number) => (
                                <span
                                  key={index}
                                  className='px-3 py-2 bg-gradient-to-r from-pink-100 to-purple-100 text-pink-800 rounded-lg text-sm font-medium'
                                >
                                  {hashtag}
                                </span>
                              )
                            )}
                          </div>
                        </div>
                      )}

                    {content.aiSuggestions.improvements &&
                      content.aiSuggestions.improvements.length > 0 && (
                        <div>
                          <h3 className='font-bold text-gray-900 mb-4'>
                            Improvement Suggestions
                          </h3>
                          <div className='space-y-3'>
                            {content.aiSuggestions.improvements.map(
                              (improvement: string, index: number) => (
                                <div
                                  key={index}
                                  className='flex items-start gap-3 p-4 bg-amber-50 rounded-xl border border-amber-100'
                                >
                                  <div className='w-6 h-6 bg-amber-200 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5'>
                                    <span className='text-amber-800 text-sm font-bold'>
                                      {index + 1}
                                    </span>
                                  </div>
                                  <p className='text-gray-800'>{improvement}</p>
                                </div>
                              )
                            )}
                          </div>
                        </div>
                      )}

                    {content.aiSuggestions.estimatedReach && (
                      <div className='bg-gradient-to-r from-green-50 to-teal-50 rounded-xl p-6 border border-green-100'>
                        <h3 className='font-bold text-gray-900 mb-3'>
                          Estimated Reach
                        </h3>
                        <p className='text-2xl font-bold text-green-600'>
                          {content.aiSuggestions.estimatedReach.toLocaleString()}{' '}
                          people
                        </p>
                      </div>
                    )}

                    {content.aiSuggestions.competitorAnalysis &&
                      content.aiSuggestions.competitorAnalysis.length > 0 && (
                        <div>
                          <h3 className='font-bold text-gray-900 mb-4'>
                            Competitor Analysis
                          </h3>
                          <div className='space-y-3'>
                            {content.aiSuggestions.competitorAnalysis.map(
                              (analysis: string, index: number) => (
                                <div
                                  key={index}
                                  className='p-4 bg-slate-50 rounded-xl border border-slate-100'
                                >
                                  <p className='text-gray-700'>{analysis}</p>
                                </div>
                              )
                            )}
                          </div>
                        </div>
                      )}
                  </div>
                )}

                {activeTab === 'optimized-content' &&
                  content.optimizedContent && (
                    <div className='space-y-8'>
                      <div className='grid gap-6'>
                        {Object.entries(content.optimizedContent).map(
                          ([platform, optimizedText]) => (
                            <div
                              key={platform}
                              className='bg-gradient-to-r from-gray-50 to-slate-50 rounded-xl p-6 border border-gray-100'
                            >
                              <div className='flex items-center gap-3 mb-4'>
                                <div className='w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-sm'>
                                  {platform.charAt(0).toUpperCase()}
                                </div>
                                <h3 className='font-bold text-gray-900 capitalize'>
                                  {platform} Optimized Content
                                </h3>
                              </div>
                              <div className='bg-white rounded-lg p-4 border border-gray-200'>
                                <pre className='whitespace-pre-wrap text-sm text-gray-700 font-mono'>
                                  {optimizedText}
                                </pre>
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}

                {activeTab === 'content-ideas' &&
                  content.contentIdeas &&
                  content.contentIdeas.length > 0 && (
                    <div className='space-y-8'>
                      <div className='grid gap-6'>
                        {content.contentIdeas.map(
                          (idea: ContentIdea, index: number) => (
                            <div
                              key={index}
                              className='bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl p-6 border border-orange-100'
                            >
                              <div className='flex items-start gap-4 mb-4'>
                                <div className='w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm'>
                                  {index + 1}
                                </div>
                                <div className='flex-1'>
                                  <h3 className='font-bold text-gray-900 text-lg mb-2'>
                                    {idea.title}
                                  </h3>
                                  <p className='text-gray-700 mb-4'>
                                    {idea.description}
                                  </p>
                                  {idea.excerpt && (
                                    <div className='bg-white rounded-lg p-4 border border-orange-200 mb-4'>
                                      <h4 className='font-semibold text-gray-900 mb-2'>
                                        Excerpt
                                      </h4>
                                      <p className='text-gray-700 text-sm italic'>
                                        {idea.excerpt}
                                      </p>
                                    </div>
                                  )}
                                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4 text-sm'>
                                    {idea.targetAudience && (
                                      <div>
                                        <span className='font-semibold text-gray-900'>
                                          Target Audience:
                                        </span>
                                        <p className='text-gray-700'>
                                          {idea.targetAudience}
                                        </p>
                                      </div>
                                    )}
                                    {idea.difficulty && (
                                      <div>
                                        <span className='font-semibold text-gray-900'>
                                          Difficulty:
                                        </span>
                                        <span
                                          className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                                            idea.difficulty === 'easy'
                                              ? 'bg-green-100 text-green-800'
                                              : idea.difficulty === 'moderate'
                                              ? 'bg-yellow-100 text-yellow-800'
                                              : 'bg-red-100 text-red-800'
                                          }`}
                                        >
                                          {idea.difficulty}
                                        </span>
                                      </div>
                                    )}
                                    {idea.timeToCreate && (
                                      <div>
                                        <span className='font-semibold text-gray-900'>
                                          Time to Create:
                                        </span>
                                        <p className='text-gray-700'>
                                          {idea.timeToCreate}
                                        </p>
                                      </div>
                                    )}
                                    {idea.estimatedEngagement && (
                                      <div>
                                        <span className='font-semibold text-gray-900'>
                                          Est. Engagement:
                                        </span>
                                        <p className='text-gray-700'>
                                          {idea.estimatedEngagement}/10
                                        </p>
                                      </div>
                                    )}
                                  </div>
                                  {idea.keyPoints &&
                                    idea.keyPoints.length > 0 && (
                                      <div className='mt-4'>
                                        <h4 className='font-semibold text-gray-900 mb-2'>
                                          Key Points
                                        </h4>
                                        <div className='flex flex-wrap gap-1'>
                                          {idea.keyPoints
                                            .slice(0, 5)
                                            .map(
                                              (
                                                point: string,
                                                pointIndex: number
                                              ) => (
                                                <span
                                                  key={pointIndex}
                                                  className='px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-md'
                                                >
                                                  {point}
                                                </span>
                                              )
                                            )}
                                          {idea.keyPoints.length > 5 && (
                                            <span className='px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md'>
                                              +{idea.keyPoints.length - 5} more
                                            </span>
                                          )}
                                        </div>
                                      </div>
                                    )}
                                </div>
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}

                {activeTab === 'analytics' && (
                  <div className='space-y-8'>
                    {/* Performance Metrics */}
                    <div>
                      <h3 className='font-bold text-gray-900 mb-4 flex items-center gap-2'>
                        <TrendingUp className='w-5 h-5 text-blue-600' />
                        Performance Metrics
                      </h3>
                      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                        {content.analytics && (
                          <>
                            <div className='bg-blue-50 rounded-xl p-4 border border-blue-100'>
                              <div className='text-2xl font-bold text-blue-600'>
                                {content.analytics.impressions?.toLocaleString() ||
                                  0}
                              </div>
                              <div className='text-sm text-blue-800'>
                                Impressions
                              </div>
                            </div>
                            <div className='bg-green-50 rounded-xl p-4 border border-green-100'>
                              <div className='text-2xl font-bold text-green-600'>
                                {content.analytics.reach?.toLocaleString() || 0}
                              </div>
                              <div className='text-sm text-green-800'>
                                Reach
                              </div>
                            </div>
                            <div className='bg-purple-50 rounded-xl p-4 border border-purple-100'>
                              <div className='text-2xl font-bold text-purple-600'>
                                {content.analytics.engagementRate?.toFixed(2) ||
                                  0}
                                %
                              </div>
                              <div className='text-sm text-purple-800'>
                                Engagement Rate
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Engagement Breakdown */}
                    {content.engagement && (
                      <div>
                        <h3 className='font-bold text-gray-900 mb-4'>
                          Engagement Breakdown
                        </h3>
                        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4'>
                          <div className='bg-red-50 rounded-xl p-4 border border-red-100 text-center'>
                            <div className='text-2xl font-bold text-red-600'>
                              {content.engagement.likes || 0}
                            </div>
                            <div className='text-sm text-red-800'>Likes</div>
                          </div>
                          <div className='bg-blue-50 rounded-xl p-4 border border-blue-100 text-center'>
                            <div className='text-2xl font-bold text-blue-600'>
                              {content.engagement.shares || 0}
                            </div>
                            <div className='text-sm text-blue-800'>Shares</div>
                          </div>
                          <div className='bg-green-50 rounded-xl p-4 border border-green-100 text-center'>
                            <div className='text-2xl font-bold text-green-600'>
                              {content.engagement.comments || 0}
                            </div>
                            <div className='text-sm text-green-800'>
                              Comments
                            </div>
                          </div>
                          <div className='bg-yellow-50 rounded-xl p-4 border border-yellow-100 text-center'>
                            <div className='text-2xl font-bold text-yellow-600'>
                              {content.engagement.saves || 0}
                            </div>
                            <div className='text-sm text-yellow-800'>Saves</div>
                          </div>
                          <div className='bg-indigo-50 rounded-xl p-4 border border-indigo-100 text-center'>
                            <div className='text-2xl font-bold text-indigo-600'>
                              {content.engagement.clicks || 0}
                            </div>
                            <div className='text-sm text-indigo-800'>
                              Clicks
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* SEO Information */}
                    {content.seo && (
                      <div>
                        <h3 className='font-bold text-gray-900 mb-4'>
                          SEO Information
                        </h3>
                        <div className='bg-gradient-to-r from-green-50 to-teal-50 rounded-xl p-6 border border-green-100'>
                          <div className='space-y-4'>
                            {content.seo.metaTitle && (
                              <div>
                                <h4 className='font-semibold text-gray-900'>
                                  Meta Title
                                </h4>
                                <p className='text-gray-700'>
                                  {content.seo.metaTitle}
                                </p>
                              </div>
                            )}
                            {content.seo.metaDescription && (
                              <div>
                                <h4 className='font-semibold text-gray-900'>
                                  Meta Description
                                </h4>
                                <p className='text-gray-700'>
                                  {content.seo.metaDescription}
                                </p>
                              </div>
                            )}
                            {content.seo.keywords &&
                              content.seo.keywords.length > 0 && (
                                <div>
                                  <h4 className='font-semibold text-gray-900 mb-2'>
                                    SEO Keywords
                                  </h4>
                                  <div className='flex flex-wrap gap-2'>
                                    {content.seo.keywords.map(
                                      (keyword: string, index: number) => (
                                        <span
                                          key={index}
                                          className='px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full'
                                        >
                                          {keyword}
                                        </span>
                                      )
                                    )}
                                  </div>
                                </div>
                              )}
                            {content.seo.canonicalUrl && (
                              <div>
                                <h4 className='font-semibold text-gray-900'>
                                  Canonical URL
                                </h4>
                                <a
                                  href={content.seo.canonicalUrl}
                                  className='text-blue-600 hover:text-blue-800 underline'
                                  target='_blank'
                                  rel='noopener noreferrer'
                                >
                                  {content.seo.canonicalUrl}
                                </a>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Scheduling Information */}
                    {content.scheduling && (
                      <div>
                        <h3 className='font-bold text-gray-900 mb-4'>
                          Scheduling Information
                        </h3>
                        <div className='bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100'>
                          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                            {content.scheduling.timezone && (
                              <div>
                                <h4 className='font-semibold text-gray-900'>
                                  Timezone
                                </h4>
                                <p className='text-gray-700'>
                                  {content.scheduling.timezone}
                                </p>
                              </div>
                            )}
                            {content.scheduling.frequency && (
                              <div>
                                <h4 className='font-semibold text-gray-900'>
                                  Frequency
                                </h4>
                                <p className='text-gray-700 capitalize'>
                                  {content.scheduling.frequency}
                                </p>
                              </div>
                            )}
                            {content.scheduling.optimalTimes &&
                              content.scheduling.optimalTimes.length > 0 && (
                                <div>
                                  <h4 className='font-semibold text-gray-900'>
                                    Optimal Times
                                  </h4>
                                  <div className='space-y-1'>
                                    {content.scheduling.optimalTimes.map(
                                      (time: string, index: number) => (
                                        <p
                                          key={index}
                                          className='text-gray-700 text-sm'
                                        >
                                          {new Date(time).toLocaleString()}
                                        </p>
                                      )
                                    )}
                                  </div>
                                </div>
                              )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className='space-y-6'>
            {/* Author Card */}
            <div className='bg-white rounded-2xl shadow-sm border border-white/20 p-6'>
              <h3 className='font-bold text-gray-900 mb-4 flex items-center gap-2'>
                <User className='w-5 h-5 text-blue-600' />
                Author
              </h3>
              <div className='flex items-center gap-4'>
                {content.author && (
                  <>
                    <Image
                      src={content.author.avatar || ''}
                      alt={content.author.name}
                      className='w-14 h-14 rounded-full object-cover ring-2 ring-blue-100'
                      width={56}
                      height={56}
                    />
                    <div>
                      <div className='font-semibold text-gray-900'>
                        {content.author.name}
                      </div>
                      <div className='text-sm text-gray-600'>
                        {content.author.role}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Timeline */}
            <div className='bg-white rounded-2xl shadow-sm border border-white/20 p-6'>
              <h3 className='font-bold text-gray-900 mb-4 flex items-center gap-2'>
                <Clock className='w-5 h-5 text-green-600' />
                Timeline
              </h3>
              <div className='space-y-4'>
                <div className='flex items-start gap-3'>
                  <Calendar className='w-4 h-4 text-gray-400 mt-1 flex-shrink-0' />
                  <div>
                    <div className='text-sm font-medium text-gray-900'>
                      Created
                    </div>
                    <div className='text-sm text-gray-600'>
                      {formatDate(content.createdAt)}
                    </div>
                  </div>
                </div>
                {content.metadata.publishedDate && (
                  <div className='flex items-start gap-3'>
                    <Eye className='w-4 h-4 text-green-500 mt-1 flex-shrink-0' />
                    <div>
                      <div className='text-sm font-medium text-gray-900'>
                        Published
                      </div>
                      <div className='text-sm text-gray-600'>
                        {formatDate(content.metadata.publishedDate)}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Tags */}
            <div className='bg-white rounded-2xl shadow-sm border border-white/20 p-6'>
              <h3 className='font-bold text-gray-900 mb-4 flex items-center gap-2'>
                <Tag className='w-5 h-5 text-purple-600' />
                Tags
              </h3>
              <div className='flex flex-wrap gap-2'>
                {content.tags.map((tag: string, index: number) => (
                  <span
                    key={index}
                    className='px-3 py-2 bg-gradient-to-r from-blue-50 to-purple-50 text-blue-800 rounded-lg text-sm font-medium border border-blue-100 hover:from-blue-100 hover:to-purple-100 transition-all duration-200'
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Platforms */}
            <div className='bg-white rounded-2xl shadow-sm border border-white/20 p-6'>
              <h3 className='font-bold text-gray-900 mb-4'>
                Publishing Platforms
              </h3>
              <div className='space-y-3'>
                {content.platforms?.map(
                  (platform: ContentPlatform, index: number) => (
                    <div
                      key={index}
                      className='flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors'
                    >
                      <div
                        className={`w-10 h-10 ${platform.color} rounded-lg flex items-center justify-center text-white font-bold`}
                      >
                        {platform.name.charAt(0)}
                      </div>
                      <div className='flex-1'>
                        <div className='font-medium text-gray-900'>
                          {platform.name}
                        </div>
                      </div>
                      <ExternalLink className='w-4 h-4 text-gray-400' />
                    </div>
                  )
                )}
              </div>
            </div>

            {/* Attachments */}
            {content.attachments && content.attachments.length > 0 && (
              <div className='bg-white rounded-2xl shadow-sm border border-white/20 p-6'>
                <h3 className='font-bold text-gray-900 mb-4'>Attachments</h3>
                <div className='space-y-3'>
                  {content.attachments.map(
                    (attachment: ContentAttachment, index: number) => (
                      <div
                        key={index}
                        className='flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors group'
                      >
                        <div className='w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center'>
                          <span className='text-xs font-bold text-blue-700'>
                            {attachment.name.split('.').pop()?.toUpperCase()}
                          </span>
                        </div>
                        <div className='flex-1 min-w-0'>
                          <div className='font-medium text-gray-900 truncate'>
                            {attachment.name}
                          </div>
                          <div className='text-sm text-gray-500'>
                            {attachment.size}
                          </div>
                        </div>
                        <button className='p-2 text-gray-400 hover:text-blue-600 transition-colors opacity-0 group-hover:opacity-100'>
                          <Download className='w-4 h-4' />
                        </button>
                      </div>
                    )
                  )}
                </div>
              </div>
            )}

            {/* Recommendations */}
            {content.recommendations && content.recommendations.length > 0 && (
              <div className='bg-white rounded-2xl shadow-sm border border-white/20 p-6'>
                <h3 className='font-bold text-gray-900 mb-4 flex items-center gap-2'>
                  <Sparkles className='w-5 h-5 text-purple-600' />
                  Recommended Content Ideas
                </h3>
                <div className='space-y-4'>
                  {content.recommendations
                    .slice(0, 3)
                    .map((rec: ContentIdea, index: number) => (
                      <div
                        key={index}
                        className='p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-100 hover:shadow-md transition-all duration-200'
                      >
                        <h4 className='font-semibold text-gray-900 mb-2 text-sm'>
                          {rec.title}
                        </h4>
                        <p className='text-gray-700 text-xs mb-3 line-clamp-2'>
                          {rec.description}
                        </p>
                        <div className='flex items-center justify-between text-xs'>
                          {rec.difficulty && (
                            <span
                              className={`px-2 py-1 rounded-full font-medium ${
                                rec.difficulty === 'easy'
                                  ? 'bg-green-100 text-green-800'
                                  : rec.difficulty === 'moderate'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-red-100 text-red-800'
                              }`}
                            >
                              {rec.difficulty}
                            </span>
                          )}
                          {rec.estimatedEngagement && (
                            <span className='text-gray-600'>
                              {rec.estimatedEngagement}/10 engagement
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  {content.recommendations.length > 3 && (
                    <div className='text-center'>
                      <span className='text-sm text-gray-500'>
                        +{content.recommendations.length - 3} more
                        recommendations
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentDetailPage;
