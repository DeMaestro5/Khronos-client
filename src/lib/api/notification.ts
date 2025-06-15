import axios from 'axios';
import {
  NotificationFilters,
  NotificationSettings,
} from '@/src/types/notification';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

class NotificationAPI {
  private baseUrl = `${API_URL}/notifications`;

  async getNotifications(filters?: NotificationFilters, page = 1, limit = 20) {
    const params = new URLSearchParams();
    if (filters?.type) params.append('type', filters.type);
    if (filters?.status) params.append('status', filters.status);
    if (filters?.priority) params.append('priority', filters.priority);
    params.append('page', page.toString());
    params.append('limit', limit.toString());

    return axios.get(`${this.baseUrl}?${params.toString()}`);
  }

  async markAsRead(notificationId: string) {
    return axios.put(`${this.baseUrl}/${notificationId}/read`);
  }

  async markAllAsRead() {
    return axios.put(`${this.baseUrl}/read-all`);
  }

  async getSettings() {
    return axios.get(`${this.baseUrl}/settings`);
  }

  async updateSettings(settings: Partial<NotificationSettings>) {
    if (settings.quietHours) {
      const { start, end } = settings.quietHours;
      if (
        typeof start !== 'string' ||
        typeof end !== 'string' ||
        !/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(start) ||
        !/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(end)
      ) {
        throw new Error(
          'Invalid quietHours format. Use HH:MM format (e.g., "22:00")'
        );
      }
    }

    return axios.put(`${this.baseUrl}/settings`, settings);
  }
}

export const notificationAPI = new NotificationAPI();
