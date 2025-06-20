'use client';

import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/src/components/ui/card';
import Label from '@/src/components/ui/label';
import { Filter as FilterIcon } from 'lucide-react';
import {
  TrendsFilters as FiltersType,
  Platform,
  Category,
} from '@/src/types/trends';

interface TrendsFiltersProps {
  showFilters: boolean;
  filters: FiltersType;
  setFilters: React.Dispatch<React.SetStateAction<FiltersType>>;
  platforms: Platform[];
  categories: Category[];
}

const TrendsFilters: React.FC<TrendsFiltersProps> = ({
  showFilters,
  filters,
  setFilters,
  platforms,
  categories,
}) => {
  if (!showFilters) return null;

  return (
    <Card className='mb-8 bg-white/90 backdrop-blur-sm border border-gray-200 shadow-lg'>
      <CardHeader className='pb-4'>
        <CardTitle className='flex items-center space-x-2 text-gray-900'>
          <FilterIcon className='w-5 h-5 text-blue-600' />
          <span>Advanced Filters</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
          <div>
            <Label htmlFor='platform' className='text-gray-700 font-medium'>
              Platform
            </Label>
            <select
              id='platform'
              value={filters.platform}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  platform: e.target.value,
                }))
              }
              className='w-full mt-2 p-3 border border-gray-200 rounded-lg bg-white/80 backdrop-blur-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm'
            >
              {platforms.map((platform) => (
                <option key={platform.value} value={platform.value}>
                  {platform.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <Label htmlFor='category' className='text-gray-700 font-medium'>
              Category
            </Label>
            <select
              id='category'
              value={filters.category}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  category: e.target.value,
                }))
              }
              className='w-full mt-2 p-3 border border-gray-200 rounded-lg bg-white/80 backdrop-blur-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm'
            >
              {categories.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <Label htmlFor='timeRange' className='text-gray-700 font-medium'>
              Time Range
            </Label>
            <select
              id='timeRange'
              value={filters.timeRange}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  timeRange: e.target.value as
                    | 'today'
                    | 'week'
                    | 'month'
                    | 'quarter'
                    | 'year',
                }))
              }
              className='w-full mt-2 p-3 border border-gray-200 rounded-lg bg-white/80 backdrop-blur-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm'
            >
              <option value='today'>Today</option>
              <option value='week'>This Week</option>
              <option value='month'>This Month</option>
              <option value='quarter'>This Quarter</option>
              <option value='year'>This Year</option>
            </select>
          </div>
          <div>
            <Label htmlFor='sentiment' className='text-gray-700 font-medium'>
              Sentiment
            </Label>
            <select
              id='sentiment'
              value={filters.sentiment}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  sentiment: e.target.value as
                    | 'positive'
                    | 'negative'
                    | 'neutral',
                }))
              }
              className='w-full mt-2 p-3 border border-gray-200 rounded-lg bg-white/80 backdrop-blur-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm'
            >
              <option value='all'>All Sentiments</option>
              <option value='positive'>Positive</option>
              <option value='neutral'>Neutral</option>
              <option value='negative'>Negative</option>
            </select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TrendsFilters;
