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
      gradient: 'from-pink-500 to-rose-500',
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
      gradient: 'from-blue-500 to-cyan-500',
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
      gradient: 'from-purple-500 to-indigo-500',
      company: 'Growth Labs',
      rating: 5,
      metric: '250% ROI improvement',
    },
  ];

  return (
    <section
      ref={ref}
      className='relative py-32 overflow-hidden bg-theme-primary theme-transition'
    >
      {/* Animated background elements */}
      <div className='absolute inset-0'>
        <div className='absolute top-20 left-10 w-96 h-96 bg-accent-primary/5 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-pulse'></div>
        <div
          className='absolute top-40 right-10 w-96 h-96 bg-accent-secondary/5 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-pulse'
          style={{ animationDelay: '2s' }}
        ></div>
        <div
          className='absolute -bottom-20 left-1/2 transform -translate-x-1/2 w-96 h-96 bg-accent-info/5 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-pulse'
          style={{ animationDelay: '4s' }}
        ></div>
      </div>

      {/* Floating geometric shapes */}
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          className='absolute opacity-20'
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
            <div className='w-4 h-4 bg-accent-primary rounded-full'></div>
          ) : i % 3 === 1 ? (
            <div className='w-3 h-3 bg-accent-secondary rotate-45'></div>
          ) : (
            <div className='w-0 h-0 border-l-2 border-r-2 border-b-4 border-transparent border-b-accent-primary'></div>
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
            className='inline-flex items-center px-6 py-3 rounded-full bg-theme-tertiary border border-theme-primary mb-6'
            whileHover={{ scale: 1.05 }}
          >
            <span className='text-accent-primary text-sm font-medium'>
              💬 What Our Users Say
            </span>
          </motion.div>

          <h2 className='text-5xl lg:text-6xl font-bold mb-6'>
            <span className='text-theme-primary'>
              Loved by content creators
            </span>
            <br />
            <span className='bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-blue-400 dark:to-indigo-500 bg-clip-text text-transparent'>
              worldwide
            </span>
          </h2>

          <p className='text-xl text-theme-secondary max-w-3xl mx-auto leading-relaxed'>
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
              <div className='absolute inset-0 bg-gradient-to-br from-theme-card/20 to-theme-tertiary/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500'></div>

              {/* Main testimonial card */}
              <div className='relative h-full bg-theme-card/90 backdrop-blur-lg border border-theme-primary rounded-2xl p-8 shadow-theme-xl hover:shadow-theme-xl transition-all duration-300 group-hover:bg-theme-card group-hover:border-theme-secondary'>
                {/* Quote */}
                <div className='mb-6'>
                  <div className='flex items-start mb-4'>
                    <div
                      className={`text-4xl bg-gradient-to-r ${testimonial.gradient} bg-clip-text text-transparent opacity-50`}
                    >
                      &ldquo;
                    </div>
                  </div>
                  <p className='text-theme-secondary text-lg leading-relaxed italic group-hover:text-theme-primary transition-colors duration-300'>
                    {testimonial.quote}
                  </p>
                </div>

                {/* Rating */}
                <div className='flex items-center mb-6'>
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <motion.div
                      key={i}
                      className='text-yellow-400'
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
                    className={`w-12 h-12 bg-gradient-to-r ${testimonial.gradient} rounded-xl flex items-center justify-center text-white font-bold shadow-theme-lg mr-4`}
                  >
                    {testimonial.avatar}
                  </div>
                  <div>
                    <h4 className='text-theme-primary font-semibold text-lg'>
                      {testimonial.name}
                    </h4>
                    <p className='text-theme-secondary text-sm'>
                      {testimonial.role}
                    </p>
                  </div>
                </div>

                {/* Metric badge */}
                <div className='mt-6 pt-6 border-t border-theme-primary'>
                  <div
                    className={`inline-flex items-center px-4 py-2 bg-gradient-to-r ${testimonial.gradient} bg-opacity-10 rounded-full`}
                  >
                    <div
                      className={`w-2 h-2 bg-gradient-to-r ${testimonial.gradient} rounded-full mr-2`}
                    ></div>
                    <span className='text-sm font-medium text-theme-primary'>
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
              <div className='w-3 h-3 bg-accent-success rounded-full'></div>
              <span className='text-theme-secondary font-medium'>
                99.9% Uptime
              </span>
            </div>
            <div className='flex items-center space-x-2'>
              <div className='w-3 h-3 bg-accent-primary rounded-full'></div>
              <span className='text-theme-secondary font-medium'>
                24/7 Support
              </span>
            </div>
            <div className='flex items-center space-x-2'>
              <div className='w-3 h-3 bg-accent-secondary rounded-full'></div>
              <span className='text-theme-secondary font-medium'>
                Enterprise Grade
              </span>
            </div>
          </div>

          <p className='text-lg text-theme-secondary mb-8'>
            Join thousands of satisfied customers who trust KHRONOS
          </p>

          <motion.button
            className='px-8 py-4 bg-accent-primary hover:bg-accent-secondary text-white font-semibold rounded-2xl shadow-theme-lg hover:shadow-theme-xl transition-all duration-300'
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
