import React from 'react';

/**
 * Disclaimer Component
 * Displays important legal and medical disclaimers for the application
 */
function Disclaimer({ darkMode }) {
  return (
    <div className={`mt-8 border-l-4 p-4 rounded ${
      darkMode
        ? 'bg-yellow-900 border-yellow-600 text-yellow-100'
        : 'bg-yellow-50 border-yellow-400 text-yellow-800'
    }`}>
      <p className="text-sm">
        <span className="font-semibold">⚠️ Important Disclaimer:</span> These translations
        should always be reviewed by qualified pharmacy staff before use with patients.
        This application is not a substitute for professional medical advice, professional
        translation services, or direct patient communication. Always verify accuracy
        and consult with language experts when necessary.
      </p>
    </div>
  );
}

export default Disclaimer;
