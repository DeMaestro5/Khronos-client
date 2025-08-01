import { motion } from 'framer-motion';

interface FooterProps {
  variant?: 'main' | 'auth' | 'custom';
  className?: string;
  children?: React.ReactNode;
  showLogo?: boolean;
  showCopyright?: boolean;
  copyrightText?: string;
  animate?: boolean;
}

export function Footer({
  variant = 'main',
  className = '',
  children,
  showLogo,
  showCopyright = true,
  copyrightText = '© 2025 KHRONOS. All rights reserved.',
  animate = false,
}: FooterProps) {
  const renderMainFooter = () => (
    <footer
      className={`bg-theme-card border-t border-theme-primary py-4 sm:py-6 overflow-hidden ${className}`}
    >
      <div className='w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0'>
          <div className='flex items-center space-x-2'>
            <div className='w-7 h-7 sm:w-8 sm:h-8 bg-accent-primary rounded-lg flex items-center justify-center'>
              <span className='text-white font-bold text-xs sm:text-sm'>K</span>
            </div>
            <span className='text-lg sm:text-xl font-bold text-theme-primary'>
              KHRONOS
            </span>
          </div>
          {showCopyright && (
            <div className='text-theme-secondary text-xs sm:text-sm text-center'>
              {copyrightText}
            </div>
          )}
        </div>
      </div>
    </footer>
  );

  const renderAuthFooter = () => (
    <div className={`text-center text-xs text-slate-400 mt-1 ${className}`}>
      {animate ? (
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          {copyrightText}
        </motion.p>
      ) : (
        <p>{copyrightText}</p>
      )}
    </div>
  );

  const renderCustomFooter = () => (
    <footer
      className={`bg-theme-card border-t border-theme-primary py-4 sm:py-6 overflow-hidden ${className}`}
    >
      <div className='w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0'>
          {showLogo && (
            <div className='flex items-center space-x-2'>
              <div className='w-7 h-7 sm:w-8 sm:h-8 bg-accent-primary rounded-lg flex items-center justify-center'>
                <span className='text-white font-bold text-xs sm:text-sm'>
                  K
                </span>
              </div>
              <span className='text-lg sm:text-xl font-bold text-theme-primary'>
                KHRONOS
              </span>
            </div>
          )}
          {children}
          {showCopyright && (
            <div className='text-theme-secondary text-xs sm:text-sm text-center'>
              {copyrightText}
            </div>
          )}
        </div>
      </div>
    </footer>
  );

  switch (variant) {
    case 'main':
      return renderMainFooter();
    case 'auth':
      return renderAuthFooter();
    case 'custom':
      return renderCustomFooter();
    default:
      return renderMainFooter();
  }
}
