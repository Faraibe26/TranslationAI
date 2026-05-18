# 💊 Pharmacy Translation Assistant MVP

A full-stack AI-powered translation tool designed for pharmacy staff to quickly translate common pharmacy communications into multiple languages.

## Features ✨

- ✅ **Clean, Intuitive UI** - Built with React and Tailwind CSS
- ✅ **Real-time Translation** - Fast translation with loading states
- ✅ **Preset Phrases** - 8 common pharmacy phrases for quick access
- ✅ **Voice Input** 🎤 - Speech-to-text for hands-free input
- ✅ **Voice Output** 🔊 - Text-to-speech for translated text in target language
- ✅ **Multi-language Support** - Spanish, French, German, Chinese, Arabic, Portuguese
- ✅ **Copy-to-Clipboard** - Easily share translations
- ✅ **Error Handling** - Comprehensive validation and error messages
- ✅ **Responsive Design** - Works on mobile, tablet, and desktop
- ✅ **Mock Translation Fallback** - Works immediately without API key for demo purposes
- ✅ **Important Disclaimer** - Clear warning about professional review requirements

## Project Structure 📁

```
TranslationAI/
├── frontend/                    # React frontend application
│   ├── src/
│   │   ├── components/          # React components
│   │   │   ├── TranslationForm.jsx    # Main translation interface
│   │   │   ├── PresetPhrases.jsx      # Quick-access phrases
│   │   │   ├── VoiceInput.jsx         # Speech-to-text component
│   │   │   ├── VoiceOutput.jsx        # Text-to-speech component
│   │   │   └── Disclaimer.jsx         # Legal disclaimer
│   │   ├── App.jsx              # Main app component
│   │   ├── App.css              # App styles
│   │   ├── index.css            # Tailwind CSS imports
│   │   └── main.jsx             # React entry point
│   ├── index.html               # HTML template
│   ├── package.json             # Node dependencies
│   ├── vite.config.js           # Vite configuration
│   ├── tailwind.config.js       # Tailwind CSS config
│   └── postcss.config.js        # PostCSS config
│
├── backend/                     # FastAPI server
│   ├── main.py                  # FastAPI application
│   ├── requirements.txt         # Python dependencies
│   └── .env                     # Environment variables
│
└── README.md                    # This file
```

## Quick Start 🚀

### Prerequisites

