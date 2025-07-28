import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { ModalProps } from '../types/modal';

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  showCloseButton = true,
  closeOnOverlayClick = true,
  closeOnEscape = true,
}: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (closeOnEscape && e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, closeOnEscape, onClose]);

  // Handle click outside
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (
      closeOnOverlayClick &&
      modalRef.current &&
      !modalRef.current.contains(e.target as Node)
    ) {
      onClose();
    }
  };

  if (!isOpen) return null;

  const sizeClasses: Record<typeof size, string> = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl',
    full: 'max-w-[95vw]',
  };

  return (
    <div className='fixed inset-0 z-[9999] flex items-center justify-center p-2 sm:p-4'>
      {/* Backdrop */}
      <div
        className='absolute inset-0 bg-theme-backdrop backdrop-blur-sm animate-fade-in'
        onClick={handleOverlayClick}
      />

      {/* Modal */}
      <div
        ref={modalRef}
        className={`relative bg-theme-card backdrop-blur-xl border border-theme-primary rounded-2xl sm:rounded-3xl shadow-theme-xl animate-scale-in w-full ${sizeClasses[size]} max-h-[95vh] sm:max-h-[90vh] overflow-hidden`}
      >
        {/* Header */}
        {(title || showCloseButton) && (
          <div className='flex items-center justify-between p-4 sm:p-6 border-b border-theme-primary'>
            {title && (
              <h2 className='text-xl sm:text-2xl font-bold text-theme-primary'>
                {title}
              </h2>
            )}
            {showCloseButton && (
              <button
                onClick={onClose}
                className='p-2 hover:bg-theme-hover rounded-xl transition-colors duration-200 text-theme-secondary hover:text-theme-primary'
                type='button'
              >
                <X className='h-4 w-4 sm:h-5 sm:w-5' />
              </button>
            )}
          </div>
        )}

        {/* Content */}
        <div className='overflow-y-auto max-h-[calc(95vh-140px)] sm:max-h-[calc(90vh-140px)]'>
          {children}
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }

        .animate-scale-in {
          animation: scale-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
