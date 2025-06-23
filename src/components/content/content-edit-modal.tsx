'use client';

import React, { useState, useEffect } from 'react';
import { X, Calendar, Save, Loader2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { contentAPI } from '@/src/lib/api';
import { Content } from '@/src/types/content';
import { useUserData } from '@/src/context/UserDataContext';

interface ContentEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  contentId: string;
  currentStatus: 'draft' | 'scheduled' | 'published';
  currentPriority?: 'low' | 'medium' | 'high';
  currentScheduledDate?: string;
  currentScheduledTime?: string;
  contentTitle: string;
  onSuccess?: () => void;
}

interface EditFormData {
  status: 'draft' | 'scheduled' | 'published';
  priority: 'low' | 'medium' | 'high';
  scheduledDate: string;
  scheduledTime: string;
}

const ContentEditModal: React.FC<ContentEditModalProps> = ({
  isOpen,
  onClose,
  contentId,
  currentStatus,
  currentPriority = 'medium',
  currentScheduledDate = '',
  currentScheduledTime = '',
  contentTitle,
  onSuccess,
}) => {
  // Use UserDataContext to update cached data
  const { updateContent } = useUserData();

  const [formData, setFormData] = useState<EditFormData>({
    status: currentStatus,
    priority: currentPriority,
    scheduledDate: currentScheduledDate
      ? currentScheduledDate.split('T')[0]
      : '',
    scheduledTime:
      currentScheduledTime ||
      (currentScheduledDate
        ? currentScheduledDate.split('T')[1]?.substring(0, 5)
        : ''),
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Reset form when modal opens or content changes
  useEffect(() => {
    if (isOpen) {
      setFormData({
        status: currentStatus,
        priority: currentPriority,
        scheduledDate: currentScheduledDate
          ? currentScheduledDate.split('T')[0]
          : '',
        scheduledTime:
          currentScheduledTime ||
          (currentScheduledDate
            ? currentScheduledDate.split('T')[1]?.substring(0, 5)
            : ''),
      });
      setErrors({});
    }
  }, [
    isOpen,
    currentStatus,
    currentPriority,
    currentScheduledDate,
    currentScheduledTime,
  ]);

  const statusOptions = [
    {
      value: 'draft',
      label: 'Draft',
      icon: '📝',
      color: 'border-amber-200 bg-amber-50 text-amber-700',
      activeColor: 'border-amber-500 bg-amber-100 text-amber-800',
    },
    {
      value: 'scheduled',
      label: 'Scheduled',
      icon: '📅',
      color: 'border-blue-200 bg-blue-50 text-blue-700',
      activeColor: 'border-blue-500 bg-blue-100 text-blue-800',
    },
    {
      value: 'published',
      label: 'Published',
      icon: '✅',
      color: 'border-green-200 bg-green-50 text-green-700',
      activeColor: 'border-green-500 bg-green-100 text-green-800',
    },
  ];

  const priorityOptions = [
    {
      value: 'low',
      label: 'Low',
      icon: '🔵',
      color: 'border-gray-200 bg-gray-50 text-gray-700',
      activeColor: 'border-gray-500 bg-gray-100 text-gray-800',
    },
    {
      value: 'medium',
      label: 'Medium',
      icon: '🟡',
      color: 'border-yellow-200 bg-yellow-50 text-yellow-700',
      activeColor: 'border-yellow-500 bg-yellow-100 text-yellow-800',
    },
    {
      value: 'high',
      label: 'High',
      icon: '🔴',
      color: 'border-red-200 bg-red-50 text-red-700',
      activeColor: 'border-red-500 bg-red-100 text-red-800',
    },
  ];

  const handleInputChange = (field: keyof EditFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // If status is scheduled, validate date and time
    if (formData.status === 'scheduled') {
      if (!formData.scheduledDate) {
        newErrors.scheduledDate =
          'Scheduled date is required when status is "Scheduled"';
      } else {
        // Check if date is not in the past
        const today = new Date();
        const scheduledDate = new Date(formData.scheduledDate);
        today.setHours(0, 0, 0, 0);
        scheduledDate.setHours(0, 0, 0, 0);

        if (scheduledDate < today) {
          newErrors.scheduledDate = 'Cannot schedule content for past dates';
        }
      }

      if (!formData.scheduledTime) {
        newErrors.scheduledTime =
          'Scheduled time is required when status is "Scheduled"';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const updatePromises: Promise<any>[] = [];
      let hasScheduleUpdate = false;
      let hasPriorityUpdate = false;
      let hasStatusUpdate = false;

      // Check what needs to be updated
      const willBeScheduled = formData.status === 'scheduled';
      const priorityChanged = formData.priority !== currentPriority;
      const statusChanged = formData.status !== currentStatus;

      // Handle priority update
      if (priorityChanged) {
        console.log('Updating priority to:', formData.priority);
        updatePromises.push(
          contentAPI.updatePriority(contentId, {
            priority: formData.priority,
          })
        );
        hasPriorityUpdate = true;
      }

      // Handle schedule update
      if (
        willBeScheduled &&
        (statusChanged || formData.scheduledDate || formData.scheduledTime)
      ) {
        if (!formData.scheduledDate || !formData.scheduledTime) {
          throw new Error('Date and time are required for scheduled content');
        }

        const scheduledDate = `${formData.scheduledDate}T${formData.scheduledTime}:00.000Z`;
        console.log('Updating schedule to:', scheduledDate);

        updatePromises.push(
          contentAPI.updateSchedule(contentId, {
            scheduledDate: scheduledDate,
            priority: formData.priority,
          })
        );
        hasScheduleUpdate = true;
      } else if (statusChanged && !willBeScheduled) {
        // If changing from scheduled to draft/published, use general update
        updatePromises.push(
          contentAPI.update(contentId, {
            status: formData.status,
            scheduledDate: null,
          } as Partial<Content>)
        );
        hasStatusUpdate = true;
      }

      // If only status changed to draft/published (not priority or schedule)
      if (
        statusChanged &&
        !willBeScheduled &&
        !hasPriorityUpdate &&
        !hasScheduleUpdate
      ) {
        updatePromises.push(
          contentAPI.update(contentId, {
            status: formData.status,
          } as Partial<Content>)
        );
        hasStatusUpdate = true;
      }

      // Execute all updates
      const responses = await Promise.all(updatePromises);

      console.log('Update responses:', responses);

      // Check if all updates were successful
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const allSuccessful = responses.every((response: any) => {
        // All responses are now Axios responses from contentAPI
        return response.status === 200 || response.data?.statusCode === '10000';
      });

      if (allSuccessful) {
        const updateTypes = [];
        if (hasPriorityUpdate) updateTypes.push('priority');
        if (hasScheduleUpdate) updateTypes.push('schedule');
        if (hasStatusUpdate) updateTypes.push('status');

        // Update cached data in UserDataContext
        const updates: Partial<Content> = {
          status: formData.status,
        };

        // Update the cached content
        updateContent(contentId, updates);

        toast.success(
          `✅ Content ${updateTypes.join(' and ')} updated successfully!`,
          {
            duration: 4000,
            style: {
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              color: 'white',
              fontWeight: '500',
            },
          }
        );

        onSuccess?.();
        onClose();
      } else {
        throw new Error('One or more updates failed');
      }
    } catch (error: unknown) {
      console.error('Failed to update content:', error);

      let errorMessage = 'Failed to update content. Please try again.';
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as {
          response?: { data?: { message?: string } };
        };
        errorMessage = axiosError.response?.data?.message || errorMessage;
      }

      toast.error(`❌ ${errorMessage}`, {
        duration: 6000,
        style: {
          background: '#ef4444',
          color: 'white',
          fontWeight: '500',
        },
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className='fixed inset-0 z-50 flex items-center justify-center p-4'>
        {/* Simple backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className='absolute inset-0 bg-black/50'
          onClick={onClose}
        />

        {/* Compact Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className='relative bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden'
        >
          {/* Header */}
          <div className='flex items-center justify-between p-6 border-b border-gray-200'>
            <div>
              <h2 className='text-lg font-semibold text-gray-900'>
                Edit Content
              </h2>
              <div className='mt-2'>
                <p className='text-sm font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent uppercase tracking-wide truncate max-w-xs'>
                  {contentTitle}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className='p-2 hover:bg-gray-100 rounded-lg transition-colors'
            >
              <X className='h-5 w-5 text-gray-500' />
            </button>
          </div>

          {/* Content */}
          <div className='p-6 space-y-6'>
            {/* Status Section */}
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-3'>
                Status
              </label>
              <div className='grid grid-cols-3 gap-2'>
                {statusOptions.map((option) => (
                  <button
                    key={option.value}
                    type='button'
                    onClick={() =>
                      handleInputChange(
                        'status',
                        option.value as 'draft' | 'scheduled' | 'published'
                      )
                    }
                    className={`p-3 rounded-lg border-2 transition-all text-center ${
                      formData.status === option.value
                        ? option.activeColor
                        : option.color
                    }`}
                  >
                    <div className='text-lg mb-1'>{option.icon}</div>
                    <div className='text-xs font-medium'>{option.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Conditional Scheduling Section */}
            <AnimatePresence>
              {formData.status === 'scheduled' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className='space-y-4 overflow-hidden'
                >
                  <div className='bg-blue-50 rounded-lg p-4 border border-blue-200'>
                    <h4 className='text-sm font-medium text-blue-900 mb-3 flex items-center'>
                      <Calendar className='h-4 w-4 mr-2' />
                      Schedule Details
                    </h4>

                    <div className='grid grid-cols-2 gap-3'>
                      <div>
                        <label className='block text-xs font-medium text-gray-700 mb-1'>
                          Date
                        </label>
                        <input
                          type='date'
                          value={formData.scheduledDate}
                          min={new Date().toISOString().split('T')[0]}
                          onChange={(e) =>
                            handleInputChange('scheduledDate', e.target.value)
                          }
                          className={`w-full px-3 py-2 border rounded-lg text-sm text-black focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            errors.scheduledDate
                              ? 'border-red-300 bg-red-50'
                              : 'border-gray-300'
                          }`}
                        />
                        {errors.scheduledDate && (
                          <p className='text-red-500 text-xs mt-1 flex items-center'>
                            <AlertCircle className='h-3 w-3 mr-1' />
                            {errors.scheduledDate}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className='block text-xs font-medium text-gray-700 mb-1'>
                          Time
                        </label>
                        <input
                          type='time'
                          value={formData.scheduledTime}
                          onChange={(e) =>
                            handleInputChange('scheduledTime', e.target.value)
                          }
                          className={`w-full px-3 py-2 border rounded-lg text-sm text-black focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            errors.scheduledTime
                              ? 'border-red-300 bg-red-50'
                              : 'border-gray-300'
                          }`}
                        />
                        {errors.scheduledTime && (
                          <p className='text-red-500 text-xs mt-1 flex items-center'>
                            <AlertCircle className='h-3 w-3 mr-1' />
                            {errors.scheduledTime}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Priority Section */}
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-3'>
                Priority
              </label>
              <div className='grid grid-cols-3 gap-2'>
                {priorityOptions.map((option) => (
                  <button
                    key={option.value}
                    type='button'
                    onClick={() =>
                      handleInputChange(
                        'priority',
                        option.value as 'low' | 'medium' | 'high'
                      )
                    }
                    className={`p-3 rounded-lg border-2 transition-all text-center ${
                      formData.priority === option.value
                        ? option.activeColor
                        : option.color
                    }`}
                  >
                    <div className='text-lg mb-1'>{option.icon}</div>
                    <div className='text-xs font-medium'>{option.label}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className='flex justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50'>
            <button
              type='button'
              onClick={onClose}
              disabled={isLoading}
              className='px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50'
            >
              Cancel
            </button>
            <button
              type='button'
              onClick={handleSubmit}
              disabled={isLoading}
              className='px-4 py-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors disabled:opacity-50 flex items-center space-x-2'
            >
              {isLoading ? (
                <>
                  <Loader2 className='h-4 w-4 animate-spin' />
                  <span>Updating...</span>
                </>
              ) : (
                <>
                  <Save className='h-4 w-4' />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ContentEditModal;
