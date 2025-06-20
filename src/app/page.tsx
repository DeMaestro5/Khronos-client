'use client';

import Link from 'next/link';
import { Button } from '../components/ui/button';
import { motion } from 'framer-motion';
import ContentCalendar from '../components/ui/content-calendar';
import FeaturesSection from '../components/features';
import Testimonial from '../components/testimonial';
import StatsSection from '../components/stats';
import ThemeToggle from '../components/ui/theme-toggle';

export default function Home() {
  return (
    <div className='min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-200'>
      {/* Navigation */}
      <motion.nav
        className='fixed top-0 w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/60 dark:border-slate-800/60 z-50 transition-colors duration-200'
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex justify-between items-center py-4'>
            <div className='flex items-center space-x-2'>
              <div className='w-8 h-8 bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-blue-600 dark:to-indigo-700 rounded-lg flex items-center justify-center'>
                <span className='text-white font-bold text-sm'>K</span>
              </div>
              <span className='text-xl font-bold text-slate-800 dark:text-slate-200'>
                KHRONOS
              </span>
            </div>
            <div className='flex items-center space-x-4'>
              <ThemeToggle variant='compact' showLabels={false} size='sm' />
              <Button
                variant='ghost'
                className='text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              >
                <Link href='/auth/login'>Login</Link>
              </Button>
              <Button className='bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-blue-600 dark:to-indigo-700 hover:bg-indigo-700 dark:hover:from-blue-500 dark:hover:to-indigo-600'>
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
              className='space-y-8 '
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className='space-y-6'>
                <motion.div
                  className='inline-flex items-center px-4 py-2 rounded-full bg-indigo-50 dark:bg-blue-950/50 border border-indigo-200 dark:border-blue-800'
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <span className='text-indigo-600 dark:text-blue-400 text-sm font-medium'>
                    ✨ AI-Powered Content Strategy
                  </span>
                </motion.div>

                <h1 className='text-5xl lg:text-6xl font-bold text-slate-900 dark:text-slate-100 leading-tight'>
                  Create content that
                  <span className='block bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-blue-400 dark:to-indigo-500 bg-clip-text text-transparent'>
                    actually converts
                  </span>
                </h1>

                <p className='text-xl text-slate-600 dark:text-slate-400 leading-relaxed max-w-xl'>
                  Stop guessing what content works. Let our AI analyze your
                  audience, optimize your strategy, and automate your publishing
                  workflow.
                </p>
              </div>

              <div className='flex flex-col sm:flex-row gap-4'>
                <Button
                  size='lg'
                  className='bg-indigo-600 hover:bg-indigo-700 px-8 py-4 text-lg'
                >
                  <Link
                    href='/auth/login'
                    className='flex items-center space-x-2'
                  >
                    <span>Start Now</span>
                    <span>→</span>
                  </Link>
                </Button>
                <Button
                  size='lg'
                  variant='outline'
                  className='border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 px-8 py-4 text-lg'
                >
                  <Link href='#demo'>Watch Demo</Link>
                </Button>
              </div>

              <div className='flex items-center space-x-8 pt-4'>
                <div className='text-center'>
                  <div className='text-2xl font-bold text-slate-900 dark:text-slate-100'>
                    50K+
                  </div>
                  <div className='text-sm text-slate-600 dark:text-slate-400'>
                    Active Users
                  </div>
                </div>
                <div className='text-center'>
                  <div className='text-2xl font-bold text-slate-900 dark:text-slate-100'>
                    99.9%
                  </div>
                  <div className='text-sm text-slate-600 dark:text-slate-400'>
                    Uptime
                  </div>
                </div>
                <div className='text-center'>
                  <div className='text-2xl font-bold text-slate-900 dark:text-slate-100'>
                    4.9/5
                  </div>
                  <div className='text-sm text-slate-600 dark:text-slate-400'>
                    Rating
                  </div>
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
                  className='absolute -top-4 -right-4 bg-indigo-500 text-white p-3 rounded-full shadow-lg'
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.8 }}
                  whileHover={{ scale: 1.1 }}
                >
                  📊
                </motion.div>
                <motion.div
                  className='absolute -bottom-4 -left-4 bg-purple-500 text-white p-3 rounded-full shadow-lg'
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
            <p className='text-xl text-indigo-100 max-w-2xl mx-auto'>
              Join thousands of creators who&apos;ve already boosted their
              engagement by 300% with KHRONOS
            </p>
            <div className='flex flex-col sm:flex-row gap-4 justify-center'>
              <Button
                size='lg'
                className='bg-white text-indigo-600 hover:bg-slate-50 px-8 py-4 text-lg font-semibold'
              >
                <Link href='/auth/signup'>Start Now</Link>
              </Button>
              <Button
                size='lg'
                variant='outline'
                className='border-white text-white hover:bg-white/10 px-8 py-4 text-lg'
              >
                <Link href='/contact'>Contact Us</Link>
              </Button>
            </div>
            <p className='text-indigo-200 text-sm'>
              No Payments required • All Free •
            </p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className='bg-slate-900 py-12'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex flex-col md:flex-row justify-between items-center'>
            <div className='flex items-center space-x-2 mb-4 md:mb-0'>
              <div className='w-8 h-8 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center'>
                <span className='text-white font-bold text-sm'>K</span>
              </div>
              <span className='text-xl font-bold text-white'>KHRONOS</span>
            </div>
            <div className='text-slate-400 text-sm'>
              © 2025 KHRONOS. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
