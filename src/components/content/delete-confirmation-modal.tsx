import React from 'react';
import { AlertTriangle, Trash2 } from 'lucide-react';
import { createPortal } from 'react-dom';

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  contentTitle: string;
  isDeleting?: boolean;
}

export const DeleteConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  contentTitle,
  isDeleting = false,
}: DeleteConfirmationModalProps) => {
  if (!isOpen) return null;

  const modalContent = (
    <div className='fixed inset-0 z-[10000] flex items-center justify-center p-4'>
      {/* Backdrop */}
      <div
        className='absolute inset-0 bg-black/60 backdrop-blur-sm'
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className='relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6'
        onClick={(e) => e.stopPropagation()}
      >
        {/* Icon and Title */}
        <div className='flex items-center gap-4 mb-4'>
          <div className='w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0'>
            <AlertTriangle className='w-6 h-6 text-red-600' />
          </div>
          <div>
            <h2 className='text-xl font-semibold text-gray-900'>
              Delete Content
            </h2>
            <p className='text-sm text-gray-500'>
              This action cannot be undone
            </p>
          </div>
        </div>

        {/* Content */}
        <div className='mb-6'>
          <p className='text-gray-700'>
            Are you sure you want to delete{' '}
            <span className='font-medium text-gray-900'>
              &quot;{contentTitle}&quot;
            </span>
            ?
          </p>
          <p className='text-sm text-gray-500 mt-2'>
            This will permanently remove the content and all associated data.
          </p>
        </div>

        {/* Buttons */}
        <div className='flex gap-3'>
          <button
            onClick={onClose}
            disabled={isDeleting}
            className='flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50'
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className='flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2'
          >
            {isDeleting ? (
              <>
                <div className='w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin' />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className='w-4 h-4' />
                Delete
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );

  if (typeof window !== 'undefined') {
    return createPortal(modalContent, document.body);
  }
  return modalContent;
};

export default DeleteConfirmationModal;
