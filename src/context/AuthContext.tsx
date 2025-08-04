'use client';

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import { AuthState, GoogleAuthResponse } from '../types/auth';
import { AuthUtils } from '../lib/auth-utils';
import { authAPI } from '../lib/api';
import { AxiosError } from 'axios';

interface AuthContextType extends AuthState {
  login: (
    email: string,
    password: string,
    rememberMe?: boolean
  ) => Promise<void>;
  logout: () => void;
  refreshTokens: () => Promise<boolean>;
  checkAuthStatus: () => void;
  updateUser: (user: Partial<AuthState['user']>) => void;
  // Google Auth methods
  googleLogin: () => void;
  handleGoogleCallback: (
    code: string,
    state: string
  ) => Promise<GoogleAuthResponse>;
  isGoogleAuthenticating: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    loading: true,
    error: null,
  });

  // Google Auth state
  const [isGoogleAuthenticating, setIsGoogleAuthenticating] = useState(false);

  // Refresh tokens function
  const refreshTokens = async (): Promise<boolean> => {
    try {
      const refreshToken = AuthUtils.getRefreshToken();
      console.log(
        'Refresh tokens called, refresh token:',
        refreshToken ? 'present' : 'missing'
      );

      if (!refreshToken) {
        console.log('No refresh token available');
        return false;
      }

      console.log('Making refresh token request...');
      const response = await authAPI.refreshToken(refreshToken);
      console.log('Refresh response:', response.data);

      // Check for the actual response format from the server
      if (response.data?.data?.tokens) {
        console.log('Storing new tokens...');
        const tokens = {
          accessToken: response.data.data.tokens.accessToken,
          refreshToken: response.data.data.tokens.refreshToken,
          expiresIn: response.data.data.tokens.accessTokenExpiresIn,
        };
        AuthUtils.storeTokens(tokens);

        // Store user data if available in refresh response
        if (response.data.data.user) {
          AuthUtils.storeUser(response.data.data.user);
        }

        return true;
      }

      console.log('Invalid refresh response format');
      return false;
    } catch (error) {
      console.error('Token refresh failed:', error);
      if (error instanceof Error) {
        console.error('Refresh error details:', {
          message: error.message,
          name: error.name,
          stack: error.stack,
        });
      }
      // Add AxiosError specific logging
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as AxiosError;
        console.error('Axios error details:', {
          status: axiosError.response?.status,
          statusText: axiosError.response?.statusText,
          data: axiosError.response?.data,
          url: axiosError.config?.url,
          method: axiosError.config?.method,
          requestData: axiosError.config?.data,
        });
      }
      return false;
    }
  };

  // Check authentication status on mount and when tokens change
  const checkAuthStatus = async () => {
    try {
      setAuthState((prev) => ({ ...prev, loading: true, error: null }));

      const tokens = AuthUtils.getStoredTokens();
      console.log(
        'Checking auth status, tokens:',
        tokens ? 'present' : 'missing'
      );

      if (!tokens) {
        console.log('No tokens found, setting unauthenticated');
        setAuthState({
          isAuthenticated: false,
          user: null,
          loading: false,
          error: null,
        });
        return;
      }

      // Check if token is expired and try to refresh
      if (AuthUtils.shouldRefreshToken()) {
        console.log('Token needs refresh, attempting refresh...');
        const refreshSuccess = await refreshTokens();
        if (!refreshSuccess) {
          console.log(
            'Token refresh failed, clearing tokens and redirecting to login'
          );
          AuthUtils.clearTokens();
          setAuthState({
            isAuthenticated: false,
            user: null,
            loading: false,
            error: 'Session expired',
          });
          // Redirect to login
          if (typeof window !== 'undefined') {
            window.location.href = '/auth/login';
          }
          return;
        }
      }

      // Get stored user data
      const storedUser = AuthUtils.getUser();
      console.log(
        'Setting authenticated state with user:',
        storedUser ? 'present' : 'missing'
      );

      setAuthState({
        isAuthenticated: true,
        user: storedUser,
        loading: false,
        error: null,
      });
    } catch (error) {
      console.error('Auth check failed:', error);
      setAuthState({
        isAuthenticated: false,
        user: null,
        loading: false,
        error: 'Authentication check failed',
      });
    }
  };

  // Login function
  const login = async (
    email: string,
    password: string,
    rememberMe: boolean = false
  ): Promise<void> => {
    try {
      setAuthState((prev) => ({ ...prev, loading: true, error: null }));

      const response = await authAPI.login(email, password, rememberMe);
      console.log('Login response:', response.data);

      // Check for the actual response format from the server
      if (response.data?.data?.tokens) {
        console.log('Storing tokens from login response');
        // Store both tokens and user data
        const tokens = {
          accessToken: response.data.data.tokens.accessToken,
          refreshToken: response.data.data.tokens.refreshToken,
          expiresIn: response.data.data.tokens.accessTokenExpiresIn,
        };
        AuthUtils.storeTokens(tokens);
        if (response.data.data.user) {
          AuthUtils.storeUser(response.data.data.user);
        }

        setAuthState({
          isAuthenticated: true,
          user: response.data.data.user || null,
          loading: false,
          error: null,
        });
      } else {
        throw new Error('Invalid login response');
      }
    } catch (error) {
      console.error('Login failed:', error);
      setAuthState((prev) => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Login failed',
      }));
      throw error;
    }
  };

  // Logout function
  const logout = () => {
    authAPI.logout();
    setAuthState({
      isAuthenticated: false,
      user: null,
      loading: false,
      error: null,
    });
  };

  // Update user function
  const updateUser = (updatedUser: Partial<AuthState['user']>) => {
    if (authState.user && updatedUser) {
      const newUser = { ...authState.user, ...updatedUser };
      AuthUtils.storeUser(newUser);
      setAuthState((prev) => ({
        ...prev,
        user: newUser,
      }));
    }
  };

  // Google Auth methods
  const googleLogin = async () => {
    setIsGoogleAuthenticating(true);
    try {
      await AuthUtils.initiateGoogleAuth();
    } catch (error) {
      console.error('Failed to initiate Google auth:', error);
      setIsGoogleAuthenticating(false);
      setAuthState((prev) => ({
        ...prev,
        error: 'Failed to start Google authentication',
      }));
    }
  };

  const handleGoogleCallback = async (
    code: string,
    state: string
  ): Promise<GoogleAuthResponse> => {
    try {
      setIsGoogleAuthenticating(true);
      setAuthState((prev) => ({ ...prev, error: null }));

      const result = await AuthUtils.handleGoogleCallback(code, state);

      if (result.success && result.user && result.tokens) {
        setAuthState({
          isAuthenticated: true,
          user: result.user,
          loading: false,
          error: null,
        });
      } else {
        setAuthState((prev) => ({
          ...prev,
          loading: false,
          error: result.error || 'Google authentication failed',
        }));
      }

      return result;
    } catch (error) {
      console.error('Google callback error:', error);
      const errorMessage =
        error instanceof Error ? error.message : 'Google authentication failed';

      setAuthState((prev) => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));

      return {
        success: false,
        error: errorMessage,
      };
    } finally {
      setIsGoogleAuthenticating(false);
    }
  };

  // Set up automatic token refresh check
  useEffect(() => {
    checkAuthStatus();

    // Set up interval to check token expiry every 5 minutes
    const interval = setInterval(() => {
      if (AuthUtils.shouldRefreshToken()) {
        refreshTokens();
      }
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(interval);
  }, []); // Remove dependency array to avoid stale closure issues

  // Listen for storage changes (e.g., logout in another tab)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'accessToken' || e.key === 'refreshToken') {
        if (!e.newValue) {
          // Tokens were cleared
          setAuthState({
            isAuthenticated: false,
            user: null,
            loading: false,
            error: null,
          });
        } else {
          // Tokens were updated, check auth status
          checkAuthStatus();
        }
      }
    };

    const handleTokensUpdated = () => {
      // Re-check authentication status when tokens are updated
      checkAuthStatus();
    };

    const handleUserUpdated = (e: CustomEvent) => {
      // Update user data directly in the context
      const user = e.detail.user;
      setAuthState((prev) => ({
        ...prev,
        user,
        loading: false,
      }));
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener(
      'tokensUpdated',
      handleTokensUpdated as EventListener
    );
    window.addEventListener('userUpdated', handleUserUpdated as EventListener);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener(
        'tokensUpdated',
        handleTokensUpdated as EventListener
      );
      window.removeEventListener(
        'userUpdated',
        handleUserUpdated as EventListener
      );
    };
  }, []);

  const contextValue: AuthContextType = {
    ...authState,
    login,
    logout,
    refreshTokens,
    checkAuthStatus,
    updateUser,
    googleLogin,
    handleGoogleCallback,
    isGoogleAuthenticating,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};
