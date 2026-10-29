import os
from typing import Optional

from fastapi import APIRouter, HTTPException, Request

from schemas.tts_schema import TTSRequest
from services.tts_service import (
    SUPPORTED_LANGUAGES,
    TTSServiceError,
    generate_speech,
    get_audio_dir,
    get_voices,
)
from utils.file_cleanup import delete_old_files
from utils.rate_limiter import check_rate_limit

router = APIRouter(prefix="/api", tags=["tts"])


@router.get("/voices")
async def list_voices(language: Optional[str] = None):
    if language and language not in SUPPORTED_LANGUAGES:
        raise HTTPException(status_code=400, detail="Unsupported language")

    try:
        voices = await get_voices()
    except TTSServiceError as exc:
        raise HTTPException(status_code=503, detail=str(exc))

    if language:
        voices = [v for v in voices if v["language"] == language]

    languages = [
        {"code": code, "name": name} for code, name in SUPPORTED_LANGUAGES.items()
    ]
    return {"success": True, "languages": languages, "voices": voices}


@router.post("/tts")
async def create_speech(payload: TTSRequest, request: Request):
    # 1. Rate limit (429)
    check_rate_limit(request)

    # 2. Validate text (400)
    text = payload.text.strip()
    if not text:
        raise HTTPException(status_code=400, detail="Text must not be empty")

    max_length = int(os.getenv("MAX_TEXT_LENGTH", "3000"))
    if len(text) > max_length:
        raise HTTPException(
            status_code=400,
            detail=f"Text is too long. Maximum {max_length} characters allowed",
        )

    # 3. Validate language (400)
    if payload.language not in SUPPORTED_LANGUAGES:
        raise HTTPException(status_code=400, detail="Unsupported language")

    # 4. Validate voice belongs to the selected language (400)
    try:
        voices = await get_voices()
    except TTSServiceError as exc:
        raise HTTPException(status_code=503, detail=str(exc))

    voice_ok = any(
        v["name"] == payload.voice and v["language"] == payload.language
        for v in voices
    )
    if not voice_ok:
        raise HTTPException(
            status_code=400, detail="Invalid voice for the selected language"
        )

    # 5. Remove old audio, then generate new audio (503 if provider fails)
    delete_old_files(get_audio_dir())

    try:
        filename = await generate_speech(text, payload.voice)
    except TTSServiceError as exc:
        raise HTTPException(status_code=503, detail=str(exc))

    return {"success": True, "audio_url": f"/audio/{filename}"}