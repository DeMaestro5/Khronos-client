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

  const floatingVariants = {
    animate: {
      y: [-10, 10, -10],
      rotate: [-2, 2, -2],
      transition: {
        duration: 6,
        repeat: Infinity,
        ease: 'easeInOut',
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
      gradient: 'from-purple-500 to-pink-500',
      shadowColor: 'shadow-purple-500/20',
    },
    {
      title: 'Smart Scheduling',
      description:
        'Automatically schedule posts at optimal times based on your audience engagement patterns.',
      icon: '⏰',
      gradient: 'from-blue-500 to-cyan-500',
      shadowColor: 'shadow-blue-500/20',
    },
    {
      title: 'Multi-Platform Publishing',
      description:
        'Publish to all your social channels simultaneously with platform-specific optimization.',
      icon: '🚀',
      gradient: 'from-orange-500 to-red-500',
      shadowColor: 'shadow-orange-500/20',
    },
    {
      title: 'Performance Analytics',
      description:
        'Track ROI, engagement rates, and conversion metrics with detailed reporting dashboards.',
      icon: '📊',
      gradient: 'from-green-500 to-emerald-500',
      shadowColor: 'shadow-green-500/20',
    },
    {
      title: 'Team Collaboration',
      description:
        'Streamline workflows with approval processes, role-based access, and real-time collaboration.',
      icon: '👥',
      gradient: 'from-indigo-500 to-purple-500',
      shadowColor: 'shadow-indigo-500/20',
    },
    {
      title: 'Content Calendar',
      description:
        'Visualize your entire content strategy with drag-and-drop calendar management.',
      icon: '📅',
      gradient: 'from-pink-500 to-rose-500',
      shadowColor: 'shadow-pink-500/20',
    },
  ];

  return (
    <section
      ref={ref}
      className='relative py-32 overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900'
    >
      {/* Animated background elements */}
      <div className='absolute inset-0'>
        <div className='absolute top-20 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse'></div>
        <div
          className='absolute top-40 right-10 w-72 h-72 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse'
          style={{ animationDelay: '2s' }}
        ></div>
        <div
          className='absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse'
          style={{ animationDelay: '4s' }}
        ></div>
      </div>

      {/* Floating particles */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className='absolute w-2 h-2 bg-white rounded-full opacity-20'
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -100, 0],
            opacity: [0.2, 0.8, 0.2],
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
            className='inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 backdrop-blur-sm mb-6'
            whileHover={{ scale: 1.05 }}
          >
            <span className='text-indigo-300 text-sm font-medium'>
              ✨ Powerful Features
            </span>
          </motion.div>

          <h2 className='text-5xl lg:text-6xl font-bold mb-6'>
            <span className='bg-gradient-to-r from-white via-indigo-200 to-purple-200 bg-clip-text text-transparent'>
              Everything you need to
            </span>
            <br />
            <span className='bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent'>
              scale your content
            </span>
          </h2>

          <p className='text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed'>
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
                y: -15,
                rotateY: 5,
                transition: { duration: 0.3 },
              }}
              className='group relative'
            >
              {/* Floating animation wrapper */}
              <motion.div
                variants={floatingVariants}
                animate='animate'
                style={{ animationDelay: `${index * 0.5}s` }}
              >
                {/* Card */}
                <div
                  className={`relative h-full p-8 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg border border-white/20 ${feature.shadowColor} shadow-2xl group-hover:shadow-3xl transition-all duration-500 overflow-hidden`}
                >
                  {/* Animated background gradient */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
                  ></div>

                  {/* Glowing border effect */}
                  <div
                    className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${feature.gradient} opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500`}
                  ></div>

                  {/* Content */}
                  <div className='relative z-10'>
                    {/* Icon */}
                    <motion.div
                      className={`inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-r ${feature.gradient} mb-6 shadow-lg`}
                      variants={iconVariants}
                      whileHover='hover'
                    >
                      <span className='text-2xl'>{feature.icon}</span>
                    </motion.div>

                    {/* Title */}
                    <h3 className='text-xl font-bold text-white mb-4 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-indigo-200 group-hover:bg-clip-text transition-all duration-300'>
                      {feature.title}
                    </h3>

                    {/* Description */}
                    <p className='text-slate-300 leading-relaxed group-hover:text-slate-200 transition-colors duration-300'>
                      {feature.description}
                    </p>

                    {/* Hover indicator */}
                    <motion.div
                      className={`absolute bottom-4 right-4 w-2 h-2 rounded-full bg-gradient-to-r ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                      animate={{
                        scale: [1, 1.5, 1],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: 'easeInOut',
                      }}
                    />
                  </div>

                  {/* Shimmer effect */}
                  <div className='absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12'></div>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesSection;
