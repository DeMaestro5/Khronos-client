'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Archive,
  Trash2,
  MoreVertical,
  Edit3,
  ArchiveRestore,
  Bot,
  Calendar,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { Content, ContentStatus, ContentType } from '../../types/content';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import {
  getStatusIcon,
  getStatusColor,
  getTypeColor,
  formatDate,
} from './content-helpers';
import { contentAPI } from '../../lib/api';
import DeleteConfirmationModal from './delete-confirmation-modal';
import ContentEditModal from './content-edit-modal';
import ArchiveConfirmationModal from './archive-confirmation-modal';
import { useAIChat } from '@/src/context/AIChatContext';

interface ContentCardProps {
  content: Content;
  onContentDeleted?: (contentId: string) => void;
  onContentUpdated?: () => void;
}

interface DropdownOption {
  icon: React.ElementType;
  label: string;
  action: () => void;
  variant?: 'default' | 'danger';
}

const Avatar = ({ src, name }: { src?: string; name: string }) => {
  const [imageError, setImageError] = useState(false);

  if (!src || imageError) {
    return (
      <div className='w-6 h-6 rounded-full bg-gray-200 dark:bg-slate-700 flex items-center justify-center'>
        <span className='text-xs font-medium text-gray-600 dark:text-slate-400'>
          {name.charAt(0).toUpperCase()}
        </span>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={name}
      className='w-6 h-6 rounded-full'
      width={24}
      height={24}
      onError={() => setImageError(true)}
    />
  );
};

const ContentDropdown = ({
  content,
  isOpen,
  onClose,
  onDeleteClick,
  onEditClick,
  onArchiveClick,
  onAIChatClick,
}: {
  content: Content;
  isOpen: boolean;
  onClose: () => void;
  onDeleteClick: () => void;
  onEditClick: () => void;
  onArchiveClick: () => void;
  onAIChatClick: () => void;
}) => {
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  const options: DropdownOption[] = [
    {
      icon: Bot,
      label: 'Chat with AI',
      action: onAIChatClick,
      variant: 'default',
    },
    {
      icon: Edit3,
      label: 'Edit',
      action: onEditClick,
      variant: 'default',
    },
    {
      icon: content.status === 'archived' ? ArchiveRestore : Archive,
      label: content.status === 'archived' ? 'Unarchive' : 'Archive',
      action: onArchiveClick,
      variant: 'default',
    },
  ];

  // Only show delete option for non-archived content
  if (content.status !== 'archived') {
    options.push({
      icon: Trash2,
      label: 'Delete',
      action: onDeleteClick,
      variant: 'danger',
    });
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={dropdownRef}
          initial={{ opacity: 0, scale: 0.95, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -10 }}
          transition={{ duration: 0.15 }}
          className='absolute right-3 top-14 w-48 bg-white dark:bg-slate-800 rounded-lg shadow-lg dark:shadow-slate-900/20 border border-gray-200 dark:border-slate-600 py-2 z-50'
        >
          {options.map((option, index) => (
            <button
              key={index}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                option.action();
                onClose();
              }}
              className={`w-full flex items-center gap-3 px-4 py-2 text-left text-sm transition-colors ${
                option.variant === 'danger'
                  ? 'text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20'
                  : option.label === 'Chat with AI'
                  ? 'text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20'
                  : 'text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700'
              }`}
            >
              <option.icon className='w-4 h-4' />
              {option.label}
            </button>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export const ContentCard = ({
  content,
  onContentDeleted,
  onContentUpdated,
}: ContentCardProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isArchiveModalOpen, setIsArchiveModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isArchiving, setIsArchiving] = useState(false);
  const { openChat } = useAIChat();

  const handleMoreClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleEditClick = () => {
    setIsDropdownOpen(false);
    setIsEditModalOpen(true);
  };

  const handleEditSuccess = () => {
    setIsEditModalOpen(false);
    onContentUpdated?.();
  };

  const handleEditCancel = () => {
    setIsEditModalOpen(false);
  };

  const handleDeleteClick = () => {
    setIsDropdownOpen(false);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    setIsDeleting(true);
    try {
      await contentAPI.delete(content._id);
      toast.success('Content deleted successfully!');
      setIsDeleteModalOpen(false);
      if (onContentDeleted) {
        onContentDeleted(content._id);
      }
    } catch (error) {
      console.error('Error deleting content:', error);
      toast.error('Failed to delete content. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setIsDeleteModalOpen(false);
  };

  const handleCardClick = () => {
    if (!isDropdownOpen) {
      window.location.href = `/content/${content._id}`;
    }
  };

  const handleArchive = async () => {
    setIsArchiving(true);
    try {
      if (content.status === 'archived') {
        // Unarchive
        await contentAPI.unarchive(content._id, {
          restoreStatus: 'draft', // Default restore status
          restoreCalendarEvents: true,
        });
        toast.success('Content unarchived successfully!');
      } else {
        // Archive
        await contentAPI.archive(content._id, {
          preserveCalendarEvents: false, // Default behavior
        });
        toast.success('Content archived successfully!');
      }
      setIsArchiveModalOpen(false);
      onContentUpdated?.();
    } catch (error) {
      console.error('Archive operation failed:', error);
      toast.error('Operation failed. Please try again.');
    } finally {
      setIsArchiving(false);
    }
  };

  const handleArchiveClick = () => {
    setIsDropdownOpen(false);
    setIsArchiveModalOpen(true);
  };

  const handleArchiveCancel = () => {
    setIsArchiveModalOpen(false);
  };

  const handleAIChat = () => {
    setIsDropdownOpen(false);
    openChat(content._id, content.title);
  };

  return (
    <>
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        whileHover={{ y: -4 }}
        transition={{ duration: 0.2 }}
      >
        <Card
          className={`h-full hover:shadow-lg dark:hover:shadow-slate-900/40 transition-all duration-200 cursor-pointer group relative ${
            content.status === 'archived'
              ? 'opacity-60 bg-gray-50 dark:bg-slate-800/50'
              : 'bg-white dark:bg-slate-800/80 border-gray-200 dark:border-slate-600'
          }`}
        >
          <div onClick={handleCardClick}>
            <CardHeader className='pb-2 sm:pb-3 p-3 sm:p-6'>
              <div className='flex items-start justify-between'>
                <div className='flex items-center gap-1.5 sm:gap-2 mb-2 min-w-0 flex-1'>
                  {getStatusIcon(content.status as ContentStatus)}
                  <span
                    className={`px-2 py-0.5 sm:py-1 rounded-full text-xs font-medium border flex-shrink-0 max-w-[80px] truncate ${getStatusColor(
                      content.status as ContentStatus
                    )}`}
                  >
                    {content.status.replace('_', ' ').toUpperCase()}
                  </span>
                  <span
                    className={`px-2 py-0.5 sm:py-1 rounded-full text-xs font-medium flex-shrink-0 max-w-[80px] truncate ${getTypeColor(
                      content.type as ContentType
                    )}`}
                  >
                    {content.type.replace('_', ' ')}
                  </span>
                </div>
                <div className='relative flex-shrink-0 ml-2'>
                  <button
                    onClick={handleMoreClick}
                    className='opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1 hover:bg-gray-100 dark:hover:bg-slate-700 rounded z-10 relative'
                  >
                    <MoreVertical className='w-4 h-4 text-gray-500 dark:text-slate-400' />
                  </button>
                </div>
              </div>
              <CardTitle className='text-base sm:text-lg font-semibold line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 text-gray-900 dark:text-slate-100 transition-colors leading-tight'>
                {content.title}
              </CardTitle>
            </CardHeader>
            <CardContent className='pt-0 p-3 sm:p-6 sm:pt-0'>
              <p className='text-xs sm:text-sm text-gray-600 dark:text-slate-400 line-clamp-3 mb-3 sm:mb-4 leading-relaxed'>
                {content.description}
              </p>

              {/* Tags */}
              <div className='flex flex-wrap gap-1 mb-3 sm:mb-4'>
                {content.tags.slice(0, 3).map((tag, index) => (
                  <span
                    key={index}
                    className='px-2 py-0.5 sm:py-1 bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-slate-300 text-xs rounded-md'
                  >
                    {tag}
                  </span>
                ))}
                {content.tags.length > 3 && (
                  <span className='px-2 py-0.5 sm:py-1 bg-gray-50 dark:bg-slate-700/50 text-gray-500 dark:text-slate-400 text-xs rounded-md'>
                    +{content.tags.length - 3} more
                  </span>
                )}
              </div>

              {/* Platforms */}
              <div className='flex items-center gap-2 mb-3 sm:mb-4'>
                <span className='text-xs text-gray-500 dark:text-slate-400 flex-shrink-0'>
                  Platforms:
                </span>
                <div className='flex gap-1 flex-wrap'>
                  {(content.platforms || content.platform || [])
                    .slice(0, 3)
                    .map((platform, index) => (
                      <div
                        key={index}
                        className='w-5 h-5 sm:w-6 sm:h-6 bg-gray-100 dark:bg-slate-700 rounded flex items-center justify-center'
                        title={
                          typeof platform === 'string'
                            ? platform
                            : platform.name
                        }
                      >
                        <span className='text-[9px] sm:text-[10px] font-medium text-gray-600 dark:text-slate-300'>
                          {(typeof platform === 'string'
                            ? platform
                            : platform.name
                          )
                            .charAt(0)
                            .toUpperCase()}
                        </span>
                      </div>
                    ))}
                  {(content.platforms || content.platform || []).length > 3 && (
                    <div className='w-5 h-5 sm:w-6 sm:h-6 bg-gray-50 dark:bg-slate-700/50 rounded flex items-center justify-center'>
                      <span className='text-[9px] sm:text-[10px] text-gray-500 dark:text-slate-400'>
                        +
                        {(content.platforms || content.platform || []).length -
                          3}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className='flex items-center justify-between pt-2 border-t border-gray-200 dark:border-slate-600 text-xs'>
                <div className='flex items-center gap-1.5 sm:gap-2 min-w-0'>
                  {content.author?.avatar && (
                    <Avatar
                      src={content.author?.avatar}
                      name={content.author?.name || 'Author'}
                    />
                  )}
                  <span className='text-gray-500 dark:text-slate-400 truncate'>
                    {content.author?.name || 'Unknown Author'}
                  </span>
                </div>
                <div className='flex items-center gap-1 sm:gap-2 text-gray-500 dark:text-slate-400 flex-shrink-0'>
                  <Calendar className='w-3 h-3' />
                  <span className='hidden sm:inline'>
                    {content.metadata?.publishedDate
                      ? formatDate(content.metadata.publishedDate)
                      : formatDate(content.createdAt)}
                  </span>
                  <span className='sm:hidden'>
                    {content.metadata?.publishedDate
                      ? new Date(
                          content.metadata.publishedDate
                        ).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        })
                      : new Date(content.createdAt).toLocaleDateString(
                          'en-US',
                          {
                            month: 'short',
                            day: 'numeric',
                          }
                        )}
                  </span>
                </div>
              </div>
            </CardContent>
          </div>

          {/* Dropdown positioned outside the clickable area */}
          <ContentDropdown
            content={content}
            isOpen={isDropdownOpen}
            onClose={() => setIsDropdownOpen(false)}
            onDeleteClick={handleDeleteClick}
            onEditClick={handleEditClick}
            onArchiveClick={handleArchiveClick}
            onAIChatClick={handleAIChat}
          />
        </Card>
      </motion.div>

      {/* Edit Modal */}
      <ContentEditModal
        isOpen={isEditModalOpen}
        onClose={handleEditCancel}
        contentId={content._id}
        currentStatus={content.status as 'draft' | 'scheduled' | 'published'}
        currentPriority='medium' // Default since priority isn't in the content type
        currentScheduledDate={content.metadata?.scheduledDate}
        contentTitle={content.title}
        onSuccess={handleEditSuccess}
      />

      {/* Archive Confirmation Modal */}
      <ArchiveConfirmationModal
        isOpen={isArchiveModalOpen}
        onClose={handleArchiveCancel}
        onConfirm={handleArchive}
        contentTitle={content.title}
        isArchiving={content.status !== 'archived' && isArchiving}
        isUnarchiving={content.status === 'archived' && isArchiving}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        contentTitle={content.title}
        isDeleting={isDeleting}
      />
    </>
  );
};

export default ContentCard;
