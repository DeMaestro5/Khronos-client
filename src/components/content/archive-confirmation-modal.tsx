import React from 'react';
import { Archive, ArchiveRestore } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ArchiveConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  contentTitle: string;
  isArchiving?: boolean;
  isUnarchiving?: boolean;
}

export const ArchiveConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  contentTitle,
  isArchiving = false,
  isUnarchiving = false,
}: ArchiveConfirmationModalProps) => {
  if (!isOpen) return null;

  const isArchiveOperation = !isUnarchiving;

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
              className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                isArchiveOperation ? 'bg-amber-100' : 'bg-blue-100'
              }`}
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{
                delay: 0.2,
                type: 'spring',
                damping: 15,
                stiffness: 300,
              }}
            >
              {isArchiveOperation ? (
                <Archive className='w-6 h-6 text-amber-600' />
              ) : (
                <ArchiveRestore className='w-6 h-6 text-blue-600' />
              )}
            </motion.div>
            <div>
              <h2 className='text-xl font-semibold text-gray-900'>
                {isArchiveOperation ? 'Archive Content' : 'Unarchive Content'}
              </h2>
              <p className='text-sm text-gray-500'>
                {isArchiveOperation
                  ? 'This action can be undone later'
                  : 'This will restore the content'}
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
              Are you sure you want to{' '}
              {isArchiveOperation ? 'archive' : 'unarchive'}{' '}
              <span className='font-medium text-gray-900'>
                &quot;{contentTitle}&quot;
              </span>
              ?
            </p>
            <p className='text-sm text-gray-500 mt-2'>
              {isArchiveOperation
                ? 'This will hide the content from your main content list but can be restored later.'
                : 'This will restore the content to your active content list.'}
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
              disabled={isArchiving || isUnarchiving}
              className='flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50'
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: 'spring', damping: 15, stiffness: 300 }}
            >
              Cancel
            </motion.button>
            <motion.button
              onClick={onConfirm}
              disabled={isArchiving || isUnarchiving}
              className={`flex-1 px-4 py-2 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${
                isArchiveOperation
                  ? 'bg-amber-600 hover:bg-amber-700'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: 'spring', damping: 15, stiffness: 300 }}
            >
              {isArchiving || isUnarchiving ? (
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
                  {isArchiving ? 'Archiving...' : 'Unarchiving...'}
                </>
              ) : (
                <>
                  {isArchiveOperation ? (
                    <Archive className='w-4 h-4' />
                  ) : (
                    <ArchiveRestore className='w-4 h-4' />
                  )}
                  {isArchiveOperation ? 'Archive' : 'Unarchive'}
                </>
              )}
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ArchiveConfirmationModal;
