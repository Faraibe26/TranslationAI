import React, { useState } from 'react';

/**
 * VoiceOutput Component
 * Handles text-to-speech output using Web Speech API
 */
function VoiceOutput({ text, language = 'es', darkMode }) {
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Language code mapping for speech synthesis
  const languageCodeMap = {
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
    utterance.lang = languageCodeMap[language] || 'es-ES';
    utterance.rate = 0.9; // Slightly slower for clarity
    utterance.pitch = 1;
    utterance.volume = 1;

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
    <div className="flex gap-2 mt-4">
      <button
        onClick={startSpeech}
        disabled={isSpeaking}
        className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
      >
        {isSpeaking ? '🔊 Speaking...' : '🔊 Speak Translation'}
      </button>
      {isSpeaking && (
        <button
          onClick={stopSpeech}
          className="flex-1 bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
        >
          Stop
        </button>
      )}
    </div>
  );
}

export default VoiceOutput;
