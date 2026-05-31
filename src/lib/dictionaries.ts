import id from '@/dictionaries/id.json';
import en from '@/dictionaries/en.json';

const dictionaries = {
  id,
  en,
};

export type Locale = keyof typeof dictionaries;

export const getDictionary = (locale: string) => {
  if (locale === 'en') return dictionaries.en;
  return dictionaries.id; // default to Indonesian
};
