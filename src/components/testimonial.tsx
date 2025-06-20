import React, { useEffect, useRef, useState } from 'react';
import { motion, useAnimation, useInView } from 'framer-motion';

const TestimonialsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });
  const controls = useAnimation();
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  useEffect(() => {
    if (isInView) {
      controls.start('visible');
    }
  }, [isInView, controls]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 60,
      rotateX: -20,
      scale: 0.9,
    },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  };

  const testimonials = [
    {
      quote:
        'KHRONOS helped us scale our content output by 5x while maintaining quality. The AI suggestions are incredibly accurate and save us hours every day.',
      name: 'Sarah Chen',
      role: 'Head of Marketing at TechFlow',
      avatar: 'SC',
      gradient: 'from-pink-500 to-rose-500 dark:from-pink-600 dark:to-rose-600',
      company: 'TechFlow',
      rating: 5,
      metric: '500% increase in content output',
    },
    {
      quote:
        'Finally, a tool that understands content strategy. Our engagement rates have never been higher, and the analytics are phenomenal.',
      name: 'Marcus Johnson',
      role: 'Creative Director',
      avatar: 'MJ',
      gradient: 'from-blue-500 to-cyan-500 dark:from-blue-600 dark:to-cyan-600',
      company: 'CreativeStudio',
      rating: 5,
      metric: '300% boost in engagement',
    },
    {
      quote:
        'The analytics alone are worth the price. We can see exactly what content drives conversions and ROI has improved dramatically.',
      name: 'Elena Rodriguez',
      role: 'Social Media Manager',
      avatar: 'ER',
      gradient:
        'from-purple-500 to-indigo-500 dark:from-purple-600 dark:to-indigo-600',
      company: 'Growth Labs',
      rating: 5,
      metric: '250% ROI improvement',
    },
  ];

  return (
    <section
      ref={ref}
      className='relative py-32 overflow-hidden bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 transition-colors duration-300'
    >
      {/* Animated background elements */}
      <div className='absolute inset-0'>
        <div className='absolute top-20 left-10 w-96 h-96 bg-gradient-to-r from-pink-300/30 to-purple-300/30 dark:from-pink-600/20 dark:to-purple-600/20 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-3xl opacity-70 dark:opacity-40 animate-pulse'></div>
        <div
          className='absolute top-40 right-10 w-96 h-96 bg-gradient-to-r from-blue-300/30 to-cyan-300/30 dark:from-blue-600/20 dark:to-cyan-600/20 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-3xl opacity-70 dark:opacity-40 animate-pulse'
          style={{ animationDelay: '2s' }}
        ></div>
        <div
          className='absolute -bottom-20 left-1/2 transform -translate-x-1/2 w-96 h-96 bg-gradient-to-r from-indigo-300/30 to-purple-300/30 dark:from-indigo-600/20 dark:to-purple-600/20 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-3xl opacity-70 dark:opacity-40 animate-pulse'
          style={{ animationDelay: '4s' }}
        ></div>
      </div>

      {/* Floating geometric shapes */}
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          className='absolute opacity-20 dark:opacity-10'
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -50, 0],
            rotate: [0, 180, 360],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 10 + Math.random() * 5,
            repeat: Infinity,
            delay: Math.random() * 3,
            ease: 'easeInOut',
          }}
        >
          {i % 3 === 0 ? (
            <div className='w-4 h-4 bg-gradient-to-r from-indigo-500 to-purple-500 dark:from-indigo-400 dark:to-purple-400 rounded-full'></div>
          ) : i % 3 === 1 ? (
            <div className='w-3 h-3 bg-gradient-to-r from-pink-500 to-rose-500 dark:from-pink-400 dark:to-rose-400 rotate-45'></div>
          ) : (
            <div className='w-0 h-0 border-l-2 border-r-2 border-b-4 border-transparent border-b-blue-500 dark:border-b-blue-400'></div>
          )}
        </motion.div>
      ))}

      <div className='relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        {/* Header */}
        <motion.div
          className='text-center mb-20'
          initial={{ opacity: 0, y: 30 }}
          animate={controls}
          variants={{
            visible: {
              opacity: 1,
              y: 0,
              transition: { duration: 0.8, ease: 'easeOut' },
            },
          }}
        >
          <motion.div
            className='inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/50 dark:to-purple-950/50 border border-indigo-200 dark:border-indigo-800 mb-6'
            whileHover={{ scale: 1.05 }}
          >
            <span className='text-indigo-600 dark:text-indigo-400 text-sm font-medium'>
              💬 What Our Users Say
            </span>
          </motion.div>

          <h2 className='text-5xl lg:text-6xl font-bold mb-6'>
            <span className='bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent'>
              Loved by content creators
            </span>
            <br />
            <span className='bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-500 bg-clip-text text-transparent'>
              worldwide
            </span>
          </h2>

          <p className='text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed'>
            Join thousands of creators, marketers, and businesses who&apos;ve
            transformed their content strategy with KHRONOS.
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <motion.div
          className='grid md:grid-cols-3 gap-8'
          variants={containerVariants}
          initial='hidden'
          animate={controls}
        >
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              variants={cardVariants}
              whileHover={{
                y: -20,
                rotateY: 5,
                transition: { duration: 0.3 },
              }}
              onHoverStart={() => setHoveredCard(index)}
              onHoverEnd={() => setHoveredCard(null)}
              className='group relative perspective-1000'
            >
              {/* Glow effect */}
              <div className='absolute inset-0 bg-gradient-to-br from-white/20 to-white/5 dark:from-slate-600/20 dark:to-slate-800/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500'></div>

              {/* Main testimonial card */}
              <div className='relative h-full bg-white/90 dark:bg-slate-800/90 backdrop-blur-lg border border-white/50 dark:border-slate-600/50 rounded-2xl p-8 shadow-xl dark:shadow-slate-900/30 hover:shadow-2xl dark:hover:shadow-slate-900/50 transition-all duration-300 group-hover:bg-white/95 dark:group-hover:bg-slate-800/95'>
                {/* Quote */}
                <div className='mb-6'>
                  <div className='flex items-start mb-4'>
                    <div
                      className={`text-4xl bg-gradient-to-r ${testimonial.gradient} bg-clip-text text-transparent opacity-50`}
                    >
                      &ldquo;
                    </div>
                  </div>
                  <p className='text-slate-700 dark:text-slate-300 text-lg leading-relaxed italic group-hover:text-slate-800 dark:group-hover:text-slate-200 transition-colors duration-300'>
                    {testimonial.quote}
                  </p>
                </div>

                {/* Rating */}
                <div className='flex items-center mb-6'>
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <motion.div
                      key={i}
                      className='text-yellow-400 dark:text-yellow-500'
                      animate={
                        hoveredCard === index
                          ? {
                              scale: [1, 1.2, 1],
                              rotate: [0, 15, 0],
                            }
                          : {}
                      }
                      transition={{
                        duration: 0.3,
                        delay: i * 0.1,
                      }}
                    >
                      ⭐
                    </motion.div>
                  ))}
                </div>

                {/* Profile section */}
                <div className='flex items-center'>
                  <div
                    className={`w-12 h-12 bg-gradient-to-r ${testimonial.gradient} rounded-xl flex items-center justify-center text-white font-bold shadow-lg mr-4`}
                  >
                    {testimonial.avatar}
                  </div>
                  <div>
                    <h4 className='text-slate-900 dark:text-slate-100 font-semibold text-lg'>
                      {testimonial.name}
                    </h4>
                    <p className='text-slate-600 dark:text-slate-400 text-sm'>
                      {testimonial.role}
                    </p>
                  </div>
                </div>

                {/* Metric badge */}
                <div className='mt-6 pt-6 border-t border-slate-200 dark:border-slate-600'>
                  <div
                    className={`inline-flex items-center px-4 py-2 bg-gradient-to-r ${testimonial.gradient} bg-opacity-10 dark:bg-opacity-20 rounded-full`}
                  >
                    <div
                      className={`w-2 h-2 bg-gradient-to-r ${testimonial.gradient} rounded-full mr-2`}
                    ></div>
                    <span className='text-sm font-medium text-slate-700 dark:text-slate-300'>
                      {testimonial.metric}
                    </span>
                  </div>
                </div>

                {/* Hover indicator */}
                <div className='absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
                  <div
                    className={`w-3 h-3 bg-gradient-to-r ${testimonial.gradient} rounded-full animate-pulse`}
                  ></div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom section */}
        <motion.div
          className='text-center mt-20'
          initial={{ opacity: 0, y: 30 }}
          animate={controls}
          variants={{
            visible: {
              opacity: 1,
              y: 0,
              transition: { duration: 0.8, ease: 'easeOut', delay: 1 },
            },
          }}
        >
          <div className='flex items-center justify-center space-x-8 mb-8'>
            <div className='flex items-center space-x-2'>
              <div className='w-3 h-3 bg-green-500 dark:bg-green-400 rounded-full'></div>
              <span className='text-slate-600 dark:text-slate-400 font-medium'>
                99.9% Uptime
              </span>
            </div>
            <div className='flex items-center space-x-2'>
              <div className='w-3 h-3 bg-blue-500 dark:bg-blue-400 rounded-full'></div>
              <span className='text-slate-600 dark:text-slate-400 font-medium'>
                24/7 Support
              </span>
            </div>
            <div className='flex items-center space-x-2'>
              <div className='w-3 h-3 bg-purple-500 dark:bg-purple-400 rounded-full'></div>
              <span className='text-slate-600 dark:text-slate-400 font-medium'>
                Enterprise Grade
              </span>
            </div>
          </div>

          <p className='text-lg text-slate-600 dark:text-slate-400 mb-8'>
            Join thousands of satisfied customers who trust KHRONOS
          </p>

          <motion.button
            className='px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-500 dark:to-purple-600 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl dark:shadow-indigo-900/20 dark:hover:shadow-indigo-900/40 transition-all duration-300'
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Start Your Success Story
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
