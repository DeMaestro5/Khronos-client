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
      <div className='border-b border-theme-secondary'>
        <div className='flex overflow-x-auto scrollbar-hide'>
          <button
            onClick={() => setActiveTab('content')}
            className={`flex-shrink-0 px-4 lg:px-6 py-4 font-medium transition-all duration-200 whitespace-nowrap ${
              activeTab === 'content'
                ? 'text-accent-primary border-b-2 border-accent-primary bg-accent-primary/10'
                : 'text-theme-secondary hover:text-theme-primary hover:bg-theme-hover'
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
                  ? 'text-accent-primary border-b-2 border-accent-primary bg-accent-primary/10'
                  : 'text-theme-secondary hover:text-theme-primary hover:bg-theme-hover'
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
                  ? 'text-accent-primary border-b-2 border-accent-primary bg-accent-primary/10'
                  : 'text-theme-secondary hover:text-theme-primary hover:bg-theme-hover'
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
                  ? 'text-accent-primary border-b-2 border-accent-primary bg-accent-primary/10'
                  : 'text-theme-secondary hover:text-theme-primary hover:bg-theme-hover'
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
                ? 'text-accent-primary border-b-2 border-accent-primary bg-accent-primary/10'
                : 'text-theme-secondary hover:text-theme-primary hover:bg-theme-hover'
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
      <div className='bg-accent-primary/5 rounded-xl p-6 border border-theme-tertiary backdrop-blur-sm'>
        <h3 className='font-bold text-theme-primary mb-3 flex items-center gap-2'>
          <Sparkles className='w-5 h-5 text-accent-primary' />
          Alternative Title
        </h3>
        <p className='text-theme-primary text-lg font-medium'>
          {suggestions.title}
        </p>
      </div>
    )}

    {suggestions.description && (
      <div className='bg-accent-primary/5 rounded-xl p-6 border border-theme-tertiary backdrop-blur-sm'>
        <h3 className='font-bold text-theme-primary mb-3'>
          Alternative Description
        </h3>
        <p className='text-theme-secondary'>{suggestions.description}</p>
      </div>
    )}

    {suggestions.keywords && suggestions.keywords.length > 0 && (
      <div>
        <h3 className='font-bold text-theme-primary mb-4'>
          Suggested Keywords
        </h3>
        <div className='flex flex-wrap gap-2'>
          {suggestions.keywords.map((keyword: string, index: number) => (
            <span
              key={index}
              className='px-4 py-2 bg-accent-primary/10 text-accent-primary rounded-full text-sm font-medium border border-accent-primary/20'
            >
              {keyword}
            </span>
          ))}
        </div>
      </div>
    )}

    {suggestions.hashtags && suggestions.hashtags.length > 0 && (
      <div>
        <h3 className='font-bold text-theme-primary mb-4'>
          Suggested Hashtags
        </h3>
        <div className='flex flex-wrap gap-2'>
          {suggestions.hashtags.map((hashtag: string, index: number) => (
            <span
              key={index}
              className='px-3 py-2 bg-accent-primary/10 text-accent-primary rounded-lg text-sm font-medium border border-accent-primary/20'
            >
              {hashtag}
            </span>
          ))}
        </div>
      </div>
    )}

    {suggestions.improvements && suggestions.improvements.length > 0 && (
      <div>
        <h3 className='font-bold text-theme-primary mb-4'>
          Improvement Suggestions
        </h3>
        <div className='space-y-3'>
          {suggestions.improvements.map(
            (improvement: string, index: number) => (
              <div
                key={index}
                className='flex items-start gap-3 p-4 bg-accent-primary/5 rounded-xl border border-theme-tertiary backdrop-blur-sm'
              >
                <div className='w-6 h-6 bg-accent-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5'>
                  <span className='text-accent-primary text-sm font-bold'>
                    {index + 1}
                  </span>
                </div>
                <p className='text-theme-primary'>{improvement}</p>
              </div>
            )
          )}
        </div>
      </div>
    )}

    {suggestions.estimatedReach && (
      <div className='bg-accent-primary/5 rounded-xl p-6 border border-theme-tertiary backdrop-blur-sm'>
        <h3 className='font-bold text-theme-primary mb-3'>Estimated Reach</h3>
        <p className='text-2xl font-bold text-accent-primary'>
          {suggestions.estimatedReach.toLocaleString()} people
        </p>
      </div>
    )}

    {suggestions.competitorAnalysis &&
      suggestions.competitorAnalysis.length > 0 && (
        <div>
          <h3 className='font-bold text-theme-primary mb-4'>
            Competitor Analysis
          </h3>
          <div className='space-y-3'>
            {suggestions.competitorAnalysis.map(
              (analysis: string, index: number) => (
                <div
                  key={index}
                  className='p-4 bg-theme-secondary/10 rounded-xl border border-theme-tertiary'
                >
                  <p className='text-theme-secondary'>{analysis}</p>
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
          className='bg-theme-secondary/5 rounded-xl p-6 border border-theme-tertiary backdrop-blur-sm'
        >
          <div className='flex items-center gap-3 mb-4'>
            <div className='w-8 h-8 bg-accent-primary rounded-lg flex items-center justify-center text-white font-bold text-sm'>
              {platform.charAt(0).toUpperCase()}
            </div>
            <h3 className='font-bold text-theme-primary capitalize'>
              {platform} Optimized Content
            </h3>
          </div>
          <div className='bg-theme-card rounded-lg p-4 border border-theme-tertiary backdrop-blur-sm'>
            <pre className='whitespace-pre-wrap text-sm text-theme-secondary font-mono'>
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
          className='bg-accent-primary/5 rounded-xl p-6 border border-theme-tertiary backdrop-blur-sm'
        >
          <div className='flex items-start gap-4 mb-4'>
            <div className='w-8 h-8 bg-accent-primary rounded-full flex items-center justify-center text-white font-bold text-sm'>
              {index + 1}
            </div>
            <div className='flex-1'>
              <h3 className='font-bold text-theme-primary text-lg mb-2'>
                {idea.title}
              </h3>
              <p className='text-theme-secondary mb-4'>{idea.description}</p>
              {idea.excerpt && (
                <div className='bg-theme-card rounded-lg p-4 border border-theme-tertiary mb-4 backdrop-blur-sm'>
                  <h4 className='font-semibold text-theme-primary mb-2'>
                    Excerpt
                  </h4>
                  <p className='text-theme-secondary text-sm italic'>
                    {idea.excerpt}
                  </p>
                </div>
              )}
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4 text-sm'>
                {idea.targetAudience && (
                  <div>
                    <span className='font-semibold text-theme-primary'>
                      Target Audience:
                    </span>
                    <p className='text-theme-secondary'>
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
                    <p className='text-theme-secondary'>{idea.timeToCreate}</p>
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
                  <h4 className='font-semibold text-theme-primary mb-2'>
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

// Analytics Tab Component
const AnalyticsTab: React.FC<{ content: ContentData }> = ({ content }) => (
  <div className='space-y-8'>
    {/* Performance Metrics */}
    <div>
      <h3 className='font-bold text-theme-primary mb-4 flex items-center gap-2'>
        <TrendingUp className='w-5 h-5 text-accent-primary' />
        Performance Metrics
      </h3>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
        {content.analytics && (
          <>
            <div className='bg-accent-primary/5 rounded-xl p-4 border border-theme-tertiary backdrop-blur-sm'>
              <div className='text-2xl font-bold text-accent-primary'>
                {content.analytics.impressions?.toLocaleString() || 0}
              </div>
              <div className='text-sm text-theme-secondary'>Impressions</div>
            </div>
            <div className='bg-accent-primary/5 rounded-xl p-4 border border-theme-tertiary backdrop-blur-sm'>
              <div className='text-2xl font-bold text-accent-primary'>
                {content.analytics.reach?.toLocaleString() || 0}
              </div>
              <div className='text-sm text-theme-secondary'>Reach</div>
            </div>
            <div className='bg-accent-primary/5 rounded-xl p-4 border border-theme-tertiary backdrop-blur-sm'>
              <div className='text-2xl font-bold text-accent-primary'>
                {content.analytics.engagementRate?.toFixed(2) || 0}%
              </div>
              <div className='text-sm text-theme-secondary'>
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
        <h3 className='font-bold text-theme-primary mb-4'>
          Engagement Breakdown
        </h3>
        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4'>
          <div className='bg-accent-primary/5 rounded-xl p-4 border border-theme-tertiary text-center backdrop-blur-sm'>
            <div className='text-2xl font-bold text-accent-primary'>
              {content.engagement.likes || 0}
            </div>
            <div className='text-sm text-theme-secondary'>Likes</div>
          </div>
          <div className='bg-accent-primary/5 rounded-xl p-4 border border-theme-tertiary text-center backdrop-blur-sm'>
            <div className='text-2xl font-bold text-accent-primary'>
              {content.engagement.shares || 0}
            </div>
            <div className='text-sm text-theme-secondary'>Shares</div>
          </div>
          <div className='bg-accent-primary/5 rounded-xl p-4 border border-theme-tertiary text-center backdrop-blur-sm'>
            <div className='text-2xl font-bold text-accent-primary'>
              {content.engagement.comments || 0}
            </div>
            <div className='text-sm text-theme-secondary'>Comments</div>
          </div>
          <div className='bg-accent-primary/5 rounded-xl p-4 border border-theme-tertiary text-center backdrop-blur-sm'>
            <div className='text-2xl font-bold text-accent-primary'>
              {content.engagement.saves || 0}
            </div>
            <div className='text-sm text-theme-secondary'>Saves</div>
          </div>
          <div className='bg-accent-primary/5 rounded-xl p-4 border border-theme-tertiary text-center backdrop-blur-sm'>
            <div className='text-2xl font-bold text-accent-primary'>
              {content.engagement.clicks || 0}
            </div>
            <div className='text-sm text-theme-secondary'>Clicks</div>
          </div>
        </div>
      </div>
    )}

    {/* SEO Information */}
    {content.seo && (
      <div>
        <h3 className='font-bold text-theme-primary mb-4'>SEO Information</h3>
        <div className='bg-accent-primary/5 rounded-xl p-6 border border-theme-tertiary backdrop-blur-sm'>
          <div className='space-y-4'>
            {content.seo.metaTitle && (
              <div>
                <h4 className='font-semibold text-theme-primary'>Meta Title</h4>
                <p className='text-theme-secondary'>{content.seo.metaTitle}</p>
              </div>
            )}
            {content.seo.metaDescription && (
              <div>
                <h4 className='font-semibold text-theme-primary'>
                  Meta Description
                </h4>
                <p className='text-theme-secondary'>
                  {content.seo.metaDescription}
                </p>
              </div>
            )}
            {content.seo.keywords && content.seo.keywords.length > 0 && (
              <div>
                <h4 className='font-semibold text-theme-primary mb-2'>
                  SEO Keywords
                </h4>
                <div className='flex flex-wrap gap-2'>
                  {content.seo.keywords.map(
                    (keyword: string, index: number) => (
                      <span
                        key={index}
                        className='px-3 py-1 bg-accent-primary/10 text-accent-primary text-sm rounded-full'
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
                <h4 className='font-semibold text-theme-primary'>
                  Canonical URL
                </h4>
                <a
                  href={content.seo.canonicalUrl}
                  className='text-accent-primary hover:text-accent-secondary underline'
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
        <h3 className='font-bold text-theme-primary mb-4'>
          Scheduling Information
        </h3>
        <div className='bg-accent-primary/5 rounded-xl p-6 border border-theme-tertiary backdrop-blur-sm'>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            {content.scheduling.timezone && (
              <div>
                <h4 className='font-semibold text-theme-primary'>Timezone</h4>
                <p className='text-theme-secondary'>
                  {content.scheduling.timezone}
                </p>
              </div>
            )}
            {content.scheduling.frequency && (
              <div>
                <h4 className='font-semibold text-theme-primary'>Frequency</h4>
                <p className='text-theme-secondary capitalize'>
                  {content.scheduling.frequency}
                </p>
              </div>
            )}
            {content.scheduling.optimalTimes &&
              content.scheduling.optimalTimes.length > 0 && (
                <div>
                  <h4 className='font-semibold text-theme-primary'>
                    Optimal Times
                  </h4>
                  <div className='space-y-1'>
                    {content.scheduling.optimalTimes.map(
                      (time: string, index: number) => (
                        <p key={index} className='text-theme-secondary text-sm'>
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
