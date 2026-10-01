const API_URL = import.meta.env.DEV
  ? (import.meta.env.VITE_API_URL || 'http://localhost:8000')
  : 'https://translationai-jckw.onrender.com';
const MYMEMORY_URL = 'https://api.mymemory.translated.net/get';

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!response.ok) {
    const detail = await response.json().catch(() => null);
    throw new Error(detail?.detail || 'Conversation request failed');
  }

  return response.json();
}

export const createConversation = (staffLanguage, patientLanguage) => request('/api/conversations', {
  method: 'POST',
  body: JSON.stringify({ staff_language: staffLanguage, patient_language: patientLanguage }),
});

export const joinConversation = (token) => request(`/api/conversations/${token}/join`, {
  method: 'POST',
});

async function translateMessageIfNeeded(message) {
  if (message.translated_text?.trim() !== message.original_text?.trim()
    || message.source_language === message.target_language) {
    return message;
  }

  const response = await fetch(
    `${MYMEMORY_URL}?q=${encodeURIComponent(message.original_text)}&langpair=${encodeURIComponent(`${message.source_language}|${message.target_language}`)}`
  );
  if (!response.ok) return message;

  const data = await response.json();
  const translatedText = data?.responseData?.translatedText?.trim();
  return translatedText && translatedText !== message.original_text.trim()
    ? { ...message, translated_text: translatedText }
    : message;
}

export const getConversationMessages = async (token) => {
  const response = await request(`/api/conversations/${token}/messages`);
  return { messages: await Promise.all(response.messages.map(translateMessageIfNeeded)) };
};

export const sendConversationMessage = (token, sender, text) => request(`/api/conversations/${token}/messages`, {
  method: 'POST',
  body: JSON.stringify({ sender, text }),
}).then(translateMessageIfNeeded);

export const endConversation = (token) => request(`/api/conversations/${token}`, {
  method: 'DELETE',
});
