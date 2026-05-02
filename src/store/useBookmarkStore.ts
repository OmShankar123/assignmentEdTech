import { createPersistedStore } from './storage';

interface BookmarkState {
  bookmarkedIds: string[];
  lastNotifiedCount: number;
  addBookmark: (id: string) => void;
  removeBookmark: (id: string) => void;
  toggleBookmark: (id: string) => void;
  isBookmarked: (id: string) => boolean;
  setLastNotifiedCount: (count: number) => void;
}

export const useBookmarkStore = createPersistedStore<BookmarkState>(
  'bookmark-storage',
  (set, get) => ({
    bookmarkedIds: [],
    lastNotifiedCount: 0,

    addBookmark: (id: string) => {
      set((state) => ({
        bookmarkedIds: state.bookmarkedIds.includes(id)
          ? state.bookmarkedIds
          : [...state.bookmarkedIds, id],
      }));
    },

    removeBookmark: (id: string) => {
      const newIds = get().bookmarkedIds.filter((bid) => bid !== id);
      set({ bookmarkedIds: newIds });
      // If they go below 5, we reset the notified count so they can hit the milestone again
      if (newIds.length < 5) {
        set({ lastNotifiedCount: 0 });
      }
    },

    toggleBookmark: (id: string) => {
      const { bookmarkedIds } = get();
      if (bookmarkedIds.includes(id)) {
        get().removeBookmark(id);
      } else {
        get().addBookmark(id);
      }
    },

    isBookmarked: (id: string) => {
      return get().bookmarkedIds.includes(id);
    },

    setLastNotifiedCount: (count: number) => {
      set({ lastNotifiedCount: count });
    },
  }),
);
