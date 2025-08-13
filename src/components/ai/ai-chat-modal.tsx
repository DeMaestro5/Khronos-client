'use client';

import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
  useLayoutEffect,
} from 'react';
import Image from 'next/image';
import {
  X,
  Send,
  Sparkles,
  Bot,
  Copy,
  Check,
  AlertCircle,
  Zap,
  Target,
  MessageCircle,
} from 'lucide-react';
import { useAIChat } from '@/src/context/AIChatContext';
import { useAuth } from '@/src/context/AuthContext';

// Utility function to generate user initials - optimized for speed
const generateInitials = (name: string): string => {
  if (!name || typeof name !== 'string') return 'U';

  const trimmedName = name.trim();
  if (trimmedName.length === 0) return 'U';

  const nameParts = trimmedName.split(' ');
  if (nameParts.length === 1) {
    return nameParts[0].charAt(0).toUpperCase();
  }

  // Get first and last name parts (filter out empty strings)
  const validParts = nameParts.filter((part) => part.length > 0);
  if (validParts.length === 1) {
    return validParts[0].charAt(0).toUpperCase();
  }

  return (
    validParts[0].charAt(0) + validParts[validParts.length - 1].charAt(0)
  ).toUpperCase();
};

// Simple text streaming without complex animations
const StreamingText: React.FC<{
  text: string;
  messageId: string;
  shouldAnimate: boolean;
  onComplete: (id: string) => void;
}> = ({ text, messageId, shouldAnimate, onComplete }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const animationRef = useRef<NodeJS.Timeout | undefined>(undefined);

  useEffect(() => {
    if (!shouldAnimate || hasAnimated) {
      setDisplayedText(text);
      return;
    }

    setDisplayedText('');
    setIsStreaming(true);
    setHasAnimated(false);

    let currentIndex = 0;
    const animate = () => {
      if (currentIndex >= text.length) {
        setIsStreaming(false);
        setHasAnimated(true);
        onComplete(messageId);
        return;
      }

      const charsToAdd = Math.random() > 0.5 ? 2 : 1;
      const nextIndex = Math.min(currentIndex + charsToAdd, text.length);
      setDisplayedText(text.substring(0, nextIndex));
      currentIndex = nextIndex;

      animationRef.current = setTimeout(animate, 15);
    };

    animate();

    return () => {
      if (animationRef.current) {
        clearTimeout(animationRef.current);
      }
    };
  }, [text, shouldAnimate, hasAnimated, messageId, onComplete]);

  // Enhanced markdown parsing with modern styling
  const formatText = (text: string) => {
    return text.split('\n').map((line, index) => {
      if (line.trim() === '') return <div key={index} className='h-2' />;

      // Headings with gradient text and better spacing
      if (line.startsWith('### ')) {
        return (
          <h4
            key={index}
            className='text-base font-semibold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mt-6 mb-3 flex items-center gap-2'
          >
            <div className='w-1 h-4 bg-gradient-to-b from-purple-500 to-indigo-500 rounded-full'></div>
            {line.replace('### ', '')}
          </h4>
        );
      }
      if (line.startsWith('## ')) {
        return (
          <h3
            key={index}
            className='text-lg font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mt-5 mb-3 flex items-center gap-2'
          >
            <div className='w-1.5 h-5 bg-gradient-to-b from-purple-500 to-indigo-500 rounded-full'></div>
            {line.replace('## ', '')}
          </h3>
        );
      }
      if (line.startsWith('# ')) {
        return (
          <h2
            key={index}
            className='text-xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mt-6 mb-4 flex items-center gap-3'
          >
            <div className='w-2 h-6 bg-gradient-to-b from-purple-500 to-indigo-500 rounded-full'></div>
            {line.replace('# ', '')}
          </h2>
        );
      }

      // Enhanced bullet points with ChatGPT/Claude-like styling
      if (line.match(/^[\s]*[\*\-]\s/)) {
        return (
          <div key={index} className='flex items-start gap-4 mb-3 group'>
            <div className='w-1.5 h-1.5 bg-gray-600 dark:bg-gray-400 rounded-full mt-2.5 flex-shrink-0'></div>
            <div className='flex-1 text-gray-800 dark:text-gray-200 leading-6'>
              {line.replace(/^[\s]*[\*\-]\s/, '')}
            </div>
          </div>
        );
      }

      // Numbered lists with ChatGPT/Claude-like styling
      if (line.match(/^[\s]*\d+\.\s/)) {
        return (
          <div key={index} className='flex items-start gap-4 mb-3 group'>
            <div className='w-6 h-6 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-full flex items-center justify-center mt-1 flex-shrink-0'>
              <span className='text-gray-700 dark:text-gray-300 text-sm font-medium'>
                {line.match(/^[\s]*(\d+)\.\s/)?.[1]}
              </span>
            </div>
            <div className='flex-1 text-gray-800 dark:text-gray-200 leading-6'>
              {line.replace(/^[\s]*\d+\.\s/, '')}
            </div>
          </div>
        );
      }

      // Bold text with ** - but exclude platform names
      if (line.includes('**')) {
        const parts = line.split('**');
        return (
          <p key={index} className='text-theme-secondary mb-2 leading-relaxed'>
            {parts.map((part, partIndex) => {
              // Check if this is a platform name that should be styled differently
              const platformNames = [
                'LinkedIn',
                'Twitter',
                'Instagram',
                'YouTube',
                'TikTok',
                'Facebook',
                'Pinterest',
                'Snapchat',
                'Discord',
                'Telegram',
              ];
              const isPlatform = platformNames.some((platform) =>
                part.toLowerCase().includes(platform.toLowerCase())
              );

              if (partIndex % 2 === 1) {
                if (isPlatform) {
                  // Style platform names with special styling instead of bold
                  return (
                    <span
                      key={partIndex}
                      className='inline-flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200 dark:border-blue-700 rounded-lg text-blue-700 dark:text-blue-300 font-medium text-sm'
                    >
                      <div className='w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full'></div>
                      {part}
                    </span>
                  );
                } else {
                  // Regular bold text - ChatGPT/Claude style
                  return (
                    <span
                      key={partIndex}
                      className='font-semibold text-gray-900 dark:text-gray-100'
                    >
                      {part}
                    </span>
                  );
                }
              } else {
                return part;
              }
            })}
          </p>
        );
      }

      // Italic text with * - ChatGPT/Claude style
      if (line.includes('*') && !line.includes('**')) {
        const parts = line.split('*');
        return (
          <p
            key={index}
            className='text-gray-800 dark:text-gray-200 mb-4 leading-6'
          >
            {parts.map((part, partIndex) =>
              partIndex % 2 === 1 ? (
                <span
                  key={partIndex}
                  className='italic text-gray-700 dark:text-gray-300'
                >
                  {part}
                </span>
              ) : (
                part
              )
            )}
          </p>
        );
      }

      // Code blocks with backticks - ChatGPT/Claude style
      if (line.includes('`')) {
        const parts = line.split('`');
        return (
          <p
            key={index}
            className='text-gray-800 dark:text-gray-200 mb-4 leading-6'
          >
            {parts.map((part, partIndex) =>
              partIndex % 2 === 1 ? (
                <code
                  key={partIndex}
                  className='bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 px-1.5 py-0.5 rounded text-sm font-mono'
                >
                  {part}
                </code>
              ) : (
                part
              )
            )}
          </p>
        );
      }

      // Hashtags styling - ChatGPT/Claude style
      if (line.includes('#')) {
        const hashtagRegex = /#(\w+)/g;
        const parts = line.split(hashtagRegex);
        return (
          <p
            key={index}
            className='text-gray-800 dark:text-gray-200 mb-4 leading-6'
          >
            {parts.map((part, partIndex) =>
              part.match(hashtagRegex) ? (
                <span
                  key={partIndex}
                  className='text-blue-600 dark:text-blue-400 font-medium'
                >
                  {part}
                </span>
              ) : (
                part
              )
            )}
          </p>
        );
      }

      // Links (basic detection)
      if (line.includes('http')) {
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        const parts = line.split(urlRegex);
        return (
          <p key={index} className='text-theme-secondary mb-2 leading-relaxed'>
            {parts.map((part, partIndex) =>
              part.match(urlRegex) ? (
                <a
                  key={partIndex}
                  href={part}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline decoration-dotted hover:decoration-solid transition-all duration-200'
                >
                  {part}
                </a>
              ) : (
                part
              )
            )}
          </p>
        );
      }

      // Emoji styling - ChatGPT/Claude style
      if (
        line.match(
          /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/u
        )
      ) {
        const emojiRegex =
          /([\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}])/gu;
        const parts = line.split(emojiRegex);
        return (
          <p
            key={index}
            className='text-gray-800 dark:text-gray-200 mb-4 leading-6'
          >
            {parts.map((part, partIndex) =>
              emojiRegex.test(part) ? (
                <span
                  key={partIndex}
                  className='inline-block'
                  style={{ fontSize: '1.1em' }}
                >
                  {part}
                </span>
              ) : (
                part
              )
            )}
          </p>
        );
      }

      // Regular paragraphs with ChatGPT/Claude-like styling
      return (
        <p
          key={index}
          className='text-gray-800 dark:text-gray-200 mb-4 leading-6'
        >
          {line}
        </p>
      );
    });
  };

  return (
    <div className='relative'>
      <div>{formatText(displayedText)}</div>
      {isStreaming && (
        <span className='inline-block w-0.5 h-5 bg-gradient-to-b from-purple-500 to-indigo-500 ml-1 animate-pulse rounded-full shadow-sm' />
      )}
    </div>
  );
};

