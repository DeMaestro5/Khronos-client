'use client';

import React from 'react';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { Search } from 'lucide-react';

interface TrendsSearchBarProps {
  searchKeyword: string;
  setSearchKeyword: (keyword: string) => void;
  onSearch: (keyword: string) => void;
  isRefreshing: boolean;
}

const TrendsSearchBar: React.FC<TrendsSearchBarProps> = ({
  searchKeyword,
  setSearchKeyword,
  onSearch,
  isRefreshing,
}) => {
  const handleSearch = () => {
    onSearch(searchKeyword);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className='mb-8'>
      <div className='relative max-w-3xl mx-auto'>
        <div className='absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none z-10'>
          <Search className='h-6 w-6 text-theme-muted' />
        </div>
        <Input
          placeholder='Search for trends, keywords, or topics...'
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          onKeyPress={handleKeyPress}
          className='pl-16 pr-32 py-5 text-lg text-theme-primary bg-theme-secondary border-2 border-theme-primary focus:bg-theme-card focus:ring-4 focus:ring-accent-primary/20 focus:border-accent-primary rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 placeholder:text-theme-muted'
        />
        <Button
          onClick={handleSearch}
          disabled={isRefreshing}
          className='absolute right-2 top-1/2 transform -translate-y-1/2 bg-accent-primary hover:bg-accent-secondary text-white px-6 py-3 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 font-semibold'
        >
          <Search
            className={`w-5 h-5 mr-2 ${isRefreshing ? 'animate-spin' : ''}`}
          />
          {isRefreshing ? 'Searching...' : 'Search'}
        </Button>
      </div>
      <div className='mt-4 text-center'>
        <p className='text-sm text-theme-secondary'>
          Try searching for topics like &quot;AI&quot;, &quot;crypto&quot;, or
          &quot;sports&quot;
        </p>
      </div>
    </div>
  );
};

export default TrendsSearchBar;
