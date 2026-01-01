
export type LanguageCode = 'en' | 'es' | 'fr' | 'de' | 'ja' | 'zh' | 'ko' | 'it' | 'pt' | 'ru';

export interface Language {
  code: LanguageCode;
  label: string;
  flag: string;
  native: string;
}

export interface VocabularyItem {
  word: string;
  reading?: string; // Mainly for Japanese (furigana/romaji), Chinese (pinyin), or Korean (romanization)
  translation: string; // Translation in the target context (usually user's primary lang)
  englishTranslation: string; // Explicit English translation as requested
  example: string;
}

export interface SavedVocabulary extends VocabularyItem {
  id: string;
  languageCode: LanguageCode;
  savedAt: number;
}

export interface Phrase {
  original: string;
  reading?: string;
  translation: string;
  context: string;
}

export interface GrammarTip {
  title: string;
  explanation: string;
  example: string;
  highlight: string; // The specific part of the example to emphasize
}

export interface LessonContent {
  title: string;
  theme: string;
  vocabulary: VocabularyItem[];
  phrases: Phrase[];
  grammar: GrammarTip[];
}

export enum AppMode {
  BROWSE = 'browse',
  CHAT = 'chat'
}
