import { createPersistedStore } from './storage';

interface BookmarkState {
  bookmarkedIds: string[];
  addBookmark: (id: string) => void;
  removeBookmark: (id: string) => void;
  toggleBookmark: (id: string) => void;
  isBookmarked: (id: string) => boolean;
}

export const useBookmarkStore = createPersistedStore<BookmarkState>(
  'bookmark-storage',
  (set, get) => ({
    bookmarkedIds: [],

    addBookmark: (id: string) => {
      set((state) => ({
        bookmarkedIds: state.bookmarkedIds.includes(id)
          ? state.bookmarkedIds
          : [...state.bookmarkedIds, id],
      }));
    },

    removeBookmark: (id: string) => {
      set((state) => ({
        bookmarkedIds: state.bookmarkedIds.filter((bid) => bid !== id),
      }));
    },

    toggleBookmark: (id: string) => {
      const { bookmarkedIds } = get();
      if (bookmarkedIds.includes(id)) {
        set({ bookmarkedIds: bookmarkedIds.filter((bid) => bid !== id) });
      } else {
        set({ bookmarkedIds: [...bookmarkedIds, id] });
      }
    },

    isBookmarked: (id: string) => {
      return get().bookmarkedIds.includes(id);
    },
  }),
);
