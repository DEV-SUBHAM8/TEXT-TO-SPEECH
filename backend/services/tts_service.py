import os
import uuid

import edge_tts

# Languages shown in the app: code -> display name
SUPPORTED_LANGUAGES = {
    "en-US": "English",
    "hi-IN": "Hindi",
    "gu-IN": "Gujarati",
    "mr-IN": "Marathi",
    "es-ES": "Spanish",
    "fr-FR": "French",
    "de-DE": "German",
}

_voices_cache = None


class TTSServiceError(Exception):
    """Raised when the TTS provider fails."""


def get_audio_dir() -> str:
    """Absolute path of the folder where generated audio is stored."""
    backend_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    audio_dir = os.path.join(backend_dir, os.getenv("AUDIO_DIR", "generated_audio"))
    os.makedirs(audio_dir, exist_ok=True)
    return audio_dir


async def get_voices():
    """Fetch voices from the provider (cached after the first call)."""
    global _voices_cache
    if _voices_cache is not None:
        return _voices_cache

    try:
        raw_voices = await edge_tts.list_voices()
    except Exception as exc:
        raise TTSServiceError("Could not fetch voices from TTS provider") from exc

    voices = []
    for v in raw_voices:
        locale = v.get("Locale")
        if locale in SUPPORTED_LANGUAGES:
            voices.append(
                {
                    "name": v["ShortName"],
                    "gender": v.get("Gender"),
                    "language": locale,
                }
            )

    _voices_cache = voices
    return voices


async def generate_speech(text: str, voice: str) -> str:
    """Generate an mp3 file and return its file name."""
    filename = f"{uuid.uuid4().hex}.mp3"
    path = os.path.join(get_audio_dir(), filename)

    try:
        communicate = edge_tts.Communicate(text, voice)
        await communicate.save(path)
    except Exception as exc:
        if os.path.exists(path):
            os.remove(path)
        raise TTSServiceError("Text-to-Speech service failed") from exc

    return filename