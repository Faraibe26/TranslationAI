import React, { useState } from 'react';

/**
 * PresetPhrases Component
 * Displays common pharmacy phrases that users can quickly select
 */
function PresetPhrases({ onSelectPhrase, darkMode }) {
  const phrases = [
    { text: 'Do you have any allergies?', category: 'Safety' },
    { text: 'This medication may cause drowsiness', category: 'Safety' },
    { text: 'Do not take with alcohol', category: 'Safety' },
    { text: 'Keep out of reach of children', category: 'Safety' },
    { text: 'How many times a day do you take this medication?', category: 'Medication' },
    { text: 'Take this medication with food', category: 'Medication' },
    { text: 'Take one tablet twice daily', category: 'Medication' },
    { text: 'Keep this medicine refrigerated.', category: 'Storage & preparation' },
    { text: 'Shake well before each use.', category: 'Storage & preparation' },
    { text: 'Do not freeze this medicine.', category: 'Storage & preparation' },
    { text: 'Store this medicine at room temperature.', category: 'Storage & preparation' },
    { text: 'Keep the container tightly closed.', category: 'Storage & preparation' },
    { text: 'Please confirm your date of birth', category: 'Patient & billing' },
    { text: 'Do you have insurance?', category: 'Patient & billing' },
  ];
  const categories = ['All', 'Favorites', 'Safety', 'Medication', 'Storage & preparation', 'Patient & billing'];
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [favorites, setFavorites] = useState(() => {
    const savedFavorites = localStorage.getItem('favoritePhrases');
    return savedFavorites ? JSON.parse(savedFavorites) : [];
  });

  const toggleFavorite = (phrase) => {
    const nextFavorites = favorites.includes(phrase)
      ? favorites.filter((favorite) => favorite !== phrase)
      : [...favorites, phrase];
    setFavorites(nextFavorites);
    localStorage.setItem('favoritePhrases', JSON.stringify(nextFavorites));
  };

  const visiblePhrases = phrases.filter(({ text, category }) => {
    const matchesCategory = activeCategory === 'All'
      || (activeCategory === 'Favorites' ? favorites.includes(text) : category === activeCategory);
    const matchesSearch = text.toLowerCase().includes(searchTerm.toLowerCase().trim());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className={`rounded-lg shadow-md p-6 ${
      darkMode ? 'bg-gray-800' : 'bg-white'
    }`}>
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <h2 className={`text-lg font-semibold ${
            darkMode ? 'text-white' : 'text-gray-800'
          }`}>
            Pharmacy phrases
          </h2>
          <p className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Approved starting points for common conversations
          </p>
        </div>
        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
          darkMode ? 'bg-indigo-500/20 text-indigo-200' : 'bg-indigo-50 text-indigo-700'
        }`}>
          {phrases.length} phrases
        </span>
      </div>
      <input
        type="search"
        value={searchTerm}
        onChange={(event) => setSearchTerm(event.target.value)}
        placeholder="Search phrases"
        aria-label="Search pharmacy phrases"
        className={`w-full p-3 mb-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
          darkMode
            ? 'bg-gray-900 border-gray-600 text-white placeholder-gray-500'
            : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400'
        }`}
      />
      <div className="flex gap-2 overflow-x-auto pb-2 mb-3" role="tablist" aria-label="Phrase categories">
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            onClick={() => setActiveCategory(category)}
            aria-selected={activeCategory === category}
            role="tab"
            className={`whitespace-nowrap px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
              activeCategory === category
                ? 'bg-indigo-600 text-white'
                : darkMode
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  : 'bg-gray-100 text-gray-600 hover:bg-indigo-50'
            }`}
          >
            {category}
          </button>
        ))}
      </div>
      <div className="space-y-2">
        {visiblePhrases.map(({ text, category }) => (
          <div
            key={text}
            className={`flex items-stretch rounded-lg border overflow-hidden ${
              darkMode ? 'border-gray-600' : 'border-gray-200'
            }`}
          >
            <button
              type="button"
              onClick={() => onSelectPhrase(text)}
              className={`flex-1 text-left p-3 transition duration-200 text-sm ${
                darkMode
                  ? 'bg-gray-700 hover:bg-gray-600 text-gray-100 hover:text-indigo-300'
                  : 'bg-gray-50 hover:bg-indigo-100 text-gray-700 hover:text-indigo-700'
              }`}
            >
              <span className="block">{text}</span>
              <span className={`block text-[11px] mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {category}
              </span>
            </button>
            <button
              type="button"
              onClick={() => toggleFavorite(text)}
              aria-label={`${favorites.includes(text) ? 'Remove' : 'Add'} ${text} ${favorites.includes(text) ? 'from' : 'to'} favorites`}
              title={favorites.includes(text) ? 'Remove from favorites' : 'Add to favorites'}
              className={`px-3 border-l text-lg transition-colors ${
                darkMode
                  ? 'bg-gray-800 border-gray-600 text-yellow-300 hover:bg-gray-700'
                  : 'bg-white border-gray-200 text-yellow-500 hover:bg-yellow-50'
              }`}
            >
              {favorites.includes(text) ? '★' : '☆'}
            </button>
          </div>
        ))}
        {visiblePhrases.length === 0 && (
          <p className={`text-sm py-4 text-center ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            No phrases match your search.
          </p>
        )}
      </div>
    </div>
  );
}

export default PresetPhrases;
