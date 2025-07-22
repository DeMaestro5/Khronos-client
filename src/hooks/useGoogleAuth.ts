import { useState, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { GoogleAuthResponse } from '../types/auth';

export const useGoogleAuth = () => {
  const { googleLogin, handleGoogleCallback, isGoogleAuthenticating } =
    useAuth();
  const [error, setError] = useState<string | null>(null);

  const initiateGoogleAuth = useCallback(() => {
    setError(null);
    try {
      googleLogin();
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : 'Failed to start Google authentication';
      setError(errorMessage);
    }
  }, [googleLogin]);

  const processGoogleCallback = useCallback(
    async (code: string, state: string): Promise<GoogleAuthResponse> => {
      setError(null);
      try {
        const result = await handleGoogleCallback(code, state);

        if (!result.success) {
          setError(result.error || 'Google authentication failed');
        }

        return result;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Google authentication failed';
        setError(errorMessage);
        return {
          success: false,
          error: errorMessage,
        };
      }
    },
    [handleGoogleCallback]
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    initiateGoogleAuth,
    processGoogleCallback,
    isAuthenticating: isGoogleAuthenticating,
    error,
    clearError,
  };
};
