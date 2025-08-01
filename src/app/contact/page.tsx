'use client';

import Link from 'next/link';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { motion } from 'framer-motion';
import { ThemeToggle } from '../../components/ui/theme-toggle';
import { Footer } from '../../components/ui/footer';
import { useState } from 'react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log('Form submitted:', formData);
  };

  return (
    <div className='min-h-screen bg-theme-secondary theme-transition overflow-x-hidden'>
      {/* Navigation */}
      <motion.nav
        className='fixed top-0 w-full bg-theme-card border-b border-theme-primary z-50 theme-transition sm:bg-theme-card/95 sm:backdrop-blur-md'
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className='w-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto'>
          <div className='flex justify-between items-center py-3 sm:py-4'>
            <div className='flex items-center space-x-2'>
              <Link href='/' className='flex items-center space-x-2'>
                <div className='w-7 h-7 sm:w-8 sm:h-8 bg-accent-primary rounded-lg flex items-center justify-center flex-shrink-0'>
                  <span className='text-white font-bold text-xs sm:text-sm'>
                    K
                  </span>
                </div>
                <span className='text-base sm:text-xl font-bold text-theme-primary truncate'>
                  KHRONOS
                </span>
              </Link>
            </div>
            <div className='flex items-center space-x-2 sm:space-x-3 flex-shrink-0'>
              <ThemeToggle variant='compact' showLabels={false} size='sm' />
              <Button
                variant='ghost'
                size='sm'
                className='text-theme-secondary hover:text-theme-primary hover:bg-theme-hover px-3 sm:px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 flex items-center justify-center'
              >
                <Link
                  href='/auth/login'
                  className='flex items-center justify-center w-full'
                >
                  Login
                </Link>
              </Button>
              <Button
                size='sm'
                className='bg-accent-primary hover:bg-accent-secondary text-white px-3 sm:px-6 py-2 text-sm font-semibold rounded-lg shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-center'
              >
                <Link
                  href='/auth/signup'
                  className='flex items-center justify-center w-full'
                >
                  <span className='hidden sm:inline'>Get Started</span>
                  <span className='sm:hidden'>Start</span>
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </motion.nav>

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
                  📧 Get in Touch
                </span>
              </motion.div>

              <h1 className='text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-theme-primary leading-tight'>
                Contact Us
              </h1>

              <p className='text-sm sm:text-base lg:text-xl text-theme-secondary leading-relaxed max-w-2xl mx-auto'>
                Have questions about KHRONOS? We&apos;d love to hear from you.
                Send us a message and we&apos;ll respond as soon as possible.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className='py-8 sm:py-12 lg:py-16 px-4 sm:px-6 lg:px-8 overflow-hidden'>
        <div className='w-full max-w-4xl mx-auto'>
          <div className='grid lg:grid-cols-2 gap-8 lg:gap-12'>
            {/* Contact Form */}
            <motion.div
              className='w-full'
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className='bg-theme-card rounded-2xl p-6 sm:p-8 shadow-theme-lg border border-theme-primary'>
                <h2 className='text-xl sm:text-2xl font-bold text-theme-primary mb-6'>
                  Send us a message
                </h2>

                <form onSubmit={handleSubmit} className='space-y-6'>
                  <div className='grid sm:grid-cols-2 gap-4'>
                    <div>
                      <label className='block text-sm font-medium text-theme-primary mb-2'>
                        Name *
                      </label>
                      <Input
                        type='text'
                        value={formData.name}
                        onChange={(e) =>
                          handleInputChange('name', e.target.value)
                        }
                        placeholder='Your name'
                        required
                        className='w-full'
                      />
                    </div>
                    <div>
                      <label className='block text-sm font-medium text-theme-primary mb-2'>
                        Email *
                      </label>
                      <Input
                        type='email'
                        value={formData.email}
                        onChange={(e) =>
                          handleInputChange('email', e.target.value)
                        }
                        placeholder='your.email@example.com'
                        required
                        className='w-full'
                      />
                    </div>
                  </div>

                  <div>
                    <label className='block text-sm font-medium text-theme-primary mb-2'>
                      Subject *
                    </label>
                    <Input
                      type='text'
                      value={formData.subject}
                      onChange={(e) =>
                        handleInputChange('subject', e.target.value)
                      }
                      placeholder='What is this about?'
                      required
                      className='w-full'
                    />
                  </div>

                  <div>
                    <label className='block text-sm font-medium text-theme-primary mb-2'>
                      Message *
                    </label>
                    <textarea
                      value={formData.message}
                      onChange={(e) =>
                        handleInputChange('message', e.target.value)
                      }
                      placeholder='Tell us more about your inquiry...'
                      required
                      rows={6}
                      className='w-full px-3 py-2 border border-theme-primary bg-theme-card rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-accent-primary focus:border-accent-primary text-theme-primary placeholder-theme-muted resize-none transition-all duration-200'
                    />
                  </div>

                  <Button
                    type='submit'
                    size='lg'
                    className='w-full bg-accent-primary hover:bg-accent-secondary text-white px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-lg font-semibold shadow-theme-lg hover:shadow-theme-xl'
                  >
                    Send Message
                  </Button>
                </form>
              </div>
            </motion.div>

            {/* Contact Information */}
            <motion.div
              className='w-full'
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <div className='space-y-8'>
                {/* General Contact */}
                <div className='bg-theme-card rounded-2xl p-6 sm:p-8 shadow-theme-lg border border-theme-primary'>
                  <h3 className='text-lg sm:text-xl font-bold text-theme-primary mb-4'>
                    General Inquiries
                  </h3>
                  <div className='space-y-4'>
                    <div className='flex items-start space-x-3'>
                      <div className='w-10 h-10 bg-accent-primary rounded-lg flex items-center justify-center flex-shrink-0'>
                        <span className='text-white text-lg'>📧</span>
                      </div>
                      <div>
                        <p className='text-sm font-medium text-theme-primary'>
                          Email
                        </p>
                        <a
                          href='mailto:Khronos@gmail.com'
                          className='text-accent-primary hover:text-accent-secondary transition-colors duration-200'
                        >
                          Khronos@gmail.com
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Founder Contact */}
                <div className='bg-theme-card rounded-2xl p-6 sm:p-8 shadow-theme-lg border border-theme-primary'>
                  <h3 className='text-lg sm:text-xl font-bold text-theme-primary mb-4'>
                    Founder & Lead Developer
                  </h3>
                  <div className='space-y-4'>
                    <div className='flex items-start space-x-3'>
                      <div className='w-10 h-10 bg-accent-secondary rounded-lg flex items-center justify-center flex-shrink-0'>
                        <span className='text-white text-lg'>👨‍💻</span>
                      </div>
                      <div>
                        <p className='text-sm font-medium text-theme-primary'>
                          Ossiakeme Stephen
                        </p>
                        <a
                          href='mailto:osstephen70@gmail.com'
                          className='text-accent-primary hover:text-accent-secondary transition-colors duration-200'
                        >
                          osstephen70@gmail.com
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Additional Info */}
                <div className='bg-theme-card rounded-2xl p-6 sm:p-8 shadow-theme-lg border border-theme-primary'>
                  <h3 className='text-lg sm:text-xl font-bold text-theme-primary mb-4'>
                    What we can help with
                  </h3>
                  <div className='space-y-3'>
                    <div className='flex items-center space-x-2'>
                      <div className='w-2 h-2 bg-accent-primary rounded-full'></div>
                      <span className='text-sm text-theme-secondary'>
                        Product questions and support
                      </span>
                    </div>
                    <div className='flex items-center space-x-2'>
                      <div className='w-2 h-2 bg-accent-primary rounded-full'></div>
                      <span className='text-sm text-theme-secondary'>
                        Feature requests and feedback
                      </span>
                    </div>
                    <div className='flex items-center space-x-2'>
                      <div className='w-2 h-2 bg-accent-primary rounded-full'></div>
                      <span className='text-sm text-theme-secondary'>
                        Partnership opportunities
                      </span>
                    </div>
                    <div className='flex items-center space-x-2'>
                      <div className='w-2 h-2 bg-accent-primary rounded-full'></div>
                      <span className='text-sm text-theme-secondary'>
                        Technical issues and bugs
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer variant='main' />
    </div>
  );
}
