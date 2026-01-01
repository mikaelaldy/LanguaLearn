
import React, { useState } from 'react';
import { LessonContent, LanguageCode, VocabularyItem, SavedVocabulary } from '../types.ts';
import TTSButton from './TTSButton.tsx';
import { generateMoreVocabulary } from '../services/geminiService.ts';

interface LessonCardProps {
  content: LessonContent;
  language: LanguageCode;
  savedWords: SavedVocabulary[];
  onSaveWord: (word: VocabularyItem) => void;
  onRemoveWord: (wordId: string) => void;
}

const LessonCard: React.FC<LessonCardProps> = ({ 
  content, 
  language, 
  savedWords, 
  onSaveWord, 
  onRemoveWord 
}) => {
  const [vocabulary, setVocabulary] = useState<VocabularyItem[]>(content.vocabulary);
  const [isExpandingVocab, setIsExpandingVocab] = useState(false);
  const [openGrammar, setOpenGrammar] = useState<number | null>(0);

  const isSaved = (word: string) => {
    return savedWords.some(sw => sw.word === word && sw.languageCode === language);
  };

  const handleToggleSave = (item: VocabularyItem) => {
    if (isSaved(item.word)) {
      const saved = savedWords.find(sw => sw.word === item.word && sw.languageCode === language);
      if (saved) onRemoveWord(saved.id);
    } else {
      onSaveWord(item);
    }
  };

  const handleGetMoreWords = async () => {
    setIsExpandingVocab(true);
    try {
      const existing = vocabulary.map(v => v.word);
      const newWords = await generateMoreVocabulary(language, content.theme, existing);
      setVocabulary(prev => [...prev, ...newWords]);
    } catch (err) {
      console.error("Failed to get more words:", err);
    } finally {
      setIsExpandingVocab(false);
    }
  };

  const highlightText = (text: string, highlight: string) => {
    if (!highlight || !text.includes(highlight)) {
      return <span>{text}</span>;
    }
    const parts = text.split(highlight);
    return (
      <span>
        {parts[0]}
        <span className="text-indigo-600 font-bold underline decoration-indigo-200 underline-offset-4">
          {highlight}
        </span>
        {parts[1]}
      </span>
    );
  };

  return (
    <div className="space-y-16 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="space-y-2">
        <h2 className="text-4xl font-extrabold text-slate-900 leading-tight">{content.title}</h2>
        <p className="text-slate-400 text-sm font-medium">Topic: <span className="text-slate-600 uppercase tracking-widest text-[10px]">{content.theme}</span></p>
      </div>

      {/* Vocabulary */}
      <section className="space-y-8">
        <div className="flex items-end justify-between border-b border-slate-100 pb-3">
          <h3 className="text-sm font-black uppercase tracking-[0.2em] text-slate-400">Vocabulary</h3>
          <span className="text-xs text-slate-300">{vocabulary.length} Words</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {vocabulary.map((item, idx) => {
            const saved = isSaved(item.word);
            return (
              <div key={idx} className="group p-6 bg-white border border-slate-100 rounded-xl hover:border-slate-300 hover:shadow-sm transition-all relative">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl font-bold text-slate-900">{item.word}</span>
                      <TTSButton text={item.word} language={language} className="opacity-60 group-hover:opacity-100" />
                    </div>
                    {item.reading && (
                      <span className="text-xs text-indigo-500 font-medium tracking-wide">{item.reading}</span>
                    )}
                  </div>
                  <button 
                    onClick={() => handleToggleSave(item)}
                    className={`p-2 transition-colors ${saved ? 'text-indigo-600' : 'text-slate-200 hover:text-slate-400'}`}
                  >
                    <i className={`fa-${saved ? 'solid' : 'regular'} fa-bookmark text-sm`}></i>
                  </button>
                </div>

                <div className="mt-5 flex flex-wrap gap-2">
                  <span className="px-2 py-1 bg-slate-50 text-slate-600 text-[10px] font-bold rounded uppercase tracking-wider border border-slate-100">
                    {item.translation}
                  </span>
                  {language !== 'en' && (
                    <span className="px-2 py-1 bg-white text-slate-400 text-[10px] font-bold rounded uppercase tracking-wider border border-slate-100">
                      en: {item.englishTranslation}
                    </span>
                  )}
                </div>

                <p className="mt-5 text-slate-500 text-sm italic leading-relaxed pl-4 border-l-2 border-slate-50 group-hover:border-slate-100 transition-colors">
                  "{item.example}"
                </p>
              </div>
            );
          })}
        </div>
        
        <button
          onClick={handleGetMoreWords}
          disabled={isExpandingVocab}
          className="w-full py-5 border-2 border-dashed border-slate-100 rounded-xl text-slate-400 text-sm font-bold hover:border-slate-300 hover:text-slate-600 hover:bg-slate-50/50 transition-all flex items-center justify-center gap-2"
        >
          {isExpandingVocab ? <i className="fa-solid fa-spinner fa-spin"></i> : <i className="fa-solid fa-plus text-[10px]"></i>}
          {isExpandingVocab ? "Generating more..." : "Generate 5 More Words"}
        </button>
      </section>

      {/* Phrases */}
      <section className="space-y-8">
        <div className="flex items-end justify-between border-b border-slate-100 pb-3">
          <h3 className="text-sm font-black uppercase tracking-[0.2em] text-slate-400">Essential Phrases</h3>
        </div>
        <div className="space-y-4">
          {content.phrases.map((phrase, idx) => (
            <div key={idx} className="flex items-center justify-between p-5 bg-white border border-slate-100 hover:border-slate-300 rounded-xl transition-all group">
              <div className="flex-1">
                <div className="flex items-center gap-4">
                  <p className="text-lg font-bold text-slate-800">{phrase.original}</p>
                  <TTSButton text={phrase.original} language={language} className="opacity-60 group-hover:opacity-100" />
                </div>
                <div className="flex items-center gap-3 mt-2">
                   <p className="text-sm text-slate-500 font-medium">{phrase.translation}</p>
                   <span className="text-[10px] text-slate-300 font-black px-2 py-0.5 border border-slate-50 rounded uppercase tracking-widest">{phrase.context}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Grammar */}
      <section className="space-y-8">
        <div className="flex items-end justify-between border-b border-slate-100 pb-3">
          <h3 className="text-sm font-black uppercase tracking-[0.2em] text-slate-400">Grammar Focus</h3>
        </div>
        <div className="space-y-4">
          {content.grammar.map((tip, idx) => (
            <div key={idx} className="border border-slate-100 rounded-xl overflow-hidden bg-white">
              <button 
                onClick={() => setOpenGrammar(openGrammar === idx ? null : idx)}
                className="w-full text-left p-6 flex items-center justify-between hover:bg-slate-50 transition-colors"
              >
                <span className="font-bold text-slate-900 tracking-tight">{tip.title}</span>
                <i className={`fa-solid fa-chevron-down text-slate-300 text-xs transition-transform ${openGrammar === idx ? 'rotate-180' : ''}`}></i>
              </button>
              {openGrammar === idx && (
                <div className="p-8 bg-white border-t border-slate-50 space-y-8 animate-in slide-in-from-top-1 duration-200">
                  <p className="text-slate-600 text-[15px] leading-relaxed max-w-2xl">{tip.explanation}</p>
                  <div className="bg-slate-50/50 border border-slate-100 p-6 rounded-xl flex items-center justify-between gap-6">
                    <p className="text-slate-900 font-semibold text-lg leading-relaxed">
                      {highlightText(tip.example, tip.highlight)}
                    </p>
                    <TTSButton text={tip.example} language={language} className="bg-white shadow-sm border-slate-200" />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default LessonCard;
