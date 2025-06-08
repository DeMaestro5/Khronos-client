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
} from 'lucide-react';
import { useAIChat } from '@/src/context/AIChatContext';

const AIChatModal: React.FC = () => {
  const {
    isOpen,
    closeChat,
    messages,
    sendMessage,
    isLoading,
    currentContentTitle,
  } = useAIChat();

  const [inputMessage, setInputMessage] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
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

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
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
                    <span className='text-xs opacity-60'>• Persistent</span>
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
                    <p className='text-sm text-gray-600 max-w-64'>
                      {currentContentTitle
                        ? `Ready to help optimize "${currentContentTitle}"! I can assist with content strategy, SEO improvements, engagement tactics, and performance insights. Your conversation will be saved for this content.`
                        : 'I&apos;m here to help with your content creation, strategy, and optimization. What would you like to know?'}
                    </p>
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
                            Conversation will persist for this content
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
                                  : 'bg-gray-100 text-gray-900 border border-gray-200'
                              }`}
                            >
                              <p className='text-sm leading-relaxed whitespace-pre-wrap'>
                                {message.content}
                              </p>

                              {/* Copy button for AI messages */}
                              {message.role === 'assistant' && (
                                <button
                                  onClick={() =>
                                    handleCopyMessage(
                                      message.id,
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
                            <div className='flex gap-1'>
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
                  </>
                )}

                <div ref={messagesEndRef} />
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
