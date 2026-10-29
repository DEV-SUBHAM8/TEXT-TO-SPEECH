const API_URL = import.meta.env.VITE_API_URL

async function request(path, options) {
  let response
  try {
    response = await fetch(`${API_URL}${path}`, options)
  } catch {
    throw new Error(
      'Cannot connect to the server. Please check that the backend is running and your internet is on.'
    )
  }

  let data = null
  try {
    data = await response.json()
  } catch {
    // response had no JSON body
  }

  if (!response.ok) {
    let message = data?.detail
    if (Array.isArray(message)) {
      message = 'Invalid request. Please check your input.'
    }
    throw new Error(message || `Server error (${response.status})`)
  }

  return data
}

export function fetchVoices() {
  return request('/api/voices')
}

export function generateSpeech({ text, language, voice }) {
  return request('/api/tts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, language, voice }),
  })
}

export function getAudioFullUrl(audioUrl) {
  return `${API_URL}${audioUrl}`
}