# Text-to-Speech Application

A full-stack web app that converts text into speech.
**React + Tailwind CSS** frontend, **Python FastAPI** backend, **edge-tts** as the TTS provider.

## Features
- Text input with character and word count (max 3000 characters)
- 7 languages: English, Hindi, Gujarati, Marathi, Spanish, French, German
- Voice selection (loaded from the backend)
- Generate speech, play, pause, seek and change volume
- Download the audio as MP3
- Error handling: empty text, long text, invalid voice or language, network failure, provider failure, rate limit

## Architecture
React Frontend -> FastAPI Backend -> edge-tts (TTS service) -> MP3 file -> React Audio Player / Download

## Project structure
```
text-to-speech/
  backend/
    main.py
    routers/tts.py
    services/tts_service.py
    schemas/tts_schema.py
    utils/rate_limiter.py
    utils/file_cleanup.py
    generated_audio/
  frontend/
    src/
      api/ttsApi.js
      components/ (TextInput, LanguageSelector, VoiceSelector,
                   GenerateButton, AudioPlayer, DownloadButton, ErrorMessage)
      App.jsx, main.jsx, index.css
  postman/tts-collection.json
  requirements.txt
  .env
```

## Run locally

### Backend
```
cd backend
python -m venv venv
venv\Scripts\Activate.ps1
python -m pip install -r ../requirements.txt
python -m uvicorn main:app --reload
```
API docs: http://127.0.0.1:8000/docs

### Frontend
```
cd frontend
npm install
npm run dev
```
Open http://localhost:5173

## Environment variables

Backend (`.env` in the project root):
```
FRONTEND_URL=http://localhost:5173
MAX_TEXT_LENGTH=3000
AUDIO_DIR=generated_audio
```
Frontend (`frontend/.env`):
```
VITE_API_URL=http://127.0.0.1:8000
```
`.env` files are listed in `.gitignore` and must not be committed.

## API documentation

### GET /api/health
Response 200: `{ "status": "ok" }`

### GET /api/voices
Optional query: `?language=hi-IN`
Response 200: `{ "success": true, "languages": [...], "voices": [...] }`
Errors: 400 unsupported language, 503 provider unavailable.

### POST /api/tts
Request:
```
{ "text": "Welcome to our application.", "language": "en-US", "voice": "en-US-AriaNeural" }
```
Response 200: `{ "success": true, "audio_url": "/audio/<file>.mp3" }`

| Status | Reason |
|---|---|
| 400 | Empty text, text over the limit, unsupported language, voice not valid for the language |
| 422 | Missing or wrong field types |
| 429 | More than 10 requests per minute from one IP |
| 503 | TTS provider failed or unavailable |

## Security
- No API keys in the frontend; configuration lives in environment variables
- Input validated on the backend (text, language, voice)
- Text length limit and rate limiting (10 requests per minute per IP)
- CORS allows only the configured frontend URL
- Generated audio files are deleted after 1 hour

## Testing
Use the Postman collection in `postman/` or the Swagger UI at `/docs`.

## Screenshots
Add screenshots of the app here.

## Deployment
Frontend on Vercel, backend on Render. Deployment URL: (add here)