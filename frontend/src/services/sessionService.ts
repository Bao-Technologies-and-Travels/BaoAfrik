import { apiClient } from './api';

export interface Session {
  id: string;
  browser: string;
  browserVersion: string;
  device: string;
  deviceType: 'desktop' | 'mobile' | 'tablet';
  location: string;
  country: string;
  city: string;
  os: string;
  osVersion: string;
  isCurrent: boolean;
  lastActivityAt: string;
  createdAt: string;
  expiresAt: string | null;
}

export const sessionService = {
  /**
   * Get all user sessions
   */
  async getSessions(): Promise<Session[]> {
    const refreshToken = localStorage.getItem('refreshToken');
    const response = await apiClient.post<Session[]>('/sessions', { refreshToken });
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.message || 'Failed to fetch sessions');
  },

  /**
   * Revoke a specific session
   */
  async revokeSession(sessionId: string): Promise<void> {
    const response = await apiClient.delete(`/sessions/${sessionId}`);
    if (!response.success) {
      throw new Error(response.message || 'Failed to revoke session');
    }
  },

  /**
   * Revoke all other sessions (keep current)
   */
  async revokeAllOtherSessions(): Promise<void> {
    const response = await apiClient.delete('/sessions');
    if (!response.success) {
      throw new Error(response.message || 'Failed to revoke sessions');
    }
  },

  /**
   * Update session activity
   */
  async updateActivity(): Promise<void> {
    await apiClient.post('/sessions/activity');
  },
};
