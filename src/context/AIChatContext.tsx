'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
  useMemo,
} from 'react';
import { aiChatAPI } from '@/src/lib/api';
import {
  AIChatMessage,
  ContentConversation,
  StartSessionResponse,
  SendMessageResponse,
  GetSessionResponse,
  ConversationStarter,
  ChatUIAction,
} from '@/src/types/ai';

interface AIChatState {
  isOpen: boolean;
  conversations: Record<string, ContentConversation>;
  currentContentId: string | null;
  currentContentTitle: string | null;
  isLoading: boolean;
  isMessageLoading: boolean; // New state for AI response loading
  error: string | null;
  initialPrompt: string;
  hasHydrated: boolean;
}

interface AIChatContextType {
  isOpen: boolean;
  messages: AIChatMessage[];
  isLoading: boolean;
  isMessageLoading: boolean; // New state for AI response loading
  error: string | null;
  currentContentId: string | null;
  currentContentTitle: string | null;
  conversationStarters: ConversationStarter[];
  actions: ChatUIAction[];
  initialPrompt: string;
  openChat: (
    contentId?: string,
    contentTitle?: string,
    initialPrompt?: string
  ) => Promise<void>;
  closeChat: () => void;
  sendMessage: (message: string) => Promise<void>;
  clearMessages: () => void;
  clearAllConversations: () => void;
  getAllConversations: () => ContentConversation[];
}

const AIChatContext = createContext<AIChatContextType | undefined>(undefined);

const STORAGE_KEY = 'ai_chat_conversations';

// Optimized localStorage operations
const storage = {
  get: (key: string) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error('Failed to get from localStorage:', error);
      return null;
    }
  },
  set: (key: string, value: unknown) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Failed to set localStorage:', error);
    }
  },
  remove: (key: string) => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Failed to remove from localStorage:', error);
    }
  },
};

