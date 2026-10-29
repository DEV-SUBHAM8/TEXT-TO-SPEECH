function voiceLabel(voice) {
  const shortName = voice.name
    .replace(/^[a-z]{2,3}-[A-Z]{2}-/, '')
    .replace('Neural', '')
  return `${shortName} (${voice.gender})`
}

export default function VoiceSelector({ voices, value, onChange, disabled }) {
  return (
    <div>
      <label htmlFor="voice" className="mb-1 block font-medium text-gray-700">
        Voice
      </label>
      <select
        id="voice"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="w-full rounded-lg border border-gray-300 bg-white p-2 text-gray-800 outline-none focus:ring-2 focus:ring-indigo-300 disabled:bg-gray-100"
      >
        {voices.length === 0 && <option value="">No voices available</option>}
        {voices.map((voice) => (
          <option key={voice.name} value={voice.name}>
            {voiceLabel(voice)}
          </option>
        ))}
      </select>
    </div>
  )
}