'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import toast from 'react-hot-toast';
import { useGlobalConfetti } from './ConfettiContext';

interface ContentCreationState {
  isCreating: boolean;
  creatingContentTitle: string;
  createdContentId: string | null;
  hasScheduledDate: boolean;
  creationStartTime: number | null;
}

interface ContentCreationContextType {
  isCreating: boolean;
  creatingContentTitle: string;
  completeContentCreation: () => void;
  failContentCreation: (error: string) => void;
  clearCreationState: () => void;
  setContentId: (contentId: string) => void;
  startContentCreation: (title: string, hasScheduledDate: boolean) => void;
}

const ContentCreationContext = createContext<
  ContentCreationContextType | undefined
>(undefined);

const STORAGE_KEY = 'content_creation_state';

export const ContentCreationProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [state, setState] = useState<ContentCreationState>({
    isCreating: false,
    creatingContentTitle: '',
    createdContentId: null,
    hasScheduledDate: false,
    creationStartTime: null,
  });

  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);
  const { triggerContentCreationCelebration } = useGlobalConfetti();

  // Timeout duration: 5 minutes
  const CREATION_TIMEOUT = 5 * 60 * 1000;

  // Load state from localStorage on mount
  useEffect(() => {
    const savedState = localStorage.getItem(STORAGE_KEY);
    if (savedState) {
      try {
        const parsedState = JSON.parse(savedState);

        // Check if the creation has been running for too long
        if (parsedState.isCreating && parsedState.creationStartTime) {
          const timeSinceStart = Date.now() - parsedState.creationStartTime;

          if (timeSinceStart > CREATION_TIMEOUT) {
            // Content creation has been running too long, consider it failed
            console.warn(
              'Content creation timeout detected, clearing stale state'
            );
            localStorage.removeItem(STORAGE_KEY);
            return;
          }
        }

        setState(parsedState);

        // If we were creating content, set up timeout for remaining time
        if (parsedState.isCreating && parsedState.creationStartTime) {
          const remainingTime =
            CREATION_TIMEOUT - (Date.now() - parsedState.creationStartTime);
          if (remainingTime > 0) {
            const timeout = setTimeout(() => {
              failContentCreation(
                'Content creation timed out. Please try again.'
              );
            }, remainingTime);
            setTimeoutId(timeout);
          } else {
            // Already expired
            failContentCreation(
              'Content creation timed out. Please try again.'
            );
          }
        }
      } catch (error) {
        console.error('Failed to parse saved content creation state:', error);
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    if (state.isCreating || state.createdContentId) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [state]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [timeoutId]);

  const startContentCreation = (title: string, hasScheduledDate: boolean) => {
    // Clear any existing timeout
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    const startTime = Date.now();

    setState({
      isCreating: true,
      creatingContentTitle: title,
      createdContentId: null,
      hasScheduledDate,
      creationStartTime: startTime,
    });

    // Set timeout to automatically fail creation after 5 minutes
    const timeout = setTimeout(() => {
      failContentCreation('Content creation timed out. Please try again.');
    }, CREATION_TIMEOUT);
    setTimeoutId(timeout);
  };

  const completeContentCreation = () => {
    // Clear timeout
    if (timeoutId) {
      clearTimeout(timeoutId);
      setTimeoutId(null);
    }

    // Show success message based on whether it was scheduled or draft
    if (state.hasScheduledDate) {
      toast.success(
        '🎉 Content created and scheduled successfully! Check your calendar!',
        {
          duration: 5000,
          style: {
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            border: 'none',
            fontWeight: '500',
            fontSize: '16px',
          },
          icon: '📅',
        }
      );
    } else {
      toast.success('🎉 Content created as draft successfully!', {
        duration: 5000,
        style: {
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          border: 'none',
          fontWeight: '500',
          fontSize: '16px',
        },
        icon: '📝',
      });
    }

    // Trigger confetti
    setTimeout(() => {
      triggerContentCreationCelebration();
    }, 100);

    // Clear state
    setState({
      isCreating: false,
      creatingContentTitle: '',
      createdContentId: null,
      hasScheduledDate: false,
      creationStartTime: null,
    });
  };

  const failContentCreation = (error: string) => {
    // Clear timeout
    if (timeoutId) {
      clearTimeout(timeoutId);
      setTimeoutId(null);
    }

    toast.error(`❌ ${error}`, {
      duration: 6000,
      style: {
        background: '#ef4444',
        color: 'white',
        border: 'none',
        fontWeight: '500',
      },
    });

    // Clear state
    setState({
      isCreating: false,
      creatingContentTitle: '',
      createdContentId: null,
      hasScheduledDate: false,
      creationStartTime: null,
    });
  };

  const clearCreationState = () => {
    // Clear timeout
    if (timeoutId) {
      clearTimeout(timeoutId);
      setTimeoutId(null);
    }

    setState({
      isCreating: false,
      creatingContentTitle: '',
      createdContentId: null,
      hasScheduledDate: false,
      creationStartTime: null,
    });
  };

  const setContentId = (contentId: string) => {
    setState((prev) => ({
      ...prev,
      createdContentId: contentId,
    }));
  };

  return (
    <ContentCreationContext.Provider
      value={{
        isCreating: state.isCreating,
        creatingContentTitle: state.creatingContentTitle,
        startContentCreation,
        completeContentCreation,
        failContentCreation,
        clearCreationState,
        setContentId,
      }}
    >
      {children}
    </ContentCreationContext.Provider>
  );
};

export const useContentCreation = () => {
  const context = useContext(ContentCreationContext);
  if (context === undefined) {
    throw new Error(
      'useContentCreation must be used within a ContentCreationProvider'
    );
  }
  return context;
};
