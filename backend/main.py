"""
Pharmacy Translation Assistant - FastAPI Backend
This backend provides translation services for pharmacy staff
"""
from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import os
import re
from dotenv import load_dotenv
import httpx


# Initialize FastAPI app
app = FastAPI(title="PharmaLingo - Pharmacy Translation API", version="1.0.0")

allowed_origins = [
    origin.strip()
    for origin in os.getenv(
        "CORS_ORIGINS",
        "http://localhost:5173,https://pharmalingo-backend.onrender.com,https://translationai-production.up.railway.app",
    ).split(",")
    if origin.strip()
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_origin_regex=r"^(https://.*\.vercel\.app|http://localhost:\d+)$",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



# Load environment variables from .env file
load_dotenv()


# Enable CORS (Cross-Origin Resource Sharing) for frontend communication

# ============ Pydantic Models ============

class TranslationRequest(BaseModel):
    """Request model for translation endpoint"""
    text: str
    source_language: str = "auto"
    target_language: str

class TranslationResponse(BaseModel):
    """Response model for translation endpoint"""
    translated_text: str
    source_language: str
    target_language: str

# ============ Mock Translation Function ============

MYMEMORY_URL = os.getenv("MYMEMORY_URL", "https://api.mymemory.translated.net/get")


def normalize_language_code(language_code: str) -> str:
    """Normalize UI language codes to translation-service language codes."""
    language_map = {
        "zh-TW": "zh",
        "zh": "zh",
        "en": "en",
        "es": "es",
        "fr": "fr",
        "de": "de",
        "vi": "vi",
        "ko": "ko",
        "ar": "ar",
        "pt": "pt",
        "auto": "auto",
    }
    return language_map.get(language_code, language_code)


def detect_supported_target(text: str) -> str:
    """Guess the source language using scripts, accents, and common words."""
    lower_text = text.lower().strip()
    cleaned_text = re.sub(r"\d+", " ", lower_text)
    tokens = re.findall(r"[\w'áéíóúüñàâçèêëîïôùûäößãõ]+", cleaned_text, flags=re.UNICODE)

    if any("\u0600" <= character <= "\u06ff" for character in lower_text):
        return "ar"
    if any("\u4e00" <= character <= "\u9fff" for character in lower_text):
        return "zh"
    if any("\uac00" <= character <= "\ud7af" for character in lower_text):
        return "ko"
    if any(character in lower_text for character in ["¿", "¡", "ñ", "á", "é", "í", "ó", "ú"]):
        return "es"
    if any(character in lower_text for character in ["à", "â", "ç", "è", "ê", "ë", "î", "ï", "ô", "ù", "û"]):
        return "fr"
    if any(character in lower_text for character in ["ä", "ö", "ß"]):
        return "de"
    if any(character in lower_text for character in ["ã", "õ", "ç", "á", "é", "í", "ó", "ú"]):
        return "pt"

    language_tokens = {
        "es": {
            "el", "la", "los", "las", "de", "del", "que", "y", "en", "no", "por", "para",
            "con", "una", "un", "es", "estoy", "está", "tiene", "tengo", "como", "cuanto",
            "cuántos", "cuántas", "porfavor", "favor", "alergia", "medicamento", "tomar",
        },
        "fr": {
            "le", "la", "les", "des", "de", "du", "que", "et", "est", "pas", "pour",
            "avec", "une", "un", "vous", "avez", "bonjour", "merci", "médicament",
        },
        "de": {
            "der", "die", "das", "und", "nicht", "ist", "ein", "eine", "mit", "sie", "haben",
            "für", "bitte", "medikament", "allergie",
        },
        "pt": {
            "o", "a", "os", "as", "de", "do", "da", "que", "e", "não", "para", "com",
            "uma", "um", "você", "por", "favor", "remédio", "alergia",
        },
        "vi": {
            "ban", "co", "khong", "có", "không", "thuoc", "thuốc", "vui", "lòng", "xin",
        },
        "en": {
            "the", "and", "is", "are", "you", "your", "please", "take", "how", "many", "any",
            "with", "from", "this", "that", "do", "does", "have", "medication", "allergies",
        },
    }

    scores = {language_code: 0 for language_code in language_tokens}
    for token in tokens:
        for language_code, token_set in language_tokens.items():
            if token in token_set:
                scores[language_code] += 1

    best_language = max(scores, key=scores.get)
    if scores[best_language] > 0:
        return best_language

    # Default to English only when the text looks like plain ASCII prose.
    ascii_letters = sum(1 for character in lower_text if character.isascii() and character.isalpha())
    non_ascii_letters = sum(1 for character in lower_text if not character.isascii() and character.isalpha())
    if ascii_letters > non_ascii_letters:
        return "en"

    return "en"


def guess_source_language(text: str) -> str:
    """Guess the source language when the UI leaves it on auto-detect."""
    return detect_supported_target(text)


def candidate_source_languages(text: str, requested_source: str, target_language: str) -> list[str]:
    """Return source-language candidates ordered from most likely to least likely."""
    candidates = []

    if requested_source and requested_source != "auto":
        candidates.append(requested_source)
    else:
        guessed_source = guess_source_language(text)
        if guessed_source != "auto":
            candidates.append(guessed_source)

        for language_code in ["es", "fr", "de", "pt", "vi", "ko", "ar", "zh", "en"]:
            if language_code not in candidates:
                candidates.append(language_code)

    # Prefer the real target if it is not English, but keep English last so
    # auto-detect + English requests still have a chance to succeed first.
    if target_language == "en" and "en" in candidates:
        candidates.remove("en")
        candidates.append("en")

    return candidates


def is_valid_translation(source_text: str, translated_text: str) -> bool:
    """Reject provider error messages and untranslated responses."""
    if not translated_text:
        return False

    cleaned_translation = translated_text.strip()
    cleaned_source = source_text.strip()

    if cleaned_translation == cleaned_source:
        return False

    translated_upper = cleaned_translation.upper()
    blocked_phrases = [
        "PLEASE SELECT TWO DISTINCT LANGUAGES",
        "INVALID SOURCE LANGUAGE",
        "TRANSLATION SERVICE ERROR",
        "TRANSLATION SERVICE RETURNED NO TEXT",
    ]
    if any(blocked_phrase in translated_upper for blocked_phrase in blocked_phrases):
        return False

    if cleaned_translation.startswith("[") and "]" in cleaned_translation[:8]:
        return False

    return True

def mock_translate(text: str, source_language: str, target_language: str) -> str:
    """
    Mock translation function for demo purposes.
    Replace this with a real translation API when you have an API key.
    """
    # Dictionary of predefined translations for common pharmacy phrases
    mock_translations = {
        "es": {
            "Do you have any allergies?": "¿Tiene alguna alergia?",
            "How many times a day do you take this medication?": "¿Cuántas veces al día toma este medicamento?",
            "This medication may cause drowsiness": "Este medicamento puede causar somnolencia",
            "Please confirm your date of birth": "Por favor, confirme su fecha de nacimiento",
            "Take this medication with food": "Tome este medicamento con comida",
            "Do not take with alcohol": "No tomar con alcohol",
            "Keep out of reach of children": "Mantener fuera del alcance de los niños",
            "Take one tablet twice daily": "Tomar una tableta dos veces al día",
        },
        "fr": {
            "Do you have any allergies?": "Avez-vous des allergies?",
            "How many times a day do you take this medication?": "Combien de fois par jour prenez-vous ce médicament?",
            "This medication may cause drowsiness": "Ce médicament peut causer de la somnolence",
            "Please confirm your date of birth": "Veuillez confirmer votre date de naissance",
            "Take this medication with food": "Prenez ce médicament avec de la nourriture",
            "Do not take with alcohol": "Ne pas prendre avec de l'alcool",
            "Keep out of reach of children": "Tenir hors de portée des enfants",
            "Take one tablet twice daily": "Prendre un comprimé deux fois par jour",
        },
        "de": {
            "Do you have any allergies?": "Haben Sie Allergien?",
            "How many times a day do you take this medication?": "Wie oft am Tag nehmen Sie dieses Medikament?",
            "This medication may cause drowsiness": "Dieses Medikament kann Schläfrigkeit verursachen",
            "Please confirm your date of birth": "Bitte bestätigen Sie Ihr Geburtsdatum",
            "Take this medication with food": "Nehmen Sie dieses Medikament mit Essen",
            "Do not take with alcohol": "Nicht mit Alkohol einnehmen",
            "Keep out of reach of children": "Außerhalb der Reichweite von Kindern aufbewahren",
            "Take one tablet twice daily": "Nehmen Sie einmal täglich eine Tablette",
        },
        "pt": {
            "Do you have any allergies?": "Você tem alguma alergia?",
            "How many times a day do you take this medication?": "Quantas vezes por dia você toma este medicamento?",
            "This medication may cause drowsiness": "Este medicamento pode causar sonolência",
            "Please confirm your date of birth": "Por favor, confirme sua data de nascimento",
            "Take this medication with food": "Tome este medicamento com comida",
            "Do not take with alcohol": "Não tome com álcool",
            "Keep out of reach of children": "Mantenha fora do alcance de crianças",
            "Take one tablet twice daily": "Tomar um comprimido duas vezes ao dia",
        },
        "vi": {
            "Do you have any allergies?": "Bạn có dị ứng nào không?",
            "How many times a day do you take this medication?": "Bạn uống thuốc này bao nhiêu lần một ngày?",
            "This medication may cause drowsiness": "Thuốc này có thể gây buồn ngủ",
            "Please confirm your date of birth": "Vui lòng xác nhận ngày sinh của bạn",
            "Take this medication with food": "Hãy uống thuốc này kèm theo thức ăn",
            "Do not take with alcohol": "Không được uống cùng với rượu",
            "Keep out of reach of children": "Giữ ngoài tầm tay của trẻ em",
            "Take one tablet twice daily": "Uống một viên hai lần mỗi ngày",
        },
        "ko": {
            "Do you have any allergies?": "알레르기가 있으신가요?",
            "How many times a day do you take this medication?": "이 약을 하루에 몇 번 복용하나요?",
            "This medication may cause drowsiness": "이 약은 졸음을 유발할 수 있습니다",
            "Please confirm your date of birth": "생년월일을 확인해주세요",
            "Take this medication with food": "이 약을 음식과 함께 복용하세요",
            "Do not take with alcohol": "술과 함께 복용하지 마세요",
            "Keep out of reach of children": "어린이의 손이 닿지 않는 곳에 보관하세요",
            "Take one tablet twice daily": "하루에 두 번 정제 1개를 복용하세요",
        },
        "zh-TW": {
            "Do you have any allergies?": "您有任何過敏症嗎?",
            "How many times a day do you take this medication?": "您一天要吃幾次這個藥?",
            "This medication may cause drowsiness": "此藥物可能會導致嗜睡",
            "Please confirm your date of birth": "請確認您的出生日期",
            "Take this medication with food": "請與食物一起服用此藥物",
            "Do not take with alcohol": "請勿與酒精一起服用",
            "Keep out of reach of children": "請將其存放在兒童無法接觸的地方",
            "Take one tablet twice daily": "每天服用一片兩次",
        },
    }
    
    english_lookup = {}
    for language_code, translations in mock_translations.items():
        for english_text, localized_text in translations.items():
            english_lookup.setdefault(language_code, {})[localized_text] = english_text

    if source_language == target_language:
        return text

    if source_language == "en" and target_language in mock_translations:
        if text in mock_translations[target_language]:
            return mock_translations[target_language][text]

    if target_language == "en" and source_language in english_lookup:
        if text in english_lookup[source_language]:
            return english_lookup[source_language][text]

    if source_language in english_lookup and source_language != "en":
        english_text = english_lookup[source_language].get(text)
        if english_text and target_language in mock_translations:
            if target_language == "en":
                return english_text
            return mock_translations[target_language].get(english_text, text)

    if source_language == "auto":
        guessed_source = detect_supported_target(text)
        if guessed_source == target_language:
            return text
        if guessed_source != "en" and guessed_source in english_lookup:
            english_text = english_lookup[guessed_source].get(text)
            if english_text:
                if target_language == "en":
                    return english_text
                if target_language in mock_translations:
                    return mock_translations[target_language].get(english_text, text)

    
    # Generic fallback for unknown phrases
    if target_language == "en":
        return text
    return text

# ============ API Endpoints ============

@app.get("/")
def read_root():
    """Health check endpoint"""
    return {"message": "Pharmacy Translation API is running", "status": "healthy"}

@app.get("/health")
def health_check():
    """Explicit health check endpoint for Railway"""
    return {"status": "ok", "service": "pharmacy-translation-api"}

@app.post("/api/translate", response_model=TranslationResponse)
async def translate(request: TranslationRequest):
    """
    Main translation endpoint.
    
    Args:
        request: TranslationRequest with text and target_language
    
    Returns:
        TranslationResponse with translated text and metadata
    """
    # Validate input
    if not request.text.strip():
        raise HTTPException(status_code=400, detail="Text cannot be empty")
    
    # Get API key from environment variables
    api_key = os.getenv("TRANSLATION_API_KEY")

    source_language = normalize_language_code(request.source_language)
    target_language = normalize_language_code(request.target_language)

    source_candidates = candidate_source_languages(request.text, source_language, target_language)
    
    try:
        translated = None
        used_source_language = source_language if source_language != "auto" else "auto"

        for candidate_source_language in source_candidates:
            try:
                candidate_translation = await call_real_translation_api(
                    request.text,
                    candidate_source_language,
                    target_language,
                    api_key,
                )
                if is_valid_translation(request.text, candidate_translation):
                    translated = candidate_translation
                    used_source_language = candidate_source_language
                    break
            except Exception as api_error:
                print(
                    f"Translation candidate failed for {candidate_source_language}->{target_language}: {api_error}"
                )

        if translated is None:
            fallback_source = source_candidates[0] if source_candidates else source_language
            print(f"Translation service unavailable, falling back to mock translation for {fallback_source}->{target_language}")
            translated = mock_translate(request.text, fallback_source, target_language)
            used_source_language = fallback_source
        
        # Return translated response
        return TranslationResponse(
            translated_text=translated,
            source_language=used_source_language,
            target_language=target_language
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Translation error: {str(e)}"
        )

async def call_real_translation_api(
    text: str,
    source_language: str,
    target_language: str,
    api_key: str
) -> str:
    """
    Call a real translation API.
    This is a placeholder function - modify based on your chosen service.
    
    Supported services: Google Translate, DeepL, Azure Translator, etc.
    """
    async with httpx.AsyncClient(timeout=20.0) as client:
        langpair = f"{source_language}|{target_language}"
        params = {
            "q": text,
            "langpair": langpair,
        }

        response = await client.get(MYMEMORY_URL, params=params)

        if response.status_code >= 400:
            raise HTTPException(status_code=502, detail=f"Translation service error: {response.text}")

        data = response.json()
        response_data = data.get("responseData", {})
        translated_text = response_data.get("translatedText")
        if not translated_text:
            raise HTTPException(status_code=502, detail="Translation service returned no text")

        return translated_text

if __name__ == "__main__":
    import uvicorn
    import os
    # Get port from environment variable or default to 8000
    port = int(os.getenv("PORT", 8000))
    # Run the server with auto-reload in development
    uvicorn.run(app, host="0.0.0.0", port=port)
