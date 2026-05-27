# 💊 PharmaLingo - Pharmacy Translation Assistant

Live demo
https://translation-nu-weld.vercel.app/




![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Status](https://img.shields.io/badge/status-Active-brightgreen)

A full-stack AI-powered translation tool designed for pharmacy staff to quickly translate common pharmacy communications into multiple languages with voice support and dark mode.

---

## ✨ Features

### �� Core Features
- ✅ **9 Languages**: Spanish, French, German, Portuguese, Vietnamese, Korean, Chinese (Taiwan), Arabic
- ✅ **Voice Input** 🎤: Speak and automatically transcribe text
- ✅ **Voice Output** 🔊: Listen to translations aloud
- ✅ **Dark Mode** 🌙: Easy on the eyes during long shifts
- ✅ **Translation History**: Last 10 translations saved automatically
- ✅ **Preset Phrases**: 8 common pharmacy phrases for quick access
- ✅ **Copy to Clipboard**: Share translations easily
- ✅ **Responsive Design**: Works on desktop, tablet, and mobile

### 🔒 Professional Features
- ✅ **Medical Accuracy**: Translations tailored for pharmacy use
- ✅ **Error Handling**: User-friendly error messages
- ✅ **Legal Disclaimer**: Important medical disclaimers included
- ✅ **Mock Translation Fallback**: Works without API keys for demo
- ✅ **Ready for Real APIs**: Easy integration with Google Translate, DeepL, etc.

---

## 🏗️ Project Structure

```
PharmaLingo/
├── frontend/                 # React + Tailwind CSS
│   ├── src/
│   │   ├── App.jsx          # Main app component
│   │   ├── App.css          # Tailwind styles
│   │   ├── index.css        # Global styles
│   │   ├── main.jsx         # React entry point
│   │   └── components/
│   │       ├── TranslationForm.jsx      # Main translation interface
│   │       ├── PresetPhrases.jsx        # Common pharmacy phrases
│   │       ├── TranslationHistory.jsx   # Recent translations
│   │       ├── VoiceInput.jsx           # Speech-to-text
│   │       ├── VoiceOutput.jsx          # Text-to-speech
│   │       └── Disclaimer.jsx           # Medical disclaimer
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── index.html
├── backend/                  # FastAPI + Python
│   ├── main.py              # FastAPI server
│   ├── requirements.txt      # Python dependencies
│   └── .env                 # Environment variables
├── README.md
└── .gitignore
```

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** v14+ and npm
- **Python** 3.8+
- **pip** (Python package manager)

### Backend Setup (5 minutes)

```bash
# Navigate to backend
cd backend

# Create virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start the server
python main.py
```

Backend runs on: `http://localhost:8000`  
API Docs: `http://localhost:8000/docs` (interactive Swagger UI)

### Frontend Setup (5 minutes)

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend runs on: `http://localhost:5176`

---

## 📱 How to Use

1. **Open the app** at `http://localhost:5176`
2. **Enter or select text**:
   - Type directly in the text box
   - Click a preset pharmacy phrase
   - Use 🎤 voice input to speak
3. **Choose target language** from dropdown
4. **Click "Translate"** button
5. **View result**:
   - Copy to clipboard 📋
   - Listen with 🔊 voice output
   - Clear and start over

---

## 🔧 API Endpoints

### `POST /api/translate`

Translates text to target language.

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

**Supported Languages:**
- `es` - Spanish
- `fr` - French
- `de` - German
- `pt` - Portuguese
- `vi` - Vietnamese
- `ko` - Korean
- `zh-TW` - Chinese (Taiwan)
- `ar` - Arabic

---

## 🌐 Integrating Real Translation APIs

Currently, PharmaLingo uses **mock translations** for demo purposes. To use real translations:

### Option 1: Google Cloud Translation

```bash
# 1. Set up Google Cloud project
# 2. Get API key from Google Cloud Console
# 3. Add to backend/.env
TRANSLATION_API_KEY=your_google_api_key
```

### Option 2: DeepL API (Recommended for Medical)

```bash
# DeepL has better accuracy for medical terms
TRANSLATION_API_KEY=your_deepl_api_key
```

Then modify `backend/main.py` function `call_real_translation_api()` with your chosen service.

---

## 🎨 Customization

### Change Preset Phrases

Edit `frontend/src/components/PresetPhrases.jsx`:

```jsx
const presetPhrases = [
  "Your custom phrase here",
  "Another custom phrase",
  // ...
];
```

### Add More Languages

1. Add language to `frontend/src/components/TranslationForm.jsx`:
```jsx
{ code: 'it', name: 'Italian' }
```

2. Add translations to `backend/main.py`:
```python
"it": {
  "Do you have any allergies?": "Hai allergies?",
  // ...
}
```

---

## 🚀 Deployment

### Option 1: Vercel + Railway (Easiest)

**Frontend on Vercel:**
```bash
npm install -g vercel
vercel
```

**Backend on Railway:**
- Push to GitHub
- Sign up at [railway.app](https://railway.app)
- Connect repository
- Set environment variables
- Deploy

### Option 2: Docker

```bash
docker-compose up
```

### Option 3: Heroku

```bash
heroku create pharmalingo
git push heroku main
```

---

## 📋 Supported Pharmacy Phrases

The app includes pre-translated pharmacy phrases in 9 languages:

1. "Do you have any allergies?"
2. "How many times a day do you take this medication?"
3. "This medication may cause drowsiness"
4. "Please confirm your date of birth"
5. "Take this medication with food"
6. "Do not take with alcohol"
7. "Keep out of reach of children"
8. "Take one tablet twice daily"

---

## ⚠️ Important Disclaimer

**All translations should always be reviewed by qualified pharmacy staff before use with patients.** This application is not a substitute for:
- Professional medical advice
- Professional translation services
- Direct patient communication
- Language experts

Always verify accuracy and consult with professionals when necessary.

---

## 🛠️ Tech Stack

**Frontend:**
- React 18+
- Tailwind CSS
- Vite
- Web Speech API (browser native)

**Backend:**
- FastAPI
- Python 3.8+
- Uvicorn
- Pydantic

**Storage:**
- localStorage (browser)
- Environment variables (.env)

---

## 📊 Browser Compatibility

| Browser | Voice Support | Dark Mode | Status |
|---------|---------------|-----------|--------|
| Chrome  | ✅ Full       | ✅        | Excellent |
| Firefox | ✅ Full       | ✅        | Good |
| Safari  | ✅ Full       | ✅        | Good |
| Edge    | ✅ Full       | ✅        | Excellent |

**Voice Input/Output** requires modern browser with Web Speech API support.

---

## 🤝 Contributing

Contributions are welcome! Feel free to:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙋 Support

For issues, questions, or suggestions:

1. Open a GitHub Issue
2. Include:
   - Browser/OS info
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots if applicable

---

## 🗺️ Roadmap

### v1.0 (Current)
- ✅ Basic translation
- ✅ Voice input/output
- ✅ Dark mode
- ✅ Translation history
- ✅ 9 languages

### v1.1 (Planned)
- [ ] Real translation API integration
- [ ] User accounts & saved favorites
- [ ] Batch translation (CSV upload)
- [ ] Offline mode
- [ ] More languages
- [ ] Mobile app (React Native)

### v2.0 (Future)
- [ ] Drug interaction warnings
- [ ] Medication database integration
- [ ] Patient instruction cards (PDF generation)
- [ ] Multi-language input
- [ ] Translation quality scoring

---

## 👨‍💻 Author

**Created by**: Farai Bekhan  
**Repository**: https://github.com/Faraibe26/TranslationAI

---

## 🎉 Getting Started Right Now

```bash
# Clone the repo
git clone https://github.com/Faraibe26/TranslationAI.git
cd TranslationAI

# Start backend (Terminal 1)
cd backend && python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python main.py

# Start frontend (Terminal 2)
cd frontend
npm install
npm run dev

# Open http://localhost:5176 in your browser
```

---

**Made with ❤️ for healthcare professionals**
