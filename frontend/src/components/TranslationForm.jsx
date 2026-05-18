import React from 'react';
import VoiceInput from './VoiceInput';
import VoiceOutput from './VoiceOutput';

/**
 * TranslationForm Component
 * Handles the main translation interface with input, language selection, and output
 */
function TranslationForm({
  sourceText,
  setSourceText,
  targetLanguage,
  setTargetLanguage,
  translatedText,
  loading,
  error,
  onTranslate,
  onCopy,
  onClear,
  darkMode,
}) {
  // Available languages for translation
  const languages = [
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' },
    { code: 'zh', name: 'Chinese (Simplified)' },
    { code: 'zh-TW', name: 'Chinese (Taiwan)' },
    { code: 'vi', name: 'Vietnamese' },
    { code: 'ko', name: 'Korean' },
    { code: 'ar', name: 'Arabic' },
    { code: 'pt', name: 'Portuguese' },
  ];

  // Handle voice transcript from VoiceInput
  const handleVoiceTranscript = (transcript) => {
    setSourceText(transcript);
  };

  return (
    <div className="space-y-6">
      {/* Voice Input Section */}
      <VoiceInput onTranscript={handleVoiceTranscript} darkMode={darkMode} />

      {/* Source Text Input Section */}
      <div className={`rounded-lg shadow-md p-6 ${
        darkMode ? 'bg-gray-800' : 'bg-white'
      }`}>
        <label className={`block text-sm font-semibold mb-2 ${
          darkMode ? 'text-gray-100' : 'text-gray-700'
        }`}>
          Text to Translate
        </label>
        <textarea
          value={sourceText}
          onChange={(e) => setSourceText(e.target.value)}
          placeholder="Enter pharmacy text here or use voice input..."
          className={`w-full h-24 p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none ${
            darkMode
              ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
              : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
          }`}
        />
        <p className={`text-xs mt-1 ${
          darkMode ? 'text-gray-400' : 'text-gray-500'
        }`}>
          {sourceText.length} characters
        </p>
      </div>

      {/* Target Language Selector */}
      <div className={`rounded-lg shadow-md p-6 ${
        darkMode ? 'bg-gray-800' : 'bg-white'
      }`}>
        <label className={`block text-sm font-semibold mb-2 ${
          darkMode ? 'text-gray-100' : 'text-gray-700'
        }`}>
          Target Language
        </label>
        <select
          value={targetLanguage}
          onChange={(e) => setTargetLanguage(e.target.value)}
          className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
            darkMode
              ? 'bg-gray-700 border-gray-600 text-white'
              : 'bg-white border-gray-300 text-gray-900'
          }`}
        >
          {languages.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.name}
            </option>
          ))}
        </select>
      </div>

      {/* Error Message Display */}
      {error && (
        <div className={`border rounded-lg p-4 ${
          darkMode
            ? 'bg-red-900 border-red-700 text-red-200'
            : 'bg-red-50 border-red-200 text-red-700'
        }`}>
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3 flex-wrap">
        <button
          onClick={onTranslate}
          disabled={loading}
          className="flex-1 min-w-32 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white font-semibold py-3 px-4 rounded-lg transition duration-200"
        >
          {loading ? 'Translating...' : 'Translate'}
        </button>
        <button
          onClick={onClear}
          className="flex-1 min-w-32 bg-gray-400 hover:bg-gray-500 text-white font-semibold py-3 px-4 rounded-lg transition duration-200"
        >
          Clear
        </button>
      </div>

      {/* Translated Output Section */}
      {translatedText && (
        <div className={`rounded-lg shadow-md p-6 ${
          darkMode ? 'bg-gray-800' : 'bg-white'
        }`}>
          <label className={`block text-sm font-semibold mb-2 ${
            darkMode ? 'text-gray-100' : 'text-gray-700'
          }`}>
            Translation
          </label>
          <div className={`p-4 rounded-lg mb-4 min-h-24 ${
            darkMode
              ? 'bg-indigo-900 text-indigo-100'
              : 'bg-indigo-50 text-gray-800'
          }`}>
            <p>{translatedText}</p>
          </div>
          <div className="flex flex-col gap-3">
            <button
              onClick={onCopy}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
            >
              📋 Copy to Clipboard
            </button>
            {/* Voice Output Component */}
            <VoiceOutput text={translatedText} language={targetLanguage} darkMode={darkMode} />
          </div>
        </div>
      )}
    </div>
  );
}

export default TranslationForm;
