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
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

// Type definitions
interface Platform {
  id: string;
  name: string;
  icon: string;
  color: string;
}

interface Author {
  id: string;
  name: string;
  avatar: string;
  role: string;
}

interface Attachment {
  name: string;
  type: string;
  size: string;
}

interface Stats {
  views: number;
  engagement: number;
  shares: number;
}

interface AISuggestions {
  title: string;
  description: string;
  keywords: string[];
  improvements: string[];
}

interface ContentData {
  id: string;
  title: string;
  excerpt: string;
  body: string;
  status: string;
  type: string;
  platforms: Platform[];
  scheduledDate: string;
  publishedDate: string;
  author: Author;
  tags: string[];
  attachments: Attachment[];
  createdAt: string;
  updatedAt: string;
  aiGenerated: boolean;
  stats: Stats;
  aiSuggestions: AISuggestions;
}

const ContentDetailPage = () => {
  const [content, setContent] = useState<ContentData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('content');
  const router = useRouter();
  // Mock data
  const mockContent: ContentData = {
    id: '1',
    title: 'The Future of Content Creation with AI',
    excerpt:
      'Exploring how artificial intelligence is revolutionizing the way we create and distribute content across platforms.',
    body: `
      <div class="space-y-6">
        <div>
          <h2 class="text-2xl font-bold text-gray-900 mb-4">Introduction</h2>
          <p class="text-gray-700 leading-relaxed">Artificial Intelligence is transforming the landscape of content creation in unprecedented ways. From automated writing tools to smart content curation, AI is becoming an indispensable partner for content creators worldwide.</p>
        </div>
        
        <div>
          <h2 class="text-2xl font-bold text-gray-900 mb-4">The Current State of AI in Content Creation</h2>
          <p class="text-gray-700 leading-relaxed">Today's AI-powered content tools can generate high-quality text, create stunning visuals, and even produce engaging videos. These technologies are not replacing human creativity but augmenting it, allowing creators to focus on strategy and storytelling while AI handles the heavy lifting.</p>
        </div>
        
        <div>
          <h2 class="text-2xl font-bold text-gray-900 mb-4">Key Benefits</h2>
          <ul class="space-y-2 text-gray-700">
            <li class="flex items-start gap-2"><span class="text-green-500 mt-1">•</span>Increased productivity and efficiency</li>
            <li class="flex items-start gap-2"><span class="text-green-500 mt-1">•</span>Consistent content quality</li>
            <li class="flex items-start gap-2"><span class="text-green-500 mt-1">•</span>Data-driven content optimization</li>
            <li class="flex items-start gap-2"><span class="text-green-500 mt-1">•</span>Personalization at scale</li>
            <li class="flex items-start gap-2"><span class="text-green-500 mt-1">•</span>Cost-effective content production</li>
          </ul>
        </div>
        
        <div>
          <h2 class="text-2xl font-bold text-gray-900 mb-4">Future Outlook</h2>
          <p class="text-gray-700 leading-relaxed">As AI technology continues to evolve, we can expect even more sophisticated tools that understand context, brand voice, and audience preferences. The future of content creation lies in the seamless collaboration between human creativity and artificial intelligence.</p>
        </div>
        
        <div>
          <h2 class="text-2xl font-bold text-gray-900 mb-4">Conclusion</h2>
          <p class="text-gray-700 leading-relaxed">Embracing AI in content creation is no longer optional—it's essential for staying competitive in today's fast-paced digital landscape. The key is finding the right balance between automation and human touch.</p>
        </div>
      </div>
    `,
    status: 'PUBLISHED',
    type: 'BLOG_POST',
    platforms: [
      {
        id: 'linkedin',
        name: 'LinkedIn',
        icon: 'linkedin',
        color: 'bg-blue-600',
      },
      { id: 'twitter', name: 'Twitter', icon: 'twitter', color: 'bg-sky-500' },
      { id: 'medium', name: 'Medium', icon: 'medium', color: 'bg-gray-800' },
    ],
    scheduledDate: '2025-01-20T10:00:00Z',
    publishedDate: '2025-01-20T10:00:00Z',
    author: {
      id: 'user1',
      name: 'John Doe',
      avatar:
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
      role: 'Content Strategist',
    },
    tags: ['AI', 'Content Creation', 'Technology', 'Future', 'Automation'],
    attachments: [
      { name: 'ai-content-infographic.png', type: 'image', size: '2.4 MB' },
      {
        name: 'content-strategy-template.pdf',
        type: 'document',
        size: '1.2 MB',
      },
    ],
    createdAt: '2025-01-15T09:00:00Z',
    updatedAt: '2025-01-20T10:00:00Z',
    aiGenerated: true,
    stats: {
      views: 1247,
      engagement: 8.4,
      shares: 23,
    },
    aiSuggestions: {
      title: 'AI-Powered Content: The Creative Revolution',
      description:
        'Discover how artificial intelligence is reshaping content creation',
      keywords: [
        'AI content',
        'automation',
        'creative tools',
        'digital marketing',
      ],
      improvements: [
        'Consider adding more case studies',
        'Include statistics about AI adoption',
        'Add section about ethical considerations',
      ],
    },
  };

  useEffect(() => {
    const fetchContent = async () => {
      setIsLoading(true);
      setTimeout(() => {
        setContent(mockContent);
        setIsLoading(false);
      }, 800);
    };
    fetchContent();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PUBLISHED':
        return <CheckCircle className='w-5 h-5 text-emerald-500' />;
      case 'SCHEDULED':
        return <Clock className='w-5 h-5 text-blue-500' />;
      case 'DRAFT':
        return <Edit className='w-5 h-5 text-amber-500' />;
      case 'ARCHIVED':
        return <Archive className='w-5 h-5 text-gray-500' />;
      default:
        return <AlertCircle className='w-5 h-5 text-gray-400' />;
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'PUBLISHED':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'SCHEDULED':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'DRAFT':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'ARCHIVED':
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
          <div className='bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 p-8 text-white'>
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
                <span className='px-4 py-2 bg-white/20 text-white rounded-full text-sm font-semibold backdrop-blur-sm'>
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
                    {content.stats.views.toLocaleString()}
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
                    {content.stats.engagement}%
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
                    {content.stats.shares}
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
                <div className='flex'>
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
                </div>
              </div>

              <div className='p-8'>
                {activeTab === 'content' && (
                  <div
                    className='prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-li:text-gray-700'
                    dangerouslySetInnerHTML={{ __html: content.body }}
                  />
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
                <Image
                  src={content.author.avatar}
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
                {content.publishedDate && (
                  <div className='flex items-start gap-3'>
                    <Eye className='w-4 h-4 text-green-500 mt-1 flex-shrink-0' />
                    <div>
                      <div className='text-sm font-medium text-gray-900'>
                        Published
                      </div>
                      <div className='text-sm text-gray-600'>
                        {formatDate(content.publishedDate)}
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
                {content.platforms.map((platform: Platform, index: number) => (
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
                ))}
              </div>
            </div>

            {/* Attachments */}
            {content.attachments && content.attachments.length > 0 && (
              <div className='bg-white rounded-2xl shadow-sm border border-white/20 p-6'>
                <h3 className='font-bold text-gray-900 mb-4'>Attachments</h3>
                <div className='space-y-3'>
                  {content.attachments.map(
                    (attachment: Attachment, index: number) => (
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentDetailPage;
