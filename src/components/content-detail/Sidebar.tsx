import React from 'react';
import { Sparkles, Download } from 'lucide-react';
import {
  ContentData,
  ContentAttachment,
  ContentIdea,
} from '@/src/types/content';
import { AuthorCard } from './AuthorCard';
import { Timeline } from './Timeline';
import { TagsCard } from './TagsCard';
import { PlatformsCard } from './PlatformsCard';
import { AIAssistantCard } from '@/src/components/ai/ai-assistant-card';

interface SidebarProps {
  content: ContentData;
}

export const Sidebar: React.FC<SidebarProps> = ({ content }) => {
  return (
    <div className='space-y-4 md:space-y-6'>
      {/* AI Assistant Card */}
      <AIAssistantCard contentId={content._id} contentTitle={content.title} />

      <AuthorCard author={content.author} />
      <Timeline content={content} />
      <TagsCard tags={content.tags} />
      <PlatformsCard platforms={content.platforms} />

      {/* Attachments */}
      {content.attachments && content.attachments.length > 0 && (
        <div className='bg-theme-card/95 rounded-2xl shadow-sm border border-theme-tertiary p-4 md:p-6 backdrop-blur-sm'>
          <h3 className='font-bold text-theme-primary mb-4 text-sm md:text-base'>
            Attachments
          </h3>
          <div className='space-y-3'>
            {content.attachments.map(
              (attachment: ContentAttachment, index: number) => (
                <div
                  key={index}
                  className='flex items-center gap-3 p-3 bg-theme-secondary rounded-xl hover:bg-theme-hover transition-colors group backdrop-blur-sm'
                >
                  <div className='w-8 h-8 md:w-10 md:h-10 bg-blue-100 dark:bg-blue-900/50 rounded-lg flex items-center justify-center flex-shrink-0'>
                    <span className='text-xs font-bold text-blue-700 dark:text-blue-300'>
                      {attachment.name.split('.').pop()?.toUpperCase()}
                    </span>
                  </div>
                  <div className='flex-1 min-w-0'>
                    <div className='font-medium text-theme-primary truncate text-sm md:text-base'>
                      {attachment.name}
                    </div>
                    <div className='text-xs md:text-sm text-theme-secondary'>
                      {attachment.size}
                    </div>
                  </div>
                  <button className='p-2 text-theme-muted hover:text-accent-primary transition-colors opacity-0 group-hover:opacity-100'>
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
        <div className='bg-theme-card/95 rounded-2xl shadow-sm border border-theme-tertiary p-4 md:p-6 backdrop-blur-sm'>
          <h3 className='font-bold text-theme-primary mb-4 flex items-center gap-2 text-sm md:text-base'>
            <Sparkles className='w-4 h-4 md:w-5 md:h-5 text-accent-primary' />
            Recommended Content Ideas
          </h3>
          <div className='space-y-3 md:space-y-4'>
            {content.recommendations
              .slice(0, 3)
              .map((rec: ContentIdea, index: number) => (
                <div
                  key={index}
                  className='p-3 md:p-4 bg-accent-primary/5 rounded-xl border border-accent-primary/20 hover:shadow-md transition-all duration-200 backdrop-blur-sm'
                >
                  <h4 className='font-semibold text-theme-primary mb-2 text-sm md:text-base break-words'>
                    {rec.title}
                  </h4>
                  <p className='text-theme-secondary text-xs md:text-sm mb-3 line-clamp-2 break-words'>
                    {rec.description}
                  </p>
                  <div className='flex items-center justify-between text-xs md:text-sm'>
                    {rec.difficulty && (
                      <span
                        className={`px-2 py-1 rounded-full font-medium ${
                          rec.difficulty === 'easy'
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
                            : rec.difficulty === 'moderate'
                            ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300'
                            : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
                        }`}
                      >
                        {rec.difficulty}
                      </span>
                    )}
                    {rec.estimatedEngagement && (
                      <span className='text-theme-secondary'>
                        {rec.estimatedEngagement}/10 engagement
                      </span>
                    )}
                  </div>
                </div>
              ))}
            {content.recommendations.length > 3 && (
              <div className='text-center'>
                <span className='text-xs md:text-sm text-theme-secondary'>
                  +{content.recommendations.length - 3} more recommendations
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
