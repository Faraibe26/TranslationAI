import React from 'react';

function PrivacyPolicy({ darkMode, onClose }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="privacy-policy-title"
    >
      <div className={`w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-3xl border p-6 md:p-8 shadow-2xl ${
        darkMode
          ? 'bg-slate-900 border-white/10 text-slate-100'
          : 'bg-white border-slate-200 text-slate-800'
      }`}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className={`text-xs font-semibold uppercase tracking-wider ${
              darkMode ? 'text-cyan-300' : 'text-cyan-700'
            }`}>
              PharmaLingo
            </p>
            <h2 id="privacy-policy-title" className="mt-1 text-2xl font-bold">
              Privacy Policy
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className={`shrink-0 rounded-full px-3 py-2 text-sm font-semibold ${
              darkMode
                ? 'bg-white/10 text-white hover:bg-white/15'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
            aria-label="Close privacy policy"
          >
            Close
          </button>
        </div>

        <div className="mt-6 space-y-5 text-sm leading-relaxed">
          <section>
            <h3 className="font-bold">What happens to text you enter</h3>
            <p className={`mt-1 ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
              When you translate text, the text is sent from your browser to the PharmaLingo
              translation server. The server may send it to an external translation provider,
              currently MyMemory, to produce the translation. Do not enter information you are
              not permitted to share through a cloud service.
            </p>
          </section>

          <section>
            <h3 className="font-bold">What may be stored in your browser</h3>
            <p className={`mt-1 ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
              Your browser may store up to 10 recent translations, favorite preset phrases,
              and your dark-mode preference using local storage. This information remains in
              your browser profile on your device. It is not synced to a PharmaLingo account.
              You can clear translation history and favorite phrases in the app where those
              controls are available.
            </p>
          </section>

          <section>
            <h3 className="font-bold">What is not stored by PharmaLingo</h3>
            <p className={`mt-1 ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
              PharmaLingo does not intentionally store translations in its own cloud database.
              It does not offer accounts or cross-device translation history.
            </p>
          </section>

          <section>
            <h3 className="font-bold">Voice input</h3>
            <p className={`mt-1 ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
              Voice input uses the browser&apos;s Web Speech service. The browser or device provider
              may process recorded speech and any information necessary to recognize it.
              PharmaLingo does not intentionally save the audio recording.
            </p>
          </section>

          <section>
            <h3 className="font-bold">External and server providers</h3>
            <p className={`mt-1 ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
              Hosting and translation providers may process technical request data, including
              IP addresses, timestamps, requested languages, and the submitted text. Their own
              privacy and retention policies apply. Review those provider policies before using
              the app with sensitive or confidential information.
            </p>
          </section>

          <section>
            <h3 className="font-bold">Your choices</h3>
            <p className={`mt-1 ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
              Use the Clear History control to remove saved translations from the browser.
              You can also remove browser storage for this site in your browser settings.
              Avoid entering patient identifiers or other highly sensitive data.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

export default PrivacyPolicy;