// Simple message bubble component
const MessageBubble: React.FC<{
  message: {
    role: string;
    content: string;
    id?: string;
    timestamp: Date | string;
    metadata?: { inappropriate?: boolean };
  };
  shouldAnimate: boolean;
  onAnimationComplete: (id: string) => void;
  onCopy: (id: string, content: string) => void;
  copiedMessageId: string | null;
  formatTime: (date: Date | string) => string;
  userInitials?: string; // Add user initials prop
  userAvatar?: string | null; // Add user avatar prop
}> = ({
  message,
  shouldAnimate,
  onAnimationComplete,
  onCopy,
  copiedMessageId,
  formatTime,
  userInitials,
  userAvatar,
}) => {
  const isUser = message.role === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div
        className={`flex gap-3 max-w-[85%] ${
          isUser ? 'flex-row-reverse' : 'flex-row'
        }`}
      >
        {/* Avatar */}
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 relative shadow-md hover:shadow-lg transition-shadow duration-200 ${
            isUser
              ? 'bg-gradient-to-br from-blue-500 to-blue-600 shadow-blue-200/50'
              : 'bg-gradient-to-br from-purple-500 to-indigo-600 shadow-purple-200/50'
          }`}
        >
          {isUser ? (
            // User avatar - always show initials, overlay image if available
            <>
              {/* Always show initials as fallback */}
              <span className='text-white text-sm font-bold tracking-wide'>
                {userInitials}
              </span>

              {/* Overlay profile picture if available */}
              {userAvatar && (
                <Image
                  src={userAvatar}
                  alt='User avatar'
                  width={40}
                  height={40}
                  className='absolute w-10 h-10 rounded-full object-cover ring-2 ring-white/20'
                  onError={() => {
                    // Hide image if it fails to load, initials will show
                    // Note: Next.js Image handles errors differently, so we'll rely on the initials fallback
                  }}
                />
              )}
            </>
          ) : (
            <div className='relative'>
              <Bot className='w-5 h-5 text-white' />
              <div className='absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white'></div>
            </div>
          )}
        </div>

        {/* Message Content */}
        <div className='group relative'>
          <div
            className={`px-5 py-4 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 ${
              isUser
                ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-blue-200/50'
                : message.metadata?.inappropriate
                ? 'bg-red-50 text-red-900 border border-red-200'
                : 'bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 text-theme-primary border border-gray-200 dark:border-gray-700 shadow-gray-200/50 dark:shadow-gray-800/50'
            }`}
          >
            <div className='text-sm leading-relaxed'>
              {!isUser ? (
                <StreamingText
                  text={message.content}
                  messageId={message.id || ''}
                  shouldAnimate={shouldAnimate}
                  onComplete={onAnimationComplete}
                />
              ) : (
                message.content
              )}
            </div>

            {message.metadata?.inappropriate && (
              <div className='mt-2 flex items-center gap-1'>
                <AlertCircle className='w-3 h-3 text-red-500' />
                <span className='text-xs text-red-600'>Flagged content</span>
              </div>
            )}
          </div>

          {/* Copy button */}
          {!isUser && (
            <button
              onClick={() => onCopy(message.id || '', message.content)}
              className={`absolute -right-10 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 ${
                copiedMessageId === message.id
                  ? 'bg-green-50 border-green-200 shadow-green-100 scale-110'
                  : 'hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
              title={
                copiedMessageId === message.id ? 'Copied!' : 'Copy message'
              }
            >
              {copiedMessageId === message.id ? (
                <Check className='w-4 h-4 text-green-600 animate-pulse' />
              ) : (
                <Copy className='w-4 h-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors' />
              )}
            </button>
          )}

          {/* Timestamp */}
          <div className='mt-2 text-xs text-gray-500 dark:text-gray-400 font-medium'>
            {formatTime(message.timestamp)}
          </div>
        </div>
      </div>
    </div>
  );
};

