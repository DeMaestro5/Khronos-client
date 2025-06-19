'use client';

import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/src/components/ui/input';
import { Button } from '@/src/components/ui/button';

interface TrendsSearchProps {
  searchKeyword: string;
  onSearchChange: (value: string) => void;
  onSearch: () => void;
  isRefreshing: boolean;
}

const TrendsSearch: React.FC<TrendsSearchProps> = ({
  searchKeyword,
  onSearchChange,
  onSearch,
  isRefreshing,
}) => {
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSearch();
    }
  };

  return (
    <div className='mb-8'>
      <div className='relative max-w-3xl mx-auto'>
        <div className='absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none z-10'>
          <Search className='h-6 w-6 text-gray-400' />
        </div>
        <Input
          placeholder='Search for trends, keywords, or topics...'
          value={searchKeyword}
          onChange={(e) => onSearchChange(e.target.value)}
          onKeyPress={handleKeyPress}
          className='pl-16 pr-32 py-5 text-lg text-gray-900 bg-gray-100 border-2 border-gray-200 focus:bg-white focus:ring-4 focus:ring-blue-100 focus:border-blue-500 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 placeholder:text-gray-500'
        />
        <Button
          onClick={onSearch}
          disabled={isRefreshing}
          className='absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 font-semibold'
        >
          <Search
            className={`w-5 h-5 mr-2 ${isRefreshing ? 'animate-spin' : ''}`}
          />
          {isRefreshing ? 'Searching...' : 'Search'}
        </Button>
      </div>
      <div className='mt-4 text-center'>
        <p className='text-sm text-gray-600'>
          Try searching for topics like &quot;AI&quot;, &quot;crypto&quot;, or
          &quot;sports&quot;
        </p>
      </div>
    </div>
  );
};

export default TrendsSearch;
