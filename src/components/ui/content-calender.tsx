'use client';

import { motion } from 'framer-motion';
import Image, { StaticImageData } from 'next/image';
import { useState } from 'react';

// Import platform icons
import instagramIcon from '../../assets/instagramIcon.jpg';
import youtubeIcon from '../../assets/youtubeIcon.png';
import facebookIcon from '../../assets/facebook-new.png';
import tiktokIcon from '../../assets/tiktokIcon.png';

interface Post {
  id: number;
  type: 'instagram' | 'youtube' | 'facebook' | 'tiktok';
  title: string;
  time: string;
  color: string;
  engagement: string;
}

type ContentData = {
  [key: string]: Post[];
};

type PlatformIcons = {
  [K in Post['type']]: string | StaticImageData;
};

const ContentCalendar = () => {
  const [currentDate] = useState(new Date());
  const [hoveredPost, setHoveredPost] = useState<Post | null>(null);

  // Sample content data
  const contentData: ContentData = {
    '2025-05-22': [
      {
        id: 1,
        type: 'instagram',
        title: 'Product Launch',
        time: '9:00 AM',
        color: 'bg-pink-400',
        engagement: '2.4K likes',
      },
    ],
    '2025-05-23': [
      {
        id: 3,
        type: 'tiktok',
        title: 'Quick Tips',
        time: '11:00 AM',
        color: 'bg-cyan-400',
        engagement: '890 retweets',
      },
    ],
    '2025-05-24': [
      {
        id: 4,
        type: 'youtube',
        title: 'Tutorial Video',
        time: '3:00 PM',
        color: 'bg-red-500',
        engagement: '5.2K views',
      },
      {
        id: 5,
        type: 'instagram',
        title: 'Behind Scenes',
        time: '6:00 PM',
        color: 'bg-purple-400',
        engagement: '1.8K likes',
      },
    ],
    '2025-05-25': [
      {
        id: 6,
        type: 'tiktok',
        title: 'Case Study',
        time: '10:00 AM',
        color: 'bg-blue-500',
        engagement: '234 shares',
      },
    ],
    '2025-05-26': [
      {
        id: 7,
        type: 'instagram',
        title: 'User Generated',
        time: '1:00 PM',
        color: 'bg-gradient-to-r from-pink-400 to-purple-500',
        engagement: '3.1K likes',
      },
      {
        id: 8,
        type: 'facebook',
        title: 'Thread Story',
        time: '4:00 PM',
        color: 'bg-cyan-400',
        engagement: '1.2K replies',
      },
    ],
  };

  // Platform icons
  const platformIcons: PlatformIcons = {
    instagram: instagramIcon,
    youtube: youtubeIcon,
    facebook: facebookIcon,
    tiktok: tiktokIcon,
  };

  const renderPlatformIcon = (type: Post['type']) => {
    const icon = platformIcons[type];
    if (typeof icon === 'string') {
      return icon;
    }
    return <Image src={icon} alt={type} width={20} height={20} />;
  };

  // Get days in current month
  const getDaysInMonth = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }

    return days;
  };

  const formatDateKey = (day: number) => {
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const dayStr = String(day).padStart(2, '0');
    return `${year}-${month}-${dayStr}`;
  };

  const isToday = (day: number | null) => {
    if (day === null) return false;
    const today = new Date();
    return (
      day === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear()
    );
  };

  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className='bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 max-w-md mx-auto'>
      {/* Calendar Header */}
      <div className='flex items-center justify-between mb-4'>
        <div>
          <h3 className='text-lg font-semibold text-slate-800'>
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h3>
          <p className='text-sm text-slate-500'>Content Calendar</p>
        </div>
        <div className='flex items-center space-x-2'>
          <div className='w-2 h-2 bg-green-400 rounded-full animate-pulse'></div>
          <span className='text-xs text-slate-500'>Live</span>
        </div>
      </div>

      {/* Week Days Header */}
      <div className='grid grid-cols-7 gap-1 mb-2'>
        {weekDays.map((day) => (
          <div
            key={day}
            className='text-center text-xs font-medium text-slate-500 py-2'
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className='grid grid-cols-7 gap-1'>
        {getDaysInMonth().map((day, index) => {
          const dateKey = day ? formatDateKey(day) : null;
          const dayContent = dateKey ? contentData[dateKey] : null;
          const hasContent = dayContent && dayContent.length > 0;

          return (
            <motion.div
              key={index}
              className={`
                relative aspect-square p-1 rounded-lg text-center text-sm
                ${day ? 'hover:bg-slate-50' : ''}
                ${isToday(day) ? 'bg-indigo-50 border-2 border-indigo-200' : ''}
                ${hasContent ? 'cursor-pointer' : ''}
              `}
              whileHover={hasContent ? { scale: 1.05 } : {}}
              transition={{ duration: 0.2 }}
            >
              {day && (
                <>
                  <div
                    className={`
                    text-xs font-medium mb-1
                    ${
                      isToday(day)
                        ? 'text-indigo-600 font-bold'
                        : 'text-slate-700'
                    }
                  `}
                  >
                    {day}
                  </div>

                  {/* Content Indicators */}
                  {hasContent && (
                    <div className='space-y-0.5'>
                      {dayContent.slice(0, 2).map((post: Post, idx: number) => (
                        <motion.div
                          key={post.id}
                          className={`
                            h-1.5 rounded-full mx-0.5 ${post.color}
                            ${post.color.includes('gradient') ? '' : ''}
                          `}
                          initial={{ width: 0 }}
                          animate={{ width: '100%' }}
                          transition={{ duration: 0.5, delay: idx * 0.1 }}
                          onHoverStart={() => setHoveredPost(post)}
                          onHoverEnd={() => setHoveredPost(null)}
                        />
                      ))}
                      {dayContent.length > 2 && (
                        <div className='text-xs text-slate-400 font-medium'>
                          +{dayContent.length - 2}
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Stats Footer */}
      <motion.div
        className='mt-4 pt-4 border-t border-slate-100 flex justify-between text-xs'
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <div className='text-center'>
          <div className='font-semibold text-slate-800'>28</div>
          <div className='text-slate-500'>Posts</div>
        </div>
        <div className='text-center'>
          <div className='font-semibold text-slate-800'>5</div>
          <div className='text-slate-500'>Platforms</div>
        </div>
        <div className='text-center'>
          <div className='font-semibold text-slate-800'>12.4K</div>
          <div className='text-slate-500'>Engagement</div>
        </div>
      </motion.div>

      {/* Hover Tooltip */}
      {hoveredPost && (
        <motion.div
          className='absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-slate-800 text-white p-3 rounded-lg shadow-xl z-10 min-w-48'
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
        >
          <div className='flex items-center space-x-2 mb-1'>
            <span>{renderPlatformIcon(hoveredPost.type)}</span>
            <span className='font-medium'>{hoveredPost.title}</span>
          </div>
          <div className='text-xs text-slate-300'>{hoveredPost.time}</div>
          <div className='text-xs text-green-300 mt-1'>
            {hoveredPost.engagement}
          </div>
          <div className='absolute bottom-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-b-slate-800'></div>
        </motion.div>
      )}

      {/* Platform Legend */}
      <motion.div
        className='mt-4 flex justify-center space-x-3'
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
      >
        {Object.entries(platformIcons)
          .slice(0, 4)
          .map(([platform]) => (
            <motion.div
              key={platform}
              className='flex items-center space-x-1 text-xs text-slate-500'
              whileHover={{ scale: 1.1 }}
            >
              <span>{renderPlatformIcon(platform as Post['type'])}</span>
              <span className='capitalize'>{platform}</span>
            </motion.div>
          ))}
      </motion.div>
    </div>
  );
};

export default ContentCalendar;
