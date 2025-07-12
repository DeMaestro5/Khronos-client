'use client';

import React, {
  useState,
  useRef,
  useEffect,
  KeyboardEvent,
  ClipboardEvent,
} from 'react';
import { Input } from '@/src/components/ui/input';

interface CodeInputProps {
  length?: number;
  value: string;
  onChange: (value: string) => void;
  onComplete?: (value: string) => void;
  disabled?: boolean;
  error?: boolean;
  className?: string;
}

export default function CodeInput({
  length = 5,
  value,
  onChange,
  onComplete,
  disabled = false,
  error = false,
  className = '',
}: CodeInputProps) {
  const [focusedIndex, setFocusedIndex] = useState(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Initialize refs array
  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, length);
  }, [length]);

  // Auto-focus next input when value changes
  useEffect(() => {
    if (value.length < length && value.length > 0) {
      setFocusedIndex(value.length);
      inputRefs.current[value.length]?.focus();
    }
  }, [value, length]);

  // Auto-complete when all digits are entered
  useEffect(() => {
    if (value.length === length && onComplete) {
      onComplete(value);
    }
  }, [value, length, onComplete]);

  const handleInputChange = (index: number, inputValue: string) => {
    if (disabled) return;

    // Only allow single alphanumeric character
    const char = inputValue.slice(-1).toUpperCase();
    if (!/^[A-Z0-9]$/.test(char) && inputValue !== '') return;

    const newValue = value.split('');
    newValue[index] = char;
    const result = newValue.join('');

    onChange(result);

    // Auto-focus next input if character entered
    if (char && index < length - 1) {
      setFocusedIndex(index + 1);
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (disabled) return;

    // Handle backspace
    if (e.key === 'Backspace') {
      if (value[index] === '') {
        // If current input is empty, go to previous input
        if (index > 0) {
          const newValue = value.split('');
          newValue[index - 1] = '';
          onChange(newValue.join(''));
          setFocusedIndex(index - 1);
          inputRefs.current[index - 1]?.focus();
        }
      } else {
        // Clear current input
        const newValue = value.split('');
        newValue[index] = '';
        onChange(newValue.join(''));
      }
    }

    // Handle arrow keys
    if (e.key === 'ArrowLeft' && index > 0) {
      setFocusedIndex(index - 1);
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === 'ArrowRight' && index < length - 1) {
      setFocusedIndex(index + 1);
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    if (disabled) return;

    e.preventDefault();
    const pastedData = e.clipboardData.getData('text/plain');
    const chars = pastedData
      .replace(/[^A-Z0-9]/gi, '')
      .toUpperCase()
      .slice(0, length);

    if (chars.length === length) {
      onChange(chars);
      setFocusedIndex(length - 1);
      inputRefs.current[length - 1]?.focus();
    }
  };

  const handleFocus = (index: number) => {
    if (disabled) return;
    setFocusedIndex(index);
  };

  const handleClick = (index: number) => {
    if (disabled) return;
    setFocusedIndex(index);
    inputRefs.current[index]?.focus();
  };

  return (
    <div
      className={`flex items-center justify-center space-x-2 sm:space-x-3 ${className}`}
    >
      {Array.from({ length }, (_, index) => (
        <div
          key={index}
          className={`relative transition-all duration-200 ${
            focusedIndex === index ? 'scale-110' : 'scale-100'
          }`}
        >
          <Input
            ref={(el) => {
              inputRefs.current[index] = el;
            }}
            type='text'
            inputMode='text'
            pattern='[A-Z0-9]*'
            maxLength={1}
            value={value[index] || ''}
            onChange={(e) => handleInputChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            onFocus={() => handleFocus(index)}
            onClick={() => handleClick(index)}
            disabled={disabled}
            className={`
              w-12 h-12 sm:w-14 sm:h-14 text-center text-lg sm:text-xl font-bold
              border-2 rounded-xl transition-all duration-300
              ${
                error
                  ? 'border-red-400 bg-red-50 text-red-600 focus:border-red-500 focus:ring-red-100'
                  : focusedIndex === index
                  ? 'border-purple-500 bg-purple-50 text-purple-900 focus:border-purple-600 focus:ring-purple-100 shadow-lg'
                  : value[index]
                  ? 'border-green-400 bg-green-50 text-green-900'
                  : 'border-slate-300 bg-white text-slate-900 hover:border-slate-400 focus:border-purple-500 focus:ring-purple-100'
              }
              ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-text'}
            `}
            style={{
              WebkitFontSmoothing: 'antialiased',
              MozOsxFontSmoothing: 'grayscale',
            }}
          />
          {/* Focus indicator */}
          {focusedIndex === index && !disabled && (
            <div className='absolute inset-0 border-2 border-purple-500 rounded-xl animate-pulse' />
          )}
        </div>
      ))}
    </div>
  );
}
