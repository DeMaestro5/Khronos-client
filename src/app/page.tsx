'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import FeaturesSection from '../components/features';
import Testimonial from '../components/testimonial';
import StatsSection from '../components/stats';
import { Footer } from '../components/ui/footer';
import { CTASection } from '../components/ui/cta-section';
import { MainNavbar } from '../components/ui/main-navbar';

export default function LandingPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
      },
    },
  };

  const floatingAnimation = {
    y: [0, -10, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  };
  return (
    <div className='min-h-screen bg-theme-secondary theme-transition overflow-x-hidden'>
      {/* Navigation */}
      <MainNavbar />

      {/* Hero Section */}
      <section className='relative min-h-screen flex items-center justify-center overflow-hidden'>
        {/* Animated Background Elements */}
        <div className='absolute inset-0 overflow-hidden pointer-events-none'>
          <motion.div
            className='absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-full blur-3xl'
            animate={floatingAnimation}
          />
          <motion.div
            className='absolute top-3/4 right-1/4 w-96 h-96 bg-gradient-to-r from-blue-500/15 to-cyan-500/15 rounded-full blur-3xl'
            animate={{
              ...floatingAnimation,
              transition: { ...floatingAnimation.transition, delay: 1 },
            }}
          />
          <motion.div
            className='absolute bottom-1/4 left-1/2 w-48 h-48 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-2xl'
            animate={{
              ...floatingAnimation,
              transition: { ...floatingAnimation.transition, delay: 2 },
            }}
          />
        </div>

        <div className='relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16'>
          <motion.div
            className='text-center'
            variants={containerVariants}
            initial='hidden'
            animate='visible'
          >
            {/* Badge */}
            <motion.div variants={itemVariants} className='mb-8'>
              <div className='inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-indigo-500/15 to-purple-500/15 border border-indigo-500/30 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105'>
                <span className='w-3 h-3 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full animate-pulse'></span>
                <span className='text-theme-primary font-semibold text-sm tracking-wide'>
                  AI-Powered Content Revolution
                </span>
                <div className='w-1 h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full'></div>
              </div>
            </motion.div>

            {/* Main Headline */}
            <motion.div variants={itemVariants} className='mb-8'>
              <h1 className='text-4xl sm:text-5xl lg:text-7xl xl:text-8xl font-black leading-tight'>
                <span className='text-theme-primary block mb-2'>
                  Transform Your
                </span>
                <span className='bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400 bg-clip-text text-transparent block'>
                  Content Strategy
                </span>
                <span className='text-theme-primary block text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold mt-4'>
                  Into Revenue Growth
                </span>
              </h1>
            </motion.div>

            {/* Subtitle */}
            <motion.div variants={itemVariants} className='mb-10'>
              <p className='text-lg sm:text-xl lg:text-2xl text-theme-primary max-w-4xl mx-auto leading-relaxed font-medium'>
                Stop creating content in the dark. KHRONOS uses advanced AI to
                analyze, optimize, and automate your entire content
                workflow—turning every post into a conversion opportunity.
              </p>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div variants={itemVariants} className='mb-12'>
              <div className='flex flex-col sm:flex-row gap-4 justify-center items-center max-w-md mx-auto'>
                <Link
                  href='/auth/signup'
                  className='group relative overflow-hidden w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl font-bold text-lg shadow-2xl hover:shadow-indigo-500/25 transition-all duration-300 transform hover:scale-105'
                >
                  <span className='relative z-10 flex items-center justify-center gap-2'>
                    Start Creating Smarter
                    <motion.span
                      className='inline-block'
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      →
                    </motion.span>
                  </span>
                  <div className='absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300' />
                </Link>
                <Link
                  href='/demo'
                  className='w-full sm:w-auto px-8 py-4 border-2 border-theme-primary text-theme-primary hover:bg-theme-primary hover:text-theme-secondary rounded-xl font-semibold text-lg transition-all duration-300 backdrop-blur-sm bg-theme-card/30 hover:bg-theme-primary hover:text-theme-secondary'
                >
                  Watch Demo
                </Link>
              </div>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div variants={itemVariants} className='mb-8'>
              <p className='text-base text-theme-primary font-medium mb-8 text-center'>
                Trusted by 50,000+ creators and growing
              </p>
              <div className='flex flex-wrap justify-center items-center gap-8 md:gap-12'>
                <div className='flex items-center gap-3 group hover:scale-105 transition-transform duration-200'>
                  <div className='w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-200'>
                    <span className='text-white font-bold text-base'>✓</span>
                  </div>
                  <div className='flex flex-col'>
                    <span className='text-theme-primary font-semibold text-sm'>
                      99.9% Uptime
                    </span>
                    <span className='text-theme-tertiary text-xs'>
                      Reliable service
                    </span>
                  </div>
                </div>
                <div className='flex items-center gap-3 group hover:scale-105 transition-transform duration-200'>
                  <div className='w-10 h-10 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-200'>
                    <span className='text-white font-bold text-base'>★</span>
                  </div>
                  <div className='flex flex-col'>
                    <span className='text-theme-primary font-semibold text-sm'>
                      4.9/5 Rating
                    </span>
                    <span className='text-theme-tertiary text-xs'>
                      User satisfaction
                    </span>
                  </div>
                </div>
                <div className='flex items-center gap-3 group hover:scale-105 transition-transform duration-200'>
                  <div className='w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-200'>
                    <span className='text-white font-bold text-base'>🚀</span>
                  </div>
                  <div className='flex flex-col'>
                    <span className='text-theme-primary font-semibold text-sm'>
                      500K+ Posts Created
                    </span>
                    <span className='text-theme-tertiary text-xs'>
                      Content generated
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        <motion.div
          className='absolute bottom-8 left-1/2 transform -translate-x-1/2'
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className='w-6 h-10 border-2 border-theme-primary rounded-full flex justify-center bg-theme-card/50 backdrop-blur-sm shadow-lg'>
            <motion.div
              className='w-1 h-3 bg-gradient-to-b from-theme-primary to-accent-primary rounded-full mt-2'
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </motion.div>
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
        footerText='Start your 7 days free trial'
      />

      {/* Footer */}
      <Footer variant='main' />
    </div>
  );
}
