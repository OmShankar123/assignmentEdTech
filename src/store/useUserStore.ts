import type { User } from '@/api/auth/types';
import { storage } from '@/storage';
import { clearTokens } from '@/storage/token';

import { createPersistedStore } from './storage';

interface UserState {
  isLoggedIn: boolean;
  user: User | null;
  enrolledCourses: string[];
  login: (user: User) => void;
  logout: () => Promise<void>;
  updateAvatar: (avatar: { url: string; localPath: string }) => void;
  enrollCourse: (courseId: string) => void;
}

export const useUserStore = createPersistedStore<UserState>('user-storage', (set) => ({
  isLoggedIn: false,
  user: null,
  enrolledCourses: [],

  login: (user: User) => {
    set({ isLoggedIn: true, user });
  },

  enrollCourse: (courseId: string) => {
    set((state) => ({
      enrolledCourses: state.enrolledCourses.includes(courseId)
        ? state.enrolledCourses
        : [...state.enrolledCourses, courseId],
    }));
  },

  updateAvatar: (avatar: { url: string; localPath: string }) => {
    set((state) => ({
      user: state.user ? { ...state.user, avatar } : null,
    }));
  },

  logout: async () => {
    // Clear sensitive token from SecureStore
    await clearTokens();
    // Clear non-sensitive data from MMKV
    storage.clearAll();
    set({ isLoggedIn: false, user: null });
  },
}));
