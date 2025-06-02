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
      color: 'from-blue-400 to-blue-600',
      bgColor: 'from-blue-500/20 to-blue-600/20',
    },
    {
      id: 2,
      number: 25000,
      suffix: '+',
      label: 'Active Users',
      description: 'Creators using KHRONOS',
      icon: '👥',
      color: 'from-emerald-400 to-emerald-600',
      bgColor: 'from-emerald-500/20 to-emerald-600/20',
    },
    {
      id: 3,
      number: 98,
      suffix: '%',
      label: 'Success Rate',
      description: 'Content optimization',
      icon: '🎯',
      color: 'from-purple-400 to-purple-600',
      bgColor: 'from-purple-500/20 to-purple-600/20',
    },
    {
      id: 4,
      number: 365,
      suffix: '',
      label: 'Days Uptime',
      description: 'Reliable service',
      icon: '⚡',
      color: 'from-orange-400 to-orange-600',
      bgColor: 'from-orange-500/20 to-orange-600/20',
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
        <div className='relative bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8 h-full transition-all duration-300 group-hover:bg-white/15 group-hover:border-white/30'>
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

            <h3 className='text-xl font-semibold text-white mb-2'>
              {stat.label}
            </h3>
          </div>

          {/* Description */}
          <p className='text-slate-300 text-sm'>{stat.description}</p>

          {/* Progress indicator */}
          <div className='mt-6 h-1 bg-white/10 rounded-full overflow-hidden'>
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
      className='relative py-20 overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900'
    >
      {/* Background decorations */}
      <div className='absolute inset-0'>
        {/* Gradient orbs */}
        <div className='absolute top-20 left-20 w-72 h-72 bg-blue-500/20 rounded-full mix-blend-multiply filter blur-xl animate-pulse' />
        <div
          className='absolute bottom-20 right-20 w-72 h-72 bg-purple-500/20 rounded-full mix-blend-multiply filter blur-xl animate-pulse'
          style={{ animationDelay: '1s' }}
        />

        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJtIDQwIDAgbCAwIDQwIiBzdHJva2U9IiMzMzM3NDQiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSIvPjxwYXRoIGQ9Im0gMCA0MCBsIDQwIDAiIHN0cm9rZT0iIzMzMzc0NCIgc3Ryb2tlLXdpZHRoPSIxIiBmaWxsPSJub25lIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIiBvcGFjaXR5PSIwLjEiLz48L3N2Zz4=')] opacity-30" />
      </div>

      <div className='relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        {/* Header */}
        <motion.div
          className='text-center mb-16'
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className='inline-flex items-center px-6 py-3 rounded-full bg-slate-800/50 border border-slate-700/50 backdrop-blur-sm mb-6'
            whileHover={{ scale: 1.05 }}
          >
            <span className='text-indigo-400 text-sm font-medium'>
              📊 Platform Impact
            </span>
          </motion.div>

          <h2 className='text-4xl lg:text-5xl font-bold mb-6'>
            <span className='bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent'>
              Numbers That Tell
            </span>
            <br />
            <span className='bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent'>
              Our Story
            </span>
          </h2>

          <p className='text-xl text-slate-300 max-w-3xl mx-auto'>
            See the real impact KHRONOS is making for creators and businesses
            worldwide
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className='grid md:grid-cols-2 lg:grid-cols-4 gap-8'>
          {stats.map((stat, index) => (
            <StatCard key={stat.id} stat={stat} index={index} />
          ))}
        </div>

        {/* Bottom accent line */}
        <motion.div
          className='flex justify-center mt-16'
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 1, delay: 1.5 }}
        >
          <div className='h-px w-32 bg-gradient-to-r from-transparent via-indigo-500 to-transparent' />
        </motion.div>
      </div>
    </section>
  );
};

export default StatsSection;
