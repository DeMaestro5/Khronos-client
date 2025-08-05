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
  Copy,
  Check,
  AlertCircle,
  Zap,
  Target,
  MessageCircle,
} from 'lucide-react';
import { useAIChat } from '@/src/context/AIChatContext';

// Optimized streaming text component with better performance
interface StreamingTextProps {
  text: string;
  speed?: number;
  onComplete?: () => void;
  shouldAnimate?: boolean;
  messageId: string;
}

const StreamingText = React.memo(
  ({
    text,
    speed = 20,
    onComplete,
    shouldAnimate = true,
    messageId,
  }: StreamingTextProps) => {
    const [displayedText, setDisplayedText] = useState('');
    const [isStreaming, setIsStreaming] = useState(false);
    const [hasAnimated, setHasAnimated] = useState(false);
    const [initializedForMessage, setInitializedForMessage] = useState<
      string | null
    >(null);
    const animationRef = useRef<NodeJS.Timeout | undefined>(undefined);

    // Use ref to store the onComplete callback to avoid dependency issues
    const onCompleteRef = useRef(onComplete);
    onCompleteRef.current = onComplete;

    // Initialize the component state when message changes
    useEffect(() => {
      if (messageId !== initializedForMessage || !shouldAnimate) {
        setInitializedForMessage(messageId);

        if (shouldAnimate && !hasAnimated) {
          setDisplayedText('');
          setIsStreaming(true);
          setHasAnimated(false);
        } else {
          setDisplayedText(text);
          setIsStreaming(false);
          setHasAnimated(true);
          // Call completion immediately for non-animated messages
          requestAnimationFrame(() => {
            if (onCompleteRef.current) {
              onCompleteRef.current();
            }
          });
        }
      }
    }, [messageId, shouldAnimate, text, hasAnimated, initializedForMessage]);

    // Optimized streaming effect using requestAnimationFrame
    useEffect(() => {
      if (!isStreaming || hasAnimated) return;

      let currentIndex = 0;
      const animate = () => {
        if (currentIndex >= text.length) {
          setIsStreaming(false);
          setHasAnimated(true);
          requestAnimationFrame(() => {
            if (onCompleteRef.current) {
              onCompleteRef.current();
            }
          });
          return;
        }

        // Add 2-4 characters at a time for faster, smoother flow
        const charsToAdd = Math.random() > 0.6 ? 3 : 2;
        const nextIndex = Math.min(currentIndex + charsToAdd, text.length);

        setDisplayedText(text.substring(0, nextIndex));
        currentIndex = nextIndex;

        animationRef.current = setTimeout(() => {
          requestAnimationFrame(animate);
        }, speed + Math.random() * 10);
      };

      requestAnimationFrame(animate);

      return () => {
        if (animationRef.current) {
          clearTimeout(animationRef.current);
        }
      };
    }, [text, speed, isStreaming, hasAnimated]);

    // Parse markdown and render formatted text with memoization
    const renderFormattedText = useCallback((text: string) => {
      const lines = text.split('\n');
      const elements: React.ReactNode[] = [];
      let key = 0;

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        if (line.trim() === '') {
          elements.push(<div key={key++} className='h-2' />);
          continue;
        }

        // Headers
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
        // Numbered headers
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
        // Bullet points
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
    }, []);

    // Format inline markdown with memoization
    const formatInlineMarkdown = useCallback((text: string) => {
      const parts = [];
      let remainingText = text;
      let key = 0;

      while (remainingText.length > 0) {
        // Bold text
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

        // Inline code
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

        parts.push(<span key={key++}>{remainingText}</span>);
        break;
      }

      return parts.length > 0 ? parts : text;
    }, []);

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
  }
);

