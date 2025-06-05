import React from 'react';
import { AlertTriangle, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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

  return (
    <AnimatePresence mode='wait'>
      <div className='fixed inset-0 z-50 flex items-center justify-center p-4'>
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className='absolute inset-0 bg-black/60 backdrop-blur-sm'
          onClick={onClose}
        />

        {/* Modal */}
        <motion.div
          initial={{
            opacity: 0,
            scale: 0.7,
            y: 50,
            rotateX: -15,
          }}
          animate={{
            opacity: 1,
            scale: 1,
            y: 0,
            rotateX: 0,
          }}
          exit={{
            opacity: 0,
            scale: 0.8,
            y: 30,
            rotateX: 10,
          }}
          transition={{
            type: 'spring',
            damping: 25,
            stiffness: 300,
            mass: 0.8,
            opacity: { duration: 0.3 },
          }}
          className='relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 transform-gpu'
          style={{ perspective: 1000 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Icon and Title */}
          <motion.div
            className='flex items-center gap-4 mb-4'
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1, duration: 0.4, ease: 'easeOut' }}
          >
            <motion.div
              className='w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0'
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{
                delay: 0.2,
                type: 'spring',
                damping: 15,
                stiffness: 300,
              }}
            >
              <AlertTriangle className='w-6 h-6 text-red-600' />
            </motion.div>
            <div>
              <h2 className='text-xl font-semibold text-gray-900'>
                Delete Content
              </h2>
              <p className='text-sm text-gray-500'>
                This action cannot be undone
              </p>
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            className='mb-6'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.4, ease: 'easeOut' }}
          >
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
          </motion.div>

          {/* Buttons */}
          <motion.div
            className='flex gap-3'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4, ease: 'easeOut' }}
          >
            <motion.button
              onClick={onClose}
              disabled={isDeleting}
              className='flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50'
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: 'spring', damping: 15, stiffness: 300 }}
            >
              Cancel
            </motion.button>
            <motion.button
              onClick={onConfirm}
              disabled={isDeleting}
              className='flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2'
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: 'spring', damping: 15, stiffness: 300 }}
            >
              {isDeleting ? (
                <>
                  <motion.div
                    className='w-4 h-4 border-2 border-white/30 border-t-white rounded-full'
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: 'linear',
                    }}
                  />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className='w-4 h-4' />
                  Delete
                </>
              )}
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default DeleteConfirmationModal;
