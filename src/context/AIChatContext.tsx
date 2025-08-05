'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
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
  error: string | null;
  initialPrompt: string;
}

interface AIChatContextType {
  isOpen: boolean;
  messages: AIChatMessage[];
  isLoading: boolean;
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

export const AIChatProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [state, setState] = useState<AIChatState>({
    isOpen: false,
    conversations: {},
    currentContentId: null,
    currentContentTitle: null,
    isLoading: false,
    error: null,
    initialPrompt: '',
  });

  // Load conversations from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsedConversations = JSON.parse(stored);

        // Check if this is old dummy data format (no sessionId)
        const isOldFormat = Object.values(parsedConversations).some(
          (conv: unknown) => {
            const conversation = conv as Record<string, unknown>;
            return (
              !conversation.sessionId &&
              Array.isArray(conversation.messages) &&
              conversation.messages.length > 0
            );
          }
        );

        if (isOldFormat) {
          console.log(
            'Detected old chat data format, clearing and starting fresh...'
          );
          localStorage.removeItem(STORAGE_KEY);
          return;
        }

        // Convert timestamp strings back to Date objects
        const conversations: Record<string, ContentConversation> = {};
        Object.keys(parsedConversations).forEach((contentId) => {
          const conv = parsedConversations[contentId];
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
        }));
      }
    } catch (error) {
      console.error('Failed to load chat conversations:', error);
      // Clear corrupted data
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  // Save conversations to localStorage whenever they change
  const saveConversations = (
    conversations: Record<string, ContentConversation>
  ) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
    } catch (error) {
      console.error('Failed to save chat conversations:', error);
    }
  };

  const openChat = async (
    contentId?: string,
    contentTitle?: string,
    initialPrompt?: string
  ) => {
    // Open modal immediately for instant feedback
    setState((prev) => ({
      ...prev,
      isOpen: true,
      currentContentId: contentId || null,
      currentContentTitle: contentTitle || null,
      initialPrompt: initialPrompt || '',
      error: null,
    }));

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
      // Check if we already have a session for this content
      const existingConversation = state.conversations[contentId];

      if (existingConversation && existingConversation.sessionId) {
        // Load existing session from server
        try {
          const response = await aiChatAPI.getSession(
            existingConversation.sessionId
          );

          // Handle the server response structure: { statusCode, message, data }
          const responseData = response.data;
          if (responseData.statusCode !== '10000') {
            throw new Error(responseData.message || 'Failed to load session');
          }

          const sessionData: GetSessionResponse = responseData.data;

          const updatedConversation: ContentConversation = {
            contentId,
            contentTitle: contentTitle || existingConversation.contentTitle,
            sessionId: existingConversation.sessionId,
            messages: sessionData.session.messages.map((msg) => ({
              ...msg,
              timestamp: new Date(msg.timestamp),
            })),
            lastUpdated: new Date(sessionData.session.updatedAt),
            conversationStarters: sessionData.conversationStarters || [],
            actions: sessionData.ui?.actions || [],
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
  };

  const createNewSession = async (contentId: string, contentTitle?: string) => {
    try {
      console.log('Creating new session for content:', contentId, contentTitle);

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

      const newConversation: ContentConversation = {
        contentId,
        contentTitle: contentTitle || sessionData.session.title,
        sessionId: sessionData.session.id,
        messages: [],
        lastUpdated: new Date(),
        conversationStarters: sessionData.conversationStarters || [],
        actions: sessionData.ui?.actions || [],
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
        response: (error as { response?: { data?: unknown; status?: number } })
          ?.response?.data,
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
  };

  const closeChat = () => {
    setState((prev) => ({
      ...prev,
      isOpen: false,
      initialPrompt: '', // Clear initial prompt when closing
      error: null,
    }));
  };

  const sendMessage = async (message: string) => {
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
        isLoading: true,
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
          isLoading: false,
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
        response: (error as { response?: { data?: unknown; status?: number } })
          ?.response?.data,
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
          isLoading: false,
          error: 'Failed to send message. Please try again.',
        };
      });
    }
  };

  const clearMessages = async () => {
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
  };

  const clearAllConversations = () => {
    setState((prev) => ({
      ...prev,
      conversations: {},
      currentContentId: null,
      currentContentTitle: null,
      initialPrompt: '',
      error: null,
    }));
    localStorage.removeItem(STORAGE_KEY);
    console.log('All chat conversations cleared');
  };

  const getAllConversations = (): ContentConversation[] => {
    return Object.values(state.conversations).sort(
      (a, b) => b.lastUpdated.getTime() - a.lastUpdated.getTime()
    );
  };

  // Get current conversation data
  const currentConversation = state.currentContentId
    ? state.conversations[state.currentContentId]
    : null;

  const currentMessages = currentConversation?.messages || [];
  const conversationStarters = currentConversation?.conversationStarters || [];
  const actions = currentConversation?.actions || [];

  return (
    <AIChatContext.Provider
      value={{
        isOpen: state.isOpen,
        messages: currentMessages,
        isLoading: state.isLoading,
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
      }}
    >
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
