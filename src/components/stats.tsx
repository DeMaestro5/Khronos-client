import React, { useEffect, useRef, useState } from 'react';
import { motion, useAnimation, useInView } from 'framer-motion';

const StatsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });
  const controls = useAnimation();

  useEffect(() => {
    if (isInView) {
      controls.start('visible');
    }
  }, [isInView, controls]);

  // Simplified counter hook
  const useCounter = (endValue: number, duration: number = 2000) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
      if (isInView) {
        let startTime: number;
        let animationFrame: number;

        const animate = (currentTime: number) => {
          if (!startTime) startTime = currentTime;
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);

          const easeOut = 1 - Math.pow(1 - progress, 3);
          const currentCount = Math.floor(easeOut * endValue);

          setCount(currentCount);

          if (progress < 1) {
            animationFrame = requestAnimationFrame(animate);
          }
        };

        animationFrame = requestAnimationFrame(animate);

        return () => {
          if (animationFrame) {
            cancelAnimationFrame(animationFrame);
          }
        };
      }
    }, [endValue, duration]);

    return count;
  };

  const stats = [
    {
      id: 1,
      number: 500000,
      suffix: '+',
      label: 'Posts Created',
      description: 'Content pieces generated',
      icon: '📝',
      color: 'from-blue-500 to-blue-600',
      bgColor: 'from-blue-500/10 to-blue-600/10',
      delay: 0.1,
    },
    {
      id: 2,
      number: 25000,
      suffix: '+',
      label: 'Active Users',
      description: 'Creators using KHRONOS',
      icon: '👥',
      color: 'from-emerald-500 to-emerald-600',
      bgColor: 'from-emerald-500/10 to-emerald-600/10',
      delay: 0.2,
    },
    {
      id: 3,
      number: 98,
      suffix: '%',
      label: 'Success Rate',
      description: 'Content optimization',
      icon: '🎯',
      color: 'from-purple-500 to-purple-600',
      bgColor: 'from-purple-500/10 to-purple-600/10',
      delay: 0.3,
    },
    {
      id: 4,
      number: 365,
      suffix: '',
      label: 'Days Uptime',
      description: 'Reliable service',
      icon: '⚡',
      color: 'from-orange-500 to-orange-600',
      bgColor: 'from-orange-500/10 to-orange-600/10',
      delay: 0.4,
    },
  ];

  const formatNumber = (num: number, suffix: string): string => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M${suffix}`;
    } else if (num >= 1000) {
      return `${Math.floor(num / 1000)}K${suffix}`;
    }
    return `${num}${suffix}`;
  };

  const StatCard = ({
    stat,
    index,
  }: {
    stat: (typeof stats)[0];
    index: number;
  }) => {
    const count = useCounter(stat.number, 2000 + index * 200);

    return (
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: index * 0.1 }}
        whileHover={{ y: -8, transition: { duration: 0.3 } }}
        className='group relative'
      >
        {/* Background glow effect */}
        <div
          className={`absolute inset-0 bg-gradient-to-br ${stat.bgColor} rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
        />

        {/* Main card */}
        <div className='relative bg-theme-card/90 backdrop-blur-lg border border-theme-primary rounded-2xl p-4 sm:p-6 lg:p-8 h-full transition-all duration-300 group-hover:bg-theme-card group-hover:border-theme-secondary shadow-theme-lg hover:shadow-theme-xl'>
          {/* Icon */}
          <motion.div
            className={`w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 bg-gradient-to-br ${stat.color} rounded-xl sm:rounded-2xl flex items-center justify-center text-lg sm:text-xl lg:text-2xl mb-4 sm:mb-6 shadow-theme-lg`}
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ duration: 0.3 }}
          >
            {stat.icon}
          </motion.div>

          {/* Content */}
          <div className='space-y-2 sm:space-y-3 mb-4 sm:mb-6'>
            <motion.div
              className={`text-2xl sm:text-3xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: stat.delay + 0.5 }}
            >
              {formatNumber(count, stat.suffix)}
            </motion.div>

            <h3 className='text-lg sm:text-xl font-semibold text-theme-primary mb-1 sm:mb-2'>
              {stat.label}
            </h3>
          </div>

          <p className='text-theme-secondary text-xs sm:text-sm'>
            {stat.description}
          </p>

          {/* Progress bar */}
          <div className='mt-4 sm:mt-6 h-1 bg-theme-tertiary rounded-full overflow-hidden'>
            <motion.div
              className={`h-full bg-gradient-to-r ${stat.color} rounded-full`}
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{
                duration: 2,
                delay: stat.delay + 1,
                ease: 'easeOut',
              }}
            />
          </div>

          {/* Floating dot animation */}
          <motion.div
            className={`absolute top-3 right-3 sm:top-4 sm:right-4 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gradient-to-r ${stat.color} rounded-full`}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: index * 0.3,
            }}
          />
        </div>
      </motion.div>
    );
  };

  return (
    <section
      ref={ref}
      className='relative py-12 sm:py-16 lg:py-20 overflow-hidden bg-theme-secondary theme-transition'
    >
      {/* Background decorations */}
      <div className='absolute inset-0'>
        {/* Gradient orbs */}
        <div className='absolute top-20 left-20 w-72 h-72 bg-accent-primary/10 rounded-full mix-blend-multiply filter blur-xl animate-pulse' />
        <div
          className='absolute bottom-20 right-20 w-72 h-72 bg-accent-secondary/10 rounded-full mix-blend-multiply filter blur-xl animate-pulse'
          style={{ animationDelay: '1s' }}
        />

        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJtIDQwIDAgbCAwIDQwIiBzdHJva2U9IiMzMzM3NDQiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSIvPjxwYXRoIGQ9Im0gMCA0MCBsIDQwIDAiIHN0cm9rZT0iIzMzMzc0NCIgc3Ryb2tlLXdpZHRoPSIxIiBmaWxsPSJub25lIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIiBvcGFjaXR5PSIwLjEiLz48L3N2Zz4=')] opacity-20" />

        {/* Floating particles */}
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            className='absolute w-2 h-2 bg-accent-primary/30 rounded-full opacity-30'
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 4 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      <div className='relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        {/* Header */}
        <motion.div
          className='text-center mb-8 sm:mb-12 lg:mb-16'
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
            className='inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 rounded-full bg-theme-tertiary border border-theme-primary backdrop-blur-sm mb-4 sm:mb-6'
            whileHover={{ scale: 1.05 }}
          >
            <span className='text-accent-primary text-xs sm:text-sm font-medium'>
              📊 Our Impact
            </span>
          </motion.div>

          <h2 className='text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 sm:mb-6'>
            <span className='text-theme-primary'>Trusted by thousands</span>
            <br />
            <span className='bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-blue-400 dark:to-indigo-500 bg-clip-text text-transparent'>
              worldwide
            </span>
          </h2>

          <p className='text-base sm:text-lg lg:text-xl text-theme-secondary max-w-3xl mx-auto leading-relaxed px-4'>
            See the real impact KHRONOS has made for content creators and
            businesses around the globe.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8'>
          {stats.map((stat, index) => (
            <StatCard key={stat.id} stat={stat} index={index} />
          ))}
        </div>

        {/* Bottom CTA */}
      </div>
    </section>
  );
};

export default StatsSection;
