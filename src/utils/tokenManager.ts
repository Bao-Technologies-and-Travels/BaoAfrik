import { API_CONFIG } from './apiConfig';

// Token management utilities
export class TokenManager {
  // Store tokens securely
  static setTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem(API_CONFIG.TOKEN_STORAGE_KEY, accessToken);
    localStorage.setItem(API_CONFIG.REFRESH_TOKEN_KEY, refreshToken);
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

  // Auto-refresh token before expiration
  static scheduleTokenRefresh(refreshCallback: () => Promise<void>): void {
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
          await refreshCallback();
        } catch (error) {
          console.error('Token refresh failed:', error);
          this.clearTokens();
        }
      }, refreshTime);
    }
  }
}
