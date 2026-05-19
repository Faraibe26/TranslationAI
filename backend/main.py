"""
Pharmacy Translation Assistant - FastAPI Backend
This backend provides translation services for pharmacy staff
"""
from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import os
from dotenv import load_dotenv
import httpx

# Load environment variables from .env file
load_dotenv()

# Initialize FastAPI app
app = FastAPI(title="PharmaLingo - Pharmacy Translation API", version="1.0.0")


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)






# Enable CORS (Cross-Origin Resource Sharing) for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:5173",
        "127.0.0.1:5173",
        "https://translation-ai-phi.vercel.app",
        "https://*.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ============ Pydantic Models ============

class TranslationRequest(BaseModel):
    """Request model for translation endpoint"""
    text: str
    target_language: str

class TranslationResponse(BaseModel):
    """Response model for translation endpoint"""
    translated_text: str
    source_language: str
    target_language: str

# ============ Mock Translation Function ============

def mock_translate(text: str, target_language: str) -> str:
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
    
    # Check if we have a predefined translation
    if target_language in mock_translations and text in mock_translations[target_language]:
        return mock_translations[target_language][text]
    
    # Generic fallback for unknown phrases
    return f"[{target_language.upper()}] {text}"

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
    
    try:
        if api_key:
            # If API key exists, use real translation API
            translated = await call_real_translation_api(
                request.text, 
                request.target_language, 
                api_key
            )
        else:
            # Fallback to mock translation for demo purposes
            translated = mock_translate(request.text, request.target_language)
        
        # Return translated response
        return TranslationResponse(
            translated_text=translated,
            source_language="en",
            target_language=request.target_language
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Translation error: {str(e)}"
        )

async def call_real_translation_api(
    text: str,
    target_language: str,
    api_key: str
) -> str:
    """
    Call a real translation API.
    This is a placeholder function - modify based on your chosen service.
    
    Supported services: Google Translate, DeepL, Azure Translator, etc.
    """
    # For now, return mock translation to avoid errors
    # In production, implement your chosen translation API here
    return mock_translate(text, target_language)

if __name__ == "__main__":
    import uvicorn
    import os
    # Get port from environment variable or default to 8000
    port = int(os.getenv("PORT", 8000))
    # Run the server with auto-reload in development
    uvicorn.run(app, host="0.0.0.0", port=port)