export const AIChatProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [state, setState] = useState<AIChatState>({
    isOpen: false,
    conversations: {},
    currentContentId: null,
    currentContentTitle: null,
    isLoading: false,
    isMessageLoading: false,
    error: null,
    initialPrompt: '',
    hasHydrated: false,
  });

  // Load conversations from localStorage on mount - optimized
  useEffect(() => {
    const loadConversations = () => {
      const stored = storage.get(STORAGE_KEY);
      if (!stored) {
        setState((prev) => ({ ...prev, hasHydrated: true }));
        return;
      }

      // Check if this is old dummy data format (no sessionId)
      const isOldFormat = Object.values(stored).some((conv: unknown) => {
        const conversation = conv as Record<string, unknown>;
        return (
          !conversation.sessionId &&
          Array.isArray(conversation.messages) &&
          conversation.messages.length > 0
        );
      });

      if (isOldFormat) {
        console.log(
          'Detected old chat data format, clearing and starting fresh...'
        );
        storage.remove(STORAGE_KEY);
        setState((prev) => ({ ...prev, hasHydrated: true }));
        return;
      }

      // Convert timestamp strings back to Date objects
      const conversations: Record<string, ContentConversation> = {};
      Object.keys(stored).forEach((contentId) => {
        const conv = stored[contentId];
        conversations[contentId] = {
          ...conv,
          lastUpdated: new Date(conv.lastUpdated),
          messages: conv.messages.map((msg: AIChatMessage) => ({
            ...msg,
            timestamp: new Date(msg.timestamp),
          })),
        };
      });

      setState((prev) => ({
        ...prev,
        conversations,
        hasHydrated: true,
      }));
    };

    // Use requestIdleCallback for better performance
    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      (
        window as { requestIdleCallback?: (callback: () => void) => void }
      ).requestIdleCallback?.(loadConversations);
    } else {
      setTimeout(loadConversations, 0);
    }
  }, []);

  // Optimized save conversations function
  const saveConversations = useCallback(
    (conversations: Record<string, ContentConversation>) => {
      // Debounce localStorage writes
      if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
        (
          window as { requestIdleCallback?: (callback: () => void) => void }
        ).requestIdleCallback?.(() => {
          storage.set(STORAGE_KEY, conversations);
        });
      } else {
        setTimeout(() => {
          storage.set(STORAGE_KEY, conversations);
        }, 0);
      }
    },
    []
  );

  // Default conversation starters and actions for immediate display
  const getDefaultConversationStarters = (
    title?: string
  ): ConversationStarter[] => [
    {
      type: 'optimization',
      prompt: title
        ? `How can I optimize "${title}" for better engagement?`
        : 'How can I improve my content strategy?',
      category: 'strategy',
    },
    {
      type: 'ideas',
      prompt: title
        ? `What are some creative ideas to expand on "${title}"?`
        : 'What are the latest content marketing trends?',
      category: 'creativity',
    },
    {
      type: 'seo',
      prompt: title
        ? `How can I improve the SEO for "${title}"?`
        : 'How can I increase engagement on my posts?',
      category: 'performance',
    },
  ];

  const defaultActions: ChatUIAction[] = useMemo(
    () => [
      {
        type: 'optimize',
        label: 'Optimize',
        description: 'Get optimization suggestions',
        icon: '⚡',
      },
      {
        type: 'ideas',
        label: 'Ideas',
        description: 'Get creative ideas',
        icon: '✨',
      },
      {
        type: 'strategy',
        label: 'Strategy',
        description: 'Get strategic advice',
        icon: '🎯',
      },
      {
        type: 'analyze',
        label: 'Analyze',
        description: 'Analyze content',
        icon: '📊',
      },
    ],
    []
  );

  const createNewSession = useCallback(
    async (contentId: string, contentTitle?: string) => {
      try {
        console.log(
          'Creating new session for content:',
          contentId,
          contentTitle
        );

        const response = await aiChatAPI.startSession(
          contentTitle || `Chat for Content ${contentId}`,
          contentId,
          `AI assistant session for content: ${contentTitle || contentId}`
        );

        console.log('Start session response:', response.data);

        // Handle the server response structure: { statusCode, message, data }
        const responseData = response.data;
        if (responseData.statusCode !== '10000') {
          throw new Error(responseData.message || 'Failed to create session');
        }

        const sessionData: StartSessionResponse = responseData.data;

        console.log('Session data:', sessionData);
        console.log('Conversation starters:', sessionData.conversationStarters);

        // Provide default conversation starters if none provided by server
        const defaultConversationStarters = [
          {
            type: 'optimization',
            prompt: contentTitle
              ? `How can I optimize "${contentTitle}" for better engagement?`
              : 'How can I improve my content strategy?',
            category: 'strategy',
          },
          {
            type: 'ideas',
            prompt: contentTitle
              ? `What are some creative ideas to expand on "${contentTitle}"?`
              : 'What are the latest content marketing trends?',
            category: 'creativity',
          },
          {
            type: 'seo',
            prompt: contentTitle
              ? `How can I improve the SEO for "${contentTitle}"?`
              : 'How can I increase engagement on my posts?',
            category: 'performance',
          },
        ];

        const newConversation: ContentConversation = {
          contentId,
          contentTitle: contentTitle || sessionData.session.title,
          sessionId: sessionData.session.id,
          messages: [],
          lastUpdated: new Date(),
          conversationStarters: (() => {
            const serverStarters = sessionData.conversationStarters || [];
            const validServerStarters = serverStarters.filter(
              (s) =>
                s && typeof s.prompt === 'string' && s.prompt.trim().length > 0
            );
            return validServerStarters.length > 0
              ? validServerStarters
              : defaultConversationStarters;
          })(),
          actions: sessionData.ui?.actions || defaultActions,
        };

        console.log('New conversation created:', newConversation);

        setState((prev) => {
          const newConversations = {
            ...prev.conversations,
            [contentId]: newConversation,
          };
          saveConversations(newConversations);
          return {
            ...prev,
            conversations: newConversations,
            isLoading: false,
          };
        });
      } catch (error) {
        console.error('Failed to create new session:', error);
        console.error('Error details:', {
          message: (error as Error)?.message,
          response: (
            error as { response?: { data?: unknown; status?: number } }
          )?.response?.data,
          status: (error as { response?: { data?: unknown; status?: number } })
            ?.response?.status,
        });

        // If the error might be due to conflicting old data, clear it and show helpful message
        const errorResponse = error as {
          response?: { data?: { message?: string } };
        };
        const errorMessage =
          errorResponse.response?.data?.message ||
          (error as Error)?.message ||
          'Unknown error';

        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: `Failed to create chat session: ${errorMessage}. Try clearing your chat history if this persists.`,
        }));
      }
    },
    [saveConversations, defaultActions]
  );

  // Optimized openChat function for instant modal display
  const openChat = useCallback(
    async (
      contentId?: string,
      contentTitle?: string,
      initialPrompt?: string
    ) => {
      // Try to synchronously locate an existing conversation (state or localStorage)
      let existingConversation: ContentConversation | undefined = undefined;
      if (contentId) {
        existingConversation = state.conversations[contentId];
        if (!existingConversation) {
          const stored = storage.get(STORAGE_KEY);
          const fromStorage = stored?.[contentId];
          if (fromStorage) {
            existingConversation = {
              ...fromStorage,
              lastUpdated: new Date(fromStorage.lastUpdated),
              messages: fromStorage.messages.map((m: AIChatMessage) => ({
                ...m,
                timestamp: new Date(m.timestamp),
              })),
            } as ContentConversation;
          }
        }
      }

      // Open modal immediately with default data for instant feedback
      setState((prev) => {
        const alreadyExists = contentId
          ? prev.conversations[contentId] || existingConversation
          : undefined;

        return {
          ...prev,
          isOpen: true,
          currentContentId: contentId || null,
          currentContentTitle:
            contentTitle || alreadyExists?.contentTitle || null,
          initialPrompt: initialPrompt || '',
          error: null,
          // Only pre-populate with default conversation if one does not already exist
          conversations: contentId
            ? alreadyExists
              ? {
                  ...prev.conversations,
                  [contentId]: alreadyExists,
                }
              : {
                  ...prev.conversations,
                  [contentId]: {
                    contentId,
                    contentTitle: contentTitle || `Content ${contentId}`,
                    sessionId: undefined,
                    messages: [],
                    lastUpdated: new Date(),
                    conversationStarters:
                      getDefaultConversationStarters(contentTitle),
                    actions: defaultActions,
                  } as ContentConversation,
                }
            : prev.conversations,
        };
      });

      if (!contentId) {
        // General chat (no specific content) - no API calls needed
        return;
      }

      // Load data in background after modal is already open
      setState((prev) => ({
        ...prev,
        isLoading: true,
      }));

      try {
        // Use the synchronously discovered existing conversation (if any)
        const conversationForSession = existingConversation;

        if (conversationForSession && conversationForSession.sessionId) {
          // Load existing session from server
          try {
            const response = await aiChatAPI.getSession(
              conversationForSession.sessionId
            );

            // Handle the server response structure: { statusCode, message, data }
            const responseData = response.data;
            if (responseData.statusCode !== '10000') {
              throw new Error(responseData.message || 'Failed to load session');
            }

            const sessionData: GetSessionResponse = responseData.data;

            // Provide default conversation starters if none provided by server
            const defaultConversationStarters = [
              {
                type: 'optimization',
                prompt:
                  contentTitle || conversationForSession.contentTitle
                    ? `How can I optimize "${
                        contentTitle || conversationForSession.contentTitle
                      }" for better engagement?`
                    : 'How can I improve my content strategy?',
                category: 'strategy',
              },
              {
                type: 'ideas',
                prompt:
                  contentTitle || conversationForSession.contentTitle
                    ? `What are some creative ideas to expand on "${
                        contentTitle || conversationForSession.contentTitle
                      }"?`
                    : 'What are the latest content marketing trends?',
                category: 'creativity',
              },
              {
                type: 'seo',
                prompt:
                  contentTitle || conversationForSession.contentTitle
                    ? `How can I improve the SEO for "${
                        contentTitle || conversationForSession.contentTitle
                      }"?`
                    : 'How can I increase engagement on my posts?',
                category: 'performance',
              },
            ];

            const updatedConversation: ContentConversation = {
              contentId,
              contentTitle: contentTitle || conversationForSession.contentTitle,
              sessionId: conversationForSession.sessionId,
              messages: sessionData.session.messages.map((msg) => ({
                ...msg,
                timestamp: new Date(msg.timestamp),
              })),
              lastUpdated: new Date(sessionData.session.updatedAt),
              conversationStarters: (() => {
                const serverStarters = sessionData.conversationStarters || [];
                const validServerStarters = serverStarters.filter(
                  (s) =>
                    s &&
                    typeof s.prompt === 'string' &&
                    s.prompt.trim().length > 0
                );
                if (validServerStarters.length > 0) return validServerStarters;
                const existingStarters =
                  conversationForSession.conversationStarters || [];
                const validExistingStarters = existingStarters.filter(
                  (s) =>
                    s &&
                    typeof s.prompt === 'string' &&
                    s.prompt.trim().length > 0
                );
                if (validExistingStarters.length > 0)
                  return validExistingStarters;
                return defaultConversationStarters;
              })(),
              actions:
                sessionData.ui?.actions || conversationForSession.actions || [],
            };

            setState((prev) => {
              const newConversations = {
                ...prev.conversations,
                [contentId]: updatedConversation,
              };
              saveConversations(newConversations);
              return {
                ...prev,
                conversations: newConversations,
                isLoading: false,
              };
            });
          } catch (error) {
            console.error('Failed to load existing session:', error);
            // Create new session if loading existing one fails
            await createNewSession(contentId, contentTitle);
          }
        } else {
          // Create new session
          await createNewSession(contentId, contentTitle);
        }
      } catch (error) {
        console.error('Failed to open chat:', error);
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: 'Failed to open chat. Please try again.',
        }));
      }
    },
    [state.conversations, saveConversations, createNewSession, defaultActions]
  );

  const closeChat = useCallback(() => {
    setState((prev) => ({
      ...prev,
      isOpen: false,
      initialPrompt: '', // Clear initial prompt when closing
      error: null,
    }));
  }, []);

  const sendMessage = useCallback(
    async (message: string) => {
      const currentContentId = state.currentContentId;

      if (!currentContentId) {
        // For general chat without specific content, just show a helpful message
        const userMessage: AIChatMessage = {
          id: Date.now().toString(),
          role: 'user',
          content: message,
          timestamp: new Date(),
        };

        const assistantMessage: AIChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content:
            "I'm here to help with general content strategy and marketing advice! However, for the best experience with specific content optimization, please select a content item from your dashboard. This will allow me to provide more targeted and contextual assistance.",
          timestamp: new Date(),
        };

        // Store these messages in a special "general" conversation
        const generalConversation: ContentConversation = {
          contentId: 'general',
          contentTitle: 'General Chat',
          sessionId: undefined,
          messages: [userMessage, assistantMessage],
          lastUpdated: new Date(),
          conversationStarters: [],
          actions: [],
        };

        setState((prev) => {
          const newConversations = {
            ...prev.conversations,
            general: generalConversation,
          };
          saveConversations(newConversations);
          return {
            ...prev,
            conversations: newConversations,
            isLoading: false,
          };
        });
        return;
      }

      const currentConversation = state.conversations[currentContentId];
      if (!currentConversation?.sessionId) {
        setState((prev) => ({
          ...prev,
          error: 'No active chat session. Please try reopening the chat.',
        }));
        return;
      }

      const userMessage: AIChatMessage = {
        id: Date.now().toString(),
        role: 'user',
        content: message,
        timestamp: new Date(),
        contentId: currentContentId,
      };

      // Add user message to current conversation immediately
      setState((prev) => {
        const updatedConversations = { ...prev.conversations };
        updatedConversations[currentContentId] = {
          ...updatedConversations[currentContentId],
          messages: [
            ...updatedConversations[currentContentId].messages,
            userMessage,
          ],
          lastUpdated: new Date(),
        };
        saveConversations(updatedConversations);

        return {
          ...prev,
          conversations: updatedConversations,
          isMessageLoading: true, // Use isMessageLoading instead of isLoading
          error: null,
          initialPrompt: '', // Clear initial prompt after sending message
        };
      });

      try {
        console.log(
          'Sending message to session:',
          currentConversation.sessionId,
          'Message:',
          message
        );

        const response = await aiChatAPI.sendMessage(
          currentConversation.sessionId,
          message
        );

        console.log('Send message response:', response.data);

        // Handle the server response structure: { statusCode, message, data }
        const responseData = response.data;
        if (responseData.statusCode !== '10000') {
          throw new Error(responseData.message || 'Failed to send message');
        }

        const messageData: SendMessageResponse = responseData.data;

        const assistantMessage: AIChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: messageData.message.content,
          timestamp: new Date(messageData.message.timestamp),
          metadata: messageData.message.metadata,
          contentId: currentContentId,
        };

        // Add assistant message to current conversation
        setState((prev) => {
          const updatedConversations = { ...prev.conversations };
          updatedConversations[currentContentId] = {
            ...updatedConversations[currentContentId],
            messages: [
              ...updatedConversations[currentContentId].messages,
              assistantMessage,
            ],
            lastUpdated: new Date(),
          };
          saveConversations(updatedConversations);

          return {
            ...prev,
            conversations: updatedConversations,
            isMessageLoading: false, // Use isMessageLoading instead of isLoading
            error: messageData.inappropriateContentDetected
              ? messageData.warningMessage || 'Content flagged as inappropriate'
              : null,
          };
        });

        // Log additional response data for debugging
        if (messageData.suggestions?.length) {
          console.log('AI Suggestions:', messageData.suggestions);
        }
        if (messageData.contentInsights) {
          console.log('Content Insights:', messageData.contentInsights);
        }
      } catch (error) {
        console.error('Failed to send message:', error);
        console.error('Send message error details:', {
          message: (error as Error)?.message,
          response: (
            error as { response?: { data?: unknown; status?: number } }
          )?.response?.data,
          status: (error as { response?: { data?: unknown; status?: number } })
            ?.response?.status,
          sessionId: currentConversation.sessionId,
        });

        // Remove the user message on error and show error state
        setState((prev) => {
          const updatedConversations = { ...prev.conversations };
          updatedConversations[currentContentId] = {
            ...updatedConversations[currentContentId],
            messages: updatedConversations[currentContentId].messages.filter(
              (msg) => msg.id !== userMessage.id
            ),
          };
          saveConversations(updatedConversations);

          return {
            ...prev,
            conversations: updatedConversations,
            isMessageLoading: false, // Use isMessageLoading instead of isLoading
            error: 'Failed to send message. Please try again.',
          };
        });
      }
    },
    [state.currentContentId, state.conversations, saveConversations]
  );

  const clearMessages = useCallback(async () => {
    const currentContentId = state.currentContentId;

    if (currentContentId) {
      // Clear local messages
      setState((prev) => {
        const updatedConversations = { ...prev.conversations };

        if (updatedConversations[currentContentId]) {
          updatedConversations[currentContentId] = {
            ...updatedConversations[currentContentId],
            messages: [],
            lastUpdated: new Date(),
          };
          saveConversations(updatedConversations);
        }

        return {
          ...prev,
          conversations: updatedConversations,
        };
      });

      // Note: We don't delete the server session here, just clear local messages
      // If you want to delete the server session, you can call aiChatAPI.deleteSession
    }
  }, [state.currentContentId, saveConversations]);

  const clearAllConversations = useCallback(() => {
    setState((prev) => ({
      ...prev,
      conversations: {},
      currentContentId: null,
      currentContentTitle: null,
      initialPrompt: '',
      error: null,
    }));
    storage.remove(STORAGE_KEY);
    console.log('All chat conversations cleared');
  }, []);

  const getAllConversations = useCallback((): ContentConversation[] => {
    return Object.values(state.conversations).sort(
      (a, b) => b.lastUpdated.getTime() - a.lastUpdated.getTime()
    );
  }, [state.conversations]);

  // Memoized current conversation data
  const currentConversation = useMemo(
    () =>
      state.currentContentId
        ? state.conversations[state.currentContentId]
        : null,
    [state.currentContentId, state.conversations]
  );

  const currentMessages = useMemo(
    () => currentConversation?.messages || [],
    [currentConversation?.messages]
  );

  const conversationStarters = useMemo(
    () => currentConversation?.conversationStarters || [],
    [currentConversation?.conversationStarters]
  );

  const actions = useMemo(
    () => currentConversation?.actions || [],
    [currentConversation?.actions]
  );

  // Memoized context value to prevent unnecessary re-renders
  const contextValue = useMemo(
    () => ({
      isOpen: state.isOpen,
      messages: currentMessages,
      isLoading: state.isLoading,
      isMessageLoading: state.isMessageLoading, // Added isMessageLoading to context value
      error: state.error,
      currentContentId: state.currentContentId,
      currentContentTitle: state.currentContentTitle,
      conversationStarters,
      actions,
      initialPrompt: state.initialPrompt,
      openChat,
      closeChat,
      sendMessage,
      clearMessages,
      clearAllConversations,
      getAllConversations,
    }),
    [
      state.isOpen,
      currentMessages,
      state.isLoading,
      state.isMessageLoading, // Added isMessageLoading to context value
      state.error,
      state.currentContentId,
      state.currentContentTitle,
      conversationStarters,
      actions,
      state.initialPrompt,
      openChat,
      closeChat,
      sendMessage,
      clearMessages,
      clearAllConversations,
      getAllConversations,
    ]
  );

  return (
    <AIChatContext.Provider value={contextValue}>
      {children}
    </AIChatContext.Provider>
  );
};

export const useAIChat = () => {
  const context = useContext(AIChatContext);
  if (context === undefined) {
    throw new Error('useAIChat must be used within an AIChatProvider');
  }
  return context;
};
