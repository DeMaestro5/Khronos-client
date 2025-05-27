import React from 'react';
import {
  Plus,
  Calendar,
  Clock,
  X,
  Edit3,
  Trash2,
  Eye,
  MoreHorizontal,
} from 'lucide-react';

type Platform = {
  id: 'instagram' | 'youtube' | 'twitter' | 'linkedin' | 'tiktok' | 'facebook';
};

type ContentItem = {
  platform: Platform['id'];
  title: string;
  time: string;
  type: string;
  status: string;
};

interface ContentModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: string | null;
  content: ContentItem[];
  onCreateContent?: () => void;
  animatingOut: boolean;
}

const PlatformIcons: Record<Platform['id'], () => React.ReactElement> = {
  instagram: () => (
    <div className='w-4 h-4 bg-gradient-to-r from-pink-500 to-orange-500 rounded-full shadow-sm' />
  ),
  youtube: () => <div className='w-4 h-4 bg-red-500 rounded-full shadow-sm' />,
  twitter: () => <div className='w-4 h-4 bg-blue-400 rounded-full shadow-sm' />,
  linkedin: () => (
    <div className='w-4 h-4 bg-blue-600 rounded-full shadow-sm' />
  ),
  tiktok: () => (
    <div className='w-4 h-4 bg-gradient-to-r from-black to-pink-500 rounded-full shadow-sm' />
  ),
  facebook: () => (
    <div className='w-4 h-4 bg-blue-600 rounded-full shadow-sm' />
  ),
};

const platformColors: Record<Platform['id'], string> = {
  instagram: 'from-pink-500 to-orange-500',
  linkedin: 'from-blue-600 to-blue-700',
  tiktok: 'from-black to-pink-600',
  twitter: 'from-blue-400 to-blue-600',
  youtube: 'from-red-500 to-red-600',
  facebook: 'from-blue-600 to-blue-700',
};

const platformNames: Record<Platform['id'], string> = {
  instagram: 'Instagram',
  youtube: 'YouTube',
  twitter: 'Twitter',
  linkedin: 'LinkedIn',
  tiktok: 'TikTok',
  facebook: 'Facebook',
};

const getStatusBadgeColor = (status: string) => {
  switch (status) {
    case 'scheduled':
      return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
    case 'draft':
      return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
    case 'published':
      return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
    default:
      return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
  }
};

export default function ContentModal({
  isOpen,
  onClose,
  selectedDate,
  content,
  onCreateContent,
  animatingOut,
}: ContentModalProps) {
  if (!isOpen || !selectedDate) return null;

  const date = new Date(selectedDate);
  const formattedDate = date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-all duration-200 ${
        animatingOut ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <div
        className={`bg-gray-900/95 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden transform transition-all duration-200 ${
          animatingOut ? 'scale-95 opacity-0' : 'scale-100 opacity-100'
        }`}
      >
        {/* Modal Header */}
        <div className='flex items-center justify-between p-6 bg-gradient-to-r from-purple-600/20 to-pink-600/20 border-b border-white/10'>
          <div className='flex items-center space-x-3'>
            <div className='p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl'>
              <Calendar className='w-5 h-5 text-white' />
            </div>
            <div>
              <h2 className='text-xl font-bold text-white'>{formattedDate}</h2>
              <p className='text-sm text-slate-300'>
                {content.length} scheduled{' '}
                {content.length === 1 ? 'post' : 'posts'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className='p-2 hover:bg-white/10 rounded-xl transition-all duration-200 text-slate-400 hover:text-white hover:scale-110'
          >
            <X className='w-5 h-5' />
          </button>
        </div>

        {/* Modal Content */}
        <div className='p-6 overflow-y-auto max-h-[60vh]'>
          <div className='space-y-4'>
            {content.map((item, idx) => {
              const IconComponent = PlatformIcons[item.platform];
              return (
                <div
                  key={`${item.title}-${idx}`}
                  className='group bg-white/5 hover:bg-white/10 rounded-2xl p-4 transition-all duration-300 hover:scale-[1.02] border border-white/10 hover:border-white/20'
                >
                  <div className='flex items-start justify-between space-x-4'>
                    <div className='flex items-start space-x-4 flex-1 min-w-0'>
                      {/* Platform Icon */}
                      <div
                        className={`flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-r ${
                          platformColors[item.platform]
                        } shadow-lg flex-shrink-0`}
                      >
                        {IconComponent && <IconComponent />}
                      </div>

                      {/* Content Details */}
                      <div className='flex-1 min-w-0'>
                        <div className='flex items-center space-x-3 mb-2'>
                          <h3 className='text-white font-semibold text-lg truncate'>
                            {item.title}
                          </h3>
                          <span
                            className={`px-3 py-1 text-xs font-medium rounded-full border ${getStatusBadgeColor(
                              item.status
                            )}`}
                          >
                            {item.status.charAt(0).toUpperCase() +
                              item.status.slice(1)}
                          </span>
                        </div>

                        <div className='flex items-center space-x-4 text-sm text-slate-400 mb-3'>
                          <span className='flex items-center space-x-1'>
                            <Clock className='w-4 h-4' />
                            <span className='font-medium'>{item.time}</span>
                          </span>
                          <span className='px-2 py-1 bg-white/10 rounded-lg'>
                            {platformNames[item.platform]}
                          </span>
                          <span className='px-2 py-1 bg-white/10 rounded-lg'>
                            {item.type}
                          </span>
                        </div>

                        {/* Progress Bar for Scheduled Items */}
                        {item.status === 'scheduled' && (
                          <div className='mb-3'>
                            <div className='flex items-center justify-between text-xs text-slate-400 mb-1'>
                              <span>Scheduled to publish</span>
                              <span className='text-emerald-400'>Ready</span>
                            </div>
                            <div className='w-full bg-white/10 rounded-full h-1.5'>
                              <div className='bg-gradient-to-r from-emerald-500 to-emerald-400 h-1.5 rounded-full w-full'></div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className='flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200'>
                      <button className='p-2 hover:bg-white/10 rounded-lg transition-all duration-200 text-slate-400 hover:text-white hover:scale-110'>
                        <Eye className='w-4 h-4' />
                      </button>
                      <button className='p-2 hover:bg-white/10 rounded-lg transition-all duration-200 text-slate-400 hover:text-white hover:scale-110'>
                        <Edit3 className='w-4 h-4' />
                      </button>
                      <button className='p-2 hover:bg-white/10 rounded-lg transition-all duration-200 text-slate-400 hover:text-red-400 hover:scale-110'>
                        <Trash2 className='w-4 h-4' />
                      </button>
                      <button className='p-2 hover:bg-white/10 rounded-lg transition-all duration-200 text-slate-400 hover:text-white hover:scale-110'>
                        <MoreHorizontal className='w-4 h-4' />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Modal Footer */}
        <div className='p-2 bg-white/5 border-t border-white/10 flex items-center justify-between'>
          <div className='text-sm text-slate-400'>
            {content.filter((item) => item.status === 'scheduled').length}{' '}
            scheduled •{' '}
            {content.filter((item) => item.status === 'draft').length} drafts
          </div>
          <div className='flex items-center space-x-3'>
            <button
              onClick={onCreateContent}
              className='flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-xl text-white font-medium transition-all duration-300 hover:scale-105'
            >
              <Plus className='w-4 h-4' />
              <span>Add More</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