- **Node.js** v14 or higher ([Download](https://nodejs.org/))
- **Python** v3.8 or higher ([Download](https://www.python.org/))
- **npm** or **yarn** (comes with Node.js)

### Step 1: Clone/Setup Backend

```bash
cd /path/to/TranslationAI/backend

# Create a virtual environment
python3 -m venv venv

# Activate virtual environment
# On macOS/Linux:
source venv/bin/activate
# On Windows:
# venv\Scripts\activate

# Install Python dependencies
pip install -r requirements.txt
```

### Step 2: Start Backend Server

```bash
# From the backend directory
python main.py
```

You should see:
```
INFO:     Uvicorn running on http://0.0.0.0:8000
INFO:     Application startup complete
```

### Step 3: Setup Frontend

In a **new terminal**:

```bash
cd /path/to/TranslationAI/frontend

# Install Node dependencies
npm install

# Start development server
npm run dev
```

The frontend will open automatically at `http://localhost:5173`

### Step 4: Use the App

1. **Voice Input** 🎤 - Click "Start Recording" to speak in English pharmacy language
2. **View Transcript** - Your speech is converted to text and fills the input field
3. **Select Target Language** - Choose from the dropdown (Spanish, French, German, Chinese, Arabic, Portuguese)
4. **Click Translate** - The translation appears below
5. **Voice Output** 🔊 - Click "🔊 Speak Translation" to hear the translation in the target language
6. **Copy** - Click "📋 Copy to Clipboard" to copy the translation
7. **Clear** - Use the Clear button to reset and start over

### Voice Features Support

#### Speech-to-Text (Voice Input)
- Works in modern browsers (Chrome, Firefox, Safari, Edge)
- Supports English input
- Real-time transcription
- Visual feedback while recording

#### Text-to-Speech (Voice Output)
- Converts translated text to speech
- Automatically uses the target language
- Adjustable speech rate for clarity
- Works in all modern browsers

**Browser Support for Voice Features:**
- ✅ Chrome/Edge (best support)
- ✅ Firefox
- ✅ Safari (iOS 14.5+)
- ❌ Internet Explorer (not supported)

## How It Works 🔧

### Frontend Flow with Voice
```
Voice Input (Optional)
    ↓
Speech-to-Text Conversion
    ↓
Text Input (Manual or Voice)
    ↓
Select Language
    ↓
Click Translate
    ↓
API Call to Backend
    ↓
Display Translation
    ↓
Voice Output (Optional)
    ↓
Copy or Translate Again
```

### Backend Flow
```
Receive Translation Request
    ↓
Validate Input
    ↓
Check for API Key
    ├─ If API Key Exists → Call Real Translation API
    └─ If No API Key → Use Mock Translation
    ↓
Return Translated Text
```

## Using with a Real Translation API 🔑

By default, the app uses **mock translations** for demo purposes. To use a real translation service:

### Option 1: Google Cloud Translate

1. Create a [Google Cloud Project](https://cloud.google.com/docs/setup)
2. Enable the Translate API
3. Create a service account and download credentials
4. Set `TRANSLATION_API_KEY` in `backend/.env`
5. Update `call_real_translation_api()` in `backend/main.py`

### Option 2: DeepL API

1. Sign up at [DeepL.com](https://www.deepl.com/docs-api)
2. Get your API key
3. Set `TRANSLATION_API_KEY` in `backend/.env`
4. Update `call_real_translation_api()` in `backend/main.py`

### Option 3: Azure Translator

1. Create an [Azure account](https://azure.microsoft.com/)
2. Set up Azure Translator resource
3. Get your API key and endpoint
4. Set environment variables in `backend/.env`
5. Update `call_real_translation_api()` in `backend/main.py`

Example `.env` setup:
```
TRANSLATION_API_KEY=your_actual_api_key_here
TRANSLATION_SERVICE=google  # or deepl, azure, etc.
```

## Available Preset Phrases 📋

The app includes these common pharmacy phrases:

1. "Do you have any allergies?"
2. "How many times a day do you take this medication?"
3. "This medication may cause drowsiness"
4. "Please confirm your date of birth"
5. "Take this medication with food"
6. "Do not take with alcohol"
7. "Keep out of reach of children"
8. "Take one tablet twice daily"

### Adding More Phrases

Edit `frontend/src/components/PresetPhrases.jsx`:

```jsx
const presetPhrases = [
  "Do you have any allergies?",
  "How many times a day do you take this medication?",
  // Add more phrases here
  "Your new phrase here",
];
```

## Supported Languages 🌍

| Code | Language |
|------|----------|
| es   | Spanish  |
| fr   | French   |
| de   | German   |
| zh   | Chinese  |
| ar   | Arabic   |
| pt   | Portuguese |

Add more languages by updating `frontend/src/components/TranslationForm.jsx`:

```jsx
const languages = [
  { code: 'es', name: 'Spanish' },
  { code: 'it', name: 'Italian' }, // Add new language
  // ...
];
```

## Important Disclaimers ⚠️

This application includes important legal disclaimers:

- ❌ **NOT a substitute** for professional medical translation
- ❌ **NOT a substitute** for professional medical advice
- ✅ **MUST be reviewed** by qualified pharmacy staff before use
- ✅ **Always verify** accuracy with language experts

See the yellow disclaimer box at the bottom of the app.

## API Documentation 📚

### POST /api/translate

**Request:**
```json
{
  "text": "Do you have any allergies?",
  "target_language": "es"
}
```

**Response:**
```json
{
  "translated_text": "¿Tiene alguna alergia?",
  "source_language": "en",
  "target_language": "es"
}
```

**Error Response:**
```json
{
  "detail": "Text cannot be empty"
}
```

### GET /

**Response:**
```json
{
  "message": "Pharmacy Translation API is running",
  "status": "healthy"
}
```

## Troubleshooting 🔍

### Port Already in Use

**Backend (Port 8000):**
```bash
# Find process using port 8000
lsof -i :8000
# Kill the process
kill -9 <PID>
```

**Frontend (Port 5173):**
```bash
# Find process using port 5173
lsof -i :5173
# Kill the process
kill -9 <PID>
```

### CORS Errors

If you see CORS errors in the browser console:
1. Make sure backend is running on `http://localhost:8000`
2. Check that frontend is running on `http://localhost:5173` or `http://localhost:3000`
3. Restart both servers

### Translation API Errors

1. Check that your API key is correctly set in `backend/.env`
2. Verify API key is for the correct translation service
3. Check API quota/billing limits
4. Review API documentation for your chosen service

### Dependencies Issues

```bash
# Frontend
cd frontend
rm -rf node_modules package-lock.json
npm install

# Backend
cd backend
rm -rf venv
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

## Technologies Used 💻

### Frontend
- **React** 18+ - UI framework
- **Tailwind CSS** 3+ - Styling
- **Vite** - Build tool
- **JavaScript ES6+** - Language

### Backend
- **FastAPI** - Web framework
- **Python** 3.8+ - Language
- **Uvicorn** - ASGI server
- **Pydantic** - Data validation
- **httpx** - Async HTTP client

## File Size & Performance 📊

- Frontend bundle: ~50 KB (gzipped)
- Backend: Lightweight FastAPI service
- Response time: <500ms (mock translation)
- No database required
- Serverless ready

## Future Enhancements 🚀

- [ ] Real translation API integration
- [ ] Translation history/favorites
- [ ] Batch file translation
- [ ] User authentication
- [ ] Translation accuracy scoring
- [ ] Custom phrase management
- [ ] Audio pronunciation guides
- [ ] Offline mode support
- [ ] Mobile app (React Native)
- [ ] Dark mode theme

## Contributing 🤝

We welcome contributions! To contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Code Style 📝

- **Frontend**: JavaScript with JSDoc comments
- **Backend**: Python with docstrings
- **Formatting**: Consistent indentation and naming
- **Comments**: Clear, helpful explanations

## License 📄

MIT License - See LICENSE file for details

## Support 💬

For issues, questions, or suggestions:

1. Check the Troubleshooting section above
2. Review the comments in the source code
3. Open an issue on GitHub
4. Contact the development team

## Disclaimer Reminder ⚠️

**This application is designed to assist pharmacy staff with translation tasks.**

- Always have qualified pharmacy staff review translations before patient use
- This is NOT a substitute for professional medical translation services
- This is NOT a substitute for professional medical advice
- Consult language experts to verify accuracy when necessary
- Comply with HIPAA and local healthcare regulations

---

**Built with ❤️ for pharmacy professionals**

Last Updated: May 2026
Version: 1.0.0
