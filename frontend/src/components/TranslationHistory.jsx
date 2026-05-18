import React from 'react';

/**
 * TranslationHistory Component
 * Displays recent translations and allows quick access to previous translations
 */
function TranslationHistory({ history, onHistoryClick, onClearHistory, darkMode }) {
  if (history.length === 0) {
    return (
      <div className={`rounded-lg shadow-md p-6 ${
        darkMode ? 'bg-gray-800' : 'bg-white'
      }`}>
        <h2 className="text-lg font-semibold mb-4">📜 Recent Translations</h2>
        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          No translations yet. Start translating to see your history!
        </p>
      </div>
    );
  }

  return (
    <div className={`rounded-lg shadow-md p-6 ${
      darkMode ? 'bg-gray-800' : 'bg-white'
    }`}>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">📜 Recent Translations</h2>
        <button
          onClick={onClearHistory}
          className="text-xs text-red-500 hover:text-red-700 font-semibold"
        >
          Clear
        </button>
      </div>
      
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {history.map((entry) => (
          <button
            key={entry.id}
            onClick={() => onHistoryClick(entry)}
            className={`w-full text-left p-3 rounded-lg transition-colors ${
              darkMode
                ? 'bg-gray-700 hover:bg-gray-600 text-gray-100'
                : 'bg-gray-50 hover:bg-indigo-100 text-gray-800'
            } border ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <p className="text-sm font-medium truncate">{entry.sourceText}</p>
                <p className="text-xs mt-1 truncate opacity-75">
                  → {entry.translatedText}
                </p>
              </div>
              <span className={`text-xs px-2 py-1 rounded ml-2 ${
                darkMode
                  ? 'bg-indigo-900 text-indigo-200'
                  : 'bg-indigo-100 text-indigo-700'
              }`}>
                {entry.targetLanguage.toUpperCase()}
              </span>
            </div>
            <p className={`text-xs mt-2 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
              {entry.timestamp}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}

export default TranslationHistory;
