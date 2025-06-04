import React, { useState } from 'react';
import { BookOpen, Zap, TrendingUp, Sparkles } from 'lucide-react';
import {
  ContentData,
  ContentIdea,
  AIContentSuggestions,
} from '@/src/types/content';
import { ContentRenderer } from './ContentRenderer';

interface ContentTabsProps {
  content: ContentData;
}

export const ContentTabs: React.FC<ContentTabsProps> = ({ content }) => {
  const [activeTab, setActiveTab] = useState('content');

  return (
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
        {activeTab === 'content' && <ContentRenderer body={content.body} />}

        {activeTab === 'ai-suggestions' && content.aiSuggestions && (
          <AISuggestionsTab suggestions={content.aiSuggestions} />
        )}

        {activeTab === 'optimized-content' && content.optimizedContent && (
          <OptimizedContentTab optimizedContent={content.optimizedContent} />
        )}

        {activeTab === 'content-ideas' &&
          content.contentIdeas &&
          content.contentIdeas.length > 0 && (
            <ContentIdeasTab contentIdeas={content.contentIdeas} />
          )}

        {activeTab === 'analytics' && <AnalyticsTab content={content} />}
      </div>
    </div>
  );
};

// AI Suggestions Tab Component
const AISuggestionsTab: React.FC<{ suggestions: AIContentSuggestions }> = ({
  suggestions,
}) => (
  <div className='space-y-8'>
    {suggestions.title && (
      <div className='bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6 border border-purple-100'>
        <h3 className='font-bold text-gray-900 mb-3 flex items-center gap-2'>
          <Sparkles className='w-5 h-5 text-purple-600' />
          Alternative Title
        </h3>
        <p className='text-gray-800 text-lg font-medium'>{suggestions.title}</p>
      </div>
    )}

    {suggestions.description && (
      <div className='bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100'>
        <h3 className='font-bold text-gray-900 mb-3'>
          Alternative Description
        </h3>
        <p className='text-gray-700'>{suggestions.description}</p>
      </div>
    )}

    {suggestions.keywords && suggestions.keywords.length > 0 && (
      <div>
        <h3 className='font-bold text-gray-900 mb-4'>Suggested Keywords</h3>
        <div className='flex flex-wrap gap-2'>
          {suggestions.keywords.map((keyword: string, index: number) => (
            <span
              key={index}
              className='px-4 py-2 bg-gradient-to-r from-purple-100 to-blue-100 text-purple-800 rounded-full text-sm font-medium'
            >
              {keyword}
            </span>
          ))}
        </div>
      </div>
    )}

    {suggestions.hashtags && suggestions.hashtags.length > 0 && (
      <div>
        <h3 className='font-bold text-gray-900 mb-4'>Suggested Hashtags</h3>
        <div className='flex flex-wrap gap-2'>
          {suggestions.hashtags.map((hashtag: string, index: number) => (
            <span
              key={index}
              className='px-3 py-2 bg-gradient-to-r from-pink-100 to-purple-100 text-pink-800 rounded-lg text-sm font-medium'
            >
              {hashtag}
            </span>
          ))}
        </div>
      </div>
    )}

    {suggestions.improvements && suggestions.improvements.length > 0 && (
      <div>
        <h3 className='font-bold text-gray-900 mb-4'>
          Improvement Suggestions
        </h3>
        <div className='space-y-3'>
          {suggestions.improvements.map(
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

    {suggestions.estimatedReach && (
      <div className='bg-gradient-to-r from-green-50 to-teal-50 rounded-xl p-6 border border-green-100'>
        <h3 className='font-bold text-gray-900 mb-3'>Estimated Reach</h3>
        <p className='text-2xl font-bold text-green-600'>
          {suggestions.estimatedReach.toLocaleString()} people
        </p>
      </div>
    )}

    {suggestions.competitorAnalysis &&
      suggestions.competitorAnalysis.length > 0 && (
        <div>
          <h3 className='font-bold text-gray-900 mb-4'>Competitor Analysis</h3>
          <div className='space-y-3'>
            {suggestions.competitorAnalysis.map(
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
);

// Optimized Content Tab Component
const OptimizedContentTab: React.FC<{
  optimizedContent: Record<string, string>;
}> = ({ optimizedContent }) => (
  <div className='space-y-8'>
    <div className='grid gap-6'>
      {Object.entries(optimizedContent).map(([platform, optimizedText]) => (
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
      ))}
    </div>
  </div>
);

// Content Ideas Tab Component
const ContentIdeasTab: React.FC<{ contentIdeas: ContentIdea[] }> = ({
  contentIdeas,
}) => (
  <div className='space-y-8'>
    <div className='grid gap-6'>
      {contentIdeas.map((idea: ContentIdea, index: number) => (
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
              <p className='text-gray-700 mb-4'>{idea.description}</p>
              {idea.excerpt && (
                <div className='bg-white rounded-lg p-4 border border-orange-200 mb-4'>
                  <h4 className='font-semibold text-gray-900 mb-2'>Excerpt</h4>
                  <p className='text-gray-700 text-sm italic'>{idea.excerpt}</p>
                </div>
              )}
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4 text-sm'>
                {idea.targetAudience && (
                  <div>
                    <span className='font-semibold text-gray-900'>
                      Target Audience:
                    </span>
                    <p className='text-gray-700'>{idea.targetAudience}</p>
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
                    <p className='text-gray-700'>{idea.timeToCreate}</p>
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
              {idea.keyPoints && idea.keyPoints.length > 0 && (
                <div className='mt-4'>
                  <h4 className='font-semibold text-gray-900 mb-2'>
                    Key Points
                  </h4>
                  <div className='flex flex-wrap gap-1'>
                    {idea.keyPoints
                      .slice(0, 5)
                      .map((point: string, pointIndex: number) => (
                        <span
                          key={pointIndex}
                          className='px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-md'
                        >
                          {point}
                        </span>
                      ))}
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
      ))}
    </div>
  </div>
);

// Analytics Tab Component
const AnalyticsTab: React.FC<{ content: ContentData }> = ({ content }) => (
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
                {content.analytics.impressions?.toLocaleString() || 0}
              </div>
              <div className='text-sm text-blue-800'>Impressions</div>
            </div>
            <div className='bg-green-50 rounded-xl p-4 border border-green-100'>
              <div className='text-2xl font-bold text-green-600'>
                {content.analytics.reach?.toLocaleString() || 0}
              </div>
              <div className='text-sm text-green-800'>Reach</div>
            </div>
            <div className='bg-purple-50 rounded-xl p-4 border border-purple-100'>
              <div className='text-2xl font-bold text-purple-600'>
                {content.analytics.engagementRate?.toFixed(2) || 0}%
              </div>
              <div className='text-sm text-purple-800'>Engagement Rate</div>
            </div>
          </>
        )}
      </div>
    </div>

    {/* Engagement Breakdown */}
    {content.engagement && (
      <div>
        <h3 className='font-bold text-gray-900 mb-4'>Engagement Breakdown</h3>
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
            <div className='text-sm text-green-800'>Comments</div>
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
            <div className='text-sm text-indigo-800'>Clicks</div>
          </div>
        </div>
      </div>
    )}

    {/* SEO Information */}
    {content.seo && (
      <div>
        <h3 className='font-bold text-gray-900 mb-4'>SEO Information</h3>
        <div className='bg-gradient-to-r from-green-50 to-teal-50 rounded-xl p-6 border border-green-100'>
          <div className='space-y-4'>
            {content.seo.metaTitle && (
              <div>
                <h4 className='font-semibold text-gray-900'>Meta Title</h4>
                <p className='text-gray-700'>{content.seo.metaTitle}</p>
              </div>
            )}
            {content.seo.metaDescription && (
              <div>
                <h4 className='font-semibold text-gray-900'>
                  Meta Description
                </h4>
                <p className='text-gray-700'>{content.seo.metaDescription}</p>
              </div>
            )}
            {content.seo.keywords && content.seo.keywords.length > 0 && (
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
                <h4 className='font-semibold text-gray-900'>Canonical URL</h4>
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
        <h3 className='font-bold text-gray-900 mb-4'>Scheduling Information</h3>
        <div className='bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100'>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            {content.scheduling.timezone && (
              <div>
                <h4 className='font-semibold text-gray-900'>Timezone</h4>
                <p className='text-gray-700'>{content.scheduling.timezone}</p>
              </div>
            )}
            {content.scheduling.frequency && (
              <div>
                <h4 className='font-semibold text-gray-900'>Frequency</h4>
                <p className='text-gray-700 capitalize'>
                  {content.scheduling.frequency}
                </p>
              </div>
            )}
            {content.scheduling.optimalTimes &&
              content.scheduling.optimalTimes.length > 0 && (
                <div>
                  <h4 className='font-semibold text-gray-900'>Optimal Times</h4>
                  <div className='space-y-1'>
                    {content.scheduling.optimalTimes.map(
                      (time: string, index: number) => (
                        <p key={index} className='text-gray-700 text-sm'>
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
);
