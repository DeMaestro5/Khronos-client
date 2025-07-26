import React, { useState } from 'react';
import { Plus, Calendar, Clock, X, Edit3, Trash2, Eye } from 'lucide-react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Platform } from '@/src/types/modal';
import { ScheduledContentItem } from '@/src/context/CalendarContext';
import { contentAPI } from '@/src/lib/api';
import { useCalendar } from '@/src/context/CalendarContext';
import DeleteConfirmationModal from '../content/delete-confirmation-modal';
import ContentEditModal from '../content/content-edit-modal';

interface ContentModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: string | null;
  content: ScheduledContentItem[];
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
      return 'bg-accent-success/20 text-accent-success border-accent-success/30';
    case 'draft':
      return 'bg-accent-warning/20 text-accent-warning border-accent-warning/30';
    case 'published':
      return 'bg-accent-info/20 text-accent-info border-accent-info/30';
    default:
      return 'bg-theme-muted/20 text-theme-muted border-theme-muted/30';
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
  const router = useRouter();
  const { loadScheduledContent } = useCalendar();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingContent, setEditingContent] =
    useState<ScheduledContentItem | null>(null);
  const [contentToDelete, setContentToDelete] =
    useState<ScheduledContentItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  if (!isOpen || !selectedDate) return null;

  const date = new Date(selectedDate);
  const formattedDate = date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Check if the selected date is in the past
  const isDateInPast = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selectedDateObj = new Date(selectedDate);
    selectedDateObj.setHours(0, 0, 0, 0);
    return selectedDateObj < today;
  };

  const handleViewContent = (contentId: string) => {
    router.push(`/content/${contentId}`);
  };

  const handleEditClick = (item: ScheduledContentItem) => {
    setEditingContent(item);
    setEditModalOpen(true);
  };

  const handleDeleteClick = (item: ScheduledContentItem) => {
    setContentToDelete(item);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!contentToDelete) return;

    setIsDeleting(true);
    try {
      await contentAPI.delete(contentToDelete.id);
      toast.success('Content deleted successfully');
      await loadScheduledContent();
      setDeleteModalOpen(false);
      setContentToDelete(null);
    } catch (error) {
      console.error('Failed to delete content:', error);
      toast.error('Failed to delete content');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModalOpen(false);
    setContentToDelete(null);
  };

  const handleEditSuccess = async () => {
    await loadScheduledContent();
    setEditModalOpen(false);
    setEditingContent(null);
    toast.success('Content updated successfully');
  };

  const handleEditCancel = () => {
    setEditModalOpen(false);
    setEditingContent(null);
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-theme-backdrop backdrop-blur-sm transition-all duration-200 ${
        animatingOut ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <div
        className={`bg-theme-card backdrop-blur-xl border border-theme-primary rounded-3xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden transform transition-all duration-200 ${
          animatingOut ? 'scale-95 opacity-0' : 'scale-100 opacity-100'
        }`}
      >
        {/* Modal Header */}
        <div className='flex items-center justify-between p-6 bg-gradient-to-r from-accent-primary/10 to-accent-secondary/10 border-b border-theme-primary'>
          <div className='flex items-center space-x-3'>
            <div className='p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl'>
              <Calendar className='w-5 h-5 text-white' />
            </div>
            <div>
              <h2 className='text-xl font-bold text-theme-primary'>
                {formattedDate}
              </h2>
              <p className='text-sm text-theme-secondary'>
                {content.length} scheduled{' '}
                {content.length === 1 ? 'post' : 'posts'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className='p-2 hover:bg-theme-hover rounded-xl transition-all duration-200 text-theme-secondary hover:text-theme-primary hover:scale-110'
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
                  className='group bg-theme-tertiary hover:bg-theme-hover rounded-2xl p-4 transition-all duration-300 hover:scale-[1.02] border border-theme-primary hover:border-theme-primary'
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
                          <h3 className='text-theme-primary font-semibold text-lg truncate'>
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

                        <div className='flex items-center space-x-4 text-sm text-theme-secondary mb-3'>
                          <span className='flex items-center space-x-1'>
                            <Clock className='w-4 h-4' />
                            <span className='font-medium'>{item.time}</span>
                          </span>
                          <span className='px-2 py-1 bg-theme-tertiary rounded-lg'>
                            {platformNames[item.platform]}
                          </span>
                          <span className='px-2 py-1 bg-theme-tertiary rounded-lg'>
                            {item.type}
                          </span>
                        </div>

                        {/* Progress Bar for Scheduled Items */}
                        {item.status === 'scheduled' && (
                          <div className='mb-3'>
                            <div className='flex items-center justify-between text-xs text-theme-secondary mb-1'>
                              <span>Scheduled to publish</span>
                              <span className='text-accent-success'>Ready</span>
                            </div>
                            <div className='w-full bg-theme-tertiary rounded-full h-1.5'>
                              <div className='bg-gradient-to-r from-accent-success to-accent-success h-1.5 rounded-full w-full'></div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className='flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200'>
                      <button
                        onClick={() => handleViewContent(item.id)}
                        className='p-2 hover:bg-theme-hover rounded-lg transition-all duration-200 text-theme-secondary hover:text-theme-primary hover:scale-110'
                        title='View Content'
                      >
                        <Eye className='w-4 h-4' />
                      </button>

                      {/* Only show edit button for present/future dates */}
                      {!isDateInPast() && (
                        <button
                          onClick={() => handleEditClick(item)}
                          className='p-2 hover:bg-theme-hover rounded-lg transition-all duration-200 text-theme-secondary hover:text-theme-primary hover:scale-110'
                          title='Edit Content'
                        >
                          <Edit3 className='w-4 h-4' />
                        </button>
                      )}

                      <button
                        onClick={() => handleDeleteClick(item)}
                        className='p-2 hover:bg-theme-hover rounded-lg transition-all duration-200 text-theme-secondary hover:text-accent-error hover:scale-110'
                        title='Delete Content'
                      >
                        <Trash2 className='w-4 h-4' />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Modal Footer */}
        <div className='p-2 bg-theme-tertiary border-t border-theme-primary flex items-center justify-between'>
          <div className='text-sm text-theme-secondary'>
            {content.filter((item) => item.status === 'scheduled').length}{' '}
            scheduled •{' '}
            {content.filter((item) => item.status === 'draft').length} drafts
          </div>
          <div className='flex items-center space-x-3'>
            <button
              onClick={isDateInPast() ? undefined : onCreateContent}
              disabled={isDateInPast()}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                isDateInPast()
                  ? 'bg-theme-disabled text-theme-muted cursor-not-allowed opacity-50'
                  : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white hover:scale-105'
              }`}
            >
              <Plus className='w-4 h-4' />
              <span>{isDateInPast() ? 'Past Date' : 'Add More'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {editingContent && (
        <ContentEditModal
          isOpen={editModalOpen}
          onClose={handleEditCancel}
          contentId={editingContent.id}
          currentStatus={editingContent.status}
          currentPriority='medium' // Default since we don't have priority in ScheduledContentItem
          currentScheduledDate={
            selectedDate ? `${selectedDate}T${editingContent.time}:00.000Z` : ''
          }
          contentTitle={editingContent.title}
          onSuccess={handleEditSuccess}
        />
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        contentTitle={contentToDelete?.title || ''}
        isDeleting={isDeleting}
      />
    </div>
  );
}
