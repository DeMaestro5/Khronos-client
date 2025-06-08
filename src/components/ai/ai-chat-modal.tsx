'use client';

import React, { useState, useRef, useEffect } from 'react';
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
  Trash2,
  RefreshCw,
} from 'lucide-react';
import { useAIChat } from '@/src/context/AIChatContext';

// Modern AI streaming text component with markdown support
interface StreamingTextProps {
  text: string;
  speed?: number;
  onComplete?: () => void;
}

const StreamingText = ({
  text,
  speed = 20,
  onComplete,
}: StreamingTextProps) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isStreaming, setIsStreaming] = useState(true);

  // Reset when text changes
  useEffect(() => {
    setDisplayedText('');
    setCurrentIndex(0);
    setIsStreaming(true);
  }, [text]);

  // Handle the streaming effect
  useEffect(() => {
    if (currentIndex >= text.length) {
      setIsStreaming(false);
      if (onComplete) {
        setTimeout(onComplete, 300);
      }
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
  }, [currentIndex, text, speed, onComplete]);

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
  } = useAIChat();

  const [inputMessage, setInputMessage] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const [completedAnimations, setCompletedAnimations] = useState<Set<string>>(
    new Set()
  );
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const message = inputMessage.trim();
    setInputMessage('');
    await sendMessage(message);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleCopyMessage = async (messageId: string, content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedMessageId(messageId);
      setTimeout(() => setCopiedMessageId(null), 2000);
    } catch (err) {
      console.error('Failed to copy message:', err);
    }
  };

  const handleConversationStarter = async (prompt: string) => {
    if (isLoading) return;
    setInputMessage(prompt);
    await sendMessage(prompt);
  };

  const handleClearAllConversations = () => {
    if (
      window.confirm(
        'Are you sure you want to clear all chat conversations? This will start fresh with new server sessions.'
      )
    ) {
      clearAllConversations();
      window.location.reload(); // Refresh to ensure clean state
    }
  };

  const handleAnimationComplete = (messageId: string) => {
    setCompletedAnimations((prev) => new Set([...prev, messageId]));
  };

  const formatTime = (date: Date | string) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getActionIcon = (type: string) => {
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
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className='fixed inset-0 z-50 flex items-end justify-end p-6 pointer-events-none'
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Chat Modal */}
        <motion.div
          className={`relative bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden pointer-events-auto flex flex-col ${
            isMinimized ? 'w-80 h-16' : 'w-96 h-[600px]'
          }`}
          initial={{ scale: 0.8, opacity: 0, y: 100 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: 100 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          {/* Header */}
          <div className='bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 p-4 flex items-center justify-between flex-shrink-0'>
            <div className='flex items-center gap-3'>
              <div className='relative'>
                <div className='w-8 h-8 bg-white/20 rounded-full flex items-center justify-center'>
                  <Bot className='w-4 h-4 text-white' />
                </div>
                <motion.div
                  className='absolute -top-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-white'
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </div>
              <div className='text-white'>
                <div className='flex items-center gap-2'>
                  <h3 className='font-semibold text-sm'>AI Assistant</h3>
                  {currentContentTitle && (
                    <div className='px-2 py-0.5 bg-white/20 rounded-full'>
                      <div className='w-1.5 h-1.5 bg-green-400 rounded-full'></div>
                    </div>
                  )}
                </div>
                {currentContentTitle && !isMinimized && (
                  <div className='flex items-center gap-1'>
                    <p className='text-xs opacity-80 truncate max-w-32'>
                      &ldquo;{currentContentTitle}&rdquo;
                    </p>
                    <span className='text-xs opacity-60'>• Enhanced</span>
                  </div>
                )}
              </div>
            </div>

            <div className='flex items-center gap-2'>
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className='p-1.5 hover:bg-white/20 rounded-lg transition-colors'
                title={isMinimized ? 'Maximize' : 'Minimize'}
              >
                {isMinimized ? (
                  <Maximize2 className='w-4 h-4 text-white' />
                ) : (
                  <Minimize2 className='w-4 h-4 text-white' />
                )}
              </button>
              <button
                onClick={closeChat}
                className='p-1.5 hover:bg-white/20 rounded-lg transition-colors'
                title='Close chat'
              >
                <X className='w-4 h-4 text-white' />
              </button>
            </div>
          </div>

          {/* Chat Content - Only show when not minimized */}
          {!isMinimized && (
            <>
              {/* Error Banner */}
              {error && (
                <div className='bg-red-50 border-b border-red-200 p-3'>
                  <div className='flex items-start gap-2'>
                    <AlertCircle className='w-4 h-4 text-red-500 flex-shrink-0 mt-0.5' />
                    <div className='flex-1'>
                      <p className='text-sm text-red-700'>{error}</p>
                      {error.includes('Try clearing your chat history') && (
                        <div className='mt-2 flex gap-2'>
                          <button
                            onClick={handleClearAllConversations}
                            className='flex items-center gap-1 px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-700 rounded-md transition-colors text-xs font-medium'
                          >
                            <Trash2 className='w-3 h-3' />
                            Clear Chat History
                          </button>
                          <button
                            onClick={() => window.location.reload()}
                            className='flex items-center gap-1 px-3 py-1.5 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-md transition-colors text-xs font-medium'
                          >
                            <RefreshCw className='w-3 h-3' />
                            Refresh Page
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Messages Area */}
              <div className='flex-1 overflow-y-auto p-4 space-y-4 min-h-0'>
                {messages.length === 0 ? (
                  <div className='flex flex-col items-center justify-center h-full text-center'>
                    <div className='w-16 h-16 bg-gradient-to-r from-purple-100 to-indigo-100 rounded-full flex items-center justify-center mb-4'>
                      <Sparkles className='w-8 h-8 text-purple-600' />
                    </div>
                    <h4 className='text-lg font-semibold text-gray-900 mb-2'>
                      Hi! I&apos;m your AI assistant
                    </h4>
                    <p className='text-sm text-gray-600 max-w-64 mb-4'>
                      {currentContentTitle
                        ? `Ready to help optimize "${currentContentTitle}"! I can assist with content strategy, SEO improvements, engagement tactics, and performance insights. Your conversation will be saved for this content.`
                        : 'I&apos;m here to help with your content creation, strategy, and optimization. What would you like to know?'}
                    </p>

                    {/* Quick Actions */}
                    {actions.length > 0 && (
                      <div className='grid grid-cols-2 gap-2 mb-4 w-full max-w-sm'>
                        {actions.map((action) => (
                          <button
                            key={action.type}
                            onClick={() =>
                              handleConversationStarter(
                                `Help me ${action.label.toLowerCase()} this content`
                              )
                            }
                            className='flex items-center gap-2 p-3 bg-white/80 hover:bg-white rounded-xl transition-all duration-200 hover:shadow-md group border border-gray-200'
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
                      <div className='w-full max-w-sm space-y-2'>
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
                        <div className='w-full max-w-sm space-y-2'>
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
                              onClick={() => handleConversationStarter(prompt)}
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
                      <div className='mt-4 space-y-2'>
                        <div className='px-4 py-2 bg-purple-50 rounded-lg border border-purple-200'>
                          <p className='text-xs text-purple-700 font-medium'>
                            Content Context: {currentContentTitle}
                          </p>
                        </div>
                        <div className='px-4 py-2 bg-green-50 rounded-lg border border-green-200'>
                          <p className='text-xs text-green-700 font-medium flex items-center gap-1'>
                            <div className='w-2 h-2 bg-green-500 rounded-full'></div>
                            Enhanced AI with server synchronization
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <>
                    {messages.map((message) => (
                      <motion.div
                        key={message.id}
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
                          className={`flex gap-3 max-w-[80%] ${
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
                                  : 'bg-gray-100 text-gray-900 border border-gray-200'
                              }`}
                            >
                              <div className='text-sm leading-relaxed whitespace-pre-wrap'>
                                {message.role === 'assistant' ? (
                                  <StreamingText
                                    text={message.content}
                                    speed={15}
                                    onComplete={() =>
                                      handleAnimationComplete(message.id || '')
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

                              {/* Copy button for AI messages - only show when animation is complete */}
                              {message.role === 'assistant' &&
                                completedAnimations.has(message.id || '') && (
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

                            {/* Timestamp - removed model info */}
                            <p
                              className={`text-xs text-gray-500 mt-1 ${
                                message.role === 'user'
                                  ? 'text-right'
                                  : 'text-left'
                              }`}
                            >
                              {formatTime(message.timestamp)}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))}

                    {/* Loading indicator */}
                    {isLoading && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className='flex justify-start'
                      >
                        <div className='flex gap-3'>
                          <div className='w-8 h-8 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full flex items-center justify-center'>
                            <Bot className='w-4 h-4 text-white' />
                          </div>
                          <div className='bg-gray-100 rounded-2xl px-4 py-3 border border-gray-200'>
                            <div className='flex space-x-1'>
                              <motion.div
                                className='w-2 h-2 bg-gray-400 rounded-full'
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{
                                  duration: 1,
                                  repeat: Infinity,
                                  delay: 0,
                                }}
                              />
                              <motion.div
                                className='w-2 h-2 bg-gray-400 rounded-full'
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{
                                  duration: 1,
                                  repeat: Infinity,
                                  delay: 0.2,
                                }}
                              />
                              <motion.div
                                className='w-2 h-2 bg-gray-400 rounded-full'
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{
                                  duration: 1,
                                  repeat: Infinity,
                                  delay: 0.4,
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    <div ref={messagesEndRef} />
                  </>
                )}
              </div>

              {/* Input Area */}
              <div className='border-t border-gray-200 flex-shrink-0'>
                <div className='flex items-center gap-3 p-4'>
                  <div className='flex-1 relative'>
                    <input
                      ref={inputRef}
                      type='text'
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder='Ask me anything about your content...'
                      className='w-full px-4 py-3 pr-12 border text-gray-900 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none text-sm'
                      disabled={isLoading}
                    />

                    <button
                      onClick={handleSendMessage}
                      disabled={!inputMessage.trim() || isLoading}
                      className='absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-lg hover:from-purple-600 hover:to-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all'
                    >
                      <Send className='w-4 h-4' />
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AIChatModal;
