'use client';

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import { AuthState } from '../types/auth';
import { AuthUtils } from '../lib/auth-utils';
import { authAPI } from '../lib/api';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshTokens: () => Promise<boolean>;
  checkAuthStatus: () => void;
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

  // Refresh tokens function
  const refreshTokens = async (): Promise<boolean> => {
    try {
      const refreshToken = AuthUtils.getRefreshToken();
      if (!refreshToken) {
        return false;
      }

      const response = await authAPI.refreshToken(refreshToken);

      if (response.data?.data?.tokens) {
        AuthUtils.storeTokens(response.data.data.tokens);

        // Store user data if available in refresh response
        if (response.data.data.user) {
          AuthUtils.storeUser(response.data.data.user);
        }

        return true;
      }

      return false;
    } catch (error) {
      console.error('Token refresh failed:', error);
      return false;
    }
  };

  // Check authentication status on mount and when tokens change
  const checkAuthStatus = async () => {
    try {
      setAuthState((prev) => ({ ...prev, loading: true, error: null }));

      const tokens = AuthUtils.getStoredTokens();
      if (!tokens) {
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
        const refreshSuccess = await refreshTokens();
        if (!refreshSuccess) {
          setAuthState({
            isAuthenticated: false,
            user: null,
            loading: false,
            error: 'Session expired',
          });
          return;
        }
      }

      // Get stored user data
      const storedUser = AuthUtils.getUser();

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
  const login = async (email: string, password: string): Promise<void> => {
    try {
      setAuthState((prev) => ({ ...prev, loading: true, error: null }));

      const response = await authAPI.login(email, password);

      if (response.data?.data?.tokens) {
        // Store both tokens and user data
        AuthUtils.storeTokens(response.data.data.tokens);
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

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const contextValue: AuthContextType = {
    ...authState,
    login,
    logout,
    refreshTokens,
    checkAuthStatus,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};
