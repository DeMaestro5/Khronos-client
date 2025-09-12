import { integrationsAPI } from './api';
import type { SupportedPlatform } from '../types/integrations';

export type IntegrationKey = SupportedPlatform;

const ALL_PLATFORMS: IntegrationKey[] = [
  'youtube',
  'facebook',
  'twitter',
  'instagram',
  'linkedin',
  'tiktok',
];

export function normalizePlatformKey(input: string): IntegrationKey | null {
  const s = (input || '').toLowerCase().trim();

  if (s.startsWith('x')) return 'twitter';
  if (s.startsWith('twitter')) return 'twitter';
  if (s.startsWith('facebook')) return 'facebook';
  if (s.startsWith('linkedin')) return 'linkedin';
  if (s.startsWith('youtube')) return 'youtube';
  if (s.startsWith('instagram')) return 'instagram';
  if (s.startsWith('tiktok')) return 'tiktok';

  return ALL_PLATFORMS.includes(s as IntegrationKey)
    ? (s as IntegrationKey)
    : null;
}

function parseConnectedValue(raw: unknown): boolean {
  if (typeof raw === 'boolean') return raw;
  if (typeof raw === 'number') return raw === 1;
  if (typeof raw === 'string') {
    const v = raw.trim().toLowerCase();
    return v === 'true' || v === '1' || v === 'yes' || v === 'connected';
  }

  return false;
}

export function extractConnectedFlag(response: unknown): boolean {
  const asObj = (v: unknown) =>
    typeof v === 'object' && v !== null
      ? (v as Record<string, unknown>)
      : undefined;

  const r = asObj(response);
  const rd = asObj(r?.data);
  const rdd = asObj(rd?.data);

  const candidates: unknown[] = [
    rdd?.connected,
    rdd?.isConnected,
    rdd?.status,
    rd?.connected,
    rd?.isConnected,
    rd?.status,
    r?.connected,
    r?.isConnected,
    r?.status,
  ];

  for (const candidate of candidates) {
    const connected = parseConnectedValue(candidate);
    if (connected) return connected;
  }

  return false;
}

export async function getPlatformStatus(
  platform: IntegrationKey
): Promise<boolean> {
  try {
    const api = integrationsAPI[platform as keyof typeof integrationsAPI];
    if (!api || !('status' in api)) return false;

    const res = await api.status();
    return extractConnectedFlag(res);
  } catch {
    return false;
  }
}

export async function getStatuses(
  platforms: IntegrationKey[]
): Promise<Record<IntegrationKey, boolean>> {
  const keys = platforms && platforms.length ? platforms : ALL_PLATFORMS;
  const results = await Promise.all(keys.map((k) => getPlatformStatus(k)));
  return keys.reduce((acc, k, idx) => {
    acc[k] = results[idx];
    return acc;
  }, {} as Record<IntegrationKey, boolean>);
}
