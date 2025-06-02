import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LeftSideSignUp({
  mousePosition,
}: {
  mousePosition: { x: number; y: number };
}) {
  const [isVisible, setIsVisible] = useState(false);
  const [currentFeature, setCurrentFeature] = useState(0);
  const [glowIntensity, setGlowIntensity] = useState(0.5);
  const [isLoading, setIsLoading] = useState(true);
  const [floatingElements, setFloatingElements] = useState<
    Array<{
      id: number;
      size: number;
      x: number;
      y: number;
      delay: number;
      duration: number;
      opacity: number;
    }>
  >([]);

  const router = useRouter();

  useEffect(() => {
    // Generate floating elements on client-side only
    setFloatingElements(
      Array.from({ length: 20 }, (_, i) => ({
        id: i,
        size: 2 + Math.random() * 4,
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: Math.random() * 10,
        duration: 15 + Math.random() * 20,
        opacity: 0.1 + Math.random() * 0.3,
      }))
    );

    setIsVisible(true);
    setIsLoading(false);

    // Cycle through features every 5 seconds
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % 4);
    }, 5000);

    // Dynamic glow effect
    const glowInterval = setInterval(() => {
      setGlowIntensity(0.3 + Math.sin(Date.now() / 2000) * 0.4);
    }, 100);

    return () => {
      clearInterval(interval);
      clearInterval(glowInterval);
    };
  }, []);

  const features = [
    {
      icon: '🤖',
      title: 'AI Content Intelligence',
      description:
        'Advanced algorithms predict viral trends and suggest high-impact content strategies',
      color: 'from-violet-400 via-purple-400 to-fuchsia-400',
      accent: 'text-violet-300',
    },
    {
      icon: '⚡',
      title: 'Smart Optimization',
      description:
        'Real-time analysis determines the perfect posting schedule for maximum reach',
      color: 'from-cyan-400 via-blue-400 to-indigo-400',
      accent: 'text-cyan-300',
    },
    {
      icon: '📊',
      title: 'Predictive Analytics',
      description:
        'Data-driven insights forecast engagement patterns and audience behavior',
      color: 'from-emerald-400 via-green-400 to-teal-400',
      accent: 'text-emerald-300',
    },
    {
      icon: '🚀',
      title: 'Instant Results',
      description:
        'Generate comprehensive content calendars and strategies in seconds',
      color: 'from-orange-400 via-amber-400 to-yellow-400',
      accent: 'text-orange-300',
    },
  ];

  if (isLoading) {
    return (
      <div className='flex-1 relative h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900' />
    );
  }

  return (
    <div
      className={`flex-1 relative h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 overflow-hidden transition-all duration-1500 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {/* Advanced Background Effects */}
      <div className='absolute inset-0'>
        {/* Animated mesh gradient */}
        <div className='absolute inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-cyan-900/20 animate-mesh-flow' />

        {/* Dynamic grid pattern */}
        <div
          className='absolute inset-0 opacity-20'
          style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, rgba(139, 92, 246, 0.3) 0%, transparent 50%), 
                             radial-gradient(circle at 75% 75%, rgba(6, 182, 212, 0.3) 0%, transparent 50%)`,
          }}
        />

        {/* Floating particles with enhanced movement */}
        {floatingElements.map((element) => (
          <div
            key={element.id}
            className='absolute rounded-full bg-gradient-to-r from-white/40 to-purple-200/40 backdrop-blur-sm animate-float-complex'
            style={{
              width: `${element.size}px`,
              height: `${element.size}px`,
              left: `${element.x}%`,
              top: `${element.y}%`,
              animationDelay: `${element.delay}s`,
              animationDuration: `${element.duration}s`,
              opacity: element.opacity,
            }}
          />
        ))}

        {/* Large ambient orbs */}
        <div className='absolute -top-32 -left-32 w-96 h-96 bg-gradient-to-br from-purple-500/20 to-transparent rounded-full blur-3xl animate-pulse-slow' />
        <div className='absolute -bottom-32 -right-32 w-96 h-96 bg-gradient-to-tl from-cyan-500/20 to-transparent rounded-full blur-3xl animate-pulse-slow-delayed' />

        {/* Interactive mouse glow */}
        <div
          className='absolute w-96 h-96 rounded-full transition-all duration-700 ease-out pointer-events-none'
          style={{
            left: mousePosition.x - 192,
            top: mousePosition.y - 192,
            background: `radial-gradient(circle, rgba(139, 92, 246, ${
              glowIntensity * 0.15
            }) 0%, rgba(6, 182, 212, ${
              glowIntensity * 0.1
            }) 50%, transparent 70%)`,
            filter: 'blur(2px)',
          }}
        />
      </div>

      {/* Centered Main Content */}
      <div className='relative z-10 w-full max-w-3xl mx-auto px-8 text-center'>
        <div
          className={`space-y-8 transition-all duration-1500 delay-300 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0'
          }`}
        >
          {/* Hero Brand Section */}
          <div className='space-y-6'>
            {/* Logo with enhanced glow */}
            <div className='flex justify-center'>
              <div className='relative mt-6'>
                <div className='absolute inset-0 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-3xl blur-xl opacity-50 animate-pulse-gentle' />
                <div className='relative w-16 h-16 bg-gradient-to-r from-purple-500 via-fuchsia-500 to-cyan-500 rounded-3xl flex items-center justify-center shadow-2xl animate-float-gentle'>
                  <span
                    onClick={() => router.push('/')}
                    className='text-white font-bold text-2xl cursor-pointer'
                  >
                    K
                  </span>
                </div>
              </div>
            </div>

            {/* Main heading with spectacular typography */}
            <div className='space-y-4'>
              <div className='space-y-2'>
                <h1 className='text-xl font-medium text-purple-300/80 tracking-wider uppercase'>
                  KHRONOS
                </h1>
                <h2 className='text-4xl md:text-5xl font-bold leading-none'>
                  <span className='block text-white'>Master Your</span>
                  <span className='block bg-gradient-to-r from-purple-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent animate-gradient-shift'>
                    Content Universe
                  </span>
                </h2>
              </div>

              <p className='text-lg md:text-xl text-slate-300 leading-relaxed max-w-2xl mx-auto font-light'>
                Unleash AI-powered content intelligence that predicts trends,
                optimizes timing, and transforms your creative process into a
                viral phenomenon.
              </p>
            </div>
          </div>

          {/* Dynamic Feature Display */}
          <div className='relative'>
            <div className='bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-6 shadow-2xl'>
              <div className='relative h-24 overflow-hidden'>
                {features.map((feature, index) => (
                  <div
                    key={index}
                    className={`absolute inset-0 flex items-center space-x-4 transition-all duration-1000 ease-in-out ${
                      currentFeature === index
                        ? 'translate-x-0 opacity-100 scale-100'
                        : index < currentFeature
                        ? '-translate-x-full opacity-0 scale-95'
                        : 'translate-x-full opacity-0 scale-95'
                    }`}
                  >
                    <div
                      className={`w-12 h-12 rounded-2xl bg-gradient-to-r ${feature.color} flex items-center justify-center text-xl shadow-lg animate-bounce-subtle`}
                    >
                      {feature.icon}
                    </div>
                    <div className='flex-1 text-left'>
                      <h3
                        className={`text-xl font-bold mb-1 ${feature.accent}`}
                      >
                        {feature.title}
                      </h3>
                      <p className='text-slate-300 text-base leading-relaxed'>
                        {feature.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Enhanced progress indicators */}
              <div className='flex justify-center space-x-2 mt-4'>
                {features.map((_, index) => (
                  <div
                    key={index}
                    className={`h-1.5 rounded-full transition-all duration-500 ${
                      currentFeature === index
                        ? 'w-8 bg-gradient-to-r from-purple-400 to-cyan-400 shadow-lg'
                        : 'w-1.5 bg-white/20 hover:bg-white/30'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Impressive Stats Grid */}
          <div className='grid grid-cols-3 gap-4'>
            {[
              {
                number: '25M+',
                label: 'Content Insights',
                icon: '📊',
                gradient: 'from-purple-500 to-purple-600',
              },
              {
                number: '500%',
                label: 'Engagement Boost',
                icon: '🚀',
                gradient: 'from-fuchsia-500 to-pink-600',
              },
              {
                number: '100K+',
                label: 'Active Creators',
                icon: '⭐',
                gradient: 'from-cyan-500 to-blue-600',
              },
            ].map((stat, index) => (
              <div
                key={index}
                className='group relative bg-white/5 backdrop-blur-xl rounded-2xl p-4 border border-white/10 hover:bg-white/10 transition-all duration-500 hover:scale-105 hover:shadow-2xl'
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-r ${stat.gradient} rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
                />
                <div className='relative text-center space-y-2'>
                  <div className='text-2xl group-hover:scale-110 transition-transform duration-300'>
                    {stat.icon}
                  </div>
                  <div className='text-2xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent'>
                    {stat.number}
                  </div>
                  <div className='text-xs text-slate-400 font-medium'>
                    {stat.label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Enhanced Custom Styles */}
      <style jsx>{`
        @keyframes mesh-flow {
          0%,
          100% {
            opacity: 0.3;
          }
          50% {
            opacity: 0.6;
          }
        }

        @keyframes float-complex {
          0%,
          100% {
            transform: translateX(0px) translateY(0px) scale(1);
            opacity: 0.2;
          }
          25% {
            transform: translateX(20px) translateY(-30px) scale(1.1);
            opacity: 0.4;
          }
          50% {
            transform: translateX(-15px) translateY(-60px) scale(0.9);
            opacity: 0.6;
          }
          75% {
            transform: translateX(-25px) translateY(-30px) scale(1.05);
            opacity: 0.3;
          }
        }

        @keyframes pulse-slow {
          0%,
          100% {
            opacity: 0.2;
            transform: scale(1);
          }
          50% {
            opacity: 0.4;
            transform: scale(1.05);
          }
        }

        @keyframes pulse-slow-delayed {
          0%,
          100% {
            opacity: 0.15;
            transform: scale(1);
          }
          50% {
            opacity: 0.35;
            transform: scale(1.03);
          }
        }

        @keyframes float-gentle {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-8px);
          }
        }

        @keyframes pulse-gentle {
          0%,
          100% {
            transform: scale(1);
            opacity: 0.9;
          }
          50% {
            transform: scale(1.05);
            opacity: 1;
          }
        }

        @keyframes gradient-shift {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        @keyframes bounce-subtle {
          0%,
          100% {
            transform: translateY(0px) scale(1);
          }
          50% {
            transform: translateY(-4px) scale(1.02);
          }
        }

        .animate-mesh-flow {
          animation: mesh-flow 8s ease-in-out infinite;
        }
        .animate-float-complex {
          animation: float-complex linear infinite;
        }
        .animate-pulse-slow {
          animation: pulse-slow 6s ease-in-out infinite;
        }
        .animate-pulse-slow-delayed {
          animation: pulse-slow-delayed 8s ease-in-out infinite 2s;
        }
        .animate-float-gentle {
          animation: float-gentle 4s ease-in-out infinite;
        }
        .animate-pulse-gentle {
          animation: pulse-gentle 3s ease-in-out infinite;
        }
        .animate-gradient-shift {
          background-size: 200% 200%;
          animation: gradient-shift 8s ease-in-out infinite;
        }
        .animate-bounce-subtle {
          animation: bounce-subtle 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
