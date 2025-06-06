'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { Platform } from '@/src/types/modal';
import { contentAPI } from '@/src/lib/api';

export interface ScheduledContentItem {
  id: string;
  title: string;
  platform: Platform['id'];
  time: string;
  type: string;
  status: 'draft' | 'scheduled' | 'published';
  description?: string;
}

export type ScheduledContent = {
  [key: string]: ScheduledContentItem[];
};

interface CalendarContextType {
  scheduledContent: ScheduledContent;
  addScheduledContent: (content: ScheduledContentItem, date: string) => void;
  updateScheduledContent: (
    id: string,
    date: string,
    updates: Partial<ScheduledContentItem>
  ) => void;
  deleteScheduledContent: (id: string, date: string) => void;
  loadScheduledContent: () => Promise<void>;
  clearAllData: () => void;
  isLoading: boolean;
}

const CalendarContext = createContext<CalendarContextType | undefined>(
  undefined
);

interface CalendarProviderProps {
  children: ReactNode;
}

export const CalendarProvider = ({ children }: CalendarProviderProps) => {
  const [scheduledContent, setScheduledContent] = useState<ScheduledContent>(
    {}
  );
  const [isLoading, setIsLoading] = useState(false);

  // Convert API content to calendar format
  const convertAPIContentToCalendar = (
    apiContent: unknown[]
  ): ScheduledContent => {
    const calendarData: ScheduledContent = {};

    console.log('🔍 Converting API content to calendar format:', apiContent);
    console.log('📊 Total content items:', apiContent.length);

    apiContent.forEach((contentItem, index) => {
      const content = contentItem as {
        _id: string; // MongoDB ObjectID
        title: string;
        status: string;
        scheduledDate?: string;
        platform?: string[];
        platforms?: { id: string }[];
        type?: string;
        description?: string;
        excerpt?: string;
        userId?: string;
        author?: { id: string };
        scheduling?: {
          scheduledDate?: string;
          startDate?: string;
        };
        metadata?: {
          scheduledDate?: string;
        };
        createdAt?: string;
        updatedAt?: string;
      };

      // Try to find scheduled date in multiple possible locations
      const possibleScheduledDate =
        content.scheduledDate ||
        content.scheduling?.scheduledDate ||
        content.scheduling?.startDate ||
        content.metadata?.scheduledDate;

      console.log(
        `📝 Processing content item ${index + 1}:`,
        JSON.stringify(
          {
            _id: content._id,
            title: content.title,
            status: content.status,
            scheduledDate: content.scheduledDate,
            possibleScheduledDate: possibleScheduledDate,
            scheduling: content.scheduling,
            metadata: content.metadata,
            platform: content.platform,
            platforms: content.platforms,
            userId: content.userId,
            authorId: content.author?.id,
          },
          null,
          2
        )
      );

      // Check if content has a scheduled date and belongs to current user
      if (
        content.status === 'scheduled' &&
        possibleScheduledDate &&
        content._id
      ) {
        // Extract date from ISO string (e.g., "2024-01-24T11:15:00.000Z" -> "2024-01-24")
        const dateKey = possibleScheduledDate.split('T')[0];

        // Extract time from ISO string (e.g., "2024-01-24T11:15:00.000Z" -> "11:15")
        const timeMatch = possibleScheduledDate.match(/T(\d{2}:\d{2})/);
        const time = timeMatch ? timeMatch[1] : '09:00';

        console.log(
          '📅 Adding to calendar:',
          JSON.stringify(
            {
              _id: content._id,
              dateKey,
              time,
              title: content.title,
              platform:
                content.platform?.[0] ||
                content.platforms?.[0]?.id ||
                'linkedin',
              status: content.status,
            },
            null,
            2
          )
        );

        const calendarItem: ScheduledContentItem = {
          id: content._id, // Use the actual MongoDB ObjectID
          title: content.title,
          platform: (content.platform?.[0] ||
            content.platforms?.[0]?.id ||
            'linkedin') as Platform['id'],
          time: time,
          type: content.type || 'post',
          status: content.status as 'draft' | 'scheduled' | 'published',
          description: content.description || content.excerpt,
        };

        if (!calendarData[dateKey]) {
          calendarData[dateKey] = [];
        }
        calendarData[dateKey].push(calendarItem);
      } else {
        console.log(
          `⚠️ Skipping item ${index + 1}: status='${
            content.status
          }', scheduledDate='${
            content.scheduledDate
          }', possibleScheduledDate='${possibleScheduledDate}', _id='${
            content._id
          }'`
        );
      }
    });

    console.log(
      '✅ Final calendar data:',
      JSON.stringify(calendarData, null, 2)
    );
    console.log('📊 Calendar dates with content:', Object.keys(calendarData));
    return calendarData;
  };

  // Load scheduled content from both API and localStorage
  const loadScheduledContent = async () => {
    setIsLoading(true);
    console.log('🚀 Loading scheduled content...');

    try {
      // First, load from localStorage (manually created calendar items)
      const storedContent = localStorage.getItem('khronos-scheduled-content');
      let localCalendarData: ScheduledContent = {};
      if (storedContent) {
        localCalendarData = JSON.parse(storedContent);
        console.log('💾 Loaded from localStorage:', localCalendarData);
      }

      // Then, fetch from API (actual scheduled content)
      try {
        console.log('🌐 Fetching content from API...');
        const response = await contentAPI.getUserContent();
        console.log('📡 API Response statusCode:', response.data?.statusCode);
        console.log('📡 API Response message:', response.data?.message);
        console.log(
          '📡 API Response data length:',
          response.data?.data?.length
        );
        console.log(
          '📡 Full API Response:',
          JSON.stringify(response.data, null, 2)
        );

        if (response.data?.statusCode === '10000' && response.data?.data) {
          console.log('✅ API call successful, processing content...');
          const apiCalendarData = convertAPIContentToCalendar(
            response.data.data
          );

          // Merge API data with local data (local data takes precedence for same dates)
          const mergedData = { ...apiCalendarData };

          // Add local data, avoiding duplicates
          Object.keys(localCalendarData).forEach((dateKey) => {
            if (mergedData[dateKey]) {
              // Merge arrays and remove duplicates based on title
              const existingTitles = new Set(
                mergedData[dateKey].map((item) => item.title)
              );
              const uniqueLocalItems = localCalendarData[dateKey].filter(
                (item) => !existingTitles.has(item.title)
              );
              mergedData[dateKey] = [
                ...mergedData[dateKey],
                ...uniqueLocalItems,
              ];
            } else {
              mergedData[dateKey] = localCalendarData[dateKey];
            }
          });

          console.log('🎯 Final merged calendar data:', mergedData);
          setScheduledContent(mergedData);
        } else {
          console.warn('⚠️ API response not successful:', response.data);
          // If API fails, fall back to localStorage only
          setScheduledContent(localCalendarData);
        }
      } catch (apiError) {
        console.error('❌ Failed to load content from API:', apiError);
        setScheduledContent(localCalendarData);
      }
    } catch (error) {
      console.error('💥 Error loading scheduled content:', error);
      setScheduledContent({});
    } finally {
      setIsLoading(false);
      console.log('🏁 Loading complete');
    }
  };

  // Add new scheduled content
  const addScheduledContent = (content: ScheduledContentItem, date: string) => {
    setScheduledContent((prev) => {
      const updated = {
        ...prev,
        [date]: prev[date] ? [...prev[date], content] : [content],
      };

      // Persist to localStorage for now
      localStorage.setItem(
        'khronos-scheduled-content',
        JSON.stringify(updated)
      );
      return updated;
    });
  };

  // Update existing scheduled content
  const updateScheduledContent = (
    id: string,
    date: string,
    updates: Partial<ScheduledContentItem>
  ) => {
    setScheduledContent((prev) => {
      const dateContent = prev[date] || [];
      const updatedDateContent = dateContent.map((item) =>
        item.id === id ? { ...item, ...updates } : item
      );

      const updated = {
        ...prev,
        [date]: updatedDateContent,
      };

      localStorage.setItem(
        'khronos-scheduled-content',
        JSON.stringify(updated)
      );
      return updated;
    });
  };

  // Delete scheduled content
  const deleteScheduledContent = (id: string, date: string) => {
    setScheduledContent((prev) => {
      const dateContent = prev[date] || [];
      const filteredContent = dateContent.filter((item) => item.id !== id);

      // Remove the date key if no content remains
      if (filteredContent.length === 0) {
        const rest = { ...prev };
        delete rest[date];
        localStorage.setItem('khronos-scheduled-content', JSON.stringify(rest));
        return rest;
      }

      const updated = {
        ...prev,
        [date]: filteredContent,
      };

      localStorage.setItem(
        'khronos-scheduled-content',
        JSON.stringify(updated)
      );
      return updated;
    });
  };

  // Add sample data for demonstration

  // Clear all data
  const clearAllData = () => {
    setScheduledContent({});
    localStorage.removeItem('khronos-scheduled-content');
  };

  // Load content on mount
  useEffect(() => {
    loadScheduledContent();
  }, []);

  const value: CalendarContextType = {
    scheduledContent,
    addScheduledContent,
    updateScheduledContent,
    deleteScheduledContent,
    loadScheduledContent,
    clearAllData,
    isLoading,
  };

  return (
    <CalendarContext.Provider value={value}>
      {children}
    </CalendarContext.Provider>
  );
};

export const useCalendar = () => {
  const context = useContext(CalendarContext);
  if (context === undefined) {
    throw new Error('useCalendar must be used within a CalendarProvider');
  }
  return context;
};
