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

  const floatingVariants = {
    animate: {
      y: [-8, 8, -8],
      rotate: [-1, 1, -1],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: 'easeInOut',
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
      className='relative py-32 overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-purple-50'
    >
      {/* Animated background elements */}
      <div className='absolute inset-0'>
        <div className='absolute top-20 left-10 w-96 h-96 bg-gradient-to-r from-pink-300 to-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse'></div>
        <div
          className='absolute top-40 right-10 w-96 h-96 bg-gradient-to-r from-blue-300 to-cyan-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse'
          style={{ animationDelay: '2s' }}
        ></div>
        <div
          className='absolute -bottom-20 left-1/2 transform -translate-x-1/2 w-96 h-96 bg-gradient-to-r from-indigo-300 to-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse'
          style={{ animationDelay: '4s' }}
        ></div>
      </div>

      {/* Floating geometric shapes */}
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          className='absolute opacity-10'
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
            <div className='w-4 h-4 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full'></div>
          ) : i % 3 === 1 ? (
            <div className='w-3 h-3 bg-gradient-to-r from-pink-500 to-rose-500 rotate-45'></div>
          ) : (
            <div className='w-0 h-0 border-l-2 border-r-2 border-b-4 border-transparent border-b-blue-500'></div>
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
            className='inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-indigo-100 to-purple-100 border border-indigo-200 mb-6'
            whileHover={{ scale: 1.05 }}
          >
            <span className='text-indigo-600 text-sm font-medium'>
              💬 What Our Users Say
            </span>
          </motion.div>

          <h2 className='text-5xl lg:text-6xl font-bold mb-6'>
            <span className='bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent'>
              Loved by content creators
            </span>
            <br />
            <span className='bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent'>
              worldwide
            </span>
          </h2>

          <p className='text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed'>
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
              className='group relative'
            >
              {/* Floating animation wrapper */}
              <motion.div
                variants={floatingVariants}
                animate='animate'
                style={{ animationDelay: `${index * 0.7}s` }}
              >
                {/* Card */}
                <div className='relative h-full p-8 rounded-3xl bg-white/70 backdrop-blur-xl border border-white/50 shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden'>
                  {/* Animated background gradient */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${testimonial.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}
                  ></div>

                  {/* Glowing border effect */}
                  <div
                    className={`absolute inset-0 rounded-3xl bg-gradient-to-r ${testimonial.gradient} opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500`}
                  ></div>

                  {/* Content */}
                  <div className='relative z-10'>
                    {/* Stars */}
                    <div className='flex items-center mb-6'>
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <motion.span
                          key={i}
                          className='text-yellow-400 text-xl'
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{
                            delay: 0.5 + i * 0.1,
                            duration: 0.3,
                            type: 'spring',
                            stiffness: 200,
                          }}
                          whileHover={{
                            scale: 1.3,
                            rotate: 15,
                            transition: { duration: 0.2 },
                          }}
                        >
                          ★
                        </motion.span>
                      ))}
                    </div>

                    {/* Quote */}
                    <blockquote className='text-slate-700 text-lg leading-relaxed mb-8 font-medium'>
                      &quot;{testimonial.quote}&quot;
                    </blockquote>

                    {/* Metric Badge */}
                    <motion.div
                      className={`inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r ${testimonial.gradient} text-white text-sm font-semibold mb-6 shadow-lg`}
                      whileHover={{ scale: 1.05 }}
                    >
                      📈 {testimonial.metric}
                    </motion.div>

                    {/* Author */}
                    <div className='flex items-center space-x-4'>
                      <motion.div
                        className={`w-14 h-14 rounded-full bg-gradient-to-r ${testimonial.gradient} flex items-center justify-center text-white font-bold text-lg shadow-lg`}
                        whileHover={{
                          scale: 1.1,
                          rotate: 5,
                          transition: { duration: 0.2 },
                        }}
                      >
                        {testimonial.avatar}
                      </motion.div>
                      <div>
                        <div className='font-bold text-slate-900 text-lg'>
                          {testimonial.name}
                        </div>
                        <div className='text-slate-600 text-sm'>
                          {testimonial.role}
                        </div>
                        <div className='text-slate-500 text-xs mt-1'>
                          {testimonial.company}
                        </div>
                      </div>
                    </div>

                    {/* Hover indicator */}
                    <motion.div
                      className={`absolute top-4 right-4 w-3 h-3 rounded-full bg-gradient-to-r ${testimonial.gradient}`}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={
                        hoveredCard === index
                          ? {
                              scale: [1, 1.5, 1],
                              opacity: 1,
                            }
                          : { scale: 0, opacity: 0 }
                      }
                      transition={{
                        duration: 0.6,
                        repeat: hoveredCard === index ? Infinity : 0,
                        ease: 'easeInOut',
                      }}
                    />
                  </div>

                  {/* Shimmer effect */}
                  <div className='absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12'></div>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom Section */}
        <motion.div
          className='text-center mt-20'
          initial={{ opacity: 0, y: 30 }}
          animate={controls}
          variants={{
            visible: {
              opacity: 1,
              y: 0,
              transition: { duration: 0.8, delay: 1.2, ease: 'easeOut' },
            },
          }}
        >
          {/* Stats */}
          <div className='flex justify-center items-center space-x-12 mb-8'>
            {[
              { value: '10k+', label: 'Happy Users' },
              { value: '4.9/5', label: 'Average Rating' },
              { value: '99%', label: 'Satisfaction' },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                className='text-center'
                whileHover={{ scale: 1.1 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5 + i * 0.1, duration: 0.5 }}
              >
                <div className='text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent'>
                  {stat.value}
                </div>
                <div className='text-slate-600 text-sm font-medium'>
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>

          {/* CTA */}
          <motion.button
            className='inline-flex items-center px-8 py-4 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300'
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <span>Join Our Community</span>
            <motion.span
              className='ml-2 text-xl'
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              →
            </motion.span>
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
