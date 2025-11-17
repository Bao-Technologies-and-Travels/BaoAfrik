import { error } from 'console';
import { authService } from '../services';
import { API_CONFIG } from './apiConfig';

// Token management utilities
export class TokenManager {
  private static isRefreshing = false;
  private static failedQueue: Array<{ resolve: (token: string) => void; reject: (error: any) => void }> = [];

  private static processQueue(error: any, token: string | null = null) {
    this.failedQueue.forEach(({ resolve, reject }) => {
      if (error) {
        reject(error);
      } else {
        resolve(token!);
      }
    });
    this.failedQueue = [];
  }

  // Store tokens securely
  static setTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem(API_CONFIG.TOKEN_STORAGE_KEY, accessToken);
    localStorage.setItem(API_CONFIG.REFRESH_TOKEN_KEY, refreshToken);

    // schedule automatic token refresh
    this.scheduleTokenRefresh();
  }

  // Get access token
  static getAccessToken(): string | null {
    return localStorage.getItem(API_CONFIG.TOKEN_STORAGE_KEY);
  }

  // Get refresh token
  static getRefreshToken(): string | null {
    return localStorage.getItem(API_CONFIG.REFRESH_TOKEN_KEY);
  }

  // Clear all tokens
  static clearTokens(): void {
    localStorage.removeItem(API_CONFIG.TOKEN_STORAGE_KEY);
    localStorage.removeItem(API_CONFIG.REFRESH_TOKEN_KEY);
    localStorage.removeItem(API_CONFIG.USER_STORAGE_KEY);
  }

  // Check if user is authenticated
  static isAuthenticated(): boolean {
    const token = this.getAccessToken();
    return token !== null && !this.isTokenExpired(token);
  }

  // Check if token is expired
  static isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      return payload.exp < currentTime;
    } catch (error) {
      return true; // If we can't parse the token, consider it expired
    }
  }

  // Get token expiration time
  static getTokenExpiration(token: string): number | null {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000; // Convert to milliseconds
    } catch (error) {
      return null;
    }
  }

  // Refresh token method
  static async refreshToken(): Promise<string> {
    if (this.isRefreshing) {
      return new Promise((resolve, reject) => {
        this.failedQueue.push({ resolve, reject });
      });
    }

    this.isRefreshing = true;

    try {
      const response = await authService.refreshToken();

      if (!response.success || !response.data) {
        throw new Error(response.message || 'Token refresh failed');
      }

      const { accessToken } = response.data;

      localStorage.setItem(API_CONFIG.TOKEN_STORAGE_KEY, accessToken);

      this.processQueue(null, accessToken);
      return accessToken;

    } catch (error) {
      this.processQueue(error, null);
      this.clearTokens();
      throw error;

    } finally {
      this.isRefreshing = false;
    }
  }

  // Auto-refresh token before expiration
  static scheduleTokenRefresh(): void {
    const token = this.getAccessToken();
    if (!token) return;

    const expirationTime = this.getTokenExpiration(token);
    if (!expirationTime) return;

    const currentTime = Date.now();
    const timeUntilExpiry = expirationTime - currentTime;
    const refreshTime = timeUntilExpiry - (5 * 60 * 1000); // Refresh 5 minutes before expiry

    if (refreshTime > 0) {
      setTimeout(async () => {
        try {
          await this.refreshToken();
          // reschedule next refresh
          this.scheduleTokenRefresh();

        } catch (error) {
          this.clearTokens();
          window.location.href = '/login?message=session_expired';
        }
      }, refreshTime);
    } else if (timeUntilExpiry > 0) {
      // Token expires soon but we missed the 5-minute window, refresh immediately
      this.refreshToken().catch(error => {
        this.clearTokens();
        window.location.href = '/login?message=session_expired';
      });
    }
  }

  // get time until token expiry
  static getTimeUntilExpiry(): number {
    const token = this.getAccessToken();
    if (!token) return 0;

    const expirationTime = this.getTokenExpiration(token);
    if (!expirationTime) return 0;

    return (expirationTime - Date.now()) / (60 * 1000);
  }
}
