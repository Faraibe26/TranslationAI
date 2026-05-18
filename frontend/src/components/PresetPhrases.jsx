import React from 'react';

/**
 * PresetPhrases Component
 * Displays common pharmacy phrases that users can quickly select
 */
function PresetPhrases({ onSelectPhrase, darkMode }) {
  // Common pharmacy phrases pre-defined for quick access
  const presetPhrases = [
    "Do you have any allergies?",
    "How many times a day do you take this medication?",
    "This medication may cause drowsiness",
    "Please confirm your date of birth",
    "Take this medication with food",
    "Do not take with alcohol",
    "Keep out of reach of children",
    "Take one tablet twice daily",
  ];

  return (
    <div className={`rounded-lg shadow-md p-6 ${
      darkMode ? 'bg-gray-800' : 'bg-white'
    }`}>
      <h2 className={`text-lg font-semibold mb-4 ${
        darkMode ? 'text-white' : 'text-gray-800'
      }`}>
        📋 Common Phrases
      </h2>
      {/* List of clickable preset phrases */}
      <div className="space-y-2">
        {presetPhrases.map((phrase, index) => (
          <button
            key={index}
            onClick={() => onSelectPhrase(phrase)}
            className={`w-full text-left p-3 rounded-lg transition duration-200 text-sm border ${
              darkMode
                ? 'bg-gray-700 hover:bg-gray-600 text-gray-100 border-gray-600 hover:text-indigo-300'
                : 'bg-gray-50 hover:bg-indigo-100 text-gray-700 border-gray-200 hover:text-indigo-700'
            }`}
          >
            {phrase}
          </button>
        ))}
      </div>
    </div>
  );
}

export default PresetPhrases;
