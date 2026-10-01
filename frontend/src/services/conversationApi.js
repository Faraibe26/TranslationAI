const API_URL = import.meta.env.VITE_API_URL || 'https://translationai-jckw.onrender.com';

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

export const getConversationMessages = (token) => request(`/api/conversations/${token}/messages`);

export const sendConversationMessage = (token, sender, text) => request(`/api/conversations/${token}/messages`, {
  method: 'POST',
  body: JSON.stringify({ sender, text }),
});

export const endConversation = (token) => request(`/api/conversations/${token}`, {
  method: 'DELETE',
});
