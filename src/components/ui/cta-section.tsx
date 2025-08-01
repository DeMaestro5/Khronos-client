import React from 'react';
import { motion } from 'framer-motion';
import { Button } from './button';
import Link from 'next/link';

interface CTASectionProps {
  title: string;
  subtitle?: string;
  primaryButton: {
    text: string;
    href: string;
    variant?: 'default' | 'outline';
  };
  secondaryButton?: {
    text: string;
    href: string;
    variant?: 'default' | 'outline';
  };
  footerText?: string;
  gradient?: string;
  className?: string;
  animate?: boolean;
}

export function CTASection({
  title,
  subtitle,
  primaryButton,
  secondaryButton,
  footerText,
  gradient = 'from-indigo-600 to-purple-600',
  className = '',
  animate = true,
}: CTASectionProps) {
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const Content = () => (
    <div className='w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center'>
      <div className='space-y-4 sm:space-y-6 lg:space-y-8'>
        {/* Title */}
        <motion.h2
          className='text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight'
          variants={animate ? itemVariants : undefined}
        >
          {title}
        </motion.h2>

        {/* Subtitle */}
        {subtitle && (
          <motion.p
            className='text-sm sm:text-base lg:text-xl text-white/90 max-w-2xl mx-auto leading-relaxed px-2'
            variants={animate ? itemVariants : undefined}
          >
            {subtitle}
          </motion.p>
        )}

        {/* Buttons */}
        <motion.div
          className='flex flex-col gap-3 sm:gap-4 max-w-sm mx-auto sm:max-w-none sm:flex-row sm:justify-center'
          variants={animate ? itemVariants : undefined}
        >
          {/* Primary Button */}
          <Button
            size='lg'
            className='bg-white text-indigo-600 hover:bg-white/90 px-4 sm:px-6 lg:px-8 py-3 sm:py-4 text-sm sm:text-base lg:text-lg font-semibold w-full sm:w-auto flex items-center justify-center rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300'
          >
            <Link
              href={primaryButton.href}
              className='flex items-center justify-center w-full'
            >
              {primaryButton.text}
            </Link>
          </Button>

          {/* Secondary Button */}
          {secondaryButton && (
            <Button
              size='lg'
              variant='outline'
              className='border-2 border-white bg-transparent text-white hover:bg-white hover:text-indigo-600 px-4 sm:px-6 lg:px-8 py-3 sm:py-4 text-sm sm:text-base lg:text-lg font-medium transition-all duration-300 w-full sm:w-auto flex items-center justify-center rounded-xl sm:rounded-2xl'
            >
              <Link
                href={secondaryButton.href}
                className='flex items-center justify-center w-full'
              >
                {secondaryButton.text}
              </Link>
            </Button>
          )}
        </motion.div>

        {/* Footer Text */}
        {footerText && (
          <motion.p
            className='text-white/80 text-xs sm:text-sm text-center'
            variants={animate ? itemVariants : undefined}
          >
            {footerText}
          </motion.p>
        )}
      </div>
    </div>
  );

  return (
    <section
      className={`py-8 sm:py-12 lg:py-16 bg-gradient-to-r ${gradient} overflow-hidden ${className}`}
    >
      {/* Background decorations */}
      <div className='absolute inset-0'>
        {/* Gradient orbs */}
        <div className='absolute top-10 left-10 w-32 h-32 sm:w-48 sm:h-48 bg-white/10 rounded-full mix-blend-multiply filter blur-xl animate-pulse' />
        <div
          className='absolute bottom-10 right-10 w-32 h-32 sm:w-48 sm:h-48 bg-white/10 rounded-full mix-blend-multiply filter blur-xl animate-pulse'
          style={{ animationDelay: '1s' }}
        />

        {/* Floating particles */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className='absolute w-1 h-1 sm:w-2 sm:h-2 bg-white/30 rounded-full opacity-30'
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      {animate ? (
        <motion.div
          initial='hidden'
          whileInView='visible'
          viewport={{ once: true, amount: 0.1 }}
          variants={containerVariants}
        >
          <Content />
        </motion.div>
      ) : (
        <Content />
      )}
    </section>
  );
}
