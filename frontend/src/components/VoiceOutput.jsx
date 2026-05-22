import React, { useState } from 'react';

/**
 * VoiceOutput Component
 * Handles text-to-speech output using Web Speech API
 */
function VoiceOutput({ text, language = 'es', darkMode }) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const speechRate = 0.75;

  // Language code mapping for speech synthesis
  const languageCodeMap = {
    en: 'en-US',
    es: 'es-ES',
    fr: 'fr-FR',
    de: 'de-DE',
    zh: 'zh-CN',
    ar: 'ar-SA',
    pt: 'pt-BR',
  };

  const startSpeech = () => {
    // Cancel any existing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    const selectedLanguage = languageCodeMap[language] || 'en-US';
    utterance.lang = selectedLanguage;
    utterance.rate = speechRate;
    utterance.pitch = 1;
    utterance.volume = 1;

    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find((voice) => voice.lang === selectedLanguage)
      || voices.find((voice) => voice.lang.startsWith(selectedLanguage.split('-')[0]))
      || voices.find((voice) => voice.lang.startsWith('en'))
      || voices[0];

    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.onstart = () => {
      setIsSpeaking(true);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
    };

    utterance.onerror = (event) => {
      console.error('Speech synthesis error', event.error);
      setIsSpeaking(false);
    };

    window.speechSynthesis.speak(utterance);
  };

  const stopSpeech = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  if (!text) {
    return null;
  }

  return (
    <div className={`mt-4 rounded-2xl border p-4 ${
      darkMode ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'
    }`}>
      <div className="flex items-center justify-between gap-3 mb-3">
        <div>
          <p className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-slate-800'}`}>
            Voice playback
          </p>
          <p className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
            Clearer speech for pharmacy communication.
          </p>
        </div>
        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${
          isSpeaking
            ? darkMode
              ? 'bg-emerald-500/15 text-emerald-200'
              : 'bg-emerald-50 text-emerald-700'
            : darkMode
              ? 'bg-white/5 text-slate-300'
              : 'bg-white text-slate-500'
        }`}>
          <span className={`h-2 w-2 rounded-full ${isSpeaking ? 'bg-emerald-400 animate-pulse' : 'bg-slate-400'}`} />
          {isSpeaking ? 'Speaking' : 'Ready'}
        </div>
      </div>

      <div className="flex gap-2">
      <button
        onClick={startSpeech}
        disabled={isSpeaking}
        className="flex-1 inline-flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-2.5 px-4 rounded-2xl transition-all duration-200 shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30"
      >
        {isSpeaking ? (
          <>
            <span className="h-3 w-3 rounded-full border-2 border-white/40 border-t-white animate-spin" />
            Speaking...
          </>
        ) : (
          <>
            <span>🔊</span>
            Speak Translation
          </>
        )}
      </button>
      {isSpeaking && (
        <button
          onClick={stopSpeech}
          className="flex-1 bg-white/10 hover:bg-white/15 text-current font-semibold py-2.5 px-4 rounded-2xl transition-all duration-200 border border-white/10"
        >
          Stop
        </button>
      )}
      </div>

    </div>
  );
}

export default VoiceOutput;
