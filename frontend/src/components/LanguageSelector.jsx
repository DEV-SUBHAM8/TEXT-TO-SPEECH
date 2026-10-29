export default function LanguageSelector({ languages, value, onChange, disabled }) {
  return (
    <div>
      <label htmlFor="language" className="mb-1 block font-medium text-gray-700">
        Language
      </label>
      <select
        id="language"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="w-full rounded-lg border border-gray-300 bg-white p-2 text-gray-800 outline-none focus:ring-2 focus:ring-indigo-300 disabled:bg-gray-100"
      >
        {languages.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.name}
          </option>
        ))}
      </select>
    </div>
  )
}