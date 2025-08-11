'use client';

import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
} from 'react';
import { motion } from 'framer-motion';

interface StreamingTextProps {
  text: string;
  speed?: number;
  onComplete?: () => void;
  shouldAnimate?: boolean;
  messageId: string;
}

// Optimized markdown parser with memoization
const useMarkdownParser = () => {
  return useCallback((text: string) => {
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
};

// Optimized inline markdown formatter
const formatInlineMarkdown = (text: string) => {
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
};

export const StreamingText: React.FC<StreamingTextProps> = React.memo(
  ({ text, speed = 20, onComplete, shouldAnimate = true, messageId }) => {
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

    const parseMarkdown = useMarkdownParser();

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

    // Memoize the parsed content to prevent unnecessary re-renders
    const parsedContent = useMemo(() => {
      return parseMarkdown(displayedText);
    }, [displayedText, parseMarkdown]);

    return (
      <div className='relative'>
        <div className='prose-custom'>{parsedContent}</div>
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
