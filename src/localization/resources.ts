import en from '@/localization/translations/en.json';
import hi from '@/localization/translations/hi.json';

export const resources = {
  en: {
    translation: en,
  },
  hi: {
    translation: hi,
  },
};

export type Language = keyof typeof resources;
