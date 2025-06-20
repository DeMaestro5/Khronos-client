'use client';

import React from 'react';
import { Button } from '@/src/components/ui/button';
import { Modal } from '@/src/components/modal';
import { Trend } from '@/src/types/trends';
import {
  Target,
  Hash,
  CheckCircle,
  XCircle,
  Minus as MinusIcon,
} from 'lucide-react';

interface TrendDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  trend: Trend | null;
  onGetPrediction: (keyword: string) => void;
  onFindRelated: (keyword: string) => void;
}

const TrendDetailModal: React.FC<TrendDetailModalProps> = ({
  isOpen,
  onClose,
  trend,
  onGetPrediction,
  onFindRelated,
}) => {
  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  const formatPercentage = (num: number): string => {
    return `${num > 0 ? '+' : ''}${num.toFixed(1)}%`;
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return (
          <CheckCircle className='w-4 h-4 text-emerald-500 dark:text-emerald-400' />
        );
      case 'negative':
        return <XCircle className='w-4 h-4 text-red-500 dark:text-red-400' />;
      default:
        return (
          <MinusIcon className='w-4 h-4 text-gray-500 dark:text-slate-400' />
        );
    }
  };

  if (!trend) return null;

  const handleGetPrediction = () => {
    onGetPrediction(trend.keyword);
    onClose();
  };

  const handleFindRelated = () => {
    onFindRelated(trend.keyword);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Trend Details: #${trend.keyword}`}
    >
      <div className='space-y-8 p-6'>
        {/* Main Stats Grid */}
        <div className='grid grid-cols-2 gap-6'>
          <div className='p-6 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800/30 backdrop-blur-sm'>
            <p className='text-sm text-gray-600 dark:text-slate-400 mb-2 font-medium'>
              Volume
            </p>
            <p className='text-3xl font-bold text-blue-600 dark:text-blue-400'>
              {formatNumber(trend.volume)}
            </p>
          </div>
          <div className='p-6 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl border border-emerald-100 dark:border-emerald-800/30 backdrop-blur-sm'>
            <p className='text-sm text-gray-600 dark:text-slate-400 mb-2 font-medium'>
              Growth
            </p>
            <p
              className={`text-3xl font-bold ${
                trend.growth > 0
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : trend.growth < 0
                  ? 'text-red-600 dark:text-red-400'
                  : 'text-gray-600 dark:text-slate-400'
              }`}
            >
              {formatPercentage(trend.growth)}
            </p>
          </div>
          <div className='p-6 bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-100 dark:border-purple-800/30 backdrop-blur-sm'>
            <p className='text-sm text-gray-600 dark:text-slate-400 mb-2 font-medium'>
              Platform
            </p>
            <p className='text-xl font-bold text-purple-600 dark:text-purple-400 capitalize'>
              {trend.platform}
            </p>
          </div>
          <div className='p-6 bg-orange-50 dark:bg-orange-900/20 rounded-xl border border-orange-100 dark:border-orange-800/30 backdrop-blur-sm'>
            <p className='text-sm text-gray-600 dark:text-slate-400 mb-2 font-medium'>
              Category
            </p>
            <p className='text-xl font-bold text-orange-600 dark:text-orange-400 capitalize'>
              {trend.category}
            </p>
          </div>
        </div>

        {/* Sentiment Section */}
        <div className='p-6 bg-gray-50 dark:bg-slate-800/60 rounded-xl border border-gray-200 dark:border-slate-700/60 backdrop-blur-sm'>
          <p className='text-sm text-gray-600 dark:text-slate-400 mb-3 font-medium'>
            Sentiment
          </p>
          <div className='flex items-center space-x-3'>
            {getSentimentIcon(trend.sentiment)}
            <span className='capitalize text-lg font-bold text-gray-900 dark:text-slate-100'>
              {trend.sentiment}
            </span>
          </div>
        </div>

        {/* Related Topics Section */}
        {trend.relatedTopics && trend.relatedTopics.length > 0 && (
          <div className='p-6 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-100 dark:border-indigo-800/30 backdrop-blur-sm'>
            <p className='text-sm text-gray-600 dark:text-slate-400 mb-4 font-medium'>
              Related Topics
            </p>
            <div className='flex flex-wrap gap-2'>
              {trend.relatedTopics.map((topic, index) => (
                <span
                  key={index}
                  className='px-4 py-2 bg-indigo-100 dark:bg-indigo-800/50 text-indigo-800 dark:text-indigo-200 text-sm rounded-full font-medium hover:bg-indigo-200 dark:hover:bg-indigo-700/60 transition-colors backdrop-blur-sm'
                >
                  {topic}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className='flex space-x-4 pt-4 border-t border-gray-200 dark:border-slate-700/60'>
          <Button
            variant='outline'
            onClick={handleGetPrediction}
            className='flex-1 h-12 bg-gradient-to-r text-indigo-600 dark:text-indigo-400 from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-800/30 hover:from-blue-100 hover:to-indigo-100 dark:hover:from-blue-800/30 dark:hover:to-indigo-800/30 font-semibold transition-all duration-200 backdrop-blur-sm'
          >
            <Target className='w-5 h-5 mr-2' />
            Get Prediction
          </Button>
          <Button
            variant='outline'
            onClick={handleFindRelated}
            className='flex-1 h-12 bg-gradient-to-r text-purple-600 dark:text-purple-400 from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-purple-200 dark:border-purple-800/30 hover:from-purple-100 hover:to-pink-100 dark:hover:from-purple-800/30 dark:hover:to-pink-800/30 font-semibold transition-all duration-200 backdrop-blur-sm'
          >
            <Hash className='w-5 h-5 mr-2' />
            Find Related
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default TrendDetailModal;
