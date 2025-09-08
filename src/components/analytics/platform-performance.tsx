'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart3 } from 'lucide-react';
import { PlatformPerformance as PlatformPerformanceType } from '@/src/types/analytics';
import { integrationsAPI } from '@/src/lib/api';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import PlatformConnectionModal from './PlatformConnectionModal';

interface PlatformPerformanceProps {
  platforms: PlatformPerformanceType[];
  isLoading?: boolean;
}

export default function PlatformPerformance({
  platforms,
  isLoading = false,
}: PlatformPerformanceProps) {
  const [connectionStates, setConnectionStates] = useState<
    Record<string, boolean>
  >({});
  const [showModal, setShowModal] = useState<{
    platform: string;
    isOpen: boolean;
  }>({
    platform: '',
    isOpen: false,
  });

  useEffect(() => {
    checkAllConnectionStatuses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // 1) Detect success from backend redirect
    const params = new URLSearchParams(window.location.search);
    const platformParam = params.get('platform');
    const success = params.get('success');

    if (platformParam === 'youtube' && success === '1') {
      // 2) Clear URL params so it doesn't retrigger on refresh
      const url = new URL(window.location.href);
      url.searchParams.delete('platform');
      url.searchParams.delete('success');
      window.history.replaceState({}, '', url.toString());

      // 3) Refresh connection statuses and close the modal
      checkAllConnectionStatuses();
      closeConnect();
    }
  }, []);

  async function checkAllConnectionStatuses() {
    const states: Record<string, boolean> = {};
    for (const p of platforms) {
      try {
        const api = integrationsAPI[p.platform as keyof typeof integrationsAPI];
        if (api && 'status' in api) {
          const res = await api.status();
          states[p.platform] = Boolean(res?.data?.data?.isConnected);
        } else {
          states[p.platform] = false;
        }
      } catch {
        states[p.platform] = false;
      }
    }
    setConnectionStates(states);
  }

  const openConnect = (platform: string) =>
    setShowModal({ platform, isOpen: true });
  const closeConnect = () => setShowModal({ platform: '', isOpen: false });
  const onConnected = () => {
    checkAllConnectionStatuses();
    closeConnect();
  };

  const disconnect = async (platform: string) => {
    try {
      const api = integrationsAPI[platform as keyof typeof integrationsAPI];
      if (api && 'disconnect' in api) {
        await api.disconnect();
        setConnectionStates((s) => ({ ...s, [platform]: false }));
      }
    } catch {}
  };

  const statusVariant = (s: PlatformPerformanceType['status']) =>
    s === 'excellent' ? 'success' : s === 'good' ? 'info' : 'warning';

  if (isLoading) {
    return (
      <div className='bg-theme-card border border-theme-primary rounded-2xl p-6 shadow-theme-md'>
        <div className='animate-pulse'>
          <div className='h-6 bg-slate-200 dark:bg-slate-700 rounded w-48 mb-6' />
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className='h-36 rounded-xl bg-white/40 dark:bg-slate-800/40 border border-white/20 dark:border-slate-700/30'
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!platforms.length) return null;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className='bg-theme-card border border-theme-tertiary rounded-2xl p-6 shadow-theme-md'
      >
        <h3 className='text-xl font-bold text-theme-primary mb-6 flex items-center gap-2'>
          <span className='p-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 dark:from-blue-600 dark:to-indigo-700'>
            <BarChart3 className='h-5 w-5 text-white' />
          </span>
          Platform Performance
        </h3>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
          {platforms.map((p, i) => {
            const isConnected = connectionStates[p.platform] || false;

            return (
              <motion.div
                key={p.platform}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.05 * i }}
                className='rounded-xl border border-theme-tertiary bg-theme-secondary/5 hover:bg-theme-hover transition-colors'
              >
                {/* header */}
                <div className='px-4 pt-4 flex items-start justify-between'>
                  <h4 className='text-lg font-semibold text-theme-primary capitalize'>
                    {p.platform}
                  </h4>
                  <div className='flex items-center gap-2'>
                    <Badge
                      variant={isConnected ? 'success' : 'neutral'}
                      size='sm'
                      withDot
                    >
                      {isConnected ? 'Connected' : 'Mock Data'}
                    </Badge>
                    <Badge variant={statusVariant(p.status)} size='sm'>
                      {p.status.replace('_', ' ')}
                    </Badge>
                  </div>
                </div>

                {/* metrics */}
                <div className='px-4 py-3 text-sm space-y-2'>
                  <div className='flex items-center justify-between'>
                    <span className='text-theme-secondary'>Content</span>
                    <span className='font-medium text-theme-primary'>
                      {p.metrics.content}
                    </span>
                  </div>
                  <div className='flex items-center justify-between'>
                    <span className='text-theme-secondary'>Engagement</span>
                    <span className='font-medium text-theme-primary'>
                      {p.metrics.engagement.toLocaleString()}
                    </span>
                  </div>
                  <div className='flex items-center justify-between'>
                    <span className='text-theme-secondary'>Reach</span>
                    <span className='font-medium text-theme-primary'>
                      {p.metrics.reach.toLocaleString()}
                    </span>
                  </div>
                  <div className='flex items-center justify-between'>
                    <span className='text-theme-secondary'>Rate</span>
                    <span className='font-medium text-theme-primary'>
                      {p.metrics.engagementRate.toFixed(1)}%
                    </span>
                  </div>
                </div>

                {/* footer */}
                <div className='border-t border-theme-tertiary px-4 pb-4 pt-3'>
                  {isConnected ? (
                    <Button
                      variant='outline'
                      size='sm'
                      className='w-full  text-theme-primary'
                      onClick={() => disconnect(p.platform)}
                    >
                      Disconnect
                    </Button>
                  ) : (
                    <Button
                      size='sm'
                      className='w-full text-theme-primary'
                      onClick={() => openConnect(p.platform.toLowerCase())}
                    >
                      Connect Account
                    </Button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      <PlatformConnectionModal
        platform={showModal.platform}
        isOpen={showModal.isOpen}
        onClose={closeConnect}
        onConnected={onConnected}
      />
    </>
  );
}
