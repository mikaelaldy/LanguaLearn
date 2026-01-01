# 🌍 LinguaLearn: AI-Powered Contextual Language Tutoring

**LinguaLearn** is a sophisticated, minimalist language learning platform designed for the modern learner. By harnessing the reasoning and synthesis capabilities of the **Google Gemini API**, LinguaLearn moves beyond static textbooks to provide a dynamic, context-first learning environment.

---

## ✨ The LinguaLearn Experience

### 🎯 Radical Personalization
Textbooks provide generic scenarios. **LinguaLearn** provides *yours*. Describe any specific situation—a high-stakes business negotiation, a first date in a foreign city, or a visit to a local pharmacy—and receive a bespoke lesson instantly.

### 🔊 Ultra-Resilient Audio Synthesis
Mastering a language requires hearing it. We utilize `gemini-2.5-flash-preview-tts` with a custom **Tiered Recovery Pipeline** to ensure stable audio generation.
- **Auto-Sanitization**: Strips problematic characters that cause model instability.
- **Tiered Prompts**: Cycles through multiple speaking styles to bypass transient reasoning failures.
- **Fresh-Instance Jitter**: Dynamically regenerates API connections and uses exponential backoff with randomized jitter to combat 500 Internal Errors.

### 🧠 Intelligent Lesson Architecture
Each generated session is structured into three pillars:
1.  **Vocabulary Core**: Curated words with localized translations, phonetic readings (Romaji, Pinyin, etc.), and illustrative examples.
2.  **Phrase Bank**: High-frequency expressions tailored to your specific scenario.
3.  **Grammar Focus**: Targeted explanations that highlight syntactic patterns directly within example sentences.

### 🏛️ Persistent Vocabulary Vault
Never lose a word. Save items to your personal bank, which persists across sessions and is automatically organized by language.

---

## 🎨 Design System: "Ink & Paper"

LinguaLearn features a "World-Class" aesthetic dubbed **Ink & Paper**:
- **High Contrast**: A sophisticated blend of Deep Slate (#0f172a) on pure White (#ffffff).
- **Typography**: Optimized for focus using the *Inter* typeface for maximum legibility.
- **Minimalist UI**: High whitespace usage and subtle indigo accents minimize cognitive load, allowing the learning content to shine.

---

## 🛠️ Technical Overview

- **Engine**: Gemini 3.0 Flash for structured JSON lesson generation.
- **Voice**: Gemini 2.5 Flash TTS for real-time audio synthesis.
- **Frontend**: React 19 + TypeScript + Tailwind CSS.
- **Stability**: Enhanced retry logic for 500-error handling on experimental TTS endpoints.
- **Persistence**: Local storage synchronization for saved vocabulary and state.

---

*LinguaLearn: Learn the language you actually need.*