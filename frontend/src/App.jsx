import React, { useState, useEffect } from 'react';
import './App.css';
import TranslationForm from './components/TranslationForm';
import PresetPhrases from './components/PresetPhrases';
import Disclaimer from './components/Disclaimer';
import TranslationHistory from './components/TranslationHistory';

function App() {
  const [sourceText, setSourceText] = useState('');
  const [targetLanguage, setTargetLanguage] = useState('es');
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
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      const response = await fetch(`${apiUrl}/api/translate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: sourceText,
          target_language: targetLanguage,
        }),
      });

      if (!response.ok) {
        throw new Error('Translation failed');
      }

      const data = await response.json();
      setTranslatedText(data.translated_text);
      
      // Add to translation history
      const newEntry = {
        id: Date.now(),
        sourceText,
        translatedText: data.translated_text,
        targetLanguage,
        timestamp: new Date().toLocaleTimeString(),
      };
      const updatedHistory = [newEntry, ...history].slice(0, 10); // Keep last 10
      setHistory(updatedHistory);
      localStorage.setItem('translationHistory', JSON.stringify(updatedHistory));
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
    setTargetLanguage('es');
  };

  const handleToggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode.toString());
  };

  const handleHistoryClick = (entry) => {
    setSourceText(entry.sourceText);
    setTargetLanguage(entry.targetLanguage);
    setTranslatedText(entry.translatedText);
  };

  const handleClearHistory = () => {
    setHistory([]);
    localStorage.removeItem('translationHistory');
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      darkMode 
        ? 'bg-gray-900 text-white' 
        : 'bg-gradient-to-br from-blue-50 to-indigo-100'
    } p-4 md:p-8`}>
      <div className="max-w-6xl mx-auto">
        {/* Header with Dark Mode Toggle */}
        <div className="flex justify-between items-center mb-8">
          <div className="text-center flex-1">
            <h1 className={`text-4xl font-bold mb-2 ${
              darkMode ? 'text-white' : 'text-gray-800'
            }`}>
              💊 PharmaLingo
            </h1>
            <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
              Translate pharmacy communication with ease
            </p>
          </div>
          <button
            onClick={handleToggleDarkMode}
            className={`p-2 rounded-lg transition-colors ${
              darkMode
                ? 'bg-gray-800 hover:bg-gray-700 text-yellow-400'
                : 'bg-white hover:bg-gray-100 text-gray-700'
            } shadow-md`}
            title="Toggle dark mode"
          >
            {darkMode ? '☀️' : '🌙'}
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

        <Disclaimer darkMode={darkMode} />
      </div>
    </div>
  );
}

export default App;