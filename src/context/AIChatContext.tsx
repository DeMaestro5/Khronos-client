'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';

interface AIChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  contentId?: string;
}

interface ContentConversation {
  contentId: string;
  contentTitle: string;
  messages: AIChatMessage[];
  lastUpdated: Date;
}

interface AIChatState {
  isOpen: boolean;
  conversations: Record<string, ContentConversation>;
  currentContentId: string | null;
  currentContentTitle: string | null;
  isLoading: boolean;
}

interface AIChatContextType {
  isOpen: boolean;
  messages: AIChatMessage[];
  isLoading: boolean;
  currentContentId: string | null;
  currentContentTitle: string | null;
  openChat: (contentId?: string, contentTitle?: string) => void;
  closeChat: () => void;
  sendMessage: (message: string) => Promise<void>;
  clearMessages: () => void;
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
  });

  // Load conversations from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsedConversations = JSON.parse(stored);
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

  const openChat = (contentId?: string, contentTitle?: string) => {
    if (!contentId) {
      // General chat (no specific content)
      setState((prev) => ({
        ...prev,
        isOpen: true,
        currentContentId: null,
        currentContentTitle: null,
      }));
      return;
    }

    // Content-specific chat
    setState((prev) => ({
      ...prev,
      isOpen: true,
      currentContentId: contentId,
      currentContentTitle: contentTitle || null,
    }));

    // Create conversation if it doesn't exist
    setState((prev) => {
      if (!prev.conversations[contentId]) {
        const newConversations = {
          ...prev.conversations,
          [contentId]: {
            contentId,
            contentTitle: contentTitle || `Content ${contentId}`,
            messages: [],
            lastUpdated: new Date(),
          },
        };
        saveConversations(newConversations);
        return {
          ...prev,
          conversations: newConversations,
        };
      }
      return prev;
    });
  };

  const closeChat = () => {
    setState((prev) => ({
      ...prev,
      isOpen: false,
    }));
  };

  const sendMessage = async (message: string) => {
    const currentContentId = state.currentContentId;

    const userMessage: AIChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: message,
      timestamp: new Date(),
      contentId: currentContentId || undefined,
    };

    // Add user message to current conversation
    setState((prev) => {
      const updatedConversations = { ...prev.conversations };

      if (currentContentId && updatedConversations[currentContentId]) {
        updatedConversations[currentContentId] = {
          ...updatedConversations[currentContentId],
          messages: [
            ...updatedConversations[currentContentId].messages,
            userMessage,
          ],
          lastUpdated: new Date(),
        };
        saveConversations(updatedConversations);
      }

      return {
        ...prev,
        conversations: updatedConversations,
        isLoading: true,
      };
    });

    try {
      // Simulate AI response - replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      let aiResponse = "I'm here to help you with your content! ";

      if (currentContentId && state.currentContentTitle) {
        // Enhanced content-specific responses
        const contentSpecificResponses = [
          `Great question about "${state.currentContentTitle}"! `,
          `Regarding your content "${state.currentContentTitle}", `,
          `For "${state.currentContentTitle}", I can help with `,
          `Let's optimize "${state.currentContentTitle}" together! `,
        ];

        const randomStart =
          contentSpecificResponses[
            Math.floor(Math.random() * contentSpecificResponses.length)
          ];

        aiResponse =
          randomStart +
          `I can help you with:
        
• Content optimization and SEO improvements
• Engagement strategies for better reach
• Performance analysis and insights
• Content repurposing ideas
• Audience targeting suggestions
• Writing style and tone adjustments

What specific aspect would you like to focus on for this content?`;
      } else {
        aiResponse +=
          'Ask me anything about content creation, optimization, strategy, or any specific questions you have about your content calendar! I can help with writing, SEO, engagement tactics, and more.';
      }

      const assistantMessage: AIChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date(),
        contentId: currentContentId || undefined,
      };

      // Add assistant message to current conversation
      setState((prev) => {
        const updatedConversations = { ...prev.conversations };

        if (currentContentId && updatedConversations[currentContentId]) {
          updatedConversations[currentContentId] = {
            ...updatedConversations[currentContentId],
            messages: [
              ...updatedConversations[currentContentId].messages,
              assistantMessage,
            ],
            lastUpdated: new Date(),
          };
          saveConversations(updatedConversations);
        }

        return {
          ...prev,
          conversations: updatedConversations,
          isLoading: false,
        };
      });
    } catch (error) {
      console.error('Failed to send message:', error);
      setState((prev) => ({
        ...prev,
        isLoading: false,
      }));
    }
  };

  const clearMessages = () => {
    const currentContentId = state.currentContentId;

    if (currentContentId) {
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
    }
  };

  const getAllConversations = (): ContentConversation[] => {
    return Object.values(state.conversations).sort(
      (a, b) => b.lastUpdated.getTime() - a.lastUpdated.getTime()
    );
  };

  // Get current messages based on selected content
  const currentMessages = state.currentContentId
    ? state.conversations[state.currentContentId]?.messages || []
    : [];

  return (
    <AIChatContext.Provider
      value={{
        isOpen: state.isOpen,
        messages: currentMessages,
        isLoading: state.isLoading,
        currentContentId: state.currentContentId,
        currentContentTitle: state.currentContentTitle,
        openChat,
        closeChat,
        sendMessage,
        clearMessages,
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
