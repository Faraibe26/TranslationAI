import React, { useEffect, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import {
  createConversation,
  endConversation,
  getConversationMessages,
  sendConversationMessage,
} from '../services/conversationApi';

const languages = [
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'zh-TW', name: 'Chinese (Taiwan)' },
  { code: 'vi', name: 'Vietnamese' },
  { code: 'ko', name: 'Korean' },
  { code: 'ar', name: 'Arabic' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'yue', name: 'Cantonese' },
  { code: 'ru', name: 'Russian' },
  { code: 'pl', name: 'Polish' },
  { code: 'el', name: 'Greek' },
  { code: 'sq', name: 'Albanian' },
];

function ConversationPanel({ darkMode, initialPatientLanguage, onClose }) {
  const [patientLanguage, setPatientLanguage] = useState(initialPatientLanguage === 'en' ? 'es' : initialPatientLanguage);
  const [session, setSession] = useState(null);
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!session) return undefined;

    const refreshMessages = async () => {
      try {
        setMessages((await getConversationMessages(session.token)).messages);
      } catch (requestError) {
        setError(requestError.message);
      }
    };

    refreshMessages();
    const intervalId = window.setInterval(refreshMessages, 2500);
    return () => window.clearInterval(intervalId);
  }, [session]);

  const startSession = async () => {
    setLoading(true);
    setError('');
    try {
      setSession(await createConversation('en', patientLanguage));
      setMessages([]);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (event) => {
    event.preventDefault();
    if (!draft.trim() || !session) return;

    setLoading(true);
    setError('');
    try {
      await sendConversationMessage(session.token, 'staff', draft.trim());
      setDraft('');
      setMessages((await getConversationMessages(session.token)).messages);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  };

  const closeSession = async () => {
    if (session) {
      await endConversation(session.token).catch(() => undefined);
    }
    setSession(null);
    setMessages([]);
  };

  const joinUrl = session ? `${window.location.origin}/join/${session.token}` : '';

  return (
    <section className={`rounded-3xl border p-6 md:p-7 shadow-xl ${
      darkMode ? 'bg-slate-900/90 border-white/10 text-white' : 'bg-white/95 border-slate-200 text-slate-900'
    }`}>
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <p className={`text-xs font-bold uppercase tracking-[0.18em] ${darkMode ? 'text-cyan-300' : 'text-cyan-700'}`}>
            Patient connection
          </p>
          <h2 className="text-2xl font-black mt-1">QR conversation</h2>
          <p className={`text-sm mt-2 max-w-xl ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
            Connect the patient&apos;s phone without exposing your staff workspace.
          </p>
        </div>
        <button type="button" onClick={onClose} className={`px-3 py-2 rounded-xl text-sm font-semibold ${darkMode ? 'bg-white/10 hover:bg-white/15' : 'bg-slate-100 hover:bg-slate-200'}`}>
          Close
        </button>
      </div>

      {!session ? (
        <div className="max-w-lg space-y-4">
          <label className="block text-sm font-semibold">
            Patient language
            <select
              value={patientLanguage}
              onChange={(event) => setPatientLanguage(event.target.value)}
              className={`mt-2 w-full p-3 rounded-xl border ${darkMode ? 'bg-slate-950 border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900'}`}
            >
              {languages.map((language) => <option key={language.code} value={language.code}>{language.name}</option>)}
            </select>
          </label>
          <button type="button" onClick={startSession} disabled={loading} className="w-full rounded-xl bg-cyan-700 hover:bg-cyan-800 disabled:opacity-60 text-white font-bold py-3 px-4">
            {loading ? 'Starting secure session...' : 'Create patient QR code'}
          </button>
          {error && <p className="text-sm text-red-500">{error}</p>}
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
          <div className="flex flex-col items-center gap-3">
            <div className="bg-white p-3 rounded-2xl w-fit">
              <QRCodeSVG value={joinUrl} size={190} includeMargin />
            </div>
            <p className={`text-center text-xs ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              Scan with the patient&apos;s phone camera
            </p>
            <span className={`text-xs font-semibold px-3 py-1 rounded-full ${session.patient_joined ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
              {session.patient_joined ? 'Patient connected' : 'Waiting for patient'}
            </span>
            <button type="button" onClick={closeSession} className="text-sm text-red-500 hover:text-red-700 font-semibold">End conversation</button>
          </div>

          <div className="min-w-0">
            <div className={`min-h-48 max-h-72 overflow-y-auto space-y-3 p-4 rounded-2xl ${darkMode ? 'bg-slate-950/70' : 'bg-slate-50'}`}>
              {messages.length === 0 && <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Messages will appear here after the patient joins.</p>}
              {messages.map((message) => (
                <div key={message.id} className={`rounded-xl p-3 ${message.sender === 'staff' ? 'bg-cyan-600 text-white ml-8' : darkMode ? 'bg-white/10 mr-8' : 'bg-white border border-slate-200 mr-8'}`}>
                  <p className="text-[11px] font-bold uppercase opacity-70">{message.sender === 'staff' ? 'You' : 'Patient'}</p>
                  <p className="text-sm mt-1">{message.sender === 'staff' ? message.original_text : message.translated_text}</p>
                </div>
              ))}
            </div>
            <form onSubmit={sendMessage} className="flex gap-2 mt-3">
              <input value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="Type a message for the patient" className={`flex-1 min-w-0 p-3 rounded-xl border ${darkMode ? 'bg-slate-950 border-white/10 text-white placeholder-slate-500' : 'bg-white border-slate-200 text-slate-900'}`} />
              <button type="submit" disabled={loading || !draft.trim()} className="px-4 rounded-xl bg-cyan-700 text-white font-bold disabled:opacity-50">Send</button>
            </form>
            {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
          </div>
        </div>
      )}
    </section>
  );
}

export default ConversationPanel;
