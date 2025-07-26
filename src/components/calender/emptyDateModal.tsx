import React from 'react';
import { X, Calendar, Plus, Clock } from 'lucide-react';

interface EmptyDateModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: string | null;
  onCreateContent?: () => void;
  animatingOut: boolean;
}

const EmptyDateModal: React.FC<EmptyDateModalProps> = ({
  isOpen,
  onClose,
  selectedDate,
  onCreateContent,
  animatingOut,
}) => {
  if (!isOpen || !selectedDate) return null;

  // Check if the selected date is in the past
  const isPastDate = () => {
    const today = new Date();
    const selectedDateObj = new Date(selectedDate);

    // Set time to beginning of day for accurate comparison
    today.setHours(0, 0, 0, 0);
    selectedDateObj.setHours(0, 0, 0, 0);

    return selectedDateObj < today;
  };

  const isToday = () => {
    const today = new Date();
    const selectedDateObj = new Date(selectedDate);

    return (
      today.getDate() === selectedDateObj.getDate() &&
      today.getMonth() === selectedDateObj.getMonth() &&
      today.getFullYear() === selectedDateObj.getFullYear()
    );
  };

  const formatDisplayDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const pastDate = isPastDate();
  const todayDate = isToday();

  return (
    <div className='fixed inset-0 bg-theme-backdrop backdrop-blur-sm flex items-center justify-center z-50 p-4'>
      <div
        className={`bg-theme-card rounded-2xl sm:rounded-3xl shadow-2xl max-w-md w-full mx-4 transform transition-all duration-300 ${
          animatingOut
            ? 'scale-95 opacity-0 translate-y-4'
            : 'scale-100 opacity-100 translate-y-0'
        }`}
      >
        {/* Header */}
        <div className='flex items-center justify-between p-4 sm:p-6 border-b border-theme-primary'>
          <div className='flex items-center space-x-3'>
            <div
              className={`p-2 sm:p-3 rounded-xl shadow-lg ${
                pastDate
                  ? 'bg-theme-tertiary'
                  : 'bg-gradient-to-r from-purple-500 to-pink-500'
              }`}
            >
              {pastDate ? (
                <Clock
                  className={`w-5 h-5 sm:w-6 sm:h-6 text-theme-secondary`}
                />
              ) : (
                <Calendar className={`w-5 h-5 sm:w-6 sm:h-6 text-white`} />
              )}
            </div>
            <div>
              <h3 className='text-lg sm:text-xl font-bold text-theme-primary'>
                {pastDate
                  ? 'Past Date'
                  : todayDate
                  ? 'Today'
                  : 'Schedule Content'}
              </h3>
              <p className='text-xs sm:text-sm text-theme-secondary'>
                {formatDisplayDate(selectedDate)}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className='p-1 sm:p-2 hover:bg-theme-hover rounded-lg transition-colors'
          >
            <X className='w-5 h-5 sm:w-6 sm:h-6 text-theme-secondary' />
          </button>
        </div>

        {/* Content */}
        <div className='p-4 sm:p-6'>
          {pastDate ? (
            <div className='text-center space-y-4'>
              <div className='w-16 h-16 bg-theme-tertiary rounded-full flex items-center justify-center mx-auto'>
                <Clock className='w-8 h-8 text-theme-muted' />
              </div>
              <div>
                <h4 className='font-semibold text-theme-primary mb-2'>
                  Cannot Schedule Past Content
                </h4>
                <p className='text-sm text-theme-secondary leading-relaxed'>
                  You cannot create new content for past dates. Content can only
                  be scheduled for today or future dates.
                </p>
              </div>

              <div className='bg-theme-tertiary rounded-xl p-4'>
                <p className='text-xs text-theme-muted text-center'>
                  💡 You can still view any existing content that was scheduled
                  for this date
                </p>
              </div>
            </div>
          ) : (
            <div className='text-center space-y-4'>
              <div className='w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto'>
                <Plus className='w-8 h-8 text-white' />
              </div>
              <div>
                <h4 className='font-semibold text-theme-primary mb-2'>
                  No Content Scheduled
                </h4>
                <p className='text-sm text-theme-secondary leading-relaxed'>
                  {todayDate
                    ? "You don't have any content scheduled for today. Ready to create something amazing?"
                    : "You don't have any content scheduled for this date. Ready to plan ahead?"}
                </p>
              </div>

              <button
                onClick={() => {
                  onClose();
                  onCreateContent?.();
                }}
                className='w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-medium py-3 px-6 rounded-xl transition-all duration-200 hover:scale-105 hover:shadow-lg'
              >
                Create Content
              </button>

              <div className='bg-accent-info/10 rounded-xl p-4'>
                <p className='text-xs text-accent-info text-center'>
                  💡 Schedule your content in advance to maintain consistency
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmptyDateModal;
