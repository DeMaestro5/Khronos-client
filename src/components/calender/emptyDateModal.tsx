import React from 'react';
import { Plus, Calendar, X } from 'lucide-react';

export default function EmptyDateModal({
  isOpen,
  onClose,
  selectedDate,
  onCreateContent,
  animatingOut,
}: {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: string | null;
  onCreateContent?: () => void;
  animatingOut: boolean;
}) {
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
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-all duration-300 ${
        animatingOut ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <div
        className={`bg-gray-900/95 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl max-w-md w-full overflow-hidden transform transition-all duration-300 ${
          animatingOut
            ? 'scale-90 opacity-0 translate-y-8'
            : 'scale-100 opacity-100 translate-y-0'
        }`}
      >
        {/* Modal Header */}
        <div className='flex items-center justify-between p-6 bg-gradient-to-r from-slate-600/20 to-slate-500/20 border-b border-white/10'>
          <div className='flex items-center space-x-3'>
            <div className='p-2 bg-gradient-to-r from-slate-500 to-slate-600 rounded-xl'>
              <Calendar className='w-5 h-5 text-white' />
            </div>
            <div>
              <h2 className='text-xl font-bold text-white'>{formattedDate}</h2>
              <p className='text-sm text-slate-400'>No content scheduled</p>
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
        <div className='p-8 text-center'>
          {/* Empty State Animation */}
          <div className='mb-6 relative'>
            <div className='w-24 h-24 mx-auto bg-gradient-to-br from-slate-600/20 to-slate-700/20 rounded-full flex items-center justify-center border-2 border-slate-500/30 relative overflow-hidden'>
              <Calendar className='w-12 h-12 text-slate-400' />

              {/* Animated ripple effect */}
              <div className='absolute inset-0 rounded-full border-2 border-slate-400/20 animate-ping'></div>
              <div className='absolute inset-2 rounded-full border border-slate-400/10 animate-pulse delay-100'></div>
            </div>
          </div>

          <h3 className='text-2xl font-bold text-white mb-3'>
            No Content Scheduled
          </h3>

          <p className='text-slate-400 mb-8 leading-relaxed'>
            You haven&apos;t scheduled any content for this date yet.
            <br />
            Start creating engaging posts for your audience!
          </p>

          {/* Action Button */}
          <button
            onClick={onCreateContent}
            className='group flex items-center justify-center space-x-3 w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-2xl text-white font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25 active:scale-95'
          >
            <div className='p-2 bg-white/20 rounded-lg group-hover:bg-white/30 transition-all duration-200 group-hover:scale-110'>
              <Plus className='w-5 h-5' />
            </div>
            <span className='text-lg'>Add Content</span>
          </button>

          {/* Decorative Elements */}
          <div className='mt-6 flex items-center justify-center space-x-2'>
            <div className='w-2 h-2 bg-purple-500/40 rounded-full animate-pulse'></div>
            <div className='w-2 h-2 bg-pink-500/40 rounded-full animate-pulse delay-100'></div>
            <div className='w-2 h-2 bg-purple-500/40 rounded-full animate-pulse delay-200'></div>
          </div>
        </div>
      </div>
    </div>
  );
}
