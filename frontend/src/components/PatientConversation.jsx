import React, { useEffect, useState } from 'react';
import {
  getConversationMessages,
  joinConversation,
  sendConversationMessage,
} from '../services/conversationApi';

function PatientConversation({ token }) {
  const [session, setSession] = useState(null);
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const join = async () => {
      try {
        setSession(await joinConversation(token));
      } catch (requestError) {
        setError(requestError.message);
      } finally {
        setLoading(false);
      }
    };
    join();
  }, [token]);

  useEffect(() => {
    if (!session) return undefined;
    const refreshMessages = async () => {
      try {
        setMessages((await getConversationMessages(token)).messages);
      } catch (requestError) {
        setError(requestError.message);
      }
    };
    refreshMessages();
    const intervalId = window.setInterval(refreshMessages, 2500);
    return () => window.clearInterval(intervalId);
  }, [session, token]);

  const sendMessage = async (event) => {
    event.preventDefault();
    if (!draft.trim()) return;
    setLoading(true);
    try {
      await sendConversationMessage(token, 'patient', draft.trim());
      setDraft('');
      setMessages((await getConversationMessages(token)).messages);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !session) {
    return <main className="min-h-screen grid place-items-center bg-slate-50 p-6"><p className="text-slate-600">Joining conversation...</p></main>;
  }

  if (error && !session) {
    return <main className="min-h-screen grid place-items-center bg-slate-50 p-6"><div className="max-w-md text-center"><h1 className="text-2xl font-black text-slate-900">Conversation unavailable</h1><p className="text-slate-600 mt-2">{error}</p></div></main>;
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 p-5 sm:p-8">
      <div className="max-w-xl mx-auto">
        <header className="mb-6">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-700">PharmaLingo</p>
          <h1 className="text-3xl font-black mt-2">Your pharmacy conversation</h1>
          <p className="text-slate-600 mt-2">Messages are translated for you and the pharmacy staff.</p>
        </header>

        <section className="bg-white border border-slate-200 rounded-3xl p-4 shadow-sm min-h-80 space-y-3">
          {messages.length === 0 && <p className="text-sm text-slate-500 p-2">The pharmacy staff will send a message here.</p>}
          {messages.map((message) => (
            <div key={message.id} className={`rounded-2xl p-4 ${message.sender === 'patient' ? 'bg-cyan-700 text-white ml-8' : 'bg-slate-100 mr-8'}`}>
              <p className="text-[11px] font-bold uppercase opacity-70">{message.sender === 'patient' ? 'You' : 'Pharmacy'}</p>
              <p className="mt-1 leading-relaxed">{message.sender === 'patient' ? message.original_text : message.translated_text}</p>
            </div>
          ))}
        </section>

        <form onSubmit={sendMessage} className="mt-4 space-y-3">
          <textarea value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="Type your response" rows="4" className="w-full p-4 rounded-2xl border border-slate-200 bg-white text-slate-900 resize-none focus:ring-2 focus:ring-cyan-600 focus:border-transparent" />
          <button type="submit" disabled={loading || !draft.trim()} className="w-full rounded-2xl bg-cyan-700 hover:bg-cyan-800 text-white font-bold py-3 disabled:opacity-50">Send message</button>
        </form>
        {error && <p className="text-sm text-red-600 mt-3">{error}</p>}
        <p className="text-xs text-slate-500 mt-6">Do not share sensitive personal or medical information in this conversation.</p>
      </div>
    </main>
  );
}

export default PatientConversation;
