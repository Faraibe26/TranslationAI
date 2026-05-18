import React, { useState, useRef } from 'react';

/**
 * VoiceInput Component
 * Handles speech-to-text input using Web Speech API
 */
function VoiceInput({ onTranscript, isListening, darkMode }) {
  const [transcript, setTranscript] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef(null);

  // Initialize speech recognition
  const initRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech Recognition not supported in this browser');
      return null;
    }
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsRecording(true);
    };

    recognition.onresult = (event) => {
      let interim = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcriptPart = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          setTranscript(transcriptPart);
          onTranscript(transcriptPart);
        } else {
          interim += transcriptPart;
        }
      }
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error', event.error);
      setIsRecording(false);
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    return recognition;
  };

  const startListening = () => {
    if (!recognitionRef.current) {
      recognitionRef.current = initRecognition();
    }
    if (recognitionRef.current) {
      setTranscript('');
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.abort();
      setIsRecording(false);
    }
  };

  return (
    <div className={`rounded-lg shadow-md p-6 ${
      darkMode ? 'bg-gray-800' : 'bg-white'
    }`}>
      <label className={`block text-sm font-semibold mb-4 ${
        darkMode ? 'text-gray-100' : 'text-gray-700'
      }`}>
        🎤 Voice Input
      </label>
      <div className="flex gap-3 mb-4">
        <button
          onClick={startListening}
          disabled={isRecording}
          className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
        >
          {isRecording ? '🔴 Recording...' : 'Start Recording'}
        </button>
        <button
          onClick={stopListening}
          disabled={!isRecording}
          className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
        >
          Stop Recording
        </button>
      </div>
      {transcript && (
        <div className={`p-3 rounded-lg ${
          darkMode
            ? 'bg-blue-900 text-blue-100'
            : 'bg-blue-50 text-gray-600'
        }`}>
          <p className="text-sm">
            <span className="font-semibold">Heard:</span> {transcript}
          </p>
        </div>
      )}
      {isRecording && (
        <p className={`text-xs mt-2 animate-pulse ${
          darkMode ? 'text-blue-400' : 'text-blue-600'
        }`}>
          🎙️ Listening...
        </p>
      )}
    </div>
  );
}

export default VoiceInput;
