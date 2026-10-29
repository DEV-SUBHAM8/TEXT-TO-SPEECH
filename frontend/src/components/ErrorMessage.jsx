export default function ErrorMessage({ message, onClose }) {
  if (!message) return null

  return (
    <div
      role="alert"
      className="flex items-start justify-between gap-3 rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-700"
    >
      <span>{message}</span>
      <button
        type="button"
        onClick={onClose}
        aria-label="Close error message"
        className="font-bold text-red-700 hover:text-red-900"
      >
        x
      </button>
    </div>
  )
}