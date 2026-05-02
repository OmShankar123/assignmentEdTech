import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useMMKVString } from 'react-native-mmkv';
import type { TOptions } from 'i18next';
import i18n from 'i18next';

import { storage } from '../storage';
import type { Language, resources } from './resources';
import type { RecursiveKeyOf } from './types';

type DefaultLocale = typeof resources.en.translation;
export type TxKeyPath = RecursiveKeyOf<DefaultLocale>;

export const LOCAL = 'local';

// storage may not be initialized yet when i18n.ts runs at module load time.
// Return null if called before initStorage() completes — i18n falls back to device locale.
export const getLanguage = (): string | null => storage?.getString(LOCAL) ?? null;

/**
 * Translates text (non-reactive, use for static content).
 * For components that need to react to language changes, use useTranslate() hook.
 */
export function translate(key: TxKeyPath, options?: TOptions): string {
  if (i18n.isInitialized) {
    return i18n.t(key, options);
  }
  return key;
}

/**
 * A hook that returns a translate function that reacts to language changes.
 * Use this in components for UI that should update when language changes.
 */
export const useTranslate = () => {
  const { t } = useTranslation();
  return useCallback((key: TxKeyPath, options?: TOptions): string => t(key, options), [t]);
};

export const changeLanguage = (lang: Language) => {
  i18n.changeLanguage(lang);
};

export const useSelectedLanguage = () => {
  const [language, setLang] = useMMKVString(LOCAL, storage);

  const setLanguage = useCallback(
    (lang: Language) => {
      setLang(lang);
      if (lang !== undefined) changeLanguage(lang as Language);
    },
    [setLang],
  );

  return { language: language as Language, setLanguage };
};
