import { useBookmarkStore } from './useBookmarkStore';
import { useUserStore } from './useUserStore';

export { useBookmarkStore } from './useBookmarkStore';
export { useUserStore } from './useUserStore';
export type { User } from '@/api/auth/types';

/**
 * Rehydrates all persisted Zustand stores from MMKV.
 *
 * Call this once in App.tsx after initStorage() resolves.
 * Stores use skipHydration:true so they hold initial state until this runs,
 * preventing access to the MMKV instance before it is initialized.
 */
export async function rehydrateStores(): Promise<void> {
  await Promise.all([useUserStore.persist.rehydrate(), useBookmarkStore.persist.rehydrate()]);
}
