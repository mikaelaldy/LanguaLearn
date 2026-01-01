
import React, { useState, useEffect } from 'react';
import { LanguageCode, LessonContent, SavedVocabulary, VocabularyItem } from './types.ts';
import { LANGUAGES, THEMES } from './constants.ts';
import { generateLesson } from './services/geminiService.ts';
import LessonCard from './components/LessonCard.tsx';
import Landing from './components/Landing.tsx';
import TTSButton from './components/TTSButton.tsx';

type AppState = 'landing' | 'setup' | 'content' | 'saved';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(() => {
    const saved = localStorage.getItem('linguaLearn_state');
    return (saved as AppState) || 'landing';
  });
  
  const [selectedLang, setSelectedLang] = useState<LanguageCode>(() => {
    const saved = localStorage.getItem('linguaLearn_lang');
    return (saved as LanguageCode) || 'en';
  });
  
  const [savedWords, setSavedWords] = useState<SavedVocabulary[]>(() => {
    const saved = localStorage.getItem('linguaLearn_saved_words');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [themeInput, setThemeInput] = useState('');
  const [lastRequestedTheme, setLastRequestedTheme] = useState<string>('');
  const [lessonContent, setLessonContent] = useState<LessonContent | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('linguaLearn_lang', selectedLang);
    localStorage.setItem('linguaLearn_state', appState);
    localStorage.setItem('linguaLearn_saved_words', JSON.stringify(savedWords));
  }, [selectedLang, appState, savedWords]);

  const handleStartSetup = () => {
    setAppState('setup');
  };

  const triggerLessonGeneration = async (theme: string) => {
    setLoading(true);
    setError(null);
    setLastRequestedTheme(theme);
    setAppState('content');
    try {
      const content = await generateLesson(selectedLang, theme);
      setLessonContent(content);
    } catch (err) {
      console.error("Failed to generate lesson:", err);
      setError("We encountered a server issue while creating your lesson. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!themeInput.trim()) return;
    triggerLessonGeneration(themeInput);
  };

  const handleSaveWord = (item: VocabularyItem) => {
    const newSaved: SavedVocabulary = {
      ...item,
      id: Math.random().toString(36).substr(2, 9),
      languageCode: selectedLang,
      savedAt: Date.now()
    };
    setSavedWords(prev => [newSaved, ...prev]);
  };

  const handleRemoveWord = (id: string) => {
    setSavedWords(prev => prev.filter(w => w.id !== id));
  };

  const resetToSetup = () => {
    setLessonContent(null);
    setAppState('setup');
    setThemeInput('');
    setError(null);
  };

  const currentLang = LANGUAGES.find(l => l.code === selectedLang)!;

  if (appState === 'landing') {
    return <Landing onStart={handleStartSetup} />;
  }

  const groupedSavedWords = savedWords.reduce((acc, word) => {
    if (!acc[word.languageCode]) acc[word.languageCode] = [];
    acc[word.languageCode].push(word);
    return acc;
  }, {} as Record<string, SavedVocabulary[]>);

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900">
      <header className="glass border-b border-slate-100 sticky top-0 z-30 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div 
            className="flex items-center gap-2 cursor-pointer group" 
            onClick={() => setAppState('landing')}
          >
            <img src="/logo.png" alt="LinguaLearn Logo" className="w-8 h-8 rounded-lg" />
            <h1 className="text-lg font-bold text-slate-900 tracking-tight">LinguaLearn</h1>
          </div>

          <div className="flex items-center gap-6">
            <button 
              onClick={() => setAppState(appState === 'saved' ? 'setup' : 'saved')}
              className={`text-[10px] font-black uppercase tracking-[0.2em] transition-all ${appState === 'saved' ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-900'}`}
            >
              Saved <span className="opacity-40">({savedWords.length})</span>
            </button>
            <div className="h-4 w-px bg-slate-100"></div>
            <div className="flex items-center gap-2">
              <span className="text-base">{currentLang.flag}</span>
              <span className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em]">{currentLang.label}</span>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-3xl mx-auto w-full p-6 sm:p-12">
        {appState === 'saved' ? (
          <div className="space-y-16 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
               <button onClick={() => setAppState('setup')} className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-slate-900 flex items-center gap-2">
                  <i className="fa-solid fa-arrow-left text-[10px]"></i> Back
                </button>
                <h2 className="text-xl font-bold text-slate-900">Vocabulary Bank</h2>
            </div>

            {savedWords.length === 0 ? (
              <div className="py-24 text-center border border-dashed border-slate-100 rounded-xl space-y-4">
                <p className="text-slate-400 text-sm font-medium">Your saved words will appear here.</p>
              </div>
            ) : (
              <div className="space-y-20">
                {(Object.entries(groupedSavedWords) as [string, SavedVocabulary[]][]).map(([langCode, words]) => {
                  const lang = LANGUAGES.find(l => l.code === langCode)!;
                  return (
                    <div key={langCode} className="space-y-8">
                      <div className="flex items-center gap-3 border-b border-slate-50 pb-3">
                        <span className="text-xl">{lang.flag}</span>
                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">{lang.label}</h3>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {words.map((word) => (
                          <div key={word.id} className="p-5 bg-white border border-slate-100 rounded-xl flex items-center justify-between group hover:border-slate-300 transition-colors">
                            <div className="space-y-2">
                              <div className="flex items-center gap-3">
                                <span className="font-bold text-slate-900">{word.word}</span>
                                <TTSButton text={word.word} language={word.languageCode as LanguageCode} className="opacity-80 group-hover:opacity-100" />
                              </div>
                              <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">{word.translation}</p>
                            </div>
                            <button onClick={() => handleRemoveWord(word.id)} className="p-2 text-slate-200 hover:text-red-500 transition-colors">
                              <i className="fa-solid fa-xmark text-sm"></i>
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ) : appState === 'setup' ? (
          <div className="space-y-20 animate-in fade-in duration-700">
            <div className="space-y-4 text-center">
              <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">What's the goal?</h2>
              <p className="text-slate-500 font-medium">Select a topic or describe a specific scenario.</p>
            </div>

            <div className="space-y-16">
              <div className="space-y-6">
                <label className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em] block text-center">Target Language</label>
                <div className="flex flex-wrap justify-center gap-3">
                  {LANGUAGES.map(lang => (
                    <button 
                      key={lang.code}
                      onClick={() => setSelectedLang(lang.code)}
                      className={`px-6 py-3 rounded-xl text-xs font-bold border transition-all ${selectedLang === lang.code ? 'bg-slate-900 text-white border-slate-900 shadow-md' : 'bg-white text-slate-400 border-slate-100 hover:border-slate-300'}`}
                    >
                      {lang.flag} <span className="ml-1 uppercase tracking-widest">{lang.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-10 pt-16 border-t border-slate-50">
                <form onSubmit={handleCustomSubmit} className="relative max-w-xl mx-auto">
                  <input 
                    type="text"
                    value={themeInput}
                    onChange={(e) => setThemeInput(e.target.value)}
                    placeholder="E.g. Business meeting in Berlin..."
                    className="w-full bg-white border-b border-slate-100 py-6 text-2xl text-slate-900 placeholder:text-slate-200 focus:border-indigo-600 focus:outline-none transition-all text-center font-medium"
                  />
                  <p className="text-[10px] text-slate-300 uppercase tracking-[0.2em] text-center mt-6">Describe any situation to generate a custom lesson</p>
                </form>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-2xl mx-auto">
                  {THEMES.map(theme => (
                    <button
                      key={theme.id}
                      onClick={() => triggerLessonGeneration(theme.title)}
                      className="group p-8 rounded-xl border border-slate-100 hover:border-slate-900 hover:bg-slate-50 transition-all text-center flex flex-col items-center gap-4"
                    >
                      <span className="text-3xl grayscale group-hover:grayscale-0 transition-all">{theme.icon}</span>
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] group-hover:text-slate-900">{theme.title}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-12 animate-in fade-in duration-500">
             <button onClick={resetToSetup} className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-slate-900 flex items-center gap-2 mb-8">
                <i className="fa-solid fa-arrow-left text-[10px]"></i> New Session
              </button>

              {loading ? (
                <div className="py-40 flex flex-col items-center justify-center gap-8 text-center">
                  <div className="w-12 h-12 border-2 border-slate-100 border-t-slate-900 rounded-full animate-spin"></div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Synthesizing Lesson...</p>
                </div>
              ) : error ? (
                <div className="py-24 text-center space-y-8">
                  <p className="text-slate-500 font-medium">{error}</p>
                  <button onClick={() => triggerLessonGeneration(lastRequestedTheme)} className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-600 underline underline-offset-8">Retry Connection</button>
                </div>
              ) : (
                lessonContent && (
                  <LessonCard 
                    content={lessonContent} 
                    language={selectedLang} 
                    savedWords={savedWords}
                    onSaveWord={handleSaveWord}
                    onRemoveWord={handleRemoveWord}
                  />
                )
              )}
          </div>
        )}
      </main>

      <footer className="py-16 border-t border-slate-50 text-center">
        <p className="text-[10px] font-black text-slate-200 uppercase tracking-[0.6em]">LinguaLearn AI &copy; 2026</p>
      </footer>
    </div>
  );
};

export default App;
