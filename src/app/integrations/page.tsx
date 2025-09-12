'use client';

import React, { useEffect, useMemo, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'react-hot-toast';
import PageLoading from '@/src/components/ui/page-loading';
import { useNotifications } from '@/src/context/NotificationContext';
import {
  NotificationPriority,
  NotificationType,
} from '@/src/types/notification';

function formatPlatformName(raw: string | null): string {
  if (!raw) return 'platform';
  const name = raw.toLowerCase();
  switch (name) {
    case 'youtube':
      return 'YouTube';
    case 'twitter':
      return 'X (Twitter)';
    case 'instagram':
      return 'Instagram';
    case 'facebook':
      return 'Facebook';
    case 'tiktok':
      return 'TikTok';
    case 'linkedin':
      return 'LinkedIn';
    default:
      return name.charAt(0).toUpperCase() + name.slice(1);
  }
}

function IntegrationsCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { addLocalNotification } = useNotifications();
  const processedRef = useRef(false);

  const platform = useMemo(() => searchParams.get('platform'), [searchParams]);
  const success = useMemo(() => searchParams.get('success'), [searchParams]);
  const error = useMemo(() => searchParams.get('error'), [searchParams]);

  useEffect(() => {
    if (processedRef.current) return;
    processedRef.current = true;

    const niceName = formatPlatformName(platform);

    const isSuccess =
      success === '1' || success === 'true' || success === 'yes';

    if (isSuccess) {
      const message = `You're all set! ${niceName} is now connected. We'll start syncing analytics in the background — this can take a minute.`;
      // Show a single explicit toast here
      toast.success(message, { icon: '✅' });
      // Record a notification silently (no extra toast)
      addLocalNotification?.(
        {
          type: NotificationType.SYSTEM,
          title: `${niceName} connected`,
          message,
          priority: NotificationPriority.MEDIUM,
          data: {
            platform: platform || undefined,
            action: 'connect',
            status: 'success',
          },
        },
        { showToast: false }
      );
    } else {
      const fallback = `We couldn't complete the connection`;
      const reason = error ? decodeURIComponent(error) : '';
      const message = `${fallback} for ${niceName}. ${reason}`.trim();
      toast.error(message || `${fallback} for ${niceName}.`, { icon: '⚠️' });
      addLocalNotification?.(
        {
          type: NotificationType.SYSTEM,
          title: `${niceName} connection failed`,
          message,
          priority: NotificationPriority.HIGH,
          data: {
            platform: platform || undefined,
            action: 'connect',
            status: 'error',
          },
        },
        { showToast: false }
      );
    }

    // Send the user to the analytics dashboard
    router.replace('/analytics');
  }, [addLocalNotification, error, platform, router, success]);

  return (
    <PageLoading
      title='Finishing up'
      subtitle='Completing your connection and taking you back to your analytics...'
      contentType='analytics'
      showGrid={true}
      gridItems={6}
    />
  );
}

export default function IntegrationsCallbackPage() {
  return (
    <Suspense
      fallback={
        <PageLoading
          title='Finishing up'
          subtitle='Completing your connection and taking you back to your analytics...'
          contentType='analytics'
          showGrid={true}
          gridItems={6}
        />
      }
    >
      <IntegrationsCallbackContent />
    </Suspense>
  );
}