// Modern loading indicator
const LoadingIndicator: React.FC = () => (
  <div className='flex justify-start mb-4'>
    <div className='flex gap-3 max-w-[85%]'>
      <div className='w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-md'>
        <div className='relative'>
          <Bot className='w-5 h-5 text-white' />
          <div className='absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white animate-pulse'></div>
        </div>
      </div>
      <div className='bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl px-5 py-4 shadow-sm'>
        <div className='flex items-center gap-2'>
          <div className='w-2 h-2 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full animate-pulse'></div>
          <div
            className='w-2 h-2 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full animate-pulse'
            style={{ animationDelay: '0.2s' }}
          ></div>
          <div
            className='w-2 h-2 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full animate-pulse'
            style={{ animationDelay: '0.4s' }}
          ></div>
        </div>
      </div>
    </div>
  </div>
);

// Simple empty state with suggested questions and quick actions
const EmptyState: React.FC<{
  currentContentTitle: string | null;
  actions: Array<{ type: string; label: string }>;
  conversationStarters: Array<{ prompt: string }>;
  onConversationStarter: (prompt: string) => void;
  isMessageLoading: boolean;
}> = ({
  currentContentTitle,
  actions,
  conversationStarters,
  onConversationStarter,
  isMessageLoading,
}) => {
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

  // Get default suggested questions if none provided
  const getDefaultQuestions = () => {
    if (currentContentTitle) {
      return [
        `How can I optimize "${currentContentTitle}" for better engagement?`,
        `What are some creative ideas to expand on "${currentContentTitle}"?`,
        `How can I improve the SEO for "${currentContentTitle}"?`,
      ];
    }
    return [
      'How can I improve my content strategy?',
      'What are the latest content marketing trends?',
      'How can I increase engagement on my posts?',
    ];
  };

  // Always show questions - either from server or defaults
  const questions = (() => {
    const fromServer = (conversationStarters || [])
      .map((s) => (typeof s?.prompt === 'string' ? s.prompt.trim() : ''))
      .filter((p) => p.length > 0);
    if (fromServer.length > 0) return fromServer.slice(0, 3);
    return getDefaultQuestions();
  })();

  return (
    <div className='flex flex-col h-full'>
      {/* Welcome Section */}
      <div className='flex flex-col items-center justify-center text-center space-y-6 p-4 flex-shrink-0'>
        <div className='w-16 h-16 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full flex items-center justify-center'>
          <Sparkles className='w-8 h-8 text-white' />
        </div>

        <div className='max-w-sm'>
          <h3 className='text-lg font-semibold text-theme-primary mb-2'>
            {currentContentTitle
              ? `Ready to help optimize "${currentContentTitle}"!`
              : 'AI Assistant Ready'}
          </h3>
          <p className='text-sm text-theme-secondary'>
            {currentContentTitle
              ? `I can assist with content strategy, SEO improvements, engagement tactics, and performance insights.`
              : 'I can help you with content strategy, SEO tips, creative ideas, and general content marketing advice.'}
          </p>
        </div>

        {currentContentTitle && (
          <div className='space-y-2 w-full max-w-xs'>
            <div className='px-3 py-2 bg-theme-secondary rounded-lg border border-theme-primary'>
              <p className='text-xs text-theme-secondary font-medium'>
                Content Context: {currentContentTitle}
              </p>
            </div>
            <div className='px-3 py-2 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800'>
              <p className='text-xs text-green-700 dark:text-green-300 font-medium flex items-center gap-1'>
                <span className='w-2 h-2 bg-green-500 rounded-full'></span>
                Enhanced AI with server synchronization
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      {actions.length > 0 && (
        <div className='px-4 pb-4 flex-shrink-0'>
          <div className='space-y-3'>
            <h4 className='text-sm font-medium text-theme-primary'>
              Quick Actions
            </h4>
            <div className='grid grid-cols-2 gap-2'>
              {actions.map((action) => (
                <button
                  key={action.type}
                  onClick={() =>
                    onConversationStarter(
                      `Help me ${action.label.toLowerCase()} this content`
                    )
                  }
                  className='flex items-center gap-2 p-3 bg-theme-secondary hover:bg-theme-hover rounded-xl transition-colors border border-theme-primary'
                  disabled={isMessageLoading}
                >
                  <span className='text-purple-500'>
                    {getActionIcon(action.type)}
                  </span>
                  <span className='text-xs font-medium text-theme-primary'>
                    {action.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Suggested Questions */}
      <div className='px-4 pb-4 flex-shrink-0'>
        <div className='space-y-3'>
          <div className='flex items-center gap-2'>
            <Sparkles className='w-4 h-4 text-purple-500' />
            <h4 className='text-sm font-medium text-theme-primary'>
              Suggested questions
            </h4>
            {/* Show loading indicator if conversation starters are being updated */}
            {isMessageLoading && (
              <div className='flex items-center gap-1'>
                <div className='w-1.5 h-1.5 bg-purple-500 rounded-full animate-pulse'></div>
                <div
                  className='w-1.5 h-1.5 bg-purple-500 rounded-full animate-pulse'
                  style={{ animationDelay: '0.2s' }}
                ></div>
                <div
                  className='w-1.5 h-1.5 bg-purple-500 rounded-full animate-pulse'
                  style={{ animationDelay: '0.4s' }}
                ></div>
              </div>
            )}
          </div>
          <div className='grid grid-cols-1 gap-2'>
            {questions.map((question, index) => (
              <button
                key={index}
                onClick={() => onConversationStarter(question)}
                className='w-full text-left p-3 bg-theme-secondary hover:bg-theme-hover rounded-lg border border-theme-primary transition-colors group'
                disabled={isMessageLoading}
              >
                <p className='text-xs text-theme-primary group-hover:text-theme-primary transition-colors'>
                  {question}
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const AIChatModal: React.FC = () => {
  const {
    isOpen,
    closeChat,
    messages,
    sendMessage,
    isMessageLoading, // Use the new isMessageLoading from context
    error,
    currentContentTitle,
    conversationStarters,
    actions,
    clearAllConversations,
    initialPrompt,
  } = useAIChat();

  // Get user information from auth context
  const { user } = useAuth();

  // Generate user initials and get avatar immediately
  const userInitials = user?.name ? generateInitials(user.name) : 'U';
  const userAvatar = user?.profilePicUrl || user?.avatar || null;

  const [inputMessage, setInputMessage] = useState('');
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const [showCopyToast, setShowCopyToast] = useState(false); // Add toast state
  const [animatedMessages, setAnimatedMessages] = useState<Set<string>>(
    new Set()
  );

  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const hasPrefilledRef = useRef(false);

  // Ensure we always can jump to the very bottom reliably
  const scrollToBottom = useCallback((behavior: ScrollBehavior = 'auto') => {
    const container = messagesContainerRef.current;
    if (!container) return;

    // Wait for layout/paint so scrollHeight is accurate
    requestAnimationFrame(() => {
      try {
        container.scrollTo({ top: container.scrollHeight, behavior });
      } catch {
        container.scrollTop = container.scrollHeight;
      }
    });
  }, []);

  // Memoized values
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
        !isMessageLoading // Use isMessageLoading instead of isLoading
      );
    },
    [lastAssistantMessageId, animatedMessages, isMessageLoading] // Update dependency
  );

  const handleAnimationComplete = useCallback((messageId: string) => {
    setAnimatedMessages((prev) => new Set([...prev, messageId]));
  }, []);

  // Input handling
  useEffect(() => {
    if (isOpen && initialPrompt && !hasPrefilledRef.current) {
      setInputMessage(initialPrompt);
      hasPrefilledRef.current = true;
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
          inputRef.current.setSelectionRange(
            initialPrompt.length,
            initialPrompt.length
          );
        }
      }, 0);
    }
  }, [isOpen, initialPrompt]);

  useEffect(() => {
    if (!isOpen) {
      hasPrefilledRef.current = false;
      return;
    }
    // When the modal opens, jump to the bottom immediately
    scrollToBottom('auto');
  }, [isOpen, scrollToBottom]);

  // Always scroll to bottom when modal opens or messages update (layout-safe)
  useLayoutEffect(() => {
    if (!isOpen) return;
    scrollToBottom('auto');
  }, [isOpen, messages.length, isMessageLoading, scrollToBottom]);

  // Observe DOM changes inside the messages container (streaming text, images)
  useEffect(() => {
    if (!isOpen) return;
    const container = messagesContainerRef.current;
    if (!container || typeof MutationObserver === 'undefined') return;

    const observer = new MutationObserver(() => {
      // Keep pinned to bottom while new content appears
      scrollToBottom('auto');
    });

    observer.observe(container, {
      childList: true,
      subtree: true,
      characterData: true,
    });

    return () => observer.disconnect();
  }, [isOpen, scrollToBottom]);

  const handleSendMessage = useCallback(async () => {
    if (!inputMessage.trim() || isMessageLoading) return; // Use isMessageLoading instead of isLoading
    const message = inputMessage.trim();
    setInputMessage('');
    await sendMessage(message);
  }, [inputMessage, isMessageLoading, sendMessage]); // Update dependency

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
        setShowCopyToast(true); // Show toast notification
        setTimeout(() => setCopiedMessageId(null), 2000);
        setTimeout(() => setShowCopyToast(false), 1500); // Hide toast after 1.5s
      } catch (err) {
        console.error('Failed to copy message:', err);
      }
    },
    []
  );

  const handleConversationStarter = useCallback(
    async (prompt: string) => {
      if (isMessageLoading) return; // Use isMessageLoading instead of isLoading
      await sendMessage(prompt);
    },
    [isMessageLoading, sendMessage] // Update dependency
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

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => inputRef.current?.focus(), 100);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Remove old scroll effect (kept here for reference)
  // useLayoutEffect(() => {
  //   if (!isOpen) return;
  //   const container = messagesContainerRef.current;
  //   if (!container) return;
  //   container.scrollTop = container.scrollHeight;
  // }, [isOpen, messages.length, isMessageLoading]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop - No animations */}
      <div
        className='fixed inset-0 bg-black/50 backdrop-blur-sm z-50 sm:hidden'
        onClick={closeChat}
      />

      {/* Modal Container - No animations */}
      <div className='fixed z-[99999] inset-0 flex items-end justify-center p-0 sm:inset-auto sm:bottom-6 sm:right-6 sm:left-auto sm:top-auto sm:p-0 sm:items-end'>
        <div className='bg-theme-primary shadow-2xl flex flex-col min-h-0 overflow-hidden w-full h-full rounded-none sm:w-96 sm:h-[600px] sm:rounded-2xl sm:border sm:border-theme-primary'>
          {/* Copy Toast Notification */}
          {showCopyToast && (
            <div className='absolute top-4 left-1/2 transform -translate-x-1/2 z-10 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-xl shadow-2xl flex items-center gap-3 transition-all duration-300 ease-in-out animate-in slide-in-from-top-2'>
              <div className='w-2 h-2 bg-white rounded-full animate-pulse'></div>
              <Check className='w-5 h-5' />
              <span className='text-sm font-semibold'>
                Copied to clipboard!
              </span>
            </div>
          )}

          {/* Header */}
          <div className='flex items-center justify-between p-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-sm'>
            <div className='flex items-center gap-3 flex-1 min-w-0'>
              {/* Status Indicator */}
              <div className='relative'>
                <div className='w-3 h-3 bg-green-400 rounded-full'></div>
              </div>

              {/* Title and Content Info */}
              <div className='flex-1 min-w-0'>
                <div className='flex items-center gap-2'>
                  <div className='w-6 h-6 bg-white/20 rounded-lg flex items-center justify-center'>
                    <Sparkles className='w-3 h-3 text-white' />
                  </div>
                  <h2 className='font-semibold text-sm sm:text-base text-white'>
                    AI Assistant
                  </h2>
                  <div className='flex items-center gap-1 px-2 py-0.5 bg-white/20 rounded-full'>
                    <div className='w-1.5 h-1.5 bg-green-400 rounded-full'></div>
                    <span className='text-xs text-white'>Enhanced</span>
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
                <X className='w-4 h-4 text-white' />
              </button>
            </div>
          </div>

          {/* Chat Content */}
          <div className='flex-1 flex flex-col min-h-0 overflow-hidden'>
            {/* Error Banner */}
            {error && (
              <div className='bg-red-50 dark:bg-red-900/20 border-b border-red-200 dark:border-red-800 p-3'>
                <div className='flex items-center justify-between'>
                  <p className='text-sm text-red-700 dark:text-red-300'>
                    {error}
                  </p>
                  <div className='flex gap-2'>
                    <button
                      onClick={handleClearAllConversations}
                      className='text-xs text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200 underline'
                    >
                      Clear All
                    </button>
                    <button
                      onClick={() => window.location.reload()}
                      className='text-xs text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200 underline'
                    >
                      Reload
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Messages Area */}
            <div
              ref={messagesContainerRef}
              className='messages-container flex-1 min-h-0 overflow-y-auto bg-theme-secondary'
              style={{
                WebkitOverflowScrolling: 'touch',
                overscrollBehavior:
                  'contain' as React.CSSProperties['overscrollBehavior'],
              }}
            >
              {messages.length === 0 ? (
                <EmptyState
                  currentContentTitle={currentContentTitle}
                  actions={actions}
                  conversationStarters={conversationStarters}
                  onConversationStarter={handleConversationStarter}
                  isMessageLoading={isMessageLoading}
                />
              ) : (
                <div className='p-4 space-y-4'>
                  {messages.map((message, index) => (
                    <MessageBubble
                      key={message.id || `${message.timestamp}-${index}`}
                      message={message}
                      shouldAnimate={shouldAnimateMessage(message.id || '')}
                      onAnimationComplete={handleAnimationComplete}
                      onCopy={handleCopyMessage}
                      copiedMessageId={copiedMessageId}
                      formatTime={formatTime}
                      userInitials={userInitials}
                      userAvatar={userAvatar}
                    />
                  ))}

                  {/* Loading indicator - only show when AI is responding to a message */}
                  {isMessageLoading && <LoadingIndicator />}
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className='border-t border-gray-200 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 p-4'>
              <div className='flex items-end gap-3'>
                <div className='flex-1 relative'>
                  <input
                    ref={inputRef}
                    type='text'
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder='Ask me anything about your content...'
                    className='w-full px-5 py-4 pr-12 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 shadow-sm hover:shadow-md transition-shadow duration-200'
                    disabled={isMessageLoading} // Use isMessageLoading instead of isLoading
                  />
                </div>
                <button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || isMessageLoading} // Use isMessageLoading instead of isLoading
                  className='p-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:from-gray-300 disabled:to-gray-400 text-white rounded-2xl transition-all duration-200 shadow-lg hover:shadow-xl disabled:shadow-none hover:scale-105 disabled:hover:scale-100'
                >
                  <Send className='w-5 h-5' />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AIChatModal;
