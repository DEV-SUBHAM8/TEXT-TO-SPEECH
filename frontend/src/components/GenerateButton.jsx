export default function GenerateButton({ onClick, loading, disabled }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || loading}
      className="w-full rounded-lg bg-indigo-600 px-4 py-3 font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-indigo-300"
    >
      {loading ? 'Generating...' : 'Generate Speech'}
    </button>
  )
}