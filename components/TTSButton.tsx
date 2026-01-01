import React, { useState } from 'react';
import { generateSpeech, decodeAudioBuffer } from '../services/geminiService.ts';
import { LanguageCode } from '../types.ts';

interface TTSButtonProps {
  text: string;
  language: LanguageCode;
  className?: string;
}

let sharedAudioContext: AudioContext | null = null;

const getAudioContext = () => {
  if (!sharedAudioContext) {
    sharedAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
  }
  return sharedAudioContext;
};

const TTSButton: React.FC<TTSButtonProps> = ({ text, language, className = "" }) => {
  const [status, setStatus] = useState<'idle' | 'loading' | 'playing'>('idle');

  const playAudio = async () => {
    if (status !== 'idle') return;
    
    setStatus('loading');
    try {
      const ctx = getAudioContext();
      if (ctx.state === 'suspended') await ctx.resume();

      const rawAudio = await generateSpeech(text, language);
      // decodeAudioBuffer is now synchronous based on updated service export
      const audioBuffer = decodeAudioBuffer(rawAudio, ctx);
      
      const source = ctx.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(ctx.destination);
      
      source.onended = () => setStatus('idle');
      source.start();
      setStatus('playing');
    } catch (error) {
      console.error("TTS Error:", error);
      setStatus('idle');
    }
  };

  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        playAudio();
      }}
      disabled={status !== 'idle'}
      className={`p-2 rounded-lg transition-all flex items-center justify-center border border-transparent ${
        status === 'loading' ? 'bg-slate-50 text-slate-300 animate-pulse' : 
        status === 'playing' ? 'bg-indigo-50 text-indigo-600 scale-105 border-indigo-100 shadow-sm shadow-indigo-50' :
        'bg-slate-50 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 hover:border-indigo-100 hover:shadow-sm'
      } ${className}`}
      aria-label="Listen to pronunciation"
    >
      {status === 'loading' ? (
        <i className="fa-solid fa-spinner fa-spin text-[10px]"></i>
      ) : (
        <i className="fa-solid fa-volume-high text-[11px]"></i>
      )}
    </button>
  );
};

export default TTSButton;
