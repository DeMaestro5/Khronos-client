import { AuthTokens, User } from '../types/auth';

const TOKEN_KEYS = {
  ACCESS_TOKEN: 'accessToken',
  REFRESH_TOKEN: 'refreshToken',
  TOKEN_EXPIRY: 'tokenExpiry',
  USER_DATA: 'userData',
} as const;

export class AuthUtils {
  /**
   * Store authentication tokens in localStorage
   */
  static storeTokens(tokens: AuthTokens): void {
    if (typeof window === 'undefined') return;

    try {
      localStorage.setItem(TOKEN_KEYS.ACCESS_TOKEN, tokens.accessToken);
      localStorage.setItem(TOKEN_KEYS.REFRESH_TOKEN, tokens.refreshToken);

      // Calculate and store expiry time if provided
      if (tokens.expiresIn) {
        const expiryTime = Date.now() + tokens.expiresIn * 1000;
        localStorage.setItem(TOKEN_KEYS.TOKEN_EXPIRY, expiryTime.toString());
      }
    } catch (error) {
      console.error('Failed to store tokens:', error);
    }
  }

  /**
   * Store user data in localStorage
   */
  static storeUser(user: User): void {
    if (typeof window === 'undefined') return;

    try {
      localStorage.setItem(TOKEN_KEYS.USER_DATA, JSON.stringify(user));
    } catch (error) {
      console.error('Failed to store user data:', error);
    }
  }

  /**
   * Store authentication tokens and user data together
   */
  static storeAuthData(tokens: AuthTokens, user: User): void {
    this.storeTokens(tokens);
    this.storeUser(user);
  }

  /**
   * Get stored access token
   */
  static getAccessToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(TOKEN_KEYS.ACCESS_TOKEN);
  }

  /**
   * Get stored refresh token
   */
  static getRefreshToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(TOKEN_KEYS.REFRESH_TOKEN);
  }

  /**
   * Get stored user data
   */
  static getUser(): User | null {
    if (typeof window === 'undefined') return null;
    try {
      const userData = localStorage.getItem(TOKEN_KEYS.USER_DATA);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Failed to parse user data:', error);
      return null;
    }
  }

  /**
   * Get current user ID
   */
  static getUserId(): string | null {
    const user = this.getUser();
    // Check for both id and _id fields (backend might return _id from MongoDB)
    return user?.id || user?._id || null;
  }

  /**
   * Get token expiry time
   */
  static getTokenExpiry(): number | null {
    if (typeof window === 'undefined') return null;
    const expiry = localStorage.getItem(TOKEN_KEYS.TOKEN_EXPIRY);
    return expiry ? parseInt(expiry, 10) : null;
  }

  /**
   * Check if access token is expired or will expire soon (within 5 minutes)
   */
  static isTokenExpired(): boolean {
    const expiry = this.getTokenExpiry();
    if (!expiry) return false;

    // Consider token expired if it expires within 5 minutes (300000ms)
    const bufferTime = 5 * 60 * 1000;
    return Date.now() >= expiry - bufferTime;
  }

  /**
   * Check if user has valid tokens stored
   */
  static hasValidTokens(): boolean {
    const accessToken = this.getAccessToken();
    const refreshToken = this.getRefreshToken();
    return !!(accessToken && refreshToken);
  }

  /**
   * Clear all stored tokens
   */
  static clearTokens(): void {
    if (typeof window === 'undefined') return;

    try {
      localStorage.removeItem(TOKEN_KEYS.ACCESS_TOKEN);
      localStorage.removeItem(TOKEN_KEYS.REFRESH_TOKEN);
      localStorage.removeItem(TOKEN_KEYS.TOKEN_EXPIRY);
      localStorage.removeItem(TOKEN_KEYS.USER_DATA);
      // Also remove the old 'token' key for backward compatibility
      localStorage.removeItem('token');
    } catch (error) {
      console.error('Failed to clear tokens:', error);
    }
  }

  /**
   * Get all stored tokens
   */
  static getStoredTokens(): AuthTokens | null {
    const accessToken = this.getAccessToken();
    const refreshToken = this.getRefreshToken();
    const expiry = this.getTokenExpiry();

    if (!accessToken || !refreshToken) {
      return null;
    }

    return {
      accessToken,
      refreshToken,
      expiresIn: expiry ? Math.floor((expiry - Date.now()) / 1000) : undefined,
    };
  }

  /**
   * Check if we should attempt to refresh the token
   */
  static shouldRefreshToken(): boolean {
    return this.hasValidTokens() && this.isTokenExpired();
  }
}
