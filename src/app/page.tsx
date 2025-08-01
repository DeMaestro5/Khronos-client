'use client';

import Link from 'next/link';
import { Button } from '../components/ui/button';
import { motion } from 'framer-motion';
import ContentCalendar from '../components/ui/content-calendar';
import FeaturesSection from '../components/features';
import Testimonial from '../components/testimonial';
import StatsSection from '../components/stats';
import { Footer } from '../components/ui/footer';
import { CTASection } from '../components/ui/cta-section';
import { MainNavbar } from '../components/ui/main-navbar';

export default function Home() {
  return (
    <div className='min-h-screen bg-theme-secondary theme-transition overflow-x-hidden'>
      {/* Navigation */}
      <MainNavbar />

      {/* Hero Section */}
      <section className='pt-20 sm:pt-24 lg:pt-28 pb-4 sm:pb-6 lg:pb-8 px-4 sm:px-6 lg:px-8 overflow-hidden'>
        <div className='w-full max-w-7xl mx-auto'>
          <div className='flex flex-col lg:grid lg:grid-cols-2 gap-8 lg:gap-12 items-center'>
            {/* Mobile: Calendar First */}
            <motion.div
              className='w-full flex justify-center lg:hidden order-1'
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className='w-full max-w-xs'>
                <ContentCalendar />
              </div>
            </motion.div>

            {/* Content */}
            <motion.div
              className='w-full space-y-6 sm:space-y-8 text-center lg:text-left order-2 lg:order-1'
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
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
                    ✨ AI-Powered Content Strategy
                  </span>
                </motion.div>

                <h1 className='text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-theme-primary leading-tight px-2 sm:px-0'>
                  Create content that
                  <span className='block bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-blue-400 dark:to-indigo-500 bg-clip-text text-transparent'>
                    actually converts
                  </span>
                </h1>

                <p className='text-sm sm:text-base lg:text-xl text-theme-secondary leading-relaxed max-w-xl mx-auto lg:mx-0 px-2 sm:px-0'>
                  Stop guessing what content works. Let our AI analyze your
                  audience, optimize your strategy, and automate your publishing
                  workflow.
                </p>
              </div>

              <div className='flex flex-col gap-3 sm:gap-4 px-4 sm:px-0'>
                <Button
                  size='lg'
                  className='bg-accent-primary hover:bg-accent-secondary text-white px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-lg font-semibold shadow-theme-lg hover:shadow-theme-xl w-full sm:w-auto'
                >
                  <Link
                    href='/auth/signup'
                    className='flex items-center justify-center space-x-2'
                  >
                    <span>Get Started Free</span>
                    <span>→</span>
                  </Link>
                </Button>
                <Button
                  size='lg'
                  variant='outline'
                  className='border-2 border-accent-primary text-accent-primary hover:bg-accent-primary hover:text-white px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-lg font-medium w-full sm:w-auto flex items-center justify-center'
                >
                  <Link
                    href='/demo'
                    className='flex items-center justify-center w-full'
                  >
                    Watch Demo
                  </Link>
                </Button>
              </div>

              {/* Stats - Mobile Optimized and Properly Centered */}
              <div className='pt-4'>
                <div className='grid grid-cols-3 gap-4 max-w-sm mx-auto lg:max-w-none lg:flex lg:justify-start lg:space-x-8 lg:grid-cols-none'>
                  <div className='text-center lg:text-left'>
                    <div className='text-lg sm:text-2xl font-bold text-theme-primary'>
                      50K+
                    </div>
                    <div className='text-xs sm:text-sm text-theme-secondary'>
                      Users
                    </div>
                  </div>
                  <div className='text-center lg:text-left'>
                    <div className='text-lg sm:text-2xl font-bold text-theme-primary'>
                      99.9%
                    </div>
                    <div className='text-xs sm:text-sm text-theme-secondary'>
                      Uptime
                    </div>
                  </div>
                  <div className='text-center lg:text-left'>
                    <div className='text-lg sm:text-2xl font-bold text-theme-primary'>
                      4.9/5
                    </div>
                    <div className='text-xs sm:text-sm text-theme-secondary'>
                      Rating
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Desktop Calendar */}
            <motion.div
              className='hidden lg:block relative order-3 lg:order-2'
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className='relative'>
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
      <div className='w-full overflow-hidden'>
        <FeaturesSection />
      </div>

      {/* Stats Section */}
      <div className='w-full overflow-hidden'>
        <StatsSection />
      </div>

      {/* Testimonials Section */}
      <div className='w-full overflow-hidden'>
        <Testimonial />
      </div>

      {/* CTA Section */}
      <CTASection
        title='Ready to transform your content strategy?'
        subtitle="Join thousands of creators who've already boosted their engagement by 300% with KHRONOS"
        primaryButton={{
          text: 'Start Your Free Trial',
          href: '/auth/signup',
        }}
        secondaryButton={{
          text: 'Contact Us',
          href: '/contact',
        }}
        footerText='7 days free trial '
      />

      {/* Footer */}
      <Footer variant='main' />
    </div>
  );
}
