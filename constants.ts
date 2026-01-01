
import { Language } from './types.ts';

export const LANGUAGES: Language[] = [
  { code: 'en', label: 'English', flag: '🇬🇧', native: 'English' },
  { code: 'es', label: 'Spanish', flag: '🇪🇸', native: 'Español' },
  { code: 'fr', label: 'French', flag: '🇫🇷', native: 'Français' },
  { code: 'de', label: 'German', flag: '🇩🇪', native: 'Deutsch' },
  { code: 'ja', label: 'Japanese', flag: '🇯🇵', native: '日本語' },
  { code: 'zh', label: 'Chinese', flag: '🇨🇳', native: '中文' },
  { code: 'ko', label: 'Korean', flag: '🇰🇷', native: '한국어' },
  { code: 'it', label: 'Italian', flag: '🇮🇹', native: 'Italiano' },
  { code: 'pt', label: 'Portuguese', flag: '🇧🇷', native: 'Português' },
  { code: 'ru', label: 'Russian', flag: '🇷🇺', native: 'Русский' }
];

export const THEMES = [
  { id: 'daily-life', title: 'Daily Life', icon: '🏠', color: 'bg-slate-50 text-slate-600', description: 'Greetings and everyday talk.' },
  { id: 'food-dining', title: 'Food & Dining', icon: '🍲', color: 'bg-slate-50 text-slate-600', description: 'Ordering and restaurant basics.' },
  { id: 'travel', title: 'Travel', icon: '✈️', color: 'bg-slate-50 text-slate-600', description: 'Airport and directions.' },
  { id: 'healthcare', title: 'Healthcare', icon: '🏥', color: 'bg-slate-50 text-slate-600', description: 'Doctor and pharmacy.' }
];
