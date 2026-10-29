import { useEffect, useState } from 'react'
import TextInput from './components/TextInput'
import LanguageSelector from './components/LanguageSelector'
import VoiceSelector from './components/VoiceSelector'
import GenerateButton from './components/GenerateButton'
import AudioPlayer from './components/AudioPlayer'
import DownloadButton from './components/DownloadButton'
import ErrorMessage from './components/ErrorMessage'
import { fetchVoices, generateSpeech, getAudioFullUrl } from './api/ttsApi'

const MAX_CHARS = 3000
const DEFAULT_LANGUAGE = 'en-US'

export default function App() {
  const [text, setText] = useState('')
  const [languages, setLanguages] = useState([])
  const [allVoices, setAllVoices] = useState([])
  const [language, setLanguage] = useState(DEFAULT_LANGUAGE)
  const [voice, setVoice] = useState('')
  const [loadingVoices, setLoadingVoices] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [audioUrl, setAudioUrl] = useState('')

  // Load languages and voices once when the page opens
  useEffect(() => {
    let ignore = false

    async function loadVoices() {
      try {
        const data = await fetchVoices()
        if (ignore) return
        setLanguages(data.languages)
        setAllVoices(data.voices)

        const first = data.voices.filter((v) => v.language === DEFAULT_LANGUAGE)
        const preferred = first.find((v) => v.name === 'en-US-AriaNeural')
        setVoice((preferred || first[0] || {}).name || '')
      } catch (err) {
        if (!ignore) setError(err.message)
      } finally {
        if (!ignore) setLoadingVoices(false)
      }
    }

    loadVoices()
    return () => {
      ignore = true
    }
  }, [])

  const voicesForLanguage = allVoices.filter((v) => v.language === language)

  function handleLanguageChange(newLanguage) {
    setLanguage(newLanguage)
    const list = allVoices.filter((v) => v.language === newLanguage)
    setVoice(list[0]?.name || '')
  }

  async function handleGenerate() {
    setError('')

    if (!text.trim()) {
      setError('Please enter some text.')
      return
    }
    if (text.length > MAX_CHARS) {
      setError(`Text is too long. Maximum ${MAX_CHARS} characters allowed.`)
      return
    }
    if (!voice) {
      setError('Please select a voice.')
      return
    }

    setLoading(true)
    setAudioUrl('')
    try {
      const data = await generateSpeech({ text, language, voice })
      setAudioUrl(getAudioFullUrl(data.audio_url))
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 px-3 py-6 sm:px-4 sm:py-10">
      <div className="mx-auto max-w-2xl space-y-5 rounded-2xl bg-white p-4 shadow sm:p-6">
        <h1 className="text-center text-2xl font-bold text-gray-800">
          Text to Speech
        </h1>

        <ErrorMessage message={error} onClose={() => setError('')} />

        <TextInput text={text} setText={setText} maxChars={MAX_CHARS} />

        <div className="grid gap-4 sm:grid-cols-2">
          <LanguageSelector
            languages={languages}
            value={language}
            onChange={handleLanguageChange}
            disabled={loadingVoices || loading}
          />
          <VoiceSelector
            voices={voicesForLanguage}
            value={voice}
            onChange={setVoice}
            disabled={loadingVoices || loading}
          />
        </div>

        <GenerateButton
          onClick={handleGenerate}
          loading={loading}
          disabled={loadingVoices}
        />

        {audioUrl && (
          <div className="space-y-3 border-t border-gray-200 pt-5">
            <h2 className="font-medium text-gray-700">Generated Audio</h2>
            <AudioPlayer key={audioUrl} src={audioUrl} />
            <DownloadButton audioUrl={audioUrl} onError={setError} />
          </div>
        )}
      </div>
    </div>
  )
}