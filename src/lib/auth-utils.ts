import { AuthTokens, User } from '../types/auth';

const TOKEN_KEYS = {
  ACCESS_TOKEN: 'accessToken',
  REFRESH_TOKEN: 'refreshToken',
  TOKEN_EXPIRY: 'tokenExpiry',
  USER_DATA: 'userData',
  GOOGLE_STATE: 'googleAuthState', // For CSRF protection
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
      } else {
        console.log('No expiresIn provided, not storing expiry');
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
    if (!expiry) {
      return false;
    }

    // Consider token expired if it expires within 10 minutes (600000ms) instead of 5 minutes
    const bufferTime = 10 * 60 * 1000;
    const isExpired = Date.now() >= expiry - bufferTime;

    return isExpired;
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
      localStorage.removeItem(TOKEN_KEYS.GOOGLE_STATE);
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
    const hasValidTokens = this.hasValidTokens();
    const isExpired = this.isTokenExpired();
    const expiry = this.getTokenExpiry();
    const now = Date.now();

    console.log('Token refresh check:', {
      hasValidTokens,
      isExpired,
      expiry,
      now,
      timeUntilExpiry: expiry ? expiry - now : 'no expiry',
    });

    return hasValidTokens && isExpired;
  }

  // Google Auth specific methods
  /**
   * Generate a random state parameter for CSRF protection
   */
  static generateGoogleState(): string {
    const state =
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15);

    if (typeof window !== 'undefined') {
      localStorage.setItem(TOKEN_KEYS.GOOGLE_STATE, state);
    }

    return state;
  }

  /**
   * Get stored Google state parameter
   */
  static getGoogleState(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(TOKEN_KEYS.GOOGLE_STATE);
  }

  /**
   * Clear stored Google state parameter
   */
  static clearGoogleState(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(TOKEN_KEYS.GOOGLE_STATE);
  }

  /**
   * Validate Google state parameter
   */
  static validateGoogleState(state: string): boolean {
    const storedState = this.getGoogleState();
    if (!storedState) return false;

    const isValid = storedState === state;
    if (isValid) {
      this.clearGoogleState(); // Clear after successful validation
    }
    return isValid;
  }

  /**
   * Initiate Google OAuth flow
   */
  static async initiateGoogleAuth(): Promise<void> {
    const state = this.generateGoogleState();

    try {
      // Use the API client to get the correct backend route
      const { authAPI } = await import('./api');
      const googleAuthUrl = `${authAPI.googleAuth.initiate()}?state=${encodeURIComponent(
        state
      )}`;

      console.log('Initiating Google OAuth via backend:', googleAuthUrl);
      window.location.href = googleAuthUrl;
    } catch (error) {
      console.error('Failed to initiate Google auth:', error);
      throw error;
    }
  }

  /**
   * Handle Google OAuth callback
   */
  static async handleGoogleCallback(
    code: string,
    state: string
  ): Promise<{
    success: boolean;
    user?: User;
    tokens?: AuthTokens;
    error?: string;
  }> {
    try {
      // Validate state parameter
      if (!this.validateGoogleState(state)) {
        throw new Error('Invalid state parameter');
      }

      // Use the existing axios instance with proper headers
      const { authAPI } = await import('./api');

      const response = await authAPI.googleAuth.callback(code, state);

      if (response.data?.data?.tokens && response.data?.data?.user) {
        // Store tokens and user data
        this.storeAuthData(response.data.data.tokens, response.data.data.user);

        return {
          success: true,
          user: response.data.data.user,
          tokens: response.data.data.tokens,
        };
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('Google auth callback error:', error);

      // Handle specific error cases
      if (error instanceof Error) {
        if (error.message.includes('x-api-key')) {
          return {
            success: false,
            error:
              'Authentication service configuration error. Please contact support.',
          };
        }
        return {
          success: false,
          error: error.message,
        };
      }

      return {
        success: false,
        error: 'Authentication failed',
      };
    }
  }
}
