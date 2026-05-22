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
  sourceLanguage,
  setSourceLanguage,
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
    { code: 'auto', name: 'Auto-detect' },
    { code: 'en', name: 'English' },
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

  const sourceLanguageLabel = languages.find((lang) => lang.code === sourceLanguage)?.name || 'Auto-detect';
  const targetLanguageLabel = languages.find((lang) => lang.code === targetLanguage)?.name || 'Spanish';

  // Handle voice transcript from VoiceInput
  const handleVoiceTranscript = (transcript) => {
    setSourceText(transcript);
  };

  const swapLanguages = () => {
    const nextSource = targetLanguage;
    const nextTarget = sourceLanguage;
    setSourceLanguage(nextSource);
    setTargetLanguage(nextTarget);
  };

  return (
    <div className="space-y-6">
      {/* Voice Input Section */}
      <VoiceInput onTranscript={handleVoiceTranscript} darkMode={darkMode} />

      {/* Source Text Input Section */}
      <div className={`translation-card rounded-3xl p-6 md:p-7 border backdrop-blur-sm transition-transform duration-200 hover:-translate-y-0.5 ${
        darkMode ? 'bg-slate-900/80 border-white/10 shadow-2xl shadow-black/20' : 'bg-white/85 border-slate-200 shadow-xl shadow-slate-200/60'
      }`}>
        <div className="flex items-center justify-between gap-3 mb-3">
          <div>
            <label className={`block text-sm font-semibold ${
              darkMode ? 'text-slate-100' : 'text-slate-800'
            }`}>
              Text to Translate
            </label>
            <p className={`text-xs mt-1 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              Type in {sourceLanguageLabel}, then translate to {targetLanguageLabel}.
            </p>
          </div>
          <div className={`rounded-full px-3 py-1 text-xs font-semibold ${
            darkMode ? 'bg-cyan-500/10 text-cyan-200' : 'bg-cyan-50 text-cyan-700'
          }`}>
            Ready
          </div>
        </div>
        <div className="relative">
          <textarea
            value={sourceText}
            onChange={(e) => setSourceText(e.target.value)}
            placeholder="Enter text in the source language or use voice input..."
            className={`w-full h-32 p-4 pr-16 border rounded-2xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent resize-none transition-all duration-200 ${
              darkMode
                ? 'bg-slate-950/60 border-white/10 text-white placeholder-slate-500'
                : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'
            }`}
          />
          <div className={`absolute right-3 bottom-3 px-2 py-1 rounded-full text-[11px] font-semibold ${
            darkMode ? 'bg-white/10 text-slate-300' : 'bg-white text-slate-500 shadow-sm'
          }`}>
            {sourceText.length} chars
          </div>
        </div>
      </div>

      {/* Target Language Selector */}
      <div className={`translation-card rounded-3xl p-6 md:p-7 border backdrop-blur-sm ${
        darkMode ? 'bg-slate-900/80 border-white/10 shadow-2xl shadow-black/20' : 'bg-white/85 border-slate-200 shadow-xl shadow-slate-200/60'
      }`}>
        <div className="flex items-center justify-between gap-3 mb-4">
          <div>
            <label className={`block text-sm font-semibold ${
              darkMode ? 'text-slate-100' : 'text-slate-800'
            }`}>
              Translation Direction
            </label>
            <p className={`text-xs mt-1 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              Swap source and target with one tap.
            </p>
          </div>
          <button
            type="button"
            onClick={swapLanguages}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
              darkMode
                ? 'bg-white/10 text-cyan-200 hover:bg-white/15 border border-white/10'
                : 'bg-cyan-50 text-cyan-700 hover:bg-cyan-100 border border-cyan-100'
            }`}
            aria-label="Swap source and target languages"
          >
            <span>⇄</span>
            Swap
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-3 items-center">
          <div className={`rounded-2xl p-4 border ${darkMode ? 'bg-slate-950/50 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
            <label className={`block text-xs font-semibold mb-2 ${
              darkMode ? 'text-slate-400' : 'text-slate-500'
            }`}>
              From
            </label>
            <select
              value={sourceLanguage}
              onChange={(e) => setSourceLanguage(e.target.value)}
              className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200 ${
                darkMode
                  ? 'bg-slate-900 border-white/10 text-white'
                  : 'bg-white border-slate-200 text-slate-900'
              }`}
            >
              {languages.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.name}
                </option>
              ))}
            </select>
          </div>

          <div className={`mx-auto flex h-12 w-12 items-center justify-center rounded-full border ${
            darkMode ? 'border-white/10 bg-white/5 text-cyan-200' : 'border-slate-200 bg-white text-cyan-700'
          }`}>
            <span className="text-lg">→</span>
          </div>

          <div className={`rounded-2xl p-4 border ${darkMode ? 'bg-slate-950/50 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
            <label className={`block text-xs font-semibold mb-2 ${
              darkMode ? 'text-slate-400' : 'text-slate-500'
            }`}>
              To
            </label>
            <select
              value={targetLanguage}
              onChange={(e) => setTargetLanguage(e.target.value)}
              className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200 ${
                darkMode
                  ? 'bg-slate-900 border-white/10 text-white'
                  : 'bg-white border-slate-200 text-slate-900'
              }`}
            >
              {languages.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.name}
                </option>
              ))}
            </select>
          </div>
        </div>
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
          className={`flex-1 min-w-32 relative overflow-hidden font-semibold py-3 px-4 rounded-2xl transition-all duration-300 ${
            loading
              ? 'bg-slate-400 text-white cursor-wait shadow-none'
              : 'bg-gradient-to-r from-cyan-600 via-sky-600 to-indigo-600 text-white shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/30 hover:-translate-y-0.5'
          }`}
        >
          <span className="relative z-10 inline-flex items-center gap-2">
            {loading && <span className="h-4 w-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />}
            {loading ? 'Translating...' : 'Translate'}
          </span>
          {!loading && <span className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300 bg-white/10" />}
        </button>
        <button
          onClick={onClear}
          className={`flex-1 min-w-32 font-semibold py-3 px-4 rounded-2xl transition-all duration-200 ${
            darkMode
              ? 'bg-white/10 hover:bg-white/15 text-white border border-white/10'
              : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
          }`}
        >
          Clear
        </button>
      </div>

      {/* Translated Output Section */}
      {translatedText && (
        <div className={`translation-result rounded-3xl p-6 md:p-7 border backdrop-blur-sm ${
          darkMode ? 'bg-slate-900/80 border-white/10 shadow-2xl shadow-black/20' : 'bg-white/85 border-slate-200 shadow-xl shadow-slate-200/60'
        }`}>
          <div className="flex items-center justify-between gap-3 mb-3">
            <div>
              <label className={`block text-sm font-semibold ${
                darkMode ? 'text-slate-100' : 'text-slate-800'
              }`}>
                Translation
              </label>
              <p className={`text-xs mt-1 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                Your translated text is ready to copy or play aloud.
              </p>
            </div>
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${
              darkMode ? 'bg-emerald-500/10 text-emerald-200' : 'bg-emerald-50 text-emerald-700'
            }`}>
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              Output ready
            </div>
          </div>
          <div className={`p-5 rounded-2xl mb-4 min-h-24 leading-relaxed ${
            darkMode
              ? 'bg-gradient-to-br from-cyan-500/10 via-sky-500/10 to-indigo-500/10 text-slate-100 border border-white/10'
              : 'bg-gradient-to-br from-cyan-50 via-sky-50 to-indigo-50 text-slate-800 border border-slate-100'
          }`}>
            <p className="text-[15px] md:text-base">{translatedText}</p>
          </div>
          <div className="flex flex-col gap-3">
            <button
              onClick={onCopy}
              className="w-full inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5 px-4 rounded-2xl transition-all duration-200 shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30"
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
