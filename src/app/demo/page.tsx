'use client';

import Link from 'next/link';
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
          <div className='text-center space-y-6 sm:space-y-8'>
            <div className='space-y-4 sm:space-y-6'>
              <div className='inline-flex items-center px-3 sm:px-4 py-2 rounded-full bg-theme-tertiary border border-theme-primary'>
                <span className='text-accent-primary text-xs sm:text-sm font-medium'>
                  🎥 Product Demo
                </span>
              </div>

              <h1 className='text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-theme-primary leading-tight'>
                Watch KHRONOS in Action
              </h1>

              <p className='text-sm sm:text-base lg:text-xl text-theme-secondary leading-relaxed max-w-2xl mx-auto'>
                See how our AI-powered platform transforms your content strategy
                and boosts engagement.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Content Section */}
      <section className='py-8 sm:py-12 lg:py-16 px-4 sm:px-6 lg:px-8 overflow-hidden'>
        <div className='w-full max-w-4xl mx-auto'>
          <div className='text-center'>
            {/* Demo Placeholder */}
            <div className='bg-theme-card rounded-2xl p-8 sm:p-12 lg:p-16 shadow-theme-lg border border-theme-primary mb-8'>
              <div className='space-y-6'>
                {/* Video Icon */}
                <div className='w-20 h-20 sm:w-24 sm:h-24 mx-auto bg-gradient-to-br from-accent-primary to-accent-secondary rounded-full flex items-center justify-center'>
                  <span className='text-white text-2xl sm:text-3xl'>🎬</span>
                </div>

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
                <div className='flex items-center justify-center space-x-2'>
                  <div className='flex space-x-1'>
                    <div className='w-2 h-2 bg-accent-primary rounded-full'></div>
                    <div className='w-2 h-2 bg-accent-primary rounded-full'></div>
                    <div className='w-2 h-2 bg-accent-primary rounded-full'></div>
                  </div>
                  <span className='text-xs text-theme-secondary ml-2'>
                    In Progress
                  </span>
                </div>
              </div>
            </div>

            {/* Call to Action */}
            <div className='space-y-4'>
              <p className='text-sm sm:text-base text-theme-secondary'>
                Can&apos;t wait? Start exploring KHRONOS today with our free
                trial.
              </p>
              <div className='flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center'>
                <Link
                  href='/auth/signup'
                  className='inline-flex items-center justify-center h-11 rounded-md px-6 sm:px-8 py-3 sm:py-4 bg-accent-primary hover:bg-accent-secondary text-white text-sm sm:text-lg font-semibold shadow-theme-lg hover:shadow-theme-xl transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none space-x-2'
                >
                  <span>Start Free Trial</span>
                  <span>→</span>
                </Link>
                <Link
                  href='/contact'
                  className='inline-flex items-center justify-center h-11 rounded-md px-6 sm:px-8 py-3 sm:py-4 border-2 border-accent-primary text-accent-primary hover:bg-accent-primary hover:text-white text-sm sm:text-lg font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none'
                >
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer variant='main' />
    </div>
  );
}
