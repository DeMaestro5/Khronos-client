import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';
import {
  Calendar,
  Clock,
  X,
  Plus,
  Edit,
  Trash2,
  Eye,
  Instagram,
  Twitter,
  Facebook,
  Linkedin,
  Youtube,
  Hash,
} from 'lucide-react';
import ContentEditModal from '../content/content-edit-modal';
import DeleteConfirmationModal from '../content/delete-confirmation-modal';
import { useCalendar } from '../../context/CalendarContext';
import { contentAPI } from '../../lib/api';
import toast from 'react-hot-toast';
import { ScheduledContentItem } from '../../context/CalendarContext';

interface ContentModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: string | null;
  content: ScheduledContentItem[];
  onCreateContent?: () => void;
}

// Platform icons mapping
const PlatformIcons: Record<
  string,
  React.ComponentType<{ className?: string }>
> = {
  instagram: Instagram,
  twitter: Twitter,
  facebook: Facebook,
  linkedin: Linkedin,
  youtube: Youtube,
  tiktok: Hash,
};

// Platform colors mapping
const platformColors: Record<string, string> = {
  instagram: 'from-pink-500 to-purple-500',
  twitter: 'from-blue-400 to-blue-600',
  facebook: 'from-blue-600 to-blue-800',
  linkedin: 'from-blue-700 to-blue-900',
  youtube: 'from-red-500 to-red-700',
  tiktok: 'from-gray-800 to-black',
};

// Platform names mapping
const platformNames: Record<string, string> = {
  instagram: 'Instagram',
  twitter: 'Twitter',
  facebook: 'Facebook',
  linkedin: 'LinkedIn',
  youtube: 'YouTube',
  tiktok: 'TikTok',
};

const getStatusBadgeColor = (status: string) => {
  switch (status) {
    case 'scheduled':
      return 'bg-emerald-500 text-white border-emerald-500';
    case 'draft':
      return 'bg-amber-500 text-white border-amber-500';
    case 'published':
      return 'bg-blue-500 text-white border-blue-500';
    default:
      return 'bg-gray-500 text-white border-gray-500';
  }
};

export default function ContentModal({
  isOpen,
  onClose,
  selectedDate,
  content,
  onCreateContent,
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

  // No scroll prevention needed - allow page scrolling when modal is open

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

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const modalContent = (
    <>
      <div
        className='fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-theme-backdrop backdrop-blur-sm'
        onClick={handleBackdropClick}
      >
        <div className='bg-theme-card backdrop-blur-xl border border-theme-primary rounded-3xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden'>
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

                          {/* Action Buttons */}
                          <div className='flex items-center space-x-2'>
                            <button
                              onClick={() => handleViewContent(item.id)}
                              className='flex items-center space-x-1 px-3 py-1.5 bg-theme-card hover:bg-theme-hover rounded-lg text-xs text-theme-secondary hover:text-theme-primary transition-all duration-200'
                            >
                              <Eye className='w-3 h-3' />
                              <span>View</span>
                            </button>
                            <button
                              onClick={() => handleEditClick(item)}
                              className='flex items-center space-x-1 px-3 py-1.5 bg-theme-card hover:bg-theme-hover rounded-lg text-xs text-theme-secondary hover:text-theme-primary transition-all duration-200'
                            >
                              <Edit className='w-3 h-3' />
                              <span>Edit</span>
                            </button>
                            <button
                              onClick={() => handleDeleteClick(item)}
                              className='flex items-center space-x-1 px-3 py-1.5 bg-red-50 hover:bg-red-100 rounded-lg text-xs text-red-600 hover:text-red-700 transition-all duration-200'
                            >
                              <Trash2 className='w-3 h-3' />
                              <span>Delete</span>
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Status Indicator */}
                      <div className='flex flex-col items-end space-y-2'>
                        <div className='flex items-center space-x-1'>
                          <div className='w-2 h-2 bg-green-500 rounded-full animate-pulse'></div>
                          <span className='text-xs text-green-600 font-medium'>
                            Ready
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Footer */}
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
    </>
  );

  // Use portal to render modal at document body level
  if (typeof window !== 'undefined') {
    return createPortal(modalContent, document.body);
  }

  return modalContent;
}
