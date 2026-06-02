"""Translation logic for PharmaLingo.

The backend owns the translation flow:
- normalize the language codes sent by the UI
- try the configured translation provider
- fall back to the built-in pharmacy phrase dictionary when needed
"""

from __future__ import annotations

import re

import httpx

from ..core.config import Settings


def normalize_language_code(language_code: str) -> str:
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

    ascii_letters = sum(1 for character in lower_text if character.isascii() and character.isalpha())
    non_ascii_letters = sum(1 for character in lower_text if not character.isascii() and character.isalpha())
    if ascii_letters > non_ascii_letters:
        return "en"

    return "en"


def guess_source_language(text: str) -> str:
    return detect_supported_target(text)


def candidate_source_languages(text: str, requested_source: str, target_language: str) -> list[str]:
    candidates: list[str] = []

    if requested_source and requested_source != "auto":
        candidates.append(requested_source)
    else:
        guessed_source = guess_source_language(text)
        if guessed_source != "auto":
            candidates.append(guessed_source)

        for language_code in ["es", "fr", "de", "pt", "vi", "ko", "ar", "zh", "en"]:
            if language_code not in candidates:
                candidates.append(language_code)

    if target_language == "en" and "en" in candidates:
        candidates.remove("en")
        candidates.append("en")

    return candidates


def is_valid_translation(source_text: str, translated_text: str) -> bool:
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


MOCK_TRANSLATIONS = {
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


def mock_translate(text: str, source_language: str, target_language: str) -> str:
    english_lookup: dict[str, dict[str, str]] = {}
    for language_code, translations in MOCK_TRANSLATIONS.items():
        for english_text, localized_text in translations.items():
            english_lookup.setdefault(language_code, {})[localized_text] = english_text

    if source_language == target_language:
        return text

    if source_language == "en" and target_language in MOCK_TRANSLATIONS:
        if text in MOCK_TRANSLATIONS[target_language]:
            return MOCK_TRANSLATIONS[target_language][text]

    if target_language == "en" and source_language in english_lookup:
        if text in english_lookup[source_language]:
            return english_lookup[source_language][text]

    if source_language in english_lookup and source_language != "en":
        english_text = english_lookup[source_language].get(text)
        if english_text and target_language in MOCK_TRANSLATIONS:
            if target_language == "en":
                return english_text
            return MOCK_TRANSLATIONS[target_language].get(english_text, text)

    if source_language == "auto":
        guessed_source = detect_supported_target(text)
        if guessed_source == target_language:
            return text
        if guessed_source != "en" and guessed_source in english_lookup:
            english_text = english_lookup[guessed_source].get(text)
            if english_text:
                if target_language == "en":
                    return english_text
                if target_language in MOCK_TRANSLATIONS:
                    return MOCK_TRANSLATIONS[target_language].get(english_text, text)

    if target_language == "en":
        return text
    return text


async def call_real_translation_api(
    text: str,
    source_language: str,
    target_language: str,
    settings: Settings,
) -> str:
    async with httpx.AsyncClient(timeout=20.0) as client:
        langpair = f"{source_language}|{target_language}"
        params = {
            "q": text,
            "langpair": langpair,
        }
        if settings.translation_api_key:
            params["key"] = settings.translation_api_key

        response = await client.get(settings.translation_api_url, params=params)

        if response.status_code >= 400:
            raise RuntimeError(f"Translation service error: {response.text}")

        data = response.json()
        response_data = data.get("responseData", {})
        translated_text = response_data.get("translatedText")
        if not translated_text:
            raise RuntimeError("Translation service returned no text")

        return translated_text


async def translate_text(
    text: str,
    source_language: str,
    target_language: str,
    settings: Settings,
) -> tuple[str, str]:
    normalized_source = normalize_language_code(source_language)
    normalized_target = normalize_language_code(target_language)
    source_candidates = candidate_source_languages(text, normalized_source, normalized_target)

    translated_text: str | None = None
    used_source_language = normalized_source if normalized_source != "auto" else "auto"

    for candidate_source_language in source_candidates:
        try:
            candidate_translation = await call_real_translation_api(
                text,
                candidate_source_language,
                normalized_target,
                settings,
            )
            if is_valid_translation(text, candidate_translation):
                translated_text = candidate_translation
                used_source_language = candidate_source_language
                break
        except Exception:
            continue

    if translated_text is None:
        fallback_source = source_candidates[0] if source_candidates else normalized_source
        translated_text = mock_translate(text, fallback_source, normalized_target)
        used_source_language = fallback_source

    return translated_text, used_source_language
