import {
  AISuggestionButtonProps,
  AISuggestionResult,
  AIFormFillResponse,
} from '@/src/types/ai';
import { Sparkles } from 'lucide-react';
import { Loader2 } from 'lucide-react';
import React, { useState } from 'react';
import { aiAPI } from '@/src/lib/api';
import toast from 'react-hot-toast';

export default function AISuggestionButton({
  onSuggestion,
  disabled = false,
}: AISuggestionButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  // Fallback suggestions when AI returns empty data
  const getFallbackSuggestion = (): AISuggestionResult => {
    const fallbackSuggestions = [
      {
        title: 'Boost Your Social Media Engagement',
        description:
          'Discover proven strategies to increase likes, comments, and shares across all your social media platforms.',
        tags: ['social-media', 'engagement', 'marketing', 'growth'],
      },
      {
        title: 'Content Creation Made Simple',
        description:
          'Learn how to create compelling content that resonates with your audience and drives meaningful results.',
        tags: ['content-creation', 'storytelling', 'branding', 'strategy'],
      },
      {
        title: 'Digital Marketing Trends 2024',
        description:
          'Stay ahead of the curve with the latest digital marketing trends and techniques that are driving success.',
        tags: ['digital-marketing', 'trends', '2024', 'innovation'],
      },
      {
        title: 'Building Your Personal Brand',
        description:
          "Establish a strong personal brand that stands out in today's competitive digital landscape.",
        tags: [
          'personal-branding',
          'professional-growth',
          'networking',
          'reputation',
        ],
      },
    ];

    const randomIndex = Math.floor(Math.random() * fallbackSuggestions.length);
    return fallbackSuggestions[randomIndex];
  };

  const generateSuggestion = async (): Promise<AISuggestionResult> => {
    try {
      const response: { data: AIFormFillResponse } =
        await aiAPI.getFormFillSuggestions();

      // Check if the API response is successful
      if (response.data?.statusCode === '10000' && response.data?.data) {
        const apiData = response.data.data;

        // Extract from either formData or suggestion object
        const formData = apiData.formData;
        const suggestion = apiData.suggestion;

        // Transform the API response to match our expected format
        const result = {
          title: formData?.title || suggestion?.title || '',
          description: formData?.description || suggestion?.description || '',
          tags: formData?.tags || suggestion?.tags || [],
        };

        // Check if we got meaningful data
        const hasTitle = result.title && result.title.trim().length > 0;
        const hasDescription =
          result.description && result.description.trim().length > 0;
        const hasTags = result.tags && result.tags.length > 0;

        // If all fields are empty, use fallback
        if (!hasTitle && !hasDescription && !hasTags) {
          const fallback = getFallbackSuggestion();
          return fallback;
        }

        // If some fields are empty, enhance with fallback data
        if (!hasTitle || !hasDescription) {
          const fallback = getFallbackSuggestion();

          const enhanced = {
            title: hasTitle ? result.title : fallback.title,
            description: hasDescription
              ? result.description
              : fallback.description,
            tags: hasTags ? result.tags : fallback.tags,
          };

          return enhanced;
        }

        return result;
      } else {
        throw new Error(
          response.data?.message ||
            'AI service returned an unsuccessful response'
        );
      }
    } catch (error) {
      console.error('❌ AI suggestion API error:', error);

      // Use fallback data instead of throwing error
      const fallback = getFallbackSuggestion();

      // Show info toast that we're using fallback
      toast('🤖 Using sample suggestion (AI service unavailable)', {
        duration: 3000,
        style: {
          background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
          color: 'white',
          border: 'none',
          fontWeight: '500',
        },
      });

      return fallback;
    }
  };

  const handleClick = async () => {
    if (disabled || isLoading) return;

    setIsLoading(true);
    try {
      const suggestion = await generateSuggestion();

      onSuggestion(suggestion);

      // Show success message
      toast.success('🎉 AI suggestions applied to your form!', {
        duration: 3000,
        style: {
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          border: 'none',
          fontWeight: '500',
        },
      });
    } catch (error) {
      console.error('❌ Failed to generate AI suggestion:', error);

      let errorMessage = 'Failed to get AI suggestions. Please try again.';
      if (error instanceof Error) {
        errorMessage = error.message;
      }

      toast.error(`❌ ${errorMessage}`, {
        duration: 6000,
        style: {
          background: '#ef4444',
          color: 'white',
          border: 'none',
          fontWeight: '500',
        },
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled || isLoading}
      className={`
          fixed bottom-6 right-6 z-[99999]
          flex items-center space-x-2 px-4 py-3
          bg-gradient-to-r from-purple-600 to-pink-600
          hover:from-purple-500 hover:to-pink-500
          disabled:from-gray-600 disabled:to-gray-700
          text-white font-medium rounded-full
          shadow-lg hover:shadow-xl
          transform hover:scale-105 active:scale-95
          transition-all duration-200
          ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
           sm:right-10 sm:bottom-10 md:right-10 md:bottom-10 lg:right-10 lg:bottom-10 xl:right-10 xl:bottom-10
        `}
      title='Get AI content suggestions'
    >
      {isLoading ? (
        <Loader2 className='h-5 w-5 animate-spin' />
      ) : (
        <Sparkles className='h-5 w-5' />
      )}
      <span className='text-sm'>
        {isLoading ? 'Generating...' : 'AI Suggest'}
      </span>
    </button>
  );
}
