'use client';

import Link from 'next/link';
import { Button } from '../components/ui/button';
import { motion } from 'framer-motion';
import ContentCalendar from '../components/ui/content-calendar';
import FeaturesSection from '../components/features';
import Testimonial from '../components/testimonial';
import StatsSection from '../components/stats';
import { ThemeToggle } from '../components/ui/theme-toggle';

export default function Home() {
  return (
    <div className='min-h-screen bg-theme-secondary theme-transition'>
      {/* Navigation */}
      <motion.nav
        className='fixed top-0 w-full bg-theme-card/90 backdrop-blur-md border-b border-theme-primary z-50 theme-transition'
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex justify-between items-center py-4'>
            <div className='flex items-center space-x-2'>
              <div className='w-8 h-8 bg-accent-primary rounded-lg flex items-center justify-center'>
                <span className='text-white font-bold text-sm'>K</span>
              </div>
              <span className='text-xl font-bold text-theme-primary'>
                KHRONOS
              </span>
            </div>
            <div className='flex items-center space-x-4'>
              <ThemeToggle variant='compact' showLabels={false} size='sm' />
              <Button
                variant='ghost'
                className='text-theme-secondary hover:text-theme-primary hover:bg-theme-hover'
              >
                <Link href='/auth/login'>Login</Link>
              </Button>
              <Button className='bg-accent-primary hover:bg-accent-secondary text-white'>
                <Link href='/auth/signup'>Get Started</Link>
              </Button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className='pt-32 pb-20 px-4 sm:px-6 lg:px-8'>
        <div className='max-w-7xl mx-auto'>
          <div className='grid lg:grid-cols-2 gap-12 items-center'>
            {/* Left Content */}
            <motion.div
              className='space-y-8'
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className='space-y-6'>
                <motion.div
                  className='inline-flex items-center px-4 py-2 rounded-full bg-theme-tertiary border border-theme-primary'
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <span className='text-accent-primary text-sm font-medium'>
                    ✨ AI-Powered Content Strategy
                  </span>
                </motion.div>

                <h1 className='text-5xl lg:text-6xl font-bold text-theme-primary leading-tight'>
                  Create content that
                  <span className='block bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-blue-400 dark:to-indigo-500 bg-clip-text text-transparent'>
                    actually converts
                  </span>
                </h1>

                <p className='text-xl text-theme-secondary leading-relaxed max-w-xl'>
                  Stop guessing what content works. Let our AI analyze your
                  audience, optimize your strategy, and automate your publishing
                  workflow.
                </p>
              </div>

              <div className='flex flex-col sm:flex-row gap-4'>
                <Button
                  size='lg'
                  className='bg-accent-primary hover:bg-accent-secondary text-white px-8 py-4 text-lg font-semibold shadow-theme-lg hover:shadow-theme-xl'
                >
                  <Link
                    href='/auth/signup'
                    className='flex items-center space-x-2'
                  >
                    <span>Get Started</span>
                    <span>→</span>
                  </Link>
                </Button>
                <Button
                  size='lg'
                  variant='outline'
                  className='border-2 border-accent-primary text-accent-primary hover:bg-accent-primary hover:text-white px-8 py-4 text-lg font-medium'
                >
                  <Link href='#demo'>Watch Demo</Link>
                </Button>
              </div>

              <div className='flex items-center space-x-8 pt-4'>
                <div className='text-center'>
                  <div className='text-2xl font-bold text-theme-primary'>
                    50K+
                  </div>
                  <div className='text-sm text-theme-secondary'>
                    Active Users
                  </div>
                </div>
                <div className='text-center'>
                  <div className='text-2xl font-bold text-theme-primary'>
                    99.9%
                  </div>
                  <div className='text-sm text-theme-secondary'>Uptime</div>
                </div>
                <div className='text-center'>
                  <div className='text-2xl font-bold text-theme-primary'>
                    4.9/5
                  </div>
                  <div className='text-sm text-theme-secondary'>Rating</div>
                </div>
              </div>
            </motion.div>

            {/* Right Visual */}
            <motion.div
              className='relative'
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className='relative'>
                {/* Main Dashboard Preview */}
                <ContentCalendar />

                {/* Floating Elements */}
                <motion.div
                  className='absolute -top-4 -right-4 bg-accent-primary text-white p-3 rounded-full shadow-theme-lg'
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.8 }}
                  whileHover={{ scale: 1.1 }}
                >
                  📊
                </motion.div>
                <motion.div
                  className='absolute -bottom-4 -left-4 bg-accent-secondary text-white p-3 rounded-full shadow-theme-lg'
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.6, delay: 1.0 }}
                  whileHover={{ scale: 1.1 }}
                >
                  🚀
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <FeaturesSection />

      {/* Stats Section */}
      <StatsSection />

      {/* Testimonials Section */}
      <Testimonial />

      {/* CTA Section */}
      <section className='py-20 bg-gradient-to-r from-indigo-600 to-purple-600'>
        <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center'>
          <motion.div
            className='space-y-8'
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className='text-4xl font-bold text-white'>
              Ready to transform your content strategy?
            </h2>
            <p className='text-xl text-white/90 max-w-2xl mx-auto'>
              Join thousands of creators who&apos;ve already boosted their
              engagement by 300% with KHRONOS
            </p>
            <div className='flex flex-col sm:flex-row gap-4 justify-center'>
              <Button
                size='lg'
                className='bg-white text-indigo-600 hover:bg-white/90 px-8 py-4 text-lg font-semibold'
              >
                <Link href='/auth/signup'>Start Now</Link>
              </Button>
              <Button
                size='lg'
                variant='outline'
                className='border-2 border-slate-800 bg-slate-800 text-white hover:bg-slate-700 dark:border-white dark:bg-white dark:text-slate-800 dark:hover:bg-gray-100 px-8 py-4 text-lg font-medium transition-all duration-300'
              >
                <Link href='/contact'>Contact Us</Link>
              </Button>
            </div>
            <p className='text-white/80 text-sm'>
              No Payments required • All Free •
            </p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className='bg-theme-card border-t border-theme-primary py-12'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex flex-col md:flex-row justify-between items-center'>
            <div className='flex items-center space-x-2 mb-4 md:mb-0'>
              <div className='w-8 h-8 bg-accent-primary rounded-lg flex items-center justify-center'>
                <span className='text-white font-bold text-sm'>K</span>
              </div>
              <span className='text-xl font-bold text-theme-primary'>
                KHRONOS
              </span>
            </div>
            <div className='text-theme-secondary text-sm'>
              © 2025 KHRONOS. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
