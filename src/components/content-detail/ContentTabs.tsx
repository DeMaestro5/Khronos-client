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
    <div className='bg-white/95 dark:bg-slate-800/90 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-200/60 dark:border-slate-700/60 overflow-hidden'>
      <div className='border-b border-gray-100 dark:border-slate-600'>
        <div className='flex overflow-x-auto scrollbar-hide'>
          <button
            onClick={() => setActiveTab('content')}
            className={`flex-shrink-0 px-4 lg:px-6 py-4 font-medium transition-all duration-200 whitespace-nowrap ${
              activeTab === 'content'
                ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400 bg-blue-50/50 dark:bg-blue-900/20'
                : 'text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-slate-100 hover:bg-gray-50 dark:hover:bg-slate-700/50'
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
              className={`flex-shrink-0 px-4 lg:px-6 py-4 font-medium transition-all duration-200 whitespace-nowrap ${
                activeTab === 'ai-suggestions'
                  ? 'text-purple-600 dark:text-purple-400 border-b-2 border-purple-600 dark:border-purple-400 bg-purple-50/50 dark:bg-purple-900/20'
                  : 'text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-slate-100 hover:bg-gray-50 dark:hover:bg-slate-700/50'
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
              className={`flex-shrink-0 px-4 lg:px-6 py-4 font-medium transition-all duration-200 whitespace-nowrap ${
                activeTab === 'optimized-content'
                  ? 'text-green-600 dark:text-green-400 border-b-2 border-green-600 dark:border-green-400 bg-green-50/50 dark:bg-green-900/20'
                  : 'text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-slate-100 hover:bg-gray-50 dark:hover:bg-slate-700/50'
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
              className={`flex-shrink-0 px-4 lg:px-6 py-4 font-medium transition-all duration-200 whitespace-nowrap ${
                activeTab === 'content-ideas'
                  ? 'text-orange-600 dark:text-orange-400 border-b-2 border-orange-600 dark:border-orange-400 bg-orange-50/50 dark:bg-orange-900/20'
                  : 'text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-slate-100 hover:bg-gray-50 dark:hover:bg-slate-700/50'
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
            className={`flex-shrink-0 px-4 lg:px-6 py-4 font-medium transition-all duration-200 whitespace-nowrap ${
              activeTab === 'analytics'
                ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400 bg-indigo-50/50 dark:bg-indigo-900/20'
                : 'text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-slate-100 hover:bg-gray-50 dark:hover:bg-slate-700/50'
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
      <div className='bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-xl p-6 border border-purple-100 dark:border-purple-700/50 backdrop-blur-sm'>
        <h3 className='font-bold text-gray-900 dark:text-slate-100 mb-3 flex items-center gap-2'>
          <Sparkles className='w-5 h-5 text-purple-600 dark:text-purple-400' />
          Alternative Title
        </h3>
        <p className='text-gray-800 dark:text-slate-200 text-lg font-medium'>
          {suggestions.title}
        </p>
      </div>
    )}

    {suggestions.description && (
      <div className='bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6 border border-blue-100 dark:border-blue-700/50 backdrop-blur-sm'>
        <h3 className='font-bold text-gray-900 dark:text-slate-100 mb-3'>
          Alternative Description
        </h3>
        <p className='text-gray-700 dark:text-slate-300'>
          {suggestions.description}
        </p>
      </div>
    )}

    {suggestions.keywords && suggestions.keywords.length > 0 && (
      <div>
        <h3 className='font-bold text-gray-900 dark:text-slate-100 mb-4'>
          Suggested Keywords
        </h3>
        <div className='flex flex-wrap gap-2'>
          {suggestions.keywords.map((keyword: string, index: number) => (
            <span
              key={index}
              className='px-4 py-2 bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 text-purple-800 dark:text-purple-300 rounded-full text-sm font-medium border border-purple-200 dark:border-purple-700'
            >
              {keyword}
            </span>
          ))}
        </div>
      </div>
    )}

    {suggestions.hashtags && suggestions.hashtags.length > 0 && (
      <div>
        <h3 className='font-bold text-gray-900 dark:text-slate-100 mb-4'>
          Suggested Hashtags
        </h3>
        <div className='flex flex-wrap gap-2'>
          {suggestions.hashtags.map((hashtag: string, index: number) => (
            <span
              key={index}
              className='px-3 py-2 bg-gradient-to-r from-pink-100 to-purple-100 dark:from-pink-900/30 dark:to-purple-900/30 text-pink-800 dark:text-pink-300 rounded-lg text-sm font-medium border border-pink-200 dark:border-pink-700'
            >
              {hashtag}
            </span>
          ))}
        </div>
      </div>
    )}

    {suggestions.improvements && suggestions.improvements.length > 0 && (
      <div>
        <h3 className='font-bold text-gray-900 dark:text-slate-100 mb-4'>
          Improvement Suggestions
        </h3>
        <div className='space-y-3'>
          {suggestions.improvements.map(
            (improvement: string, index: number) => (
              <div
                key={index}
                className='flex items-start gap-3 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-100 dark:border-amber-700/50 backdrop-blur-sm'
              >
                <div className='w-6 h-6 bg-amber-200 dark:bg-amber-800 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5'>
                  <span className='text-amber-800 dark:text-amber-200 text-sm font-bold'>
                    {index + 1}
                  </span>
                </div>
                <p className='text-gray-800 dark:text-slate-200'>
                  {improvement}
                </p>
              </div>
            )
          )}
        </div>
      </div>
    )}

    {suggestions.estimatedReach && (
      <div className='bg-gradient-to-r from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20 rounded-xl p-6 border border-green-100 dark:border-green-700/50 backdrop-blur-sm'>
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
          className='bg-gradient-to-r from-gray-50 to-slate-50 dark:from-slate-800/50 dark:to-slate-700/50 rounded-xl p-6 border border-gray-100 dark:border-slate-700/60 backdrop-blur-sm'
        >
          <div className='flex items-center gap-3 mb-4'>
            <div className='w-8 h-8 bg-blue-600 dark:bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold text-sm'>
              {platform.charAt(0).toUpperCase()}
            </div>
            <h3 className='font-bold text-gray-900 dark:text-slate-100 capitalize'>
              {platform} Optimized Content
            </h3>
          </div>
          <div className='bg-white dark:bg-slate-800/80 rounded-lg p-4 border border-gray-200 dark:border-slate-600/50 backdrop-blur-sm'>
            <pre className='whitespace-pre-wrap text-sm text-gray-700 dark:text-slate-200 font-mono'>
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
          className='bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 rounded-xl p-6 border border-orange-100 dark:border-orange-800/30 backdrop-blur-sm'
        >
          <div className='flex items-start gap-4 mb-4'>
            <div className='w-8 h-8 bg-orange-500 dark:bg-orange-600 rounded-full flex items-center justify-center text-white font-bold text-sm'>
              {index + 1}
            </div>
            <div className='flex-1'>
              <h3 className='font-bold text-gray-900 dark:text-slate-100 text-lg mb-2'>
                {idea.title}
              </h3>
              <p className='text-gray-700 dark:text-slate-200 mb-4'>
                {idea.description}
              </p>
              {idea.excerpt && (
                <div className='bg-white dark:bg-slate-800/60 rounded-lg p-4 border border-orange-200 dark:border-orange-700/40 mb-4 backdrop-blur-sm'>
                  <h4 className='font-semibold text-gray-900 dark:text-slate-100 mb-2'>
                    Excerpt
                  </h4>
                  <p className='text-gray-700 dark:text-slate-300 text-sm italic'>
                    {idea.excerpt}
                  </p>
                </div>
              )}
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4 text-sm'>
                {idea.targetAudience && (
                  <div>
                    <span className='font-semibold text-gray-900 dark:text-slate-100'>
                      Target Audience:
                    </span>
                    <p className='text-gray-700 dark:text-slate-300'>
                      {idea.targetAudience}
                    </p>
                  </div>
                )}
                {idea.difficulty && (
                  <div>
                    <span className='font-semibold text-gray-900 dark:text-slate-100'>
                      Difficulty:
                    </span>
                    <span
                      className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                        idea.difficulty === 'easy'
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
                          : idea.difficulty === 'moderate'
                          ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300'
                          : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
                      }`}
                    >
                      {idea.difficulty}
                    </span>
                  </div>
                )}
                {idea.timeToCreate && (
                  <div>
                    <span className='font-semibold text-gray-900 dark:text-slate-100'>
                      Time to Create:
                    </span>
                    <p className='text-gray-700 dark:text-slate-300'>
                      {idea.timeToCreate}
                    </p>
                  </div>
                )}
                {idea.estimatedEngagement && (
                  <div>
                    <span className='font-semibold text-gray-900 dark:text-slate-100'>
                      Est. Engagement:
                    </span>
                    <p className='text-gray-700 dark:text-slate-300'>
                      {idea.estimatedEngagement}/10
                    </p>
                  </div>
                )}
              </div>
              {idea.keyPoints && idea.keyPoints.length > 0 && (
                <div className='mt-4'>
                  <h4 className='font-semibold text-gray-900 dark:text-slate-100 mb-2'>
                    Key Points
                  </h4>
                  <div className='flex flex-wrap gap-1'>
                    {idea.keyPoints
                      .slice(0, 5)
                      .map((point: string, pointIndex: number) => (
                        <span
                          key={pointIndex}
                          className='px-2 py-1 bg-orange-100 dark:bg-orange-800/30 text-orange-800 dark:text-orange-300 text-xs rounded-md'
                        >
                          {point}
                        </span>
                      ))}
                    {idea.keyPoints.length > 5 && (
                      <span className='px-2 py-1 bg-gray-100 dark:bg-slate-700/50 text-gray-600 dark:text-slate-400 text-xs rounded-md'>
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
      <h3 className='font-bold text-gray-900 dark:text-slate-100 mb-4 flex items-center gap-2'>
        <TrendingUp className='w-5 h-5 text-blue-600 dark:text-blue-400' />
        Performance Metrics
      </h3>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
        {content.analytics && (
          <>
            <div className='bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-100 dark:border-blue-800/30 backdrop-blur-sm'>
              <div className='text-2xl font-bold text-blue-600 dark:text-blue-400'>
                {content.analytics.impressions?.toLocaleString() || 0}
              </div>
              <div className='text-sm text-blue-800 dark:text-blue-300'>
                Impressions
              </div>
            </div>
            <div className='bg-green-50 dark:bg-green-900/20 rounded-xl p-4 border border-green-100 dark:border-green-800/30 backdrop-blur-sm'>
              <div className='text-2xl font-bold text-green-600 dark:text-green-400'>
                {content.analytics.reach?.toLocaleString() || 0}
              </div>
              <div className='text-sm text-green-800 dark:text-green-300'>
                Reach
              </div>
            </div>
            <div className='bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4 border border-purple-100 dark:border-purple-800/30 backdrop-blur-sm'>
              <div className='text-2xl font-bold text-purple-600 dark:text-purple-400'>
                {content.analytics.engagementRate?.toFixed(2) || 0}%
              </div>
              <div className='text-sm text-purple-800 dark:text-purple-300'>
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
        <h3 className='font-bold text-gray-900 dark:text-slate-100 mb-4'>
          Engagement Breakdown
        </h3>
        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4'>
          <div className='bg-red-50 dark:bg-red-900/20 rounded-xl p-4 border border-red-100 dark:border-red-800/30 text-center backdrop-blur-sm'>
            <div className='text-2xl font-bold text-red-600 dark:text-red-400'>
              {content.engagement.likes || 0}
            </div>
            <div className='text-sm text-red-800 dark:text-red-300'>Likes</div>
          </div>
          <div className='bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-100 dark:border-blue-800/30 text-center backdrop-blur-sm'>
            <div className='text-2xl font-bold text-blue-600 dark:text-blue-400'>
              {content.engagement.shares || 0}
            </div>
            <div className='text-sm text-blue-800 dark:text-blue-300'>
              Shares
            </div>
          </div>
          <div className='bg-green-50 dark:bg-green-900/20 rounded-xl p-4 border border-green-100 dark:border-green-800/30 text-center backdrop-blur-sm'>
            <div className='text-2xl font-bold text-green-600 dark:text-green-400'>
              {content.engagement.comments || 0}
            </div>
            <div className='text-sm text-green-800 dark:text-green-300'>
              Comments
            </div>
          </div>
          <div className='bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-4 border border-yellow-100 dark:border-yellow-800/30 text-center backdrop-blur-sm'>
            <div className='text-2xl font-bold text-yellow-600 dark:text-yellow-400'>
              {content.engagement.saves || 0}
            </div>
            <div className='text-sm text-yellow-800 dark:text-yellow-300'>
              Saves
            </div>
          </div>
          <div className='bg-indigo-50 dark:bg-indigo-900/20 rounded-xl p-4 border border-indigo-100 dark:border-indigo-800/30 text-center backdrop-blur-sm'>
            <div className='text-2xl font-bold text-indigo-600 dark:text-indigo-400'>
              {content.engagement.clicks || 0}
            </div>
            <div className='text-sm text-indigo-800 dark:text-indigo-300'>
              Clicks
            </div>
          </div>
        </div>
      </div>
    )}

    {/* SEO Information */}
    {content.seo && (
      <div>
        <h3 className='font-bold text-gray-900 dark:text-slate-100 mb-4'>
          SEO Information
        </h3>
        <div className='bg-gradient-to-r from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20 rounded-xl p-6 border border-green-100 dark:border-green-800/30 backdrop-blur-sm'>
          <div className='space-y-4'>
            {content.seo.metaTitle && (
              <div>
                <h4 className='font-semibold text-gray-900 dark:text-slate-100'>
                  Meta Title
                </h4>
                <p className='text-gray-700 dark:text-slate-300'>
                  {content.seo.metaTitle}
                </p>
              </div>
            )}
            {content.seo.metaDescription && (
              <div>
                <h4 className='font-semibold text-gray-900 dark:text-slate-100'>
                  Meta Description
                </h4>
                <p className='text-gray-700 dark:text-slate-300'>
                  {content.seo.metaDescription}
                </p>
              </div>
            )}
            {content.seo.keywords && content.seo.keywords.length > 0 && (
              <div>
                <h4 className='font-semibold text-gray-900 dark:text-slate-100 mb-2'>
                  SEO Keywords
                </h4>
                <div className='flex flex-wrap gap-2'>
                  {content.seo.keywords.map(
                    (keyword: string, index: number) => (
                      <span
                        key={index}
                        className='px-3 py-1 bg-green-100 dark:bg-green-800/30 text-green-800 dark:text-green-300 text-sm rounded-full'
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
                <h4 className='font-semibold text-gray-900 dark:text-slate-100'>
                  Canonical URL
                </h4>
                <a
                  href={content.seo.canonicalUrl}
                  className='text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline'
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
        <h3 className='font-bold text-gray-900 dark:text-slate-100 mb-4'>
          Scheduling Information
        </h3>
        <div className='bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6 border border-blue-100 dark:border-blue-800/30 backdrop-blur-sm'>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            {content.scheduling.timezone && (
              <div>
                <h4 className='font-semibold text-gray-900 dark:text-slate-100'>
                  Timezone
                </h4>
                <p className='text-gray-700 dark:text-slate-300'>
                  {content.scheduling.timezone}
                </p>
              </div>
            )}
            {content.scheduling.frequency && (
              <div>
                <h4 className='font-semibold text-gray-900 dark:text-slate-100'>
                  Frequency
                </h4>
                <p className='text-gray-700 dark:text-slate-300 capitalize'>
                  {content.scheduling.frequency}
                </p>
              </div>
            )}
            {content.scheduling.optimalTimes &&
              content.scheduling.optimalTimes.length > 0 && (
                <div>
                  <h4 className='font-semibold text-gray-900 dark:text-slate-100'>
                    Optimal Times
                  </h4>
                  <div className='space-y-1'>
                    {content.scheduling.optimalTimes.map(
                      (time: string, index: number) => (
                        <p
                          key={index}
                          className='text-gray-700 dark:text-slate-300 text-sm'
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
);
