import { Grid3X3 } from 'lucide-react';
import { Heart } from 'lucide-react';
import { List } from 'lucide-react';
import React from 'react';
import QuickAction from '../quick-action';

const contentItems = [
  {
    id: 1,
    title: 'Summer Campaign Launch',
    date: 'May 23',
    time: '9:00 AM',
    platform: 'Instagram',
    type: 'Video',
    status: 'scheduled',
    engagement: '2.4K',
  },
  {
    id: 2,
    title: 'Product Feature Highlight',
    date: 'May 24',
    time: '2:30 PM',
    platform: 'LinkedIn',
    type: 'Carousel',
    status: 'draft',
    engagement: '1.8K',
  },
  {
    id: 3,
    title: 'Behind the Scenes',
    date: 'May 25',
    time: '11:15 AM',
    platform: 'TikTok',
    type: 'Video',
    status: 'scheduled',
    engagement: '3.2K',
  },
  {
    id: 4,
    title: 'Customer Success Story',
    date: 'May 26',
    time: '4:00 PM',
    platform: 'Twitter',
    type: 'Thread',
    status: 'review',
    engagement: '956',
  },
];

export default function CalendarSidebar({
  platformColors,
}: {
  platformColors: { [key: string]: string };
}) {
  return (
    <div className='space-y-6'>
      {/* Upcoming Content */}
      <div className='bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-6 hover:bg-white/15 transition-all duration-500'>
        <div className='flex items-center justify-between mb-6'>
          <h3 className='text-xl font-bold text-white'>Upcoming Content</h3>
          <div className='flex items-center space-x-2'>
            <button className='p-2 bg-white/10 rounded-xl hover:bg-white/20 transition-colors'>
              <Grid3X3 className='h-4 w-4 text-white' />
            </button>
            <button className='p-2 bg-white/10 rounded-xl hover:bg-white/20 transition-colors'>
              <List className='h-4 w-4 text-white' />
            </button>
          </div>
        </div>

        <div className='space-y-4'>
          {contentItems.map((item, index) => (
            <div
              key={item.id}
              className='group flex items-start space-x-4 p-4 bg-white/5 rounded-2xl hover:bg-white/10 transition-all duration-300 hover:scale-102 cursor-pointer'
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div
                className={`w-3 h-3 rounded-full bg-gradient-to-r ${
                  platformColors[item.platform]
                } mt-2 group-hover:scale-125 transition-transform duration-300`}
              ></div>
              <div className='flex-1 min-w-0'>
                <h4 className='font-semibold text-white truncate group-hover:text-purple-200 transition-colors'>
                  {item.title}
                </h4>
                <div className='flex items-center space-x-2 mt-1'>
                  <span className='text-sm text-slate-300'>{item.date}</span>
                  <span className='text-sm text-slate-400'>•</span>
                  <span className='text-sm text-slate-300'>{item.time}</span>
                </div>
                <div className='flex items-center justify-between mt-2'>
                  <span className='text-xs font-medium text-purple-300 bg-purple-500/20 px-2 py-1 rounded-lg'>
                    {item.platform}
                  </span>
                  <div className='flex items-center space-x-1 text-sm text-slate-300'>
                    <Heart className='h-3 w-3' />
                    <span>{item.engagement}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <QuickAction />
    </div>
  );
}
