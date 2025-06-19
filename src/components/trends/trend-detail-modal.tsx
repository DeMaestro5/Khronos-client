'use client';

import React from 'react';
import {
  Target,
  Hash,
  CheckCircle,
  XCircle,
  Minus as MinusIcon,
} from 'lucide-react';
import { Button } from '@/src/components/ui/button';
import { Modal } from '@/src/components/modal';
import { Trend } from '@/src/types/trends';

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
  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return <CheckCircle className='w-4 h-4 text-emerald-500' />;
      case 'negative':
        return <XCircle className='w-4 h-4 text-red-500' />;
      default:
        return <MinusIcon className='w-4 h-4 text-gray-500' />;
    }
  };

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

  if (!trend) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Trend Details: #${trend.keyword}`}
    >
      <div className='p-6 space-y-8'>
        {/* Stats Grid */}
        <div className='grid grid-cols-2 gap-6'>
          <div className='p-6 bg-blue-50 rounded-2xl hover:shadow-lg transition-all duration-200'>
            <p className='text-sm font-medium text-gray-600 mb-2'>Volume</p>
            <p className='text-3xl font-bold text-blue-600'>
              {formatNumber(trend.volume)}
            </p>
          </div>
          <div className='p-6 bg-emerald-50 rounded-2xl hover:shadow-lg transition-all duration-200'>
            <p className='text-sm font-medium text-gray-600 mb-2'>Growth</p>
            <p
              className={`text-3xl font-bold ${
                trend.growth > 0
                  ? 'text-emerald-600'
                  : trend.growth < 0
                  ? 'text-red-600'
                  : 'text-gray-600'
              }`}
            >
              {formatPercentage(trend.growth)}
            </p>
          </div>
          <div className='p-6 bg-purple-50 rounded-2xl hover:shadow-lg transition-all duration-200'>
            <p className='text-sm font-medium text-gray-600 mb-2'>Platform</p>
            <p className='text-2xl font-bold text-purple-600 capitalize'>
              {trend.platform}
            </p>
          </div>
          <div className='p-6 bg-orange-50 rounded-2xl hover:shadow-lg transition-all duration-200'>
            <p className='text-sm font-medium text-gray-600 mb-2'>Category</p>
            <p className='text-2xl font-bold text-orange-600 capitalize'>
              {trend.category}
            </p>
          </div>
        </div>

        {/* Sentiment */}
        <div className='p-6 bg-gray-50 rounded-2xl hover:shadow-lg transition-all duration-200'>
          <p className='text-sm font-medium text-gray-600 mb-3'>Sentiment</p>
          <div className='flex items-center space-x-3'>
            {getSentimentIcon(trend.sentiment)}
            <span className='text-xl font-bold text-gray-900 capitalize'>
              {trend.sentiment}
            </span>
          </div>
        </div>

        {/* Related Topics */}
        {trend.relatedTopics && trend.relatedTopics.length > 0 && (
          <div className='p-6 bg-indigo-50 rounded-2xl hover:shadow-lg transition-all duration-200'>
            <p className='text-sm font-medium text-gray-600 mb-4'>
              Related Topics
            </p>
            <div className='flex flex-wrap gap-3'>
              {trend.relatedTopics.map((topic, index) => (
                <span
                  key={index}
                  className='px-4 py-2 bg-indigo-100 text-indigo-800 text-sm font-medium rounded-xl hover:bg-indigo-200 transition-colors duration-200'
                >
                  {topic}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className='flex space-x-4 pt-4'>
          <Button
            variant='outline'
            onClick={() => {
              onClose();
              onGetPrediction(trend.keyword);
            }}
            className='flex-1 h-12 bg-gradient-to-r text-indigo-600 from-blue-50 to-indigo-50 border-blue-200 hover:from-blue-100 hover:to-indigo-100 hover:border-blue-300 hover:shadow-lg transition-all duration-200'
          >
            <Target className='w-5 h-5 mr-2' />
            Get Prediction
          </Button>
          <Button
            variant='outline'
            onClick={() => {
              onClose();
              onFindRelated(trend.keyword);
            }}
            className='flex-1 h-12 bg-gradient-to-r text-purple-600 from-purple-50 to-pink-50 border-purple-200 hover:from-purple-100 hover:to-pink-100 hover:border-purple-300 hover:shadow-lg transition-all duration-200'
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
