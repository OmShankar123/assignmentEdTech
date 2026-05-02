import { Course } from '@/api/courses/types';

import { createPersistedStore } from './storage';

interface BookmarkState {
  bookmarks: Course[];
  lastNotifiedCount: number;
  addBookmark: (course: Course) => void;
  removeBookmark: (id: string) => void;
  toggleBookmark: (course: Course) => void;
  isBookmarked: (id: string) => boolean;
  setLastNotifiedCount: (count: number) => void;
}

export const useBookmarkStore = createPersistedStore<BookmarkState>(
  'bookmark-storage',
  (set, get) => ({
    bookmarks: [],
    lastNotifiedCount: 0,

    addBookmark: (course: Course) => {
      set((state) => ({
        bookmarks: state.bookmarks.some((b) => b._id === course._id)
          ? state.bookmarks
          : [...state.bookmarks, course],
      }));
    },

    removeBookmark: (id: string) => {
      const newBookmarks = get().bookmarks.filter((b) => b._id !== id);
      set({ bookmarks: newBookmarks });
      // If they go below 5, we reset the notified count so they can hit the milestone again
      if (newBookmarks.length < 5) {
        set({ lastNotifiedCount: 0 });
      }
    },

    toggleBookmark: (course: Course) => {
      const isCurrentlyBookmarked = get().isBookmarked(course._id);
      if (isCurrentlyBookmarked) {
        get().removeBookmark(course._id);
      } else {
        get().addBookmark(course);
      }
    },

    isBookmarked: (id: string) => {
      return get().bookmarks.some((b) => b._id === id);
    },

    setLastNotifiedCount: (count: number) => {
      set({ lastNotifiedCount: count });
    },
  }),
);
