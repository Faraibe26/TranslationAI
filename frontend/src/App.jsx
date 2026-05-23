import React, { useState, useEffect } from 'react';
import './App.css';
import TranslationForm from './components/TranslationForm';
import PresetPhrases from './components/PresetPhrases';
import Disclaimer from './components/Disclaimer';
import TranslationHistory from './components/TranslationHistory';

const API_URL_CANDIDATES = [
  '',
  import.meta.env.VITE_API_URL,
  'https://pharmalingo-backend.onrender.com',
  'https://translationai-production.up.railway.app',
  'http://localhost:8000',
].filter(Boolean);

function App() {
  const [sourceText, setSourceText] = useState('');
  const [sourceLanguage, setSourceLanguage] = useState('auto');
  const [targetLanguage, setTargetLanguage] = useState('en');
  const [translatedText, setTranslatedText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [darkMode, setDarkMode] = useState(() => {
    // Load dark mode preference from localStorage
    return localStorage.getItem('darkMode') === 'true';
  });
  const [history, setHistory] = useState(() => {
    // Load translation history from localStorage
    const saved = localStorage.getItem('translationHistory');
    return saved ? JSON.parse(saved) : [];
  });

  const handlePresetPhrase = (phrase) => {
    setSourceText(phrase);
    setError('');
  };

  const handleTranslate = async () => {
    if (!sourceText.trim()) {
      setError('Please enter text to translate');
      return;
    }

    setLoading(true);
    setError('');
    setTranslatedText('');

    try {
      const requestPayload = {
        text: sourceText,
        source_language: sourceLanguage,
        target_language: targetLanguage,
      };

      let lastError = null;

      for (const apiUrl of API_URL_CANDIDATES) {
        try {
          const endpoint = apiUrl ? `${apiUrl}/api/translate` : '/api/translate';
          const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestPayload),
          });

          if (!response.ok) {
            lastError = new Error(`Translation failed with status ${response.status}`);
            continue;
          }

          const data = await response.json();
          setTranslatedText(data.translated_text);

          const newEntry = {
            id: Date.now(),
            sourceText,
            translatedText: data.translated_text,
            sourceLanguage,
            targetLanguage,
            timestamp: new Date().toLocaleTimeString(),
          };
          const updatedHistory = [newEntry, ...history].slice(0, 10);
          setHistory(updatedHistory);
          localStorage.setItem('translationHistory', JSON.stringify(updatedHistory));
          return;
        } catch (fetchError) {
          lastError = fetchError;
        }
      }

      throw lastError || new Error('Translation failed');
    } catch (err) {
      setError('Error translating text. Please try again.');
      console.error('Translation error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (translatedText) {
      navigator.clipboard.writeText(translatedText);
      alert('Copied to clipboard!');
    }
  };

  const handleClear = () => {
    setSourceText('');
    setTranslatedText('');
    setError('');
    setSourceLanguage('auto');
    setTargetLanguage('en');
  };

  const handleToggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode.toString());
  };

  const handleHistoryClick = (entry) => {
    setSourceText(entry.sourceText);
    setSourceLanguage(entry.sourceLanguage || 'en');
    setTargetLanguage(entry.targetLanguage);
    setTranslatedText(entry.translatedText);
  };

  const handleClearHistory = () => {
    setHistory([]);
    localStorage.removeItem('translationHistory');
  };

  return (
    <div className={`app-shell min-h-screen relative overflow-hidden transition-colors duration-300 ${
      darkMode
        ? 'bg-slate-950 text-white'
        : 'bg-slate-50 text-slate-900'
    } p-4 md:p-8`}>
      <div className="ambient-orb ambient-orb-one" />
      <div className="ambient-orb ambient-orb-two" />
      <div className="ambient-grid" />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between mb-8">
          <div className="max-w-2xl">
            <h1 className={`text-4xl md:text-5xl font-black tracking-tight mb-3 ${
              darkMode ? 'text-white' : 'text-slate-900'
            }`}>
              PharmaLingo
            </h1>
            <p className={`text-base md:text-lg max-w-xl ${
              darkMode ? 'text-slate-300' : 'text-slate-600'
            }`}>
              Translate pharmacy communication with a cleaner two-way workflow, faster actions, and speech output that feels more polished.
            </p>
          </div>

          <button
            onClick={handleToggleDarkMode}
            className={`inline-flex items-center gap-3 self-start md:self-auto px-4 py-3 rounded-2xl transition-all duration-200 shadow-lg ${
              darkMode
                ? 'bg-white/10 hover:bg-white/15 text-white border border-white/10'
                : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200'
            }`}
            title="Toggle dark mode"
          >
            <span className="text-lg">{darkMode ? '☀️' : '🌙'}</span>
            <span className="text-sm font-semibold">{darkMode ? 'Light mode' : 'Dark mode'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Column - Preset Phrases & History */}
          <div className="lg:col-span-1 space-y-6">
            <PresetPhrases onSelectPhrase={handlePresetPhrase} darkMode={darkMode} />
            <TranslationHistory 
              history={history}
              onHistoryClick={handleHistoryClick}
              onClearHistory={handleClearHistory}
              darkMode={darkMode}
            />
          </div>

          {/* Right Column - Translation Form */}
          <div className="lg:col-span-3">
            <TranslationForm
              sourceText={sourceText}
              setSourceText={setSourceText}
              sourceLanguage={sourceLanguage}
              setSourceLanguage={setSourceLanguage}
              targetLanguage={targetLanguage}
              setTargetLanguage={setTargetLanguage}
              translatedText={translatedText}
              loading={loading}
              error={error}
              onTranslate={handleTranslate}
              onCopy={handleCopy}
              onClear={handleClear}
              darkMode={darkMode}
            />
          </div>
        </div>

        <div className="mt-6">
          <Disclaimer darkMode={darkMode} />
        </div>
      </div>
    </div>
  );
}

export default App;