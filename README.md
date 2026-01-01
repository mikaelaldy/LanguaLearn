# 🌍 LanguaLearn: AI-Powered Contextual Language Tutoring

> **Learn the language you actually need.**

LanguaLearn is a sophisticated, minimalist language learning platform designed for the modern learner. By harnessing the reasoning and synthesis capabilities of the **Google Gemini API**, LanguaLearn moves beyond static textbooks to provide a dynamic, context-first learning environment.

## 💡 Inspiration

Traditional language learning apps often feel rigid and disconnected from real life. You memorize "The apple is red" but freeze when trying to order coffee or ask for directions. We wanted to build a tool that adapts to *your* life and *your* immediate needs—whether it's a business trip to Tokyo, a vacation in Paris, or just chatting with a neighbor. We envisioned a "radical personalization" engine where the curriculum is generated on the fly, tailored specifically to the user's context.

## 🚀 What it does

LanguaLearn allows users to:
*   **Generate Custom Lessons:** Simply describe a scenario (e.g., "Negotiating a contract in Berlin" or "Buying train tickets in Osaka") and get a bespoke lesson instantly.
*   **Explore Common Themes:** Quick access to essential topics like Daily Life, Food & Dining, Travel, and Healthcare.
*   **Listen to Native-Quality Audio:** Every word and phrase comes with high-fidelity Text-to-Speech (TTS) to perfect your pronunciation.
*   **Save & Review:** Build your own "Vocabulary Vault" that persists across sessions.

## ⚙️ How we built it

We built LanguaLearn using a modern, performance-focused stack:

*   **Frontend:** [React 19](https://react.dev/) with [TypeScript](https://www.typescriptlang.org/) for type safety.
*   **Build Tool:** [Vite](https://vitejs.dev/) for lightning-fast development and building.
*   **Styling:** [Tailwind CSS](https://tailwindcss.com/) for a bespoke "Ink & Paper" design system.
*   **AI Intelligence:**
    *   **Gemini 3.0 Flash:** We use this model to reason about the user's request and generate structured JSON lessons containing vocabulary, phrases, and grammar tips.
    *   **Gemini 2.5 Flash TTS:** This experimental endpoint powers our "Ultra-Resilient Audio Synthesis," providing natural-sounding speech for 10+ languages.

## 🚧 Challenges we ran into

**Stable Audio Generation:**
Working with experimental TTS models can be unpredictable. We encountered issues with transient 500 errors and model instability when processing certain characters. To solve this, we engineered a **Tiered Recovery Pipeline** in our `geminiService.ts`:
*   **Auto-Sanitization:** We strip problematic characters that confuse the model.
*   **Tiered Prompts:** If a prompt fails, we retry with slightly different phrasing (e.g., "Say: [text]" vs "Please read this aloud: [text]") to bypass reasoning blocks.
*   **Exponential Backoff & Jitter:** We implemented robust retry logic with randomized delays to handle rate limits and server hiccups gracefully.

## 🏆 Accomplishments that we're proud of

*   **"Ink & Paper" Design:** We achieved a "World-Class" aesthetic using a high-contrast palette (Deep Slate on Pure White) and the *Inter* typeface. It looks and feels like a premium educational tool.
*   **Seamless AI Integration:** The transition between user input and lesson generation feels magical. The structured JSON output from Gemini 3.0 Flash is parsed and rendered instantly into interactive cards.
*   **Multi-Language Support:** We successfully integrated support for 10 languages, including complex scripts like Japanese (Romaji), Chinese (Pinyin), and Korean, ensuring correct pronunciation guides are generated.

## 🔮 What's next for LanguaLearn

*   **User Accounts:** syncing progress across devices.
*   **Gamification:** Streaks, daily goals, and achievements.
*   **Conversation Mode:** Real-time roleplay with an AI tutor using Gemini's multimodal capabilities.
*   **Image-to-Lesson:** Snap a photo of a menu or sign and get an instant lesson about it.

## 🛠️ Getting Started

To run LanguaLearn locally:

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/yourusername/langualearn.git
    cd langualearn
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up your API Key:**
    Create a `.env` file in the root directory and add your Google Gemini API key:
    ```env
    VITE_API_KEY=your_gemini_api_key_here
    ```
    *(Note: Ensure your code retrieves this correctly, e.g. via `import.meta.env` or `process.env` depending on your config)*

4.  **Run the development server:**
    ```bash
    npm run dev
    ```

5.  **Open your browser:**
    Navigate to `http://localhost:5173` (or the port shown in your terminal).

---

*Built with ❤️ for the Hackathon.*
