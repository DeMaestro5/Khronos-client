export type SupportedPlatform =
  | 'youtube'
  | 'tiktok'
  | 'facebook'
  | 'twitter'
  | 'instagram'
  | 'linkedin';

export interface PlatformStatus {
  platform: SupportedPlatform;
  isConnected: boolean;
  accountId: string;
  accountName: string;
  connectAt: string;
  lastSyncedAt: string;
  permissions: string[];
}

export type PlatformPostIds = Partial<Record<SupportedPlatform, string[]>>;
