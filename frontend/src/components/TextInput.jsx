export default function TextInput({ text, setText, maxChars }) {
  const charCount = text.length
  const trimmed = text.trim()
  const wordCount = trimmed ? trimmed.split(/\s+/).length : 0
  const overLimit = charCount > maxChars

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label htmlFor="tts-text" className="font-medium text-gray-700">
          Enter your text
        </label>
        <button
          type="button"
          onClick={() => setText('')}
          disabled={!text}
          className="text-sm text-indigo-600 hover:underline disabled:text-gray-400 disabled:no-underline"
        >
          Clear
        </button>
      </div>

      <textarea
        id="tts-text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={8}
        placeholder="Type or paste your text here..."
        className={`w-full rounded-lg border p-3 text-gray-800 outline-none focus:ring-2 ${
          overLimit
            ? 'border-red-500 focus:ring-red-300'
            : 'border-gray-300 focus:ring-indigo-300'
        }`}
      />

      <div className="mt-2 flex flex-wrap justify-between gap-2 text-sm">
        <span className={overLimit ? 'text-red-600 font-medium' : 'text-gray-500'}>
          Characters: {charCount} / {maxChars}
        </span>
        <span className="text-gray-500">Words: {wordCount}</span>
      </div>

      {overLimit && (
        <p className="mt-1 text-sm text-red-600">
          Text is too long. Please remove {charCount - maxChars} characters.
        </p>
      )}
    </div>
  )
}