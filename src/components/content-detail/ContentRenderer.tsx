import React from 'react';
import { FileText, Sparkles } from 'lucide-react';
import { ContentBody, ContentSection } from '@/src/types/content';

interface ContentRendererProps {
  body: ContentBody | undefined;
}

export const ContentRenderer: React.FC<ContentRendererProps> = ({ body }) => {
  if (!body?.sections || body.sections.length === 0) {
    return (
      <div className='text-theme-secondary text-center py-8'>
        <FileText className='w-12 h-12 mx-auto mb-4 text-theme-secondary' />
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
                <h1
                  key={index}
                  className='text-3xl font-bold text-theme-primary'
                >
                  {typeof section.content === 'string' ? section.content : ''}
                </h1>
              );
            } else if (level === 2) {
              return (
                <h2
                  key={index}
                  className='text-2xl font-bold text-theme-primary'
                >
                  {typeof section.content === 'string' ? section.content : ''}
                </h2>
              );
            } else if (level === 3) {
              return (
                <h3
                  key={index}
                  className='text-xl font-bold text-theme-primary'
                >
                  {typeof section.content === 'string' ? section.content : ''}
                </h3>
              );
            } else {
              return (
                <h4
                  key={index}
                  className='text-lg font-bold text-theme-primary'
                >
                  {typeof section.content === 'string' ? section.content : ''}
                </h4>
              );
            }

          case 'paragraph':
            return (
              <p key={index} className='text-theme-secondary leading-relaxed'>
                {typeof section.content === 'string' ? section.content : ''}
              </p>
            );

          case 'list':
            const ListTag = section.style === 'numbered' ? 'ol' : 'ul';
            return (
              <ListTag
                key={index}
                className={`space-y-2 text-theme-secondary ${
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
                className={`p-4 rounded-xl border backdrop-blur-sm ${
                  section.style === 'tip'
                    ? 'bg-accent-primary/5 border-accent-primary/20'
                    : section.style === 'warning'
                    ? 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800/30'
                    : 'bg-theme-secondary/10 border-theme-primary/20'
                }`}
              >
                {section.title && (
                  <h4 className='font-semibold text-theme-primary mb-2 flex items-center gap-2'>
                    {section.style === 'tip' && (
                      <Sparkles className='w-4 h-4 text-accent-primary' />
                    )}
                    {section.title}
                  </h4>
                )}
                <p className='text-theme-secondary'>
                  {typeof section.content === 'string' ? section.content : ''}
                </p>
              </div>
            );

          case 'section':
            return (
              <section key={index} className='space-y-4'>
                {section.title && (
                  <h3 className='text-xl font-bold text-theme-primary'>
                    {section.title}
                  </h3>
                )}
                {typeof section.content === 'string' ? (
                  <p className='text-theme-secondary leading-relaxed'>
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
        <div className='border-t border-theme-primary/20 pt-6 mt-8'>
          <div className='flex items-center gap-4 text-sm text-theme-secondary'>
            <span>{body.wordCount} words</span>
            <span>•</span>
            <span>{body.readingTime}</span>
          </div>
        </div>
      )}
    </div>
  );
};
