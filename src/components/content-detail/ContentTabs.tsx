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
    <div className='bg-theme-card/95 backdrop-blur-sm rounded-2xl shadow-lg border border-theme-tertiary overflow-hidden'>
      {/* Mobile-Optimized Tab Navigation */}
      <div className='border-b border-theme-secondary'>
        <div className='flex overflow-x-auto scrollbar-hide px-2'>
          <button
            onClick={() => setActiveTab('content')}
            className={`flex-shrink-0 px-3 py-3 font-medium transition-all duration-200 whitespace-nowrap text-sm ${
              activeTab === 'content'
                ? 'text-accent-primary border-b-2 border-accent-primary bg-accent-primary/10'
                : 'text-theme-secondary hover:text-theme-primary hover:bg-theme-hover'
            }`}
          >
            <div className='flex items-center gap-1.5'>
              <BookOpen className='w-4 h-4' />
              <span className='hidden sm:inline'>Content</span>
              <span className='sm:hidden'>Content</span>
            </div>
          </button>

          {content.aiSuggestions && (
            <button
              onClick={() => setActiveTab('ai-suggestions')}
              className={`flex-shrink-0 px-3 py-3 font-medium transition-all duration-200 whitespace-nowrap text-sm ${
                activeTab === 'ai-suggestions'
                  ? 'text-accent-primary border-b-2 border-accent-primary bg-accent-primary/10'
                  : 'text-theme-secondary hover:text-theme-primary hover:bg-theme-hover'
              }`}
            >
              <div className='flex items-center gap-1.5'>
                <Zap className='w-4 h-4' />
                <span className='hidden sm:inline'>AI Suggestions</span>
                <span className='sm:hidden'>AI</span>
              </div>
            </button>
          )}

          {content.optimizedContent && (
            <button
              onClick={() => setActiveTab('optimized-content')}
              className={`flex-shrink-0 px-3 py-3 font-medium transition-all duration-200 whitespace-nowrap text-sm ${
                activeTab === 'optimized-content'
                  ? 'text-accent-primary border-b-2 border-accent-primary bg-accent-primary/10'
                  : 'text-theme-secondary hover:text-theme-primary hover:bg-theme-hover'
              }`}
            >
              <div className='flex items-center gap-1.5'>
                <TrendingUp className='w-4 h-4' />
                <span className='hidden sm:inline'>Platform Content</span>
                <span className='sm:hidden'>Platform</span>
              </div>
            </button>
          )}

          {content.contentIdeas && content.contentIdeas.length > 0 && (
            <button
              onClick={() => setActiveTab('content-ideas')}
              className={`flex-shrink-0 px-3 py-3 font-medium transition-all duration-200 whitespace-nowrap text-sm ${
                activeTab === 'content-ideas'
                  ? 'text-accent-primary border-b-2 border-accent-primary bg-accent-primary/10'
                  : 'text-theme-secondary hover:text-theme-primary hover:bg-theme-hover'
              }`}
            >
              <div className='flex items-center gap-1.5'>
                <Sparkles className='w-4 h-4' />
                <span className='hidden sm:inline'>
                  Content Ideas ({content.contentIdeas.length})
                </span>
                <span className='sm:hidden'>
                  Ideas ({content.contentIdeas.length})
                </span>
              </div>
            </button>
          )}

          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex-shrink-0 px-3 py-3 font-medium transition-all duration-200 whitespace-nowrap text-sm ${
              activeTab === 'analytics'
                ? 'text-accent-primary border-b-2 border-accent-primary bg-accent-primary/10'
                : 'text-theme-secondary hover:text-theme-primary hover:bg-theme-hover'
            }`}
          >
            <div className='flex items-center gap-1.5'>
              <TrendingUp className='w-4 h-4' />
              <span className='hidden sm:inline'>Analytics</span>
              <span className='sm:hidden'>Analytics</span>
            </div>
          </button>
        </div>
      </div>

      {/* Tab Content - Mobile Optimized */}
      <div className='p-4 md:p-6 lg:p-8'>
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

// AI Suggestions Tab Component - Mobile Optimized
const AISuggestionsTab: React.FC<{ suggestions: AIContentSuggestions }> = ({
  suggestions,
}) => (
  <div className='space-y-6'>
    {suggestions.title && (
      <div className='bg-accent-primary/5 rounded-xl p-4 md:p-6 border border-theme-tertiary backdrop-blur-sm'>
        <h3 className='font-bold text-theme-primary mb-3 flex items-center gap-2 text-sm md:text-base'>
          <Sparkles className='w-4 h-4 md:w-5 md:h-5 text-accent-primary' />
          Alternative Title
        </h3>
        <p className='text-theme-primary text-base md:text-lg font-medium break-words'>
          {suggestions.title}
        </p>
      </div>
    )}

    {suggestions.description && (
      <div className='bg-accent-primary/5 rounded-xl p-4 md:p-6 border border-theme-tertiary backdrop-blur-sm'>
        <h3 className='font-bold text-theme-primary mb-3 text-sm md:text-base'>
          Alternative Description
        </h3>
        <p className='text-theme-secondary text-sm md:text-base break-words'>
          {suggestions.description}
        </p>
      </div>
    )}

    {suggestions.keywords && suggestions.keywords.length > 0 && (
      <div>
        <h3 className='font-bold text-theme-primary mb-4 text-sm md:text-base'>
          Suggested Keywords
        </h3>
        <div className='flex flex-wrap gap-2'>
          {suggestions.keywords.map((keyword: string, index: number) => (
            <span
              key={index}
              className='px-3 py-1.5 md:px-4 md:py-2 bg-accent-primary/10 text-accent-primary rounded-full text-xs md:text-sm font-medium border border-accent-primary/20'
            >
              {keyword}
            </span>
          ))}
        </div>
      </div>
    )}

    {suggestions.hashtags && suggestions.hashtags.length > 0 && (
      <div>
        <h3 className='font-bold text-theme-primary mb-4 text-sm md:text-base'>
          Suggested Hashtags
        </h3>
        <div className='flex flex-wrap gap-2'>
          {suggestions.hashtags.map((hashtag: string, index: number) => (
            <span
              key={index}
              className='px-2 py-1.5 md:px-3 md:py-2 bg-accent-primary/10 text-accent-primary rounded-lg text-xs md:text-sm font-medium border border-accent-primary/20'
            >
              {hashtag}
            </span>
          ))}
        </div>
      </div>
    )}

    {suggestions.improvements && suggestions.improvements.length > 0 && (
      <div>
        <h3 className='font-bold text-theme-primary mb-4 text-sm md:text-base'>
          Improvement Suggestions
        </h3>
        <div className='space-y-3'>
          {suggestions.improvements.map(
            (improvement: string, index: number) => (
              <div
                key={index}
                className='flex items-start gap-3 p-3 md:p-4 bg-accent-primary/5 rounded-xl border border-theme-tertiary backdrop-blur-sm'
              >
                <div className='w-5 h-5 md:w-6 md:h-6 bg-accent-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5'>
                  <span className='text-accent-primary text-xs md:text-sm font-bold'>
                    {index + 1}
                  </span>
                </div>
                <p className='text-theme-primary text-sm md:text-base break-words'>
                  {improvement}
                </p>
              </div>
            )
          )}
        </div>
      </div>
    )}

    {suggestions.estimatedReach && (
      <div className='bg-accent-primary/5 rounded-xl p-4 md:p-6 border border-theme-tertiary backdrop-blur-sm'>
        <h3 className='font-bold text-theme-primary mb-3 text-sm md:text-base'>
          Estimated Reach
        </h3>
        <p className='text-xl md:text-2xl font-bold text-accent-primary'>
          {suggestions.estimatedReach.toLocaleString()} people
        </p>
      </div>
    )}

    {suggestions.competitorAnalysis &&
      suggestions.competitorAnalysis.length > 0 && (
        <div>
          <h3 className='font-bold text-theme-primary mb-4 text-sm md:text-base'>
            Competitor Analysis
          </h3>
          <div className='space-y-3'>
            {suggestions.competitorAnalysis.map(
              (analysis: string, index: number) => (
                <div
                  key={index}
                  className='p-3 md:p-4 bg-theme-secondary/10 rounded-xl border border-theme-tertiary'
                >
                  <p className='text-theme-secondary text-sm md:text-base break-words'>
                    {analysis}
                  </p>
                </div>
              )
            )}
          </div>
        </div>
      )}
  </div>
);

// Optimized Content Tab Component - Mobile Optimized
const OptimizedContentTab: React.FC<{
  optimizedContent: Record<string, string>;
}> = ({ optimizedContent }) => (
  <div className='space-y-6'>
    <div className='grid gap-4 md:gap-6'>
      {Object.entries(optimizedContent).map(([platform, optimizedText]) => (
        <div
          key={platform}
          className='bg-theme-secondary/5 rounded-xl p-4 md:p-6 border border-theme-tertiary backdrop-blur-sm'
        >
          <div className='flex items-center gap-3 mb-4'>
            <div className='w-6 h-6 md:w-8 md:h-8 bg-accent-primary rounded-lg flex items-center justify-center text-white font-bold text-xs md:text-sm'>
              {platform.charAt(0).toUpperCase()}
            </div>
            <h3 className='font-bold text-theme-primary capitalize text-sm md:text-base'>
              {platform} Optimized Content
            </h3>
          </div>
          <div className='bg-theme-card rounded-lg p-3 md:p-4 border border-theme-tertiary backdrop-blur-sm'>
            <pre className='whitespace-pre-wrap text-xs md:text-sm text-theme-secondary font-mono break-words'>
              {optimizedText}
            </pre>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// Content Ideas Tab Component - Mobile Optimized
const ContentIdeasTab: React.FC<{ contentIdeas: ContentIdea[] }> = ({
  contentIdeas,
}) => (
  <div className='space-y-6'>
    <div className='grid gap-4 md:gap-6'>
      {contentIdeas.map((idea: ContentIdea, index: number) => (
        <div
          key={index}
          className='bg-accent-primary/5 rounded-xl p-4 md:p-6 border border-theme-tertiary backdrop-blur-sm'
        >
          <div className='flex items-start gap-3 md:gap-4 mb-4'>
            <div className='w-6 h-6 md:w-8 md:h-8 bg-accent-primary rounded-full flex items-center justify-center text-white font-bold text-xs md:text-sm'>
              {index + 1}
            </div>
            <div className='flex-1 min-w-0'>
              <h3 className='font-bold text-theme-primary text-base md:text-lg mb-2 break-words'>
                {idea.title}
              </h3>
              <p className='text-theme-secondary mb-4 text-sm md:text-base break-words'>
                {idea.description}
              </p>
              {idea.excerpt && (
                <div className='bg-theme-card rounded-lg p-3 md:p-4 border border-theme-tertiary mb-4 backdrop-blur-sm'>
                  <h4 className='font-semibold text-theme-primary mb-2 text-sm md:text-base'>
                    Excerpt
                  </h4>
                  <p className='text-theme-secondary text-xs md:text-sm italic break-words'>
                    {idea.excerpt}
                  </p>
                </div>
              )}
              <div className='grid grid-cols-1 gap-3 md:gap-4 text-xs md:text-sm'>
                {idea.targetAudience && (
                  <div>
                    <span className='font-semibold text-theme-primary'>
                      Target Audience:
                    </span>
                    <p className='text-theme-secondary break-words'>
                      {idea.targetAudience}
                    </p>
                  </div>
                )}
                {idea.difficulty && (
                  <div>
                    <span className='font-semibold text-theme-primary'>
                      Difficulty:
                    </span>
                    <span
                      className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                        idea.difficulty === 'easy'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                          : idea.difficulty === 'moderate'
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300'
                          : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                      }`}
                    >
                      {idea.difficulty}
                    </span>
                  </div>
                )}
                {idea.timeToCreate && (
                  <div>
                    <span className='font-semibold text-theme-primary'>
                      Time to Create:
                    </span>
                    <p className='text-theme-secondary break-words'>
                      {idea.timeToCreate}
                    </p>
                  </div>
                )}
                {idea.estimatedEngagement && (
                  <div>
                    <span className='font-semibold text-theme-primary'>
                      Est. Engagement:
                    </span>
                    <p className='text-theme-secondary'>
                      {idea.estimatedEngagement}/10
                    </p>
                  </div>
                )}
              </div>
              {idea.keyPoints && idea.keyPoints.length > 0 && (
                <div className='mt-4'>
                  <h4 className='font-semibold text-theme-primary mb-2 text-sm md:text-base'>
                    Key Points
                  </h4>
                  <div className='flex flex-wrap gap-1'>
                    {idea.keyPoints
                      .slice(0, 5)
                      .map((point: string, pointIndex: number) => (
                        <span
                          key={pointIndex}
                          className='px-2 py-1 bg-accent-primary/10 text-accent-primary text-xs rounded-md'
                        >
                          {point}
                        </span>
                      ))}
                    {idea.keyPoints.length > 5 && (
                      <span className='px-2 py-1 bg-theme-secondary/20 text-theme-secondary text-xs rounded-md'>
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

// Analytics Tab Component - Mobile Optimized
const AnalyticsTab: React.FC<{ content: ContentData }> = ({ content }) => (
  <div className='space-y-6'>
    {/* Performance Metrics */}
    <div>
      <h3 className='font-bold text-theme-primary mb-4 flex items-center gap-2 text-sm md:text-base'>
        <TrendingUp className='w-4 h-4 md:w-5 md:h-5 text-accent-primary' />
        Performance Metrics
      </h3>
      <div className='grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4'>
        {content.analytics && (
          <>
            <div className='bg-accent-primary/5 rounded-xl p-3 md:p-4 border border-theme-tertiary backdrop-blur-sm'>
              <div className='text-lg md:text-2xl font-bold text-accent-primary'>
                {content.analytics.impressions?.toLocaleString() || 0}
              </div>
              <div className='text-xs md:text-sm text-theme-secondary'>
                Impressions
              </div>
            </div>
            <div className='bg-accent-primary/5 rounded-xl p-3 md:p-4 border border-theme-tertiary backdrop-blur-sm'>
              <div className='text-lg md:text-2xl font-bold text-accent-primary'>
                {content.analytics.reach?.toLocaleString() || 0}
              </div>
              <div className='text-xs md:text-sm text-theme-secondary'>
                Reach
              </div>
            </div>
            <div className='bg-accent-primary/5 rounded-xl p-3 md:p-4 border border-theme-tertiary backdrop-blur-sm col-span-2 md:col-span-1'>
              <div className='text-lg md:text-2xl font-bold text-accent-primary'>
                {content.analytics.engagementRate?.toFixed(2) || 0}%
              </div>
              <div className='text-xs md:text-sm text-theme-secondary'>
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
        <h3 className='font-bold text-theme-primary mb-4 text-sm md:text-base'>
          Engagement Breakdown
        </h3>
        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4'>
          <div className='bg-accent-primary/5 rounded-xl p-3 md:p-4 border border-theme-tertiary text-center backdrop-blur-sm'>
            <div className='text-lg md:text-2xl font-bold text-accent-primary'>
              {content.engagement.likes || 0}
            </div>
            <div className='text-xs md:text-sm text-theme-secondary'>Likes</div>
          </div>
          <div className='bg-accent-primary/5 rounded-xl p-3 md:p-4 border border-theme-tertiary text-center backdrop-blur-sm'>
            <div className='text-lg md:text-2xl font-bold text-accent-primary'>
              {content.engagement.shares || 0}
            </div>
            <div className='text-xs md:text-sm text-theme-secondary'>
              Shares
            </div>
          </div>
          <div className='bg-accent-primary/5 rounded-xl p-3 md:p-4 border border-theme-tertiary text-center backdrop-blur-sm'>
            <div className='text-lg md:text-2xl font-bold text-accent-primary'>
              {content.engagement.comments || 0}
            </div>
            <div className='text-xs md:text-sm text-theme-secondary'>
              Comments
            </div>
          </div>
          <div className='bg-accent-primary/5 rounded-xl p-3 md:p-4 border border-theme-tertiary text-center backdrop-blur-sm'>
            <div className='text-lg md:text-2xl font-bold text-accent-primary'>
              {content.engagement.saves || 0}
            </div>
            <div className='text-xs md:text-sm text-theme-secondary'>Saves</div>
          </div>
          <div className='bg-accent-primary/5 rounded-xl p-3 md:p-4 border border-theme-tertiary text-center backdrop-blur-sm col-span-2 md:col-span-1'>
            <div className='text-lg md:text-2xl font-bold text-accent-primary'>
              {content.engagement.clicks || 0}
            </div>
            <div className='text-xs md:text-sm text-theme-secondary'>
              Clicks
            </div>
          </div>
        </div>
      </div>
    )}

    {/* SEO Information */}
    {content.seo && (
      <div>
        <h3 className='font-bold text-theme-primary mb-4 text-sm md:text-base'>
          SEO Information
        </h3>
        <div className='bg-accent-primary/5 rounded-xl p-4 md:p-6 border border-theme-tertiary backdrop-blur-sm'>
          <div className='space-y-4'>
            {content.seo.metaTitle && (
              <div>
                <h4 className='font-semibold text-theme-primary text-sm md:text-base'>
                  Meta Title
                </h4>
                <p className='text-theme-secondary text-sm md:text-base break-words'>
                  {content.seo.metaTitle}
                </p>
              </div>
            )}
            {content.seo.metaDescription && (
              <div>
                <h4 className='font-semibold text-theme-primary text-sm md:text-base'>
                  Meta Description
                </h4>
                <p className='text-theme-secondary text-sm md:text-base break-words'>
                  {content.seo.metaDescription}
                </p>
              </div>
            )}
            {content.seo.keywords && content.seo.keywords.length > 0 && (
              <div>
                <h4 className='font-semibold text-theme-primary mb-2 text-sm md:text-base'>
                  SEO Keywords
                </h4>
                <div className='flex flex-wrap gap-2'>
                  {content.seo.keywords.map(
                    (keyword: string, index: number) => (
                      <span
                        key={index}
                        className='px-2 py-1 md:px-3 md:py-1 bg-accent-primary/10 text-accent-primary text-xs md:text-sm rounded-full'
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
                <h4 className='font-semibold text-theme-primary text-sm md:text-base'>
                  Canonical URL
                </h4>
                <a
                  href={content.seo.canonicalUrl}
                  className='text-accent-primary hover:text-accent-secondary underline text-sm md:text-base break-all'
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
        <h3 className='font-bold text-theme-primary mb-4 text-sm md:text-base'>
          Scheduling Information
        </h3>
        <div className='bg-accent-primary/5 rounded-xl p-4 md:p-6 border border-theme-tertiary backdrop-blur-sm'>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            {content.scheduling.timezone && (
              <div>
                <h4 className='font-semibold text-theme-primary text-sm md:text-base'>
                  Timezone
                </h4>
                <p className='text-theme-secondary text-sm md:text-base break-words'>
                  {content.scheduling.timezone}
                </p>
              </div>
            )}
            {content.scheduling.frequency && (
              <div>
                <h4 className='font-semibold text-theme-primary text-sm md:text-base'>
                  Frequency
                </h4>
                <p className='text-theme-secondary text-sm md:text-base capitalize'>
                  {content.scheduling.frequency}
                </p>
              </div>
            )}
            {content.scheduling.optimalTimes &&
              content.scheduling.optimalTimes.length > 0 && (
                <div>
                  <h4 className='font-semibold text-theme-primary text-sm md:text-base'>
                    Optimal Times
                  </h4>
                  <div className='space-y-1'>
                    {content.scheduling.optimalTimes.map(
                      (time: string, index: number) => (
                        <p
                          key={index}
                          className='text-theme-secondary text-xs md:text-sm'
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
