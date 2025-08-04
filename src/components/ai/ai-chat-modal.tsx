'use client';

import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
} from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Send,
  Sparkles,
  Bot,
  User,
  Minimize2,
  Maximize2,
  Copy,
  Check,
  AlertCircle,
  Zap,
  Target,
  MessageCircle,
} from 'lucide-react';
import { useAIChat } from '@/src/context/AIChatContext';

// Modern AI streaming text component with markdown support
interface StreamingTextProps {
  text: string;
  speed?: number;
  onComplete?: () => void;
  shouldAnimate?: boolean;
  messageId: string;
}

const StreamingText = ({
  text,
  speed = 20,
  onComplete,
  shouldAnimate = true,
  messageId,
}: StreamingTextProps) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isStreaming, setIsStreaming] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [initializedForMessage, setInitializedForMessage] = useState<
    string | null
  >(null);

  // Use ref to store the onComplete callback to avoid dependency issues
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  // Initialize the component state when message changes or first loads
  useEffect(() => {
    // If this is a new message or we haven't initialized for this message yet
    if (messageId !== initializedForMessage || !shouldAnimate) {
      setInitializedForMessage(messageId);

      if (shouldAnimate && !hasAnimated) {
        // Start fresh animation only for truly new messages
        setDisplayedText('');
        setCurrentIndex(0);
        setIsStreaming(true);
        setHasAnimated(false);
      } else {
        // Show full text immediately for existing messages or when shouldn't animate
        setDisplayedText(text);
        setCurrentIndex(text.length);
        setIsStreaming(false);
        setHasAnimated(true);
        // Call completion immediately for non-animated messages
        setTimeout(() => {
          if (onCompleteRef.current) {
            onCompleteRef.current();
          }
        }, 0);
      }
    }
  }, [messageId, shouldAnimate, text, hasAnimated, initializedForMessage]);

  // Handle the streaming effect
  useEffect(() => {
    // Only animate if we should animate and we're currently streaming
    if (!isStreaming || hasAnimated) return;

    if (currentIndex >= text.length) {
      setIsStreaming(false);
      setHasAnimated(true);
      setTimeout(() => {
        if (onCompleteRef.current) {
          onCompleteRef.current();
        }
      }, 300);
      return;
    }

    const timer = setTimeout(() => {
      // Add 1-2 characters at a time for natural flow
      const charsToAdd = Math.random() > 0.8 ? 2 : 1;
      const nextIndex = Math.min(currentIndex + charsToAdd, text.length);

      setDisplayedText(text.substring(0, nextIndex));
      setCurrentIndex(nextIndex);
    }, speed + Math.random() * 20);

    return () => clearTimeout(timer);
  }, [currentIndex, text, speed, isStreaming, hasAnimated]);

  // Parse markdown and render formatted text
  const renderFormattedText = (text: string) => {
    const lines = text.split('\n');
    const elements: React.ReactNode[] = [];
    let key = 0;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // Skip empty lines but add spacing
      if (line.trim() === '') {
        elements.push(<div key={key++} className='h-2' />);
        continue;
      }

      // Headers (### ## #)
      if (line.startsWith('### ')) {
        elements.push(
          <h4
            key={key++}
            className='text-base font-semibold text-gray-900 mt-4 mb-2 first:mt-0'
          >
            {line.replace('### ', '')}
          </h4>
        );
      } else if (line.startsWith('## ')) {
        elements.push(
          <h3
            key={key++}
            className='text-lg font-semibold text-gray-900 mt-5 mb-3 first:mt-0'
          >
            {line.replace('## ', '')}
          </h3>
        );
      } else if (line.startsWith('# ')) {
        elements.push(
          <h2
            key={key++}
            className='text-xl font-bold text-gray-900 mt-6 mb-3 first:mt-0'
          >
            {line.replace('# ', '')}
          </h2>
        );
      }
      // Numbered headers (**1. **2. etc.)
      else if (line.match(/^\*\*\d+\.\s/)) {
        const headerText = line.replace(/^\*\*(\d+\.\s[^*]+)\*\*:?/, '$1');
        elements.push(
          <div key={key++} className='mt-5 mb-3 first:mt-0'>
            <h3 className='text-lg font-semibold text-purple-600 flex items-center gap-2'>
              <span className='w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center text-sm'>
                {headerText.match(/(\d+)/)?.[1]}
              </span>
              {headerText.replace(/^\d+\.\s/, '')}
            </h3>
          </div>
        );
      }
      // Bullet points (* or -)
      else if (line.match(/^[\s]*[\*\-]\s/)) {
        const indent = line.match(/^(\s*)/)?.[1]?.length || 0;
        const bulletText = line.replace(/^[\s]*[\*\-]\s/, '');
        const formattedText = formatInlineMarkdown(bulletText);

        elements.push(
          <div
            key={key++}
            className={`flex items-start gap-2 mb-1 ${
              indent > 0 ? 'ml-4' : ''
            }`}
          >
            <span className='w-1.5 h-1.5 bg-purple-400 rounded-full mt-2 flex-shrink-0'></span>
            <span className='text-gray-700 leading-relaxed'>
              {formattedText}
            </span>
          </div>
        );
      }
      // Regular paragraphs
      else {
        const formattedLine = formatInlineMarkdown(line);
        elements.push(
          <p
            key={key++}
            className='text-gray-700 leading-relaxed mb-3 last:mb-0'
          >
            {formattedLine}
          </p>
        );
      }
    }

    return elements;
  };

  // Format inline markdown (bold, italic, etc.)
  const formatInlineMarkdown = (text: string) => {
    const parts = [];
    let remainingText = text;
    let key = 0;

    while (remainingText.length > 0) {
      // Bold text (**text**)
      const boldMatch = remainingText.match(/^(.*?)\*\*(.*?)\*\*(.*)/);
      if (boldMatch) {
        const [, before, bold, after] = boldMatch;
        if (before) parts.push(<span key={key++}>{before}</span>);
        parts.push(
          <strong key={key++} className='font-semibold text-gray-900'>
            {bold}
          </strong>
        );
        remainingText = after;
        continue;
      }

      // Inline code (`code`)
      const codeMatch = remainingText.match(/^(.*?)`([^`]+)`(.*)/);
      if (codeMatch) {
        const [, before, code, after] = codeMatch;
        if (before) parts.push(<span key={key++}>{before}</span>);
        parts.push(
          <code
            key={key++}
            className='px-1.5 py-0.5 bg-purple-50 text-purple-700 rounded text-sm font-mono'
          >
            {code}
          </code>
        );
        remainingText = after;
        continue;
      }

      // No more markdown, add remaining text
      parts.push(<span key={key++}>{remainingText}</span>);
      break;
    }

    return parts.length > 0 ? parts : text;
  };

  return (
    <div className='relative'>
      <div className='prose-custom'>{renderFormattedText(displayedText)}</div>
      {isStreaming && (
        <motion.span
          className='inline-block w-0.5 h-[1.2em] bg-purple-500 ml-1 align-text-bottom'
          animate={{
            opacity: [0, 1, 1, 0],
            scaleY: [0.8, 1, 1, 0.8],
          }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      )}
    </div>
  );
};

const AIChatModal: React.FC = () => {
  const {
    isOpen,
    closeChat,
    messages,
    sendMessage,
    isLoading,
    error,
    currentContentTitle,
    conversationStarters,
    actions,
    clearAllConversations,
    initialPrompt,
  } = useAIChat();

  const [inputMessage, setInputMessage] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const [animatedMessages, setAnimatedMessages] = useState<Set<string>>(
    new Set()
  );
  const animatedMessagesRef = useRef<Set<string>>(new Set());

  // Initialize the ref with the current state
  useEffect(() => {
    animatedMessagesRef.current = animatedMessages;
  }, [animatedMessages]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Add ref to track if we've already prefilled for this session
  const hasPrefilledRef = useRef(false);

  useEffect(() => {
    if (isOpen && initialPrompt && !hasPrefilledRef.current) {
      setInputMessage(initialPrompt);
      hasPrefilledRef.current = true;
      // Focus the input and move cursor to the end
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
          inputRef.current.setSelectionRange(
            initialPrompt.length,
            initialPrompt.length
          );
        }
      }, 100);
    }
  }, [isOpen, initialPrompt]);

  // Reset the prefilled flag when modal closes or when starting a new chat session
  useEffect(() => {
    if (!isOpen) {
      hasPrefilledRef.current = false;
    }
  }, [isOpen]);

  // Memoize the most recent assistant message ID to prevent unnecessary re-calculations
  const lastAssistantMessageId = useMemo(() => {
    const assistantMessages = messages.filter((m) => m.role === 'assistant');
    return assistantMessages.length > 0
      ? assistantMessages[assistantMessages.length - 1].id
      : null;
  }, [messages]);

  // Memoize the shouldAnimate calculation to prevent unnecessary re-renders
  const shouldAnimateMessage = useCallback(
    (messageId: string) => {
      const shouldAnimate =
        messageId === lastAssistantMessageId &&
        !animatedMessagesRef.current.has(messageId) &&
        !isLoading;
      return shouldAnimate;
    },
    [lastAssistantMessageId, isLoading]
  );

  // Stable callback for animation completion
  const handleAnimationComplete = useCallback((messageId: string) => {
    setAnimatedMessages((prev) => {
      const newSet = new Set([...prev, messageId]);
      animatedMessagesRef.current = newSet;
      return newSet;
    });
  }, []);

  // Create stable onComplete callbacks for each message to prevent infinite re-renders
  const callbackMap = useRef(new Map<string, () => void>());

  const createOnCompleteCallback = useCallback(
    (messageId: string) => {
      if (!callbackMap.current.has(messageId)) {
        callbackMap.current.set(messageId, () =>
          handleAnimationComplete(messageId)
        );
      }
      return callbackMap.current.get(messageId)!;
    },
    [handleAnimationComplete]
  );

  // Clean up callback map when messages change to prevent memory leaks
  useEffect(() => {
    const currentMessageIds = new Set(messages.map((m) => m.id || ''));
    for (const [messageId] of callbackMap.current) {
      if (!currentMessageIds.has(messageId)) {
        callbackMap.current.delete(messageId);
      }
    }
  }, [messages]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen && !isMinimized) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen, isMinimized]);

  const handleSendMessage = useCallback(async () => {
    if (!inputMessage.trim() || isLoading) return;

    const message = inputMessage.trim();
    setInputMessage('');
    await sendMessage(message);
  }, [inputMessage, isLoading, sendMessage]);

  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSendMessage();
      }
    },
    [handleSendMessage]
  );

  const handleCopyMessage = useCallback(
    async (messageId: string, content: string) => {
      try {
        await navigator.clipboard.writeText(content);
        setCopiedMessageId(messageId);
        setTimeout(() => setCopiedMessageId(null), 2000);
      } catch (err) {
        console.error('Failed to copy message:', err);
      }
    },
    []
  );

  const handleConversationStarter = useCallback(
    async (prompt: string) => {
      if (isLoading) return;
      await sendMessage(prompt);
    },
    [isLoading, sendMessage]
  );

  const handleClearAllConversations = useCallback(() => {
    if (
      window.confirm(
        'Are you sure you want to clear all chat conversations? This will start fresh with new server sessions.'
      )
    ) {
      clearAllConversations();
      window.location.reload(); // Refresh to ensure clean state
    }
  }, [clearAllConversations]);

  const formatTime = useCallback((date: Date | string) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  }, []);

  const getActionIcon = useCallback((type: string) => {
    switch (type) {
      case 'optimize':
        return <Zap className='w-4 h-4' />;
      case 'ideas':
        return <Sparkles className='w-4 h-4' />;
      case 'strategy':
        return <Target className='w-4 h-4' />;
      case 'analyze':
        return <MessageCircle className='w-4 h-4' />;
      default:
        return <Sparkles className='w-4 h-4' />;
    }
  }, []);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop - Only show on mobile */}
          <motion.div
            className='fixed inset-0 bg-black/50 backdrop-blur-sm z-50 sm:hidden'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeChat}
          />

          {/* Chat Modal - Responsive Design */}
          <motion.div
            className='fixed z-[99999] inset-0 flex items-end justify-center p-0 sm:inset-auto sm:bottom-6 sm:right-6 sm:left-auto sm:top-auto sm:p-0 sm:items-end'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className={`bg-white shadow-2xl flex flex-col overflow-hidden w-full h-full rounded-none sm:w-96 sm:h-[600px] sm:rounded-2xl sm:border sm:border-gray-200 ${
                isMinimized ? 'sm:h-16' : ''
              }`}
              initial={{
                y: '100%',
                scale: 0.95,
                opacity: 0,
              }}
              animate={{
                y: 0,
                scale: 1,
                opacity: 1,
              }}
              exit={{
                y: '100%',
                scale: 0.95,
                opacity: 0,
              }}
              transition={{
                type: 'spring',
                stiffness: 300,
                damping: 30,
              }}
            >
              {/* Header */}
              <div className='flex items-center justify-between p-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-sm'>
                <div className='flex items-center gap-3 flex-1 min-w-0'>
                  {/* Status Indicator */}
                  <div className='relative'>
                    <div className='w-3 h-3 bg-green-400 rounded-full'></div>
                    <motion.div
                      className='absolute inset-0 bg-green-400 rounded-full'
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  </div>

                  {/* Title and Content Info */}
                  <div className='flex-1 min-w-0'>
                    <div className='flex items-center gap-2'>
                      <div className='w-6 h-6 bg-white/20 rounded-lg flex items-center justify-center'>
                        <Sparkles className='w-3 h-3 text-white' />
                      </div>
                      <h2 className='font-semibold text-sm sm:text-base'>
                        AI Assistant
                      </h2>
                      <div className='flex items-center gap-1 px-2 py-0.5 bg-white/20 rounded-full'>
                        <div className='w-1.5 h-1.5 bg-green-400 rounded-full'></div>
                        <span className='text-xs'>Enhanced</span>
                      </div>
                    </div>

                    {currentContentTitle && (
                      <p className='text-xs text-white/80 truncate mt-1'>
                        &ldquo;{currentContentTitle}&rdquo;
                      </p>
                    )}
                  </div>
                </div>

                {/* Header Actions */}
                <div className='flex items-center gap-2'>
                  {/* Minimize button - Only show on desktop */}
                  <button
                    onClick={() => setIsMinimized(!isMinimized)}
                    className='hidden sm:block p-2 hover:bg-white/10 rounded-lg transition-colors'
                    title={isMinimized ? 'Maximize' : 'Minimize'}
                  >
                    {isMinimized ? (
                      <Maximize2 className='w-4 h-4' />
                    ) : (
                      <Minimize2 className='w-4 h-4' />
                    )}
                  </button>
                  <button
                    onClick={closeChat}
                    className='p-2 hover:bg-white/10 rounded-lg transition-colors'
                    title='Close'
                  >
                    <X className='w-4 h-4' />
                  </button>
                </div>
              </div>

              {/* Chat Content - Only show when not minimized */}
              {!isMinimized && (
                <div className='flex-1 flex flex-col overflow-hidden'>
                  {/* Error Banner */}
                  {error && (
                    <div className='bg-red-50 border-b border-red-200 p-3'>
                      <div className='flex items-center justify-between'>
                        <p className='text-sm text-red-700'>{error}</p>
                        <div className='flex gap-2'>
                          <button
                            onClick={handleClearAllConversations}
                            className='text-xs text-red-600 hover:text-red-800 underline'
                          >
                            Clear All
                          </button>
                          <button
                            onClick={() => window.location.reload()}
                            className='text-xs text-red-600 hover:text-red-800 underline'
                          >
                            Reload
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Messages Area */}
                  <div className='flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50'>
                    {messages.length === 0 ? (
                      <div className='flex flex-col items-center justify-center h-full text-center space-y-4'>
                        <div className='w-16 h-16 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full flex items-center justify-center'>
                          <Sparkles className='w-8 h-8 text-white' />
                        </div>
                        <div className='max-w-sm'>
                          <h3 className='text-lg font-semibold text-gray-900 mb-2'>
                            {currentContentTitle
                              ? `Ready to help optimize "${currentContentTitle}"!`
                              : 'AI Assistant Ready'}
                          </h3>
                          <p className='text-sm text-gray-600 leading-relaxed'>
                            {currentContentTitle
                              ? `I can assist with content strategy, SEO improvements, engagement tactics, and performance insights. Your conversation will be saved for this content.`
                              : 'I can help you with content strategy, SEO tips, creative ideas, and general content marketing advice. Ask me anything!'}
                          </p>
                        </div>

                        {/* Quick Actions */}
                        {actions.length > 0 && (
                          <div className='grid grid-cols-2 gap-2 w-full max-w-xs'>
                            {actions.map((action) => (
                              <button
                                key={action.type}
                                onClick={() =>
                                  handleConversationStarter(
                                    `Help me ${action.label.toLowerCase()} this content`
                                  )
                                }
                                className='flex items-center gap-2 p-3 bg-white hover:bg-gray-50 rounded-xl transition-all duration-200 hover:shadow-sm group border border-gray-200'
                                disabled={isLoading}
                              >
                                <span className='text-purple-600 group-hover:text-purple-700'>
                                  {getActionIcon(action.type)}
                                </span>
                                <span className='text-xs font-medium text-gray-700 group-hover:text-gray-900'>
                                  {action.label}
                                </span>
                              </button>
                            ))}
                          </div>
                        )}

                        {/* Conversation Starters */}
                        {conversationStarters.length > 0 && (
                          <div className='w-full max-w-xs space-y-2'>
                            <p className='text-xs font-medium text-gray-500 mb-2'>
                              Suggested questions:
                            </p>
                            {conversationStarters
                              .slice(0, 3)
                              .map((starter, index) => (
                                <button
                                  key={index}
                                  onClick={() =>
                                    handleConversationStarter(
                                      starter.prompt || `Question ${index + 1}`
                                    )
                                  }
                                  className='w-full text-left p-3 bg-purple-50 hover:bg-purple-100 rounded-lg border border-purple-200 transition-all duration-200 group'
                                  disabled={isLoading}
                                >
                                  <p className='text-xs text-purple-700 group-hover:text-purple-800'>
                                    {starter.prompt ||
                                      `Suggested question ${index + 1}`}
                                  </p>
                                </button>
                              ))}
                          </div>
                        )}

                        {/* Fallback conversation starters if none provided by server */}
                        {conversationStarters.length === 0 &&
                          currentContentTitle && (
                            <div className='w-full max-w-xs space-y-2'>
                              <p className='text-xs font-medium text-gray-500 mb-2'>
                                Suggested questions:
                              </p>
                              {[
                                `How can I optimize "${currentContentTitle}" for better engagement?`,
                                `What are some creative ideas to expand on "${currentContentTitle}"?`,
                                `How can I improve the SEO for "${currentContentTitle}"?`,
                              ].map((prompt, index) => (
                                <button
                                  key={index}
                                  onClick={() =>
                                    handleConversationStarter(prompt)
                                  }
                                  className='w-full text-left p-3 bg-purple-50 hover:bg-purple-100 rounded-lg border border-purple-200 transition-all duration-200 group'
                                  disabled={isLoading}
                                >
                                  <p className='text-xs text-purple-700 group-hover:text-purple-800'>
                                    {prompt}
                                  </p>
                                </button>
                              ))}
                            </div>
                          )}

                        {currentContentTitle && (
                          <div className='mt-4 space-y-2 w-full max-w-xs'>
                            <div className='px-3 py-2 bg-purple-50 rounded-lg border border-purple-200'>
                              <p className='text-xs text-purple-700 font-medium'>
                                Content Context: {currentContentTitle}
                              </p>
                            </div>
                            <div className='px-3 py-2 bg-green-50 rounded-lg border border-green-200'>
                              <p className='text-xs text-green-700 font-medium flex items-center gap-1'>
                                <span className='w-2 h-2 bg-green-500 rounded-full'></span>
                                Enhanced AI with server synchronization
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <>
                        {messages.map((message, index) => (
                          <motion.div
                            key={
                              message.id ||
                              (typeof message.timestamp === 'string'
                                ? `${message.timestamp}-${index}`
                                : `${message.timestamp?.toString()}-${index}`) ||
                              `${index}-${
                                message.role
                              }-${message.content?.slice(0, 10)}`
                            }
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            className={`flex ${
                              message.role === 'user'
                                ? 'justify-end'
                                : 'justify-start'
                            }`}
                          >
                            <div
                              className={`flex gap-3 max-w-[85%] sm:max-w-[80%] ${
                                message.role === 'user'
                                  ? 'flex-row-reverse'
                                  : 'flex-row'
                              }`}
                            >
                              {/* Avatar */}
                              <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                                  message.role === 'user'
                                    ? 'bg-gradient-to-r from-blue-500 to-purple-500'
                                    : 'bg-gradient-to-r from-purple-500 to-indigo-500'
                                }`}
                              >
                                {message.role === 'user' ? (
                                  <User className='w-4 h-4 text-white' />
                                ) : (
                                  <Bot className='w-4 h-4 text-white' />
                                )}
                              </div>

                              {/* Message Bubble */}
                              <div className='group relative'>
                                <div
                                  className={`relative px-4 py-3 rounded-2xl ${
                                    message.role === 'user'
                                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                                      : message.metadata?.inappropriate
                                      ? 'bg-red-50 text-red-900 border border-red-200'
                                      : 'bg-white text-gray-900 border border-gray-200 shadow-sm'
                                  }`}
                                >
                                  <div className='text-sm leading-relaxed whitespace-pre-wrap'>
                                    {message.role === 'assistant' ? (
                                      <StreamingText
                                        text={message.content}
                                        speed={15}
                                        messageId={message.id || ''}
                                        shouldAnimate={shouldAnimateMessage(
                                          message.id || ''
                                        )}
                                        onComplete={createOnCompleteCallback(
                                          message.id || ''
                                        )}
                                      />
                                    ) : (
                                      message.content
                                    )}
                                  </div>

                                  {/* Metadata indicators */}
                                  {message.metadata?.inappropriate && (
                                    <div className='mt-2 flex items-center gap-1'>
                                      <AlertCircle className='w-3 h-3 text-red-500' />
                                      <span className='text-xs text-red-600'>
                                        Flagged content
                                      </span>
                                    </div>
                                  )}

                                  {/* Copy button for AI messages - show for all completed messages */}
                                  {message.role === 'assistant' && (
                                    <button
                                      onClick={() =>
                                        handleCopyMessage(
                                          message.id || '',
                                          message.content
                                        )
                                      }
                                      className='absolute -right-8 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 p-1.5 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50 transition-all'
                                      title='Copy message'
                                    >
                                      {copiedMessageId === message.id ? (
                                        <Check className='w-3 h-3 text-green-500' />
                                      ) : (
                                        <Copy className='w-3 h-3 text-gray-400' />
                                      )}
                                    </button>
                                  )}
                                </div>

                                {/* Timestamp */}
                                <div className='mt-1 flex items-center gap-2 text-xs text-gray-500'>
                                  <span>{formatTime(message.timestamp)}</span>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        ))}

                        {/* Loading indicator */}
                        {isLoading && (
                          <motion.div
                            className='flex justify-start'
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <div className='flex gap-3 max-w-[85%] sm:max-w-[80%]'>
                              <div className='w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center'>
                                <Bot className='w-4 h-4 text-white' />
                              </div>
                              <div className='bg-white border border-gray-200 rounded-2xl px-4 py-3 shadow-sm'>
                                <div className='flex items-center gap-2'>
                                  <motion.div
                                    className='w-2 h-2 bg-purple-500 rounded-full'
                                    animate={{ scale: [1, 1.2, 1] }}
                                    transition={{
                                      duration: 1.2,
                                      repeat: Infinity,
                                    }}
                                  />
                                  <motion.div
                                    className='w-2 h-2 bg-purple-500 rounded-full'
                                    animate={{ scale: [1, 1.2, 1] }}
                                    transition={{
                                      duration: 1.2,
                                      repeat: Infinity,
                                      delay: 0.2,
                                    }}
                                  />
                                  <motion.div
                                    className='w-2 h-2 bg-purple-500 rounded-full'
                                    animate={{ scale: [1, 1.2, 1] }}
                                    transition={{
                                      duration: 1.2,
                                      repeat: Infinity,
                                      delay: 0.4,
                                    }}
                                  />
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </>
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Input Area */}
                  <div className='border-t border-gray-200 bg-white p-4'>
                    <div className='flex items-end gap-3'>
                      <div className='flex-1 relative'>
                        <input
                          ref={inputRef}
                          type='text'
                          value={inputMessage}
                          onChange={(e) => setInputMessage(e.target.value)}
                          onKeyPress={handleKeyPress}
                          placeholder='Ask me anything about your content...'
                          className='w-full px-4 py-3 pr-12 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none text-sm'
                          disabled={isLoading}
                        />
                      </div>
                      <button
                        onClick={handleSendMessage}
                        disabled={!inputMessage.trim() || isLoading}
                        className='p-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:from-gray-300 disabled:to-gray-400 text-white rounded-2xl transition-all duration-200 shadow-lg hover:shadow-xl disabled:shadow-none'
                      >
                        <Send className='w-4 h-4' />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AIChatModal;
