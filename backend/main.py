import os

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

load_dotenv(os.path.join(os.path.dirname(__file__), "..", ".env"))

from routers import tts  # noqa: E402
from services.tts_service import get_audio_dir  # noqa: E402

app = FastAPI(title="Text-to-Speech API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[os.getenv("FRONTEND_URL", "http://localhost:5173")],
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

app.include_router(tts.router)

# Serves generated audio files at /audio/<file>.mp3
app.mount("/audio", StaticFiles(directory=get_audio_dir()), name="audio")


@app.get("/api/health")
def health():
    return {"status": "ok"}