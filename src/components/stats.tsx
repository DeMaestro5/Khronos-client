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
      color: 'from-blue-400 to-blue-600 dark:from-blue-500 dark:to-blue-700',
      bgColor:
        'from-blue-500/20 to-blue-600/20 dark:from-blue-600/30 dark:to-blue-700/30',
    },
    {
      id: 2,
      number: 25000,
      suffix: '+',
      label: 'Active Users',
      description: 'Creators using KHRONOS',
      icon: '👥',
      color:
        'from-emerald-400 to-emerald-600 dark:from-emerald-500 dark:to-emerald-700',
      bgColor:
        'from-emerald-500/20 to-emerald-600/20 dark:from-emerald-600/30 dark:to-emerald-700/30',
    },
    {
      id: 3,
      number: 98,
      suffix: '%',
      label: 'Success Rate',
      description: 'Content optimization',
      icon: '🎯',
      color:
        'from-purple-400 to-purple-600 dark:from-purple-500 dark:to-purple-700',
      bgColor:
        'from-purple-500/20 to-purple-600/20 dark:from-purple-600/30 dark:to-purple-700/30',
    },
    {
      id: 4,
      number: 365,
      suffix: '',
      label: 'Days Uptime',
      description: 'Reliable service',
      icon: '⚡',
      color:
        'from-orange-400 to-orange-600 dark:from-orange-500 dark:to-orange-700',
      bgColor:
        'from-orange-500/20 to-orange-600/20 dark:from-orange-600/30 dark:to-orange-700/30',
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
        <div className='relative bg-white/90 dark:bg-slate-800/90 backdrop-blur-lg border border-white/40 dark:border-slate-600/40 rounded-2xl p-8 h-full transition-all duration-300 group-hover:bg-white/95 dark:group-hover:bg-slate-800/95 group-hover:border-white/60 dark:group-hover:border-slate-600/60 shadow-lg dark:shadow-slate-900/20 hover:shadow-2xl dark:hover:shadow-slate-900/40'>
          {/* Icon */}
          <motion.div
            className={`w-16 h-16 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center text-2xl mb-6 shadow-lg`}
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ duration: 0.2 }}
          >
            {stat.icon}
          </motion.div>

          {/* Animated number */}
          <div className='space-y-2 mb-4'>
            <div
              className={`text-4xl lg:text-5xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}
            >
              {formatNumber(count, stat.suffix)}
            </div>

            <h3 className='text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2'>
              {stat.label}
            </h3>
          </div>

          {/* Description */}
          <p className='text-slate-600 dark:text-slate-400 text-sm'>
            {stat.description}
          </p>

          {/* Progress indicator */}
          <div className='mt-6 h-1 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden'>
            <motion.div
              className={`h-full bg-gradient-to-r ${stat.color} rounded-full`}
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{
                duration: 2,
                delay: index * 0.2 + 1,
                ease: 'easeOut',
              }}
            />
          </div>

          {/* Floating dot animation */}
          <motion.div
            className={`absolute top-4 right-4 w-2 h-2 bg-gradient-to-r ${stat.color} rounded-full`}
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
      className='relative py-20 overflow-hidden bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 transition-colors duration-300'
    >
      {/* Background decorations */}
      <div className='absolute inset-0'>
        {/* Gradient orbs */}
        <div className='absolute top-20 left-20 w-72 h-72 bg-blue-500/30 dark:bg-blue-600/20 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-xl animate-pulse' />
        <div
          className='absolute bottom-20 right-20 w-72 h-72 bg-purple-500/30 dark:bg-purple-600/20 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-xl animate-pulse'
          style={{ animationDelay: '1s' }}
        />

        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJtIDQwIDAgbCAwIDQwIiBzdHJva2U9IiMzMzM3NDQiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSIvPjxwYXRoIGQ9Im0gMCA0MCBsIDQwIDAiIHN0cm9rZT0iIzMzMzc0NCIgc3Ryb2tlLXdpZHRoPSIxIiBmaWxsPSJub25lIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIiBvcGFjaXR5PSIwLjEiLz48L3N2Zz4=')] opacity-20 dark:opacity-10" />

        {/* Floating particles */}
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            className='absolute w-2 h-2 bg-indigo-400 dark:bg-blue-400 rounded-full opacity-30 dark:opacity-20'
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
          className='text-center mb-16'
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
              📊 Our Impact
            </span>
          </motion.div>

          <h2 className='text-5xl lg:text-6xl font-bold mb-6'>
            <span className='bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent'>
              Trusted by thousands
            </span>
            <br />
            <span className='bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-500 bg-clip-text text-transparent'>
              worldwide
            </span>
          </h2>

          <p className='text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed'>
            See the real impact KHRONOS has made for content creators and
            businesses around the globe.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
          {stats.map((stat, index) => (
            <StatCard key={stat.id} stat={stat} index={index} />
          ))}
        </div>

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
            Ready to join our growing community?
          </p>
          <motion.button
            className='px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-500 dark:to-purple-600 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl dark:shadow-indigo-900/20 dark:hover:shadow-indigo-900/40 transition-all duration-300'
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Get Started Today
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default StatsSection;
