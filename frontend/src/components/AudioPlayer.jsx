import { useRef, useState } from 'react'

function formatTime(seconds) {
  if (!Number.isFinite(seconds)) return '0:00'
  const minutes = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60).toString().padStart(2, '0')
  return `${minutes}:${secs}`
}

export default function AudioPlayer({ src }) {
  const audioRef = useRef(null)
  const [playing, setPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)

  const safeDuration = Number.isFinite(duration) ? duration : 0

  function togglePlay() {
    const audio = audioRef.current
    if (!audio) return
    if (audio.paused) {
      audio.play().catch(() => setPlaying(false))
    } else {
      audio.pause()
    }
  }

  function handleSeek(e) {
    const time = Number(e.target.value)
    audioRef.current.currentTime = time
    setCurrentTime(time)
  }

  function handleVolume(e) {
    const value = Number(e.target.value)
    audioRef.current.volume = value
    setVolume(value)
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
      <audio
        ref={audioRef}
        src={src}
        preload="metadata"
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => setPlaying(false)}
      />

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={togglePlay}
          className="w-20 rounded-lg bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
        >
          {playing ? 'Pause' : 'Play'}
        </button>

        <span className="w-10 text-right text-xs text-gray-600">
          {formatTime(currentTime)}
        </span>

        <input
          type="range"
          min="0"
          max={safeDuration}
          step="0.1"
          value={Math.min(currentTime, safeDuration)}
          onChange={handleSeek}
          aria-label="Seek"
          className="min-w-0 flex-1 accent-indigo-600"
        />

        <span className="w-10 text-xs text-gray-600">
          {formatTime(safeDuration)}
        </span>
      </div>

      <div className="mt-3 flex items-center gap-3">
        <span className="w-20 text-sm text-gray-600">Volume</span>
        <input
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={volume}
          onChange={handleVolume}
          aria-label="Volume"
          className="w-full max-w-48 accent-indigo-600"
        />
      </div>
    </div>
  )
}