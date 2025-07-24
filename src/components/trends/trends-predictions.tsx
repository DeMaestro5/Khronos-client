'use client';

import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/src/components/ui/card';
import { TrendPrediction } from '@/src/types/trends';
import { Target, Sparkles } from 'lucide-react';

interface TrendsPredictionsProps {
  predictions: TrendPrediction[];
}

const TrendsPredictions: React.FC<TrendsPredictionsProps> = ({
  predictions,
}) => {
  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  if (predictions.length === 0) return null;

  return (
    <div className='mb-8'>
      <h2 className='text-2xl font-bold text-theme-primary mb-6'>
        AI Predictions
      </h2>
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        {predictions.map((prediction, index) => (
          <Card
            key={index}
            className='bg-gradient-to-br from-indigo-50 to-purple-50 border border-theme-tertiary shadow-lg'
          >
            <CardHeader>
              <CardTitle className='flex items-center space-x-2'>
                <div className='p-2 bg-indigo-100 rounded-xl'>
                  <Target className='w-5 h-5 text-indigo-600' />
                </div>
                <span className='text-theme-primary'>
                  Prediction for &quot;{prediction.keyword}&quot;
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='space-y-6'>
                <div className='grid grid-cols-2 gap-4'>
                  <div className='p-4 bg-white rounded-xl shadow-sm'>
                    <p className='text-sm text-gray-600 mb-1'>
                      Predicted Volume
                    </p>
                    <p className='text-lg font-bold text-indigo-600'>
                      {formatNumber(prediction.predictedVolume)}
                    </p>
                  </div>
                  <div className='p-4 bg-white rounded-xl shadow-sm'>
                    <p className='text-sm text-gray-600 mb-1'>Confidence</p>
                    <p className='text-lg font-bold'>
                      {Math.round(prediction.confidence * 100)}%
                    </p>
                  </div>
                </div>

                <div className='p-4 bg-white rounded-xl shadow-sm'>
                  <p className='text-sm text-gray-600 mb-2'>Confidence Level</p>
                  <div className='flex items-center space-x-3'>
                    <div className='flex-1 bg-gray-200 rounded-full h-3'>
                      <div
                        className='bg-gradient-to-r from-indigo-500 to-purple-500 h-3 rounded-full transition-all duration-500'
                        style={{
                          width: `${prediction.confidence * 100}%`,
                        }}
                      ></div>
                    </div>
                    <span className='text-sm font-bold text-gray-900'>
                      {Math.round(prediction.confidence * 100)}%
                    </span>
                  </div>
                </div>

                {prediction.recommendations &&
                  prediction.recommendations.length > 0 && (
                    <div>
                      <p className='text-sm text-gray-600 mb-3 font-medium'>
                        Recommendations
                      </p>
                      <div className='space-y-2'>
                        {prediction.recommendations.map((rec, idx) => (
                          <div
                            key={idx}
                            className='flex items-start space-x-2 p-3 bg-white rounded-lg'
                          >
                            <Sparkles className='w-4 h-4 text-indigo-500 mt-0.5 flex-shrink-0' />
                            <p className='text-sm text-gray-700'>{rec}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TrendsPredictions;
