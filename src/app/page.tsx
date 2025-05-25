'use client';

import Link from 'next/link';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { motion } from 'framer-motion';
import ContentCalendar from '../components/ui/content-calendar';

// Animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: 'easeOut' },
};

const fadeInScale = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.6, ease: 'easeOut' },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

export default function Home() {
  return (
    <div className='min-h-screen bg-slate-50'>
      {/* Navigation */}
      <motion.nav
        className='fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-slate-200/60 z-50'
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex justify-between items-center py-4'>
            <div className='flex items-center space-x-2'>
              <div className='w-8 h-8 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center'>
                <span className='text-white font-bold text-sm'>K</span>
              </div>
              <span className='text-xl font-bold text-slate-800'>KHRONOS</span>
            </div>
            <div className='flex items-center space-x-4'>
              <Button
                variant='ghost'
                className='text-slate-600 hover:text-slate-800'
              >
                <Link href='/auth/login'>Login</Link>
              </Button>
              <Button className='bg-gradient-to-r from-indigo-600 to-purple-600 hover:bg-indigo-700'>
                <Link href='/signup'>Get Started</Link>
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
                  className='inline-flex items-center px-4 py-2 rounded-full bg-indigo-50 border border-indigo-200'
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <span className='text-indigo-600 text-sm font-medium'>
                    ✨ AI-Powered Content Strategy
                  </span>
                </motion.div>

                <h1 className='text-5xl lg:text-6xl font-bold text-slate-900 leading-tight'>
                  Create content that
                  <span className='block bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent'>
                    actually converts
                  </span>
                </h1>

                <p className='text-xl text-slate-600 leading-relaxed max-w-xl'>
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
                    href='/dashboard'
                    className='flex items-center space-x-2'
                  >
                    <span>Start Now</span>
                    <span>→</span>
                  </Link>
                </Button>
                <Button
                  size='lg'
                  variant='outline'
                  className='border-slate-300 text-slate-700 hover:bg-slate-50 px-8 py-4 text-lg'
                >
                  <Link href='#demo'>Watch Demo</Link>
                </Button>
              </div>

              <div className='flex items-center space-x-8 pt-4'>
                <div className='text-center'>
                  <div className='text-2xl font-bold text-slate-900'>50K+</div>
                  <div className='text-sm text-slate-600'>Active Users</div>
                </div>
                <div className='text-center'>
                  <div className='text-2xl font-bold text-slate-900'>99.9%</div>
                  <div className='text-sm text-slate-600'>Uptime</div>
                </div>
                <div className='text-center'>
                  <div className='text-2xl font-bold text-slate-900'>4.9/5</div>
                  <div className='text-sm text-slate-600'>Rating</div>
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
      <section className='py-20 bg-white'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <motion.div
            className='text-center mb-16'
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className='text-4xl font-bold mb-4 block bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent'>
              Everything you need to scale your content
            </h2>
            <p className='text-xl text-slate-600 max-w-2xl mx-auto'>
              From planning to publishing, our AI-powered platform handles it
              all
            </p>
          </motion.div>

          <motion.div
            className='grid md:grid-cols-2 lg:grid-cols-3 gap-8'
            variants={staggerContainer}
            initial='initial'
            whileInView='animate'
            viewport={{ once: true }}
          >
            {features.map((feature) => (
              <motion.div
                key={feature.title}
                variants={fadeInScale}
                whileHover={{ y: -5 }}
                transition={{ duration: 0.3 }}
              >
                <Card className='border-1 shadow-lg hover:shadow-xl transition-all duration-300 h-full bg-gradient-to-b from-white to-slate-200'>
                  <CardContent className='p-8'>
                    <div className='text-4xl mb-6'>{feature.icon}</div>
                    <h3 className='text-xl font-semibold text-slate-900 mb-3'>
                      {feature.title}
                    </h3>
                    <p className='text-slate-600 leading-relaxed'>
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className='py-20 bg-slate-900'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <motion.div
            className='grid md:grid-cols-4 gap-8 text-center'
            variants={staggerContainer}
            initial='initial'
            whileInView='animate'
            viewport={{ once: true }}
          >
            {stats.map((stat) => (
              <motion.div
                key={stat.label}
                variants={fadeInUp}
                className='space-y-2'
              >
                <div className='text-4xl font-bold text-white'>
                  {stat.value}
                </div>
                <div className='text-slate-400'>{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className='py-20 bg-gradient-to-b from-slate-50 to-white'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <motion.div
            className='text-center mb-16'
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className='text-4xl font-bold text-slate-900 mb-4'>
              Loved by content creators worldwide
            </h2>
          </motion.div>

          <motion.div
            className='grid md:grid-cols-3 gap-8'
            variants={staggerContainer}
            initial='initial'
            whileInView='animate'
            viewport={{ once: true }}
          >
            {testimonials.map((testimonial) => (
              <motion.div
                key={testimonial.name}
                variants={fadeInUp}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <Card className='border-0 shadow-lg hover:shadow-xl transition-all duration-300 h-full'>
                  <CardContent className='p-8'>
                    <div className='text-yellow-400 text-2xl mb-4'>★★★★★</div>
                    <p className='text-slate-700 mb-6 leading-relaxed'>
                      &quot;{testimonial.quote}&quot;
                    </p>
                    <div className='flex items-center space-x-3'>
                      <div className='w-12 h-12 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full flex items-center justify-center text-white font-semibold'>
                        {testimonial.name.charAt(0)}
                      </div>
                      <div>
                        <div className='font-semibold text-slate-900'>
                          {testimonial.name}
                        </div>
                        <div className='text-slate-600 text-sm'>
                          {testimonial.role}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

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
                <Link href='/signup'>Start Now</Link>
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

const features = [
  {
    title: 'AI Content Intelligence',
    description:
      'Get data-driven insights on what content performs best for your specific audience and niche.',
    icon: '🧠',
  },
  {
    title: 'Smart Scheduling',
    description:
      'Automatically schedule posts at optimal times based on your audience engagement patterns.',
    icon: '⏰',
  },
  {
    title: 'Multi-Platform Publishing',
    description:
      'Publish to all your social channels simultaneously with platform-specific optimization.',
    icon: '🚀',
  },
  {
    title: 'Performance Analytics',
    description:
      'Track ROI, engagement rates, and conversion metrics with detailed reporting dashboards.',
    icon: '📊',
  },
  {
    title: 'Team Collaboration',
    description:
      'Streamline workflows with approval processes, role-based access, and real-time collaboration.',
    icon: '👥',
  },
  {
    title: 'Content Calendar',
    description:
      'Visualize your entire content strategy with drag-and-drop calendar management.',
    icon: '📅',
  },
];

const stats = [
  { value: '500K+', label: 'Posts Scheduled' },
  { value: '10K+', label: 'Active Users' },
  { value: '300%', label: 'Avg. Engagement Boost' },
  { value: '99.9%', label: 'Uptime' },
];

const testimonials = [
  {
    quote:
      'KHRONOS helped us scale our content output by 5x while maintaining quality. The AI suggestions are incredibly accurate.',
    name: 'Sarah Chen',
    role: 'Head of Marketing at TechFlow',
  },
  {
    quote:
      'Finally, a tool that understands content strategy. Our engagement rates have never been higher.',
    name: 'Marcus Johnson',
    role: 'Creative Director',
  },
  {
    quote:
      'The analytics alone are worth the price. We can see exactly what content drives conversions.',
    name: 'Elena Rodriguez',
    role: 'Social Media Manager',
  },
];
