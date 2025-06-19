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
  forceRefreshCalendar: () => Promise<void>;
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

    apiContent.forEach((contentItem) => {
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
      }
    });

    return calendarData;
  };

  // Load scheduled content from both API and localStorage
  const loadScheduledContent = async () => {
    setIsLoading(true);

    try {
      // First, fetch from API (actual scheduled content)
      try {
        const response = await contentAPI.getUserContent();

        if (response.data?.statusCode === '10000' && response.data?.data) {
          const apiCalendarData = convertAPIContentToCalendar(
            response.data.data
          );

          setScheduledContent(apiCalendarData);

          // Clear old localStorage data that might have invalid IDs
          // Only keep localStorage as backup for manual entries in the future
          const storedContent = localStorage.getItem(
            'khronos-scheduled-content'
          );
          if (storedContent) {
            try {
              const localCalendarData = JSON.parse(
                storedContent
              ) as ScheduledContent;
              // Check if any items have invalid IDs (not MongoDB ObjectIDs)
              let hasInvalidIds = false;
              Object.values(localCalendarData).forEach(
                (dateContent: ScheduledContentItem[]) => {
                  dateContent.forEach((item: ScheduledContentItem) => {
                    // MongoDB ObjectIDs are 24 character hex strings
                    if (
                      !item.id ||
                      typeof item.id !== 'string' ||
                      item.id.length !== 24 ||
                      !/^[a-f\d]{24}$/i.test(item.id)
                    ) {
                      hasInvalidIds = true;
                    }
                  });
                }
              );

              if (hasInvalidIds) {
                localStorage.removeItem('khronos-scheduled-content');
              }
            } catch {
              localStorage.removeItem('khronos-scheduled-content');
            }
          }
        } else {
          // If API fails, show empty calendar
          setScheduledContent({});
        }
      } catch {
        setScheduledContent({});
      }
    } catch {
      setScheduledContent({});
    } finally {
      setIsLoading(false);
    }
  };

  // Force refresh calendar by clearing cache and reloading
  const forceRefreshCalendar = async () => {
    localStorage.removeItem('khronos-scheduled-content');
    await loadScheduledContent();
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
    forceRefreshCalendar,
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
