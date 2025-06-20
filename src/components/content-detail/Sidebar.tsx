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
    <div className='space-y-6'>
      {/* AI Assistant Card */}
      <AIAssistantCard contentId={content._id} contentTitle={content.title} />

      <AuthorCard author={content.author} />
      <Timeline content={content} />
      <TagsCard tags={content.tags} />
      <PlatformsCard platforms={content.platforms} />

      {/* Attachments */}
      {content.attachments && content.attachments.length > 0 && (
        <div className='bg-white/95 dark:bg-slate-800/90 rounded-2xl shadow-sm border border-white/20 dark:border-slate-700/60 p-6 backdrop-blur-sm'>
          <h3 className='font-bold text-gray-900 dark:text-slate-100 mb-4'>
            Attachments
          </h3>
          <div className='space-y-3'>
            {content.attachments.map(
              (attachment: ContentAttachment, index: number) => (
                <div
                  key={index}
                  className='flex items-center gap-3 p-3 bg-gray-50 dark:bg-slate-700/50 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-600/60 transition-colors group backdrop-blur-sm'
                >
                  <div className='w-10 h-10 bg-blue-100 dark:bg-blue-900/50 rounded-lg flex items-center justify-center'>
                    <span className='text-xs font-bold text-blue-700 dark:text-blue-300'>
                      {attachment.name.split('.').pop()?.toUpperCase()}
                    </span>
                  </div>
                  <div className='flex-1 min-w-0'>
                    <div className='font-medium text-gray-900 dark:text-slate-100 truncate'>
                      {attachment.name}
                    </div>
                    <div className='text-sm text-gray-500 dark:text-slate-400'>
                      {attachment.size}
                    </div>
                  </div>
                  <button className='p-2 text-gray-400 dark:text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors opacity-0 group-hover:opacity-100'>
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
        <div className='bg-white/95 dark:bg-slate-800/90 rounded-2xl shadow-sm border border-white/20 dark:border-slate-700/60 p-6 backdrop-blur-sm'>
          <h3 className='font-bold text-gray-900 dark:text-slate-100 mb-4 flex items-center gap-2'>
            <Sparkles className='w-5 h-5 text-purple-600 dark:text-purple-400' />
            Recommended Content Ideas
          </h3>
          <div className='space-y-4'>
            {content.recommendations
              .slice(0, 3)
              .map((rec: ContentIdea, index: number) => (
                <div
                  key={index}
                  className='p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl border border-purple-100 dark:border-purple-800/30 hover:shadow-md dark:hover:shadow-slate-900/20 transition-all duration-200 backdrop-blur-sm'
                >
                  <h4 className='font-semibold text-gray-900 dark:text-slate-100 mb-2 text-sm'>
                    {rec.title}
                  </h4>
                  <p className='text-gray-700 dark:text-slate-200 text-xs mb-3 line-clamp-2'>
                    {rec.description}
                  </p>
                  <div className='flex items-center justify-between text-xs'>
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
                      <span className='text-gray-600 dark:text-slate-400'>
                        {rec.estimatedEngagement}/10 engagement
                      </span>
                    )}
                  </div>
                </div>
              ))}
            {content.recommendations.length > 3 && (
              <div className='text-center'>
                <span className='text-sm text-gray-500 dark:text-slate-400'>
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
