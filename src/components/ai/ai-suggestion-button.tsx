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
  contentType = 'post',
  disabled = false,
}: AISuggestionButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const generateSuggestion = async (): Promise<AISuggestionResult> => {
    try {
      const response: { data: AIFormFillResponse } =
        await aiAPI.getFormFillSuggestions();

      // Check if the API response is successful
      if (response.data?.statusCode === '10000' && response.data?.data) {
        const suggestion = response.data.data;

        // Transform the API response to match our expected format
        return {
          title: suggestion.title || '',
          description: suggestion.description || '',
          tags: suggestion.tags || [],
        };
      } else {
        throw new Error(
          response.data?.message || 'Failed to get AI suggestions'
        );
      }
    } catch (error) {
      console.error('AI suggestion API error:', error);

      // Show fallback message
      toast.error('AI service unavailable. Using fallback suggestions.', {
        duration: 3000,
        style: {
          background: '#f59e0b',
          color: 'white',
          border: 'none',
          fontWeight: '500',
        },
      });

      // Fallback to mock data if API fails
      const suggestions = {
        post: {
          titles: [
            '10 Game-Changing Tips That Will Transform Your Day',
            "The Secret Strategy Everyone's Talking About",
            'Why This Simple Change Made All the Difference',
            'Behind the Scenes: What Nobody Tells You',
            'The Ultimate Guide to Mastering Your Goals',
          ],
          descriptions: [
            'Discover the proven strategies that successful people use daily. These actionable tips will help you unlock your potential and achieve remarkable results in just 30 days.',
            "Learn the insider secrets that industry experts don't want you to know. This comprehensive guide reveals the exact methods used by top performers.",
            'Transform your approach with these evidence-based techniques. Perfect for beginners and experts alike, these strategies deliver real, measurable results.',
          ],
          tags: [
            ['productivity', 'success', 'motivation', 'tips', 'lifestyle'],
            ['strategy', 'business', 'growth', 'entrepreneurship', 'mindset'],
            ['inspiration', 'achievement', 'goals', 'transformation', 'habits'],
          ],
        },
        story: {
          titles: [
            'A Day That Changed Everything',
            'The Moment I Realized My Potential',
            'From Doubt to Confidence: My Journey',
          ],
          descriptions: [
            "Sometimes the biggest changes come from the smallest moments. Here's the story of how one conversation shifted my entire perspective and set me on a new path.",
            'Behind every success story is a moment of clarity. This is mine - raw, honest, and hopefully inspiring for anyone facing similar challenges.',
          ],
          tags: [
            ['story', 'inspiration', 'personal', 'journey', 'growth'],
            [
              'motivation',
              'authentic',
              'reallife',
              'transformation',
              'mindset',
            ],
          ],
        },
        video: {
          titles: [
            'Watch This Before You Start Your Day',
            'The 60-Second Rule That Changes Everything',
            'Quick Tutorial: Master This in Minutes',
          ],
          descriptions: [
            "In this quick video, I'll show you the exact process I use every morning to set myself up for success. It takes less than 5 minutes but the impact lasts all day.",
            'Step-by-step tutorial that breaks down complex concepts into simple, actionable steps. Perfect for busy professionals who want real results fast.',
          ],
          tags: [
            ['tutorial', 'howto', 'quick', 'efficient', 'practical'],
            ['education', 'tips', 'video', 'stepbystep', 'guide'],
          ],
        },
        article: {
          titles: [
            'The Complete Guide to Modern Success Strategies',
            'Research-Backed Methods for Peak Performance',
            'What 10 Years of Data Taught Me About Growth',
          ],
          descriptions: [
            "An in-depth analysis of the strategies that actually work in today's landscape. Based on extensive research and real-world testing, this comprehensive guide provides actionable insights you can implement immediately.",
            'Dive deep into the methodologies that top performers use to maintain consistency and achieve breakthrough results. Includes case studies, practical frameworks, and step-by-step implementation guides.',
          ],
          tags: [
            ['indepth', 'research', 'comprehensive', 'strategy', 'analysis'],
            ['guide', 'methodology', 'framework', 'professional', 'insights'],
          ],
        },
      };

      const typeData =
        suggestions[contentType as keyof typeof suggestions] ||
        suggestions.post;
      const randomTitle =
        typeData.titles[Math.floor(Math.random() * typeData.titles.length)];
      const randomDescription =
        typeData.descriptions[
          Math.floor(Math.random() * typeData.descriptions.length)
        ];
      const randomTags =
        typeData.tags[Math.floor(Math.random() * typeData.tags.length)];

      return {
        title: randomTitle,
        description: randomDescription,
        tags: randomTags,
      };
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
      console.error('Failed to generate AI suggestion:', error);
      toast.error('Failed to get AI suggestions. Please try again.', {
        duration: 4000,
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
          fixed bottom-6 right-6 z-50
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
