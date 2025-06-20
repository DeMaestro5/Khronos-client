import React, { useEffect, useRef } from 'react';
import { motion, useAnimation, useInView } from 'framer-motion';

const FeaturesSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });
  const controls = useAnimation();

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
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 50,
      rotateX: -15,
    },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  };

  const iconVariants = {
    hover: {
      scale: 1.2,
      rotate: 360,
      transition: {
        duration: 0.6,
        ease: 'easeInOut',
      },
    },
  };

  const features = [
    {
      title: 'AI Content Intelligence',
      description:
        'Get data-driven insights on what content performs best for your specific audience and niche.',
      icon: '🧠',
      gradient:
        'from-purple-500 to-pink-500 dark:from-purple-600 dark:to-pink-600',
      shadowColor: 'shadow-purple-500/20 dark:shadow-purple-600/30',
      bgGradient:
        'from-purple-500/10 to-pink-500/10 dark:from-purple-600/20 dark:to-pink-600/20',
    },
    {
      title: 'Smart Scheduling',
      description:
        'Automatically schedule posts at optimal times based on your audience engagement patterns.',
      icon: '⏰',
      gradient: 'from-blue-500 to-cyan-500 dark:from-blue-600 dark:to-cyan-600',
      shadowColor: 'shadow-blue-500/20 dark:shadow-blue-600/30',
      bgGradient:
        'from-blue-500/10 to-cyan-500/10 dark:from-blue-600/20 dark:to-cyan-600/20',
    },
    {
      title: 'Multi-Platform Publishing',
      description:
        'Publish to all your social channels simultaneously with platform-specific optimization.',
      icon: '🚀',
      gradient:
        'from-orange-500 to-red-500 dark:from-orange-600 dark:to-red-600',
      shadowColor: 'shadow-orange-500/20 dark:shadow-orange-600/30',
      bgGradient:
        'from-orange-500/10 to-red-500/10 dark:from-orange-600/20 dark:to-red-600/20',
    },
    {
      title: 'Performance Analytics',
      description:
        'Track ROI, engagement rates, and conversion metrics with detailed reporting dashboards.',
      icon: '📊',
      gradient:
        'from-green-500 to-emerald-500 dark:from-green-600 dark:to-emerald-600',
      shadowColor: 'shadow-green-500/20 dark:shadow-green-600/30',
      bgGradient:
        'from-green-500/10 to-emerald-500/10 dark:from-green-600/20 dark:to-emerald-600/20',
    },
    {
      title: 'Team Collaboration',
      description:
        'Streamline workflows with approval processes, role-based access, and real-time collaboration.',
      icon: '👥',
      gradient:
        'from-indigo-500 to-purple-500 dark:from-indigo-600 dark:to-purple-600',
      shadowColor: 'shadow-indigo-500/20 dark:shadow-indigo-600/30',
      bgGradient:
        'from-indigo-500/10 to-purple-500/10 dark:from-indigo-600/20 dark:to-purple-600/20',
    },
    {
      title: 'Content Calendar',
      description:
        'Visualize your entire content strategy with drag-and-drop calendar management.',
      icon: '📅',
      gradient: 'from-pink-500 to-rose-500 dark:from-pink-600 dark:to-rose-600',
      shadowColor: 'shadow-pink-500/20 dark:shadow-pink-600/30',
      bgGradient:
        'from-pink-500/10 to-rose-500/10 dark:from-pink-600/20 dark:to-rose-600/20',
    },
  ];

  return (
    <section
      ref={ref}
      className='relative py-32 overflow-hidden bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 transition-colors duration-300'
    >
      {/* Animated background elements */}
      <div className='absolute inset-0'>
        <div className='absolute top-20 left-10 w-72 h-72 bg-purple-500/20 dark:bg-purple-600/30 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-xl opacity-70 dark:opacity-40 animate-pulse'></div>
        <div
          className='absolute top-40 right-10 w-72 h-72 bg-cyan-500/20 dark:bg-cyan-600/30 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-xl opacity-70 dark:opacity-40 animate-pulse'
          style={{ animationDelay: '2s' }}
        ></div>
        <div
          className='absolute -bottom-8 left-20 w-72 h-72 bg-pink-500/20 dark:bg-pink-600/30 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-xl opacity-70 dark:opacity-40 animate-pulse'
          style={{ animationDelay: '4s' }}
        ></div>
      </div>

      {/* Floating particles */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className='absolute w-2 h-2 bg-indigo-400 dark:bg-blue-400 rounded-full opacity-30 dark:opacity-20'
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -100, 0],
            opacity: [0.3, 0.8, 0.3],
          }}
          transition={{
            duration: 8 + Math.random() * 4,
            repeat: Infinity,
            delay: Math.random() * 2,
            ease: 'easeInOut',
          }}
        />
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
            className='inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/50 dark:to-purple-950/50 border border-indigo-200 dark:border-indigo-800 backdrop-blur-sm mb-6'
            whileHover={{ scale: 1.05 }}
          >
            <span className='text-indigo-600 dark:text-indigo-400 text-sm font-medium'>
              ✨ Powerful Features
            </span>
          </motion.div>

          <h2 className='text-5xl lg:text-6xl font-bold mb-6'>
            <span className='bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent'>
              Everything you need to
            </span>
            <br />
            <span className='bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-500 bg-clip-text text-transparent'>
              scale your content
            </span>
          </h2>

          <p className='text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed'>
            From planning to publishing, our AI-powered platform handles it all
            with cutting-edge technology and intuitive design.
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          className='grid md:grid-cols-2 lg:grid-cols-3 gap-8'
          variants={containerVariants}
          initial='hidden'
          animate={controls}
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              variants={cardVariants}
              whileHover={{
                y: -10,
                rotateY: 5,
                transition: { duration: 0.3 },
              }}
              className='group relative perspective-1000'
            >
              {/* Glow effect */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${feature.bgGradient} rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
              />

              {/* Main card */}
              <div className='relative h-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg border border-white/40 dark:border-slate-600/40 rounded-2xl p-8 shadow-lg dark:shadow-slate-900/20 hover:shadow-2xl dark:hover:shadow-slate-900/40 transition-all duration-300 group-hover:bg-white/90 dark:group-hover:bg-slate-800/90 group-hover:border-white/60 dark:group-hover:border-slate-600/60'>
                {/* Floating icon */}
                <motion.div
                  className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center text-2xl mb-6 shadow-lg ${feature.shadowColor} group-hover:shadow-xl transition-all duration-300`}
                  variants={iconVariants}
                  whileHover='hover'
                >
                  {feature.icon}
                </motion.div>

                {/* Content */}
                <h3 className='text-xl font-bold text-slate-900 dark:text-slate-100 mb-4 group-hover:text-indigo-700 dark:group-hover:text-indigo-400 transition-colors duration-300'>
                  {feature.title}
                </h3>

                <p className='text-slate-600 dark:text-slate-400 leading-relaxed group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors duration-300'>
                  {feature.description}
                </p>

                {/* Hover arrow */}
                <div className='absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0'>
                  <div
                    className={`p-2 bg-gradient-to-r ${feature.gradient} rounded-full shadow-lg`}
                  >
                    <svg
                      className='w-4 h-4 text-white'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M17 8l4 4m0 0l-4 4m4-4H3'
                      />
                    </svg>
                  </div>
                </div>

                {/* Decorative elements */}
                <motion.div
                  className={`absolute top-4 right-4 w-2 h-2 bg-gradient-to-r ${feature.gradient} rounded-full opacity-60`}
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.6, 1, 0.6],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: index * 0.2,
                  }}
                />
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom CTA */}
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
          <p className='text-lg text-slate-600 dark:text-slate-400 mb-8'>
            Ready to transform your content strategy?
          </p>
          <motion.button
            className='px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-500 dark:to-purple-600 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl dark:shadow-indigo-900/20 dark:hover:shadow-indigo-900/40 transition-all duration-300 hover:scale-105'
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Start Your Free Trial
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesSection;
