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
