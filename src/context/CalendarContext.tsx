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
  _id: string; // Use _id to match API response
  id: string; // Keep for backward compatibility
  title: string;
  platform: Platform['id'];
  platforms?: string[]; // Array of platforms
  time: string;
  type: string;
  status: 'draft' | 'scheduled' | 'published';
  description?: string;
  scheduledDate?: string;
  createdAt?: string;
  updatedAt?: string;
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

  // Convert API content to calendar format with proper error handling
  const convertAPIContentToCalendar = (apiData: unknown): ScheduledContent => {
    const calendarData: ScheduledContent = {};

    try {
      // Handle the API response structure: { contents: [...], totalContents: number }
      let contentArray: unknown[] = [];

      if (Array.isArray(apiData)) {
        contentArray = apiData;
      } else if (apiData && typeof apiData === 'object') {
        const dataObj = apiData as {
          contents?: unknown[];
          content?: unknown[];
          items?: unknown[];
        };
        if (Array.isArray(dataObj.contents)) {
          contentArray = dataObj.contents;
        } else if (Array.isArray(dataObj.content)) {
          contentArray = dataObj.content;
        } else if (Array.isArray(dataObj.items)) {
          contentArray = dataObj.items;
        }
      }

      contentArray.forEach((contentItem) => {
        try {
          const content = contentItem as {
            _id: string;
            title: string;
            status: string;
            scheduledDate?: string;
            platform?: string[];
            platforms?: { id: string }[] | string[];
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
              status?: string;
              title?: string;
              description?: string;
              platform?: string[];
              type?: string;
            };
            createdAt?: string;
            updatedAt?: string;
          };

          // Safely extract properties with fallbacks to metadata
          const title = content.title || content.metadata?.title || 'Untitled';
          const status = content.status || content.metadata?.status || 'draft';
          const description =
            content.description ||
            content.metadata?.description ||
            content.excerpt ||
            '';
          const type = content.type || content.metadata?.type || 'social';

          // Extract platform information
          let platformArray: string[] = [];
          if (content.platform && Array.isArray(content.platform)) {
            platformArray = content.platform;
          } else if (
            content.metadata?.platform &&
            Array.isArray(content.metadata.platform)
          ) {
            platformArray = content.metadata.platform;
          } else if (content.platforms) {
            if (Array.isArray(content.platforms)) {
              platformArray = content.platforms.map((p) =>
                typeof p === 'string' ? p : (p as { id: string }).id
              );
            }
          }

          const primaryPlatform = (platformArray[0] ||
            'instagram') as Platform['id'];

          // Try to find scheduled date in multiple possible locations
          const possibleScheduledDate =
            content.scheduledDate ||
            content.scheduling?.scheduledDate ||
            content.scheduling?.startDate ||
            content.metadata?.scheduledDate;

          // Only process items that have a scheduled date or are scheduled status
          const hasScheduledDate =
            possibleScheduledDate && possibleScheduledDate.trim() !== '';
          const isScheduledStatus = status === 'scheduled';

          if ((hasScheduledDate || isScheduledStatus) && content._id) {
            let dateToUse = possibleScheduledDate;

            // If no specific scheduled date but status is scheduled, use creation date
            if (!hasScheduledDate && isScheduledStatus && content.createdAt) {
              dateToUse = content.createdAt;
            }

            if (dateToUse) {
              try {
                // Parse the date and extract components
                const scheduledDate = new Date(dateToUse);

                if (!isNaN(scheduledDate.getTime())) {
                  // Extract date key (YYYY-MM-DD format)
                  const dateKey = `${scheduledDate.getFullYear()}-${String(
                    scheduledDate.getMonth() + 1
                  ).padStart(2, '0')}-${String(
                    scheduledDate.getDate()
                  ).padStart(2, '0')}`;

                  // Extract time (HH:MM format)
                  const time = `${String(scheduledDate.getHours()).padStart(
                    2,
                    '0'
                  )}:${String(scheduledDate.getMinutes()).padStart(2, '0')}`;

                  const calendarItem: ScheduledContentItem = {
                    _id: content._id,
                    id: content._id, // Keep for backward compatibility
                    title: title,
                    platform: primaryPlatform,
                    platforms: platformArray,
                    time: time,
                    type: type,
                    status: status as 'draft' | 'scheduled' | 'published',
                    description: description,
                    scheduledDate: dateToUse,
                    createdAt: content.createdAt,
                    updatedAt: content.updatedAt,
                  };

                  if (!calendarData[dateKey]) {
                    calendarData[dateKey] = [];
                  }
                  calendarData[dateKey].push(calendarItem);
                } else {
                  console.warn('📅 Invalid date format:', dateToUse);
                }
              } catch (dateError) {
                console.warn('📅 Error parsing date:', dateToUse, dateError);
              }
            }
          }
        } catch (itemError) {
          console.error('📅 Error processing content item:', itemError);
        }
      });
    } catch (error) {
      console.error('📅 Error in convertAPIContentToCalendar:', error);
    }

    return calendarData;
  };

  // Load scheduled content from API
  const loadScheduledContent = async () => {
    setIsLoading(true);

    try {
      const response = await contentAPI.getUserContent();

      if (
        response.data?.statusCode === '10000' &&
        response.data?.data !== undefined
      ) {
        const apiCalendarData = convertAPIContentToCalendar(response.data.data);

        setScheduledContent(apiCalendarData);

        // Optional: Save to localStorage for caching (but API is the source of truth)
        try {
          localStorage.setItem(
            'khronos-scheduled-content-cache',
            JSON.stringify({
              data: apiCalendarData,
              timestamp: Date.now(),
              version: '2.0', // Version to handle future changes
            })
          );
        } catch (storageError) {
          console.warn('📅 Could not save to localStorage:', storageError);
        }
      } else {
        console.warn('📅 CalendarContext: Invalid API response structure');
        setScheduledContent({});
      }
    } catch (error) {
      console.error(
        '📅 CalendarContext: Failed to load scheduled content:',
        error
      );

      // Try to load from cache as fallback
      try {
        const cachedData = localStorage.getItem(
          'khronos-scheduled-content-cache'
        );
        if (cachedData) {
          const parsed = JSON.parse(cachedData);
          if (parsed.data && parsed.version === '2.0') {
            setScheduledContent(parsed.data);
          } else {
            setScheduledContent({});
          }
        } else {
          setScheduledContent({});
        }
      } catch (cacheError) {
        console.error('📅 CalendarContext: Cache fallback failed:', cacheError);
        setScheduledContent({});
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Force refresh calendar by clearing cache and reloading
  const forceRefreshCalendar = async () => {
    localStorage.removeItem('khronos-scheduled-content-cache');
    localStorage.removeItem('khronos-scheduled-content'); // Remove old cache
    await loadScheduledContent();
  };

  // Add new scheduled content (for manual additions)
  const addScheduledContent = (content: ScheduledContentItem, date: string) => {
    setScheduledContent((prev) => {
      const updated = {
        ...prev,
        [date]: prev[date] ? [...prev[date], content] : [content],
      };

      // Update cache
      try {
        localStorage.setItem(
          'khronos-scheduled-content-cache',
          JSON.stringify({
            data: updated,
            timestamp: Date.now(),
            version: '2.0',
          })
        );
      } catch (storageError) {
        console.warn('📅 Could not update cache:', storageError);
      }

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
        item.id === id || item._id === id ? { ...item, ...updates } : item
      );

      const updated = {
        ...prev,
        [date]: updatedDateContent,
      };

      // Update cache
      try {
        localStorage.setItem(
          'khronos-scheduled-content-cache',
          JSON.stringify({
            data: updated,
            timestamp: Date.now(),
            version: '2.0',
          })
        );
      } catch (storageError) {
        console.warn('📅 Could not update cache:', storageError);
      }

      return updated;
    });
  };

  // Delete scheduled content
  const deleteScheduledContent = (id: string, date: string) => {
    setScheduledContent((prev) => {
      const dateContent = prev[date] || [];
      const filteredContent = dateContent.filter(
        (item) => item.id !== id && item._id !== id
      );

      let updated;
      // Remove the date key if no content remains
      if (filteredContent.length === 0) {
        const rest = { ...prev };
        delete rest[date];
        updated = rest;
      } else {
        updated = {
          ...prev,
          [date]: filteredContent,
        };
      }

      // Update cache
      try {
        localStorage.setItem(
          'khronos-scheduled-content-cache',
          JSON.stringify({
            data: updated,
            timestamp: Date.now(),
            version: '2.0',
          })
        );
      } catch (storageError) {
        console.warn('📅 Could not update cache:', storageError);
      }

      return updated;
    });
  };

  // Clear all data
  const clearAllData = () => {
    setScheduledContent({});
    localStorage.removeItem('khronos-scheduled-content-cache');
    localStorage.removeItem('khronos-scheduled-content'); // Remove old cache
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
