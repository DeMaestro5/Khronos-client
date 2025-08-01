'use client';

import Link from 'next/link';
import { Button } from '../../components/ui/button';
import { motion } from 'framer-motion';
import { Footer } from '../../components/ui/footer';
import { MainNavbar } from '../../components/ui/main-navbar';

export default function DemoPage() {
  return (
    <div className='min-h-screen bg-theme-secondary theme-transition overflow-x-hidden'>
      {/* Navigation */}
      <MainNavbar logoClickable={true} />

      {/* Hero Section */}
      <section className='pt-20 sm:pt-24 lg:pt-28 pb-4 sm:pb-6 lg:pb-8 px-4 sm:px-6 lg:px-8 overflow-hidden'>
        <div className='w-full max-w-4xl mx-auto'>
          <motion.div
            className='text-center space-y-6 sm:space-y-8'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className='space-y-4 sm:space-y-6'>
              <motion.div
                className='inline-flex items-center px-3 sm:px-4 py-2 rounded-full bg-theme-tertiary border border-theme-primary'
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <span className='text-accent-primary text-xs sm:text-sm font-medium'>
                  🎥 Product Demo
                </span>
              </motion.div>

              <h1 className='text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-theme-primary leading-tight'>
                Watch KHRONOS in Action
              </h1>

              <p className='text-sm sm:text-base lg:text-xl text-theme-secondary leading-relaxed max-w-2xl mx-auto'>
                See how our AI-powered platform transforms your content strategy
                and boosts engagement.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Demo Content Section */}
      <section className='py-8 sm:py-12 lg:py-16 px-4 sm:px-6 lg:px-8 overflow-hidden'>
        <div className='w-full max-w-4xl mx-auto'>
          <motion.div
            className='text-center'
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {/* Demo Placeholder */}
            <div className='bg-theme-card rounded-2xl p-8 sm:p-12 lg:p-16 shadow-theme-lg border border-theme-primary mb-8'>
              <div className='space-y-6'>
                {/* Video Icon */}
                <motion.div
                  className='w-20 h-20 sm:w-24 sm:h-24 mx-auto bg-gradient-to-br from-accent-primary to-accent-secondary rounded-full flex items-center justify-center'
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <span className='text-white text-2xl sm:text-3xl'>🎬</span>
                </motion.div>

                {/* Coming Soon Text */}
                <div className='space-y-4'>
                  <h2 className='text-xl sm:text-2xl lg:text-3xl font-bold text-theme-primary'>
                    Demo Video Coming Soon
                  </h2>
                  <p className='text-sm sm:text-base lg:text-lg text-theme-secondary max-w-md mx-auto'>
                    We&apos;re working hard to create an amazing demo that
                    showcases all the powerful features of KHRONOS.
                  </p>
                </div>

                {/* Progress Indicator */}
                <motion.div
                  className='flex items-center justify-center space-x-2'
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                >
                  <div className='flex space-x-1'>
                    <motion.div
                      className='w-2 h-2 bg-accent-primary rounded-full'
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1, repeat: Infinity, delay: 0 }}
                    />
                    <motion.div
                      className='w-2 h-2 bg-accent-primary rounded-full'
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                    />
                    <motion.div
                      className='w-2 h-2 bg-accent-primary rounded-full'
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                    />
                  </div>
                  <span className='text-xs text-theme-secondary ml-2'>
                    In Progress
                  </span>
                </motion.div>
              </div>
            </div>

            {/* Call to Action */}
            <div className='space-y-4'>
              <p className='text-sm sm:text-base text-theme-secondary'>
                Can&apos;t wait? Start exploring KHRONOS today with our free
                trial.
              </p>
              <div className='flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center'>
                <Button
                  size='lg'
                  className='bg-accent-primary hover:bg-accent-secondary text-white px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-lg font-semibold shadow-theme-lg hover:shadow-theme-xl'
                >
                  <Link
                    href='/auth/signup'
                    className='flex items-center justify-center space-x-2'
                  >
                    <span>Start Free Trial</span>
                    <span>→</span>
                  </Link>
                </Button>
                <Button
                  size='lg'
                  variant='outline'
                  className='border-2 border-accent-primary text-accent-primary hover:bg-accent-primary hover:text-white px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-lg font-medium'
                >
                  <Link
                    href='/contact'
                    className='flex items-center justify-center w-full'
                  >
                    Contact Us
                  </Link>
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <Footer variant='main' />
    </div>
  );
}
