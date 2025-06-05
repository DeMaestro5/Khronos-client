import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthUtils } from '../lib/auth-utils';

export const useAuthCheck = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = () => {
      try {
        const hasValidTokens = AuthUtils.hasValidTokens();
        setIsAuthenticated(hasValidTokens);

        if (!hasValidTokens && typeof window !== 'undefined') {
          // Redirect to login if no valid tokens
          router.push('/auth/login');
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        setIsAuthenticated(false);
        router.push('/auth/login');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();

    // Listen for storage changes (e.g., logout in another tab)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'accessToken' || e.key === 'refreshToken') {
        checkAuth();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [router]);

  return { isAuthenticated, isLoading };
};

export const useTokenStatus = () => {
  const [tokenStatus, setTokenStatus] = useState({
    hasTokens: false,
    isExpired: false,
    shouldRefresh: false,
  });

  useEffect(() => {
    const updateTokenStatus = () => {
      setTokenStatus({
        hasTokens: AuthUtils.hasValidTokens(),
        isExpired: AuthUtils.isTokenExpired(),
        shouldRefresh: AuthUtils.shouldRefreshToken(),
      });
    };

    updateTokenStatus();

    // Update token status every minute
    const interval = setInterval(updateTokenStatus, 60000);
    return () => clearInterval(interval);
  }, []);

  return tokenStatus;
};