StreamingText.displayName = 'StreamingText';

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
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const [animatedMessages, setAnimatedMessages] = useState<Set<string>>(
    new Set()
  );

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const hasPrefilledRef = useRef(false);

  // Memoized values to prevent unnecessary re-renders
  const lastAssistantMessageId = useMemo(() => {
    const assistantMessages = messages.filter((m) => m.role === 'assistant');
    return assistantMessages.length > 0
      ? assistantMessages[assistantMessages.length - 1].id
      : null;
  }, [messages]);

  const shouldAnimateMessage = useCallback(
    (messageId: string) => {
      return (
        messageId === lastAssistantMessageId &&
        !animatedMessages.has(messageId) &&
        !isLoading
      );
    },
    [lastAssistantMessageId, animatedMessages, isLoading]
  );

  const handleAnimationComplete = useCallback((messageId: string) => {
    setAnimatedMessages((prev) => new Set([...prev, messageId]));
  }, []);

  // Optimized input handling
  useEffect(() => {
    if (isOpen && initialPrompt && !hasPrefilledRef.current) {
      setInputMessage(initialPrompt);
      hasPrefilledRef.current = true;
      requestAnimationFrame(() => {
        if (inputRef.current) {
          inputRef.current.focus();
          inputRef.current.setSelectionRange(
            initialPrompt.length,
            initialPrompt.length
          );
        }
      });
    }
  }, [isOpen, initialPrompt]);

  useEffect(() => {
    if (!isOpen) {
      hasPrefilledRef.current = false;
    }
  }, [isOpen]);

  // Auto-scroll with optimized timing
  useEffect(() => {
    if (messages.length > 0) {
      requestAnimationFrame(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      });
    }
  }, [messages]);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => inputRef.current?.focus(), 100);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

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
      window.location.reload();
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
    <AnimatePresence mode='wait'>
      {isOpen && (
        <>
          {/* Optimized backdrop */}
          <motion.div
            className='fixed inset-0 bg-black/50 backdrop-blur-sm z-50 sm:hidden'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            onClick={closeChat}
            style={{ willChange: 'opacity' }}
          />

          {/* Optimized chat modal */}
          <motion.div
            className='fixed z-[99999] inset-0 flex items-end justify-center p-0 sm:inset-auto sm:bottom-6 sm:right-6 sm:left-auto sm:top-auto sm:p-0 sm:items-end'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            style={{ willChange: 'opacity' }}
          >
            <motion.div
              className={`bg-white shadow-2xl flex flex-col overflow-hidden w-full h-full rounded-none sm:w-96 sm:h-[600px] sm:rounded-2xl sm:border sm:border-gray-200`}
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
                damping: 25,
                mass: 0.8,
                duration: 0.4,
              }}
              style={{
                willChange: 'transform, opacity',
                transform: 'translateZ(0)',
                backfaceVisibility: 'hidden',
              }}
            >
              {/* Header */}
              <motion.div
                className='flex items-center justify-between p-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-sm'
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                style={{ willChange: 'transform, opacity' }}
              >
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
                  <button
                    onClick={closeChat}
                    className='p-2 hover:bg-white/10 rounded-lg transition-colors'
                    title='Close'
                  >
                    <X className='w-4 h-4' />
                  </button>
                </div>
              </motion.div>

              {/* Chat Content */}
              <AnimatePresence>
                <motion.div
                  className='flex-1 flex flex-col overflow-hidden'
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                  style={{
                    willChange: 'opacity',
                    transform: 'translateZ(0)',
                  }}
                >
                  {/* Error Banner */}
                  {error && (
                    <motion.div
                      className='bg-red-50 border-b border-red-200 p-3'
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3, ease: 'easeOut' }}
                    >
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
                    </motion.div>
                  )}

                  {/* Messages Area */}
                  <div className='flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50'>
                    {messages.length === 0 ? (
                      <motion.div
                        className='flex flex-col items-center justify-center h-full text-center space-y-4'
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.4, ease: 'easeOut' }}
                      >
                        <motion.div
                          className='w-16 h-16 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full flex items-center justify-center'
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{
                            duration: 0.4,
                            ease: 'easeOut',
                          }}
                        >
                          <Sparkles className='w-8 h-8 text-white' />
                        </motion.div>
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
                          <motion.div
                            className='grid grid-cols-2 gap-2 w-full max-w-xs'
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, ease: 'easeOut' }}
                          >
                            {actions.map((action) => (
                              <motion.button
                                key={action.type}
                                onClick={() =>
                                  handleConversationStarter(
                                    `Help me ${action.label.toLowerCase()} this content`
                                  )
                                }
                                className='flex items-center gap-2 p-3 bg-white hover:bg-gray-50 rounded-xl transition-all duration-200 hover:shadow-sm group border border-gray-200'
                                disabled={isLoading}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{
                                  duration: 0.3,
                                  ease: 'easeOut',
                                }}
                              >
                                <span className='text-purple-600 group-hover:text-purple-700'>
                                  {getActionIcon(action.type)}
                                </span>
                                <span className='text-xs font-medium text-gray-700 group-hover:text-gray-900'>
                                  {action.label}
                                </span>
                              </motion.button>
                            ))}
                          </motion.div>
                        )}

                        {/* Conversation Starters */}
                        {conversationStarters.length > 0 && (
                          <motion.div
                            className='w-full max-w-xs space-y-2'
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, ease: 'easeOut' }}
                          >
                            <p className='text-xs font-medium text-gray-500 mb-2'>
                              Suggested questions:
                            </p>
                            {conversationStarters
                              .slice(0, 3)
                              .map((starter, index) => (
                                <motion.button
                                  key={index}
                                  onClick={() =>
                                    handleConversationStarter(
                                      starter.prompt || `Question ${index + 1}`
                                    )
                                  }
                                  className='w-full text-left p-3 bg-purple-50 hover:bg-purple-100 rounded-lg border border-purple-200 transition-all duration-200 group'
                                  disabled={isLoading}
                                  whileHover={{ scale: 1.01, x: 2 }}
                                  initial={{ opacity: 0, x: -5 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{
                                    duration: 0.3,
                                    ease: 'easeOut',
                                  }}
                                >
                                  <p className='text-xs text-purple-700 group-hover:text-purple-800'>
                                    {starter.prompt ||
                                      `Suggested question ${index + 1}`}
                                  </p>
                                </motion.button>
                              ))}
                          </motion.div>
                        )}

                        {/* Fallback conversation starters */}
                        {conversationStarters.length === 0 &&
                          currentContentTitle && (
                            <motion.div
                              className='w-full max-w-xs space-y-2'
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.3, ease: 'easeOut' }}
                            >
                              <p className='text-xs font-medium text-gray-500 mb-2'>
                                Suggested questions:
                              </p>
                              {[
                                `How can I optimize "${currentContentTitle}" for better engagement?`,
                                `What are some creative ideas to expand on "${currentContentTitle}"?`,
                                `How can I improve the SEO for "${currentContentTitle}"?`,
                              ].map((prompt, index) => (
                                <motion.button
                                  key={index}
                                  onClick={() =>
                                    handleConversationStarter(prompt)
                                  }
                                  className='w-full text-left p-3 bg-purple-50 hover:bg-purple-100 rounded-lg border border-purple-200 transition-all duration-200 group'
                                  disabled={isLoading}
                                  whileHover={{ scale: 1.01, x: 2 }}
                                  initial={{ opacity: 0, x: -5 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{
                                    duration: 0.3,
                                    ease: 'easeOut',
                                  }}
                                >
                                  <p className='text-xs text-purple-700 group-hover:text-purple-800'>
                                    {prompt}
                                  </p>
                                </motion.button>
                              ))}
                            </motion.div>
                          )}

                        {currentContentTitle && (
                          <motion.div
                            className='mt-4 space-y-2 w-full max-w-xs'
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, ease: 'easeOut' }}
                          >
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
                          </motion.div>
                        )}
                      </motion.div>
                    ) : (
                      <>
                        {messages.map((message, index) => (
                          <motion.div
                            key={message.id || `${message.timestamp}-${index}`}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                              duration: 0.3,
                              delay: index * 0.05,
                            }}
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
                                        onComplete={() =>
                                          handleAnimationComplete(
                                            message.id || ''
                                          )
                                        }
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

                                  {/* Copy button */}
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
                  <motion.div
                    className='border-t border-gray-200 bg-white p-4'
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.3 }}
                  >
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
                      <motion.button
                        onClick={handleSendMessage}
                        disabled={!inputMessage.trim() || isLoading}
                        className='p-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:from-gray-300 disabled:to-gray-400 text-white rounded-2xl transition-all duration-200 shadow-lg hover:shadow-xl disabled:shadow-none'
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Send className='w-4 h-4' />
                      </motion.button>
                    </div>
                  </motion.div>
                </motion.div>
              </AnimatePresence>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AIChatModal;
