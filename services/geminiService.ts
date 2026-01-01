import { GoogleGenAI, Type, Modality } from "@google/genai";
import { LessonContent, LanguageCode, VocabularyItem } from "../types.ts";

const LANGUAGE_NAMES: Record<LanguageCode, string> = { 
  en: "English", 
  es: "Spanish",
  fr: "French",
  de: "German", 
  ja: "Japanese", 
  zh: "Mandarin Chinese",
  ko: "Korean",
  it: "Italian",
  pt: "Portuguese",
  ru: "Russian"
};

export async function generateLesson(language: LanguageCode, theme: string): Promise<LessonContent> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const targetLanguage = LANGUAGE_NAMES[language];

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: [{ 
      parts: [{ 
        text: `You are an expert language teacher. Generate a structured language learning lesson for a student learning ${targetLanguage} with the theme: "${theme}". 
        The response MUST be strictly valid JSON. 
        Provide 5 vocabulary items, 3 common phrases, and 1 important grammar tip. 
        For vocabulary, include "translation" and "englishTranslation".
        For the grammar tip, include a "highlight" field which is the exact substring of the "example" sentence that demonstrates the specific grammar rule.
        
        IMPORTANT: If the target language is Japanese (ja), Chinese (zh), or Korean (ko), you MUST provide a "reading" field for EVERY vocabulary item and EVERY phrase.
        - Japanese: Romaji.
        - Chinese: Pinyin.
        - Korean: Revised Romanization.
        Otherwise, leave "reading" empty.`
      }] 
    }],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          vocabulary: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                word: { type: Type.STRING },
                reading: { type: Type.STRING },
                translation: { type: Type.STRING },
                englishTranslation: { type: Type.STRING },
                example: { type: Type.STRING }
              },
              required: ["word", "translation", "englishTranslation", "example"]
            }
          },
          phrases: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                original: { type: Type.STRING },
                reading: { type: Type.STRING },
                translation: { type: Type.STRING },
                context: { type: Type.STRING }
              },
              required: ["original", "translation", "context"]
            }
          },
          grammar: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                explanation: { type: Type.STRING },
                example: { type: Type.STRING },
                highlight: { type: Type.STRING }
              },
              required: ["title", "explanation", "example", "highlight"]
            }
          }
        },
        required: ["title", "vocabulary", "phrases", "grammar"]
      }
    }
  });

  const parsed = JSON.parse(response.text || '{}');
  return { ...parsed, theme };
}

export async function generateMoreVocabulary(language: LanguageCode, theme: string, existingWords: string[]): Promise<VocabularyItem[]> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const targetLanguage = LANGUAGE_NAMES[language];

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: [{ 
      parts: [{ 
        text: `Generate 5 more vocabulary items for ${targetLanguage} learners for the theme: "${theme}".
        Avoid: ${existingWords.join(', ')}.
        Return JSON with "vocabulary" array.`
      }] 
    }],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          vocabulary: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                word: { type: Type.STRING },
                reading: { type: Type.STRING },
                translation: { type: Type.STRING },
                englishTranslation: { type: Type.STRING },
                example: { type: Type.STRING }
              },
              required: ["word", "translation", "englishTranslation", "example"]
            }
          }
        },
        required: ["vocabulary"]
      }
    }
  });

  const parsed = JSON.parse(response.text || '{"vocabulary": []}');
  return parsed.vocabulary;
}

export async function generateSpeech(text: string, language: LanguageCode): Promise<ArrayBuffer> {
  if (!text || text.trim().length === 0) {
    throw new Error("TTS Error: Text input is empty.");
  }

  // Pre-process text: extreme sanitization for model stability
  const sanitizedText = text.trim()
    .replace(/[""]/g, "'") // Handle smart quotes
    .replace(/[{}()\[\]]/g, "") // Strip brackets/parens
    .replace(/\s+/g, " ") // Normalize whitespace
    .substring(0, 200);   // Keep it short for preview stability

  const voices: Record<LanguageCode, string> = {
    en: 'Kore',
    es: 'Puck',
    fr: 'Charon',
    de: 'Puck',
    ja: 'Kore',
    zh: 'Charon',
    ko: 'Kore',
    it: 'Puck',
    pt: 'Charon',
    ru: 'Fenrir'
  };

  const promptVariations = [
    (t: string) => `Say: ${t}`,
    (t: string) => t,
    (t: string) => `Please read this aloud: ${t}`
  ];

  async function generateWithRetry(retries = 8, delay = 1000): Promise<any> {
    const attempt = 8 - retries;
    const promptIdx = attempt % promptVariations.length;
    const prompt = promptVariations[promptIdx](sanitizedText);
    
    // Always create a fresh instance per call for maximum isolation/reliability
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    try {
      const result = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text: prompt }] }],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: voices[language] || 'Kore' },
            },
          },
        },
      });

      const candidate = result.candidates?.[0];
      const audioData = candidate?.content?.parts?.find(p => p.inlineData?.data)?.inlineData?.data;

      if (!audioData) {
        if (retries > 0) {
          const jitter = Math.random() * 2000;
          await new Promise(r => setTimeout(r, delay + jitter));
          return generateWithRetry(retries - 1, delay * 1.5);
        }
        throw new Error(`TTS Error: Finish reason ${candidate?.finishReason || 'UNKNOWN'}`);
      }

      return audioData;
    } catch (error: any) {
      const errorStr = JSON.stringify(error).toLowerCase();
      const isInternal = errorStr.includes("500") || errorStr.includes("internal") || errorStr.includes("overloaded");

      if (retries > 0 && isInternal) {
        console.warn(`TTS: Internal error (500), retrying attempt ${attempt}...`);
        const jitter = Math.random() * 3000;
        await new Promise(r => setTimeout(r, delay + jitter));
        return generateWithRetry(retries - 1, delay * 2);
      }
      throw error;
    }
  }

  const base64Audio = await generateWithRetry();
  return decodeBase64(base64Audio);
}

function decodeBase64(base64: string): ArrayBuffer {
  try {
    const binaryString = window.atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
  } catch (e) {
    throw new Error("TTS Error: Base64 decoding failed.");
  }
}

export function decodeAudioBuffer(data: ArrayBuffer, ctx: AudioContext): AudioBuffer {
  const dataInt16 = new Int16Array(data);
  const numChannels = 1;
  const sampleRate = 24000;
  const frameCount = dataInt16.length;
  
  const audioBuffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
  const channelData = audioBuffer.getChannelData(0);

  for (let i = 0; i < frameCount; i++) {
    channelData[i] = dataInt16[i] / 32768.0;
  }
  
  return audioBuffer;
}