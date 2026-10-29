import { useState } from 'react'

export default function DownloadButton({ audioUrl, onError }) {
  const [downloading, setDownloading] = useState(false)

  async function handleDownload() {
    setDownloading(true)
    try {
      const response = await fetch(audioUrl)
      if (!response.ok) {
        throw new Error(
          'The audio file is no longer available. Please generate it again.'
        )
      }
      const blob = await response.blob()
      const objectUrl = URL.createObjectURL(blob)

      const link = document.createElement('a')
      link.href = objectUrl
      link.download = 'speech.mp3'
      document.body.appendChild(link)
      link.click()
      link.remove()
      URL.revokeObjectURL(objectUrl)
    } catch (err) {
      if (err instanceof TypeError) {
        onError('Cannot connect to the server. Download failed.')
      } else {
        onError(err.message)
      }
    } finally {
      setDownloading(false)
    }
  }

  return (
    <button
      type="button"
      onClick={handleDownload}
      disabled={downloading}
      className="w-full rounded-lg border border-indigo-600 px-4 py-3 font-semibold text-indigo-600 transition hover:bg-indigo-50 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {downloading ? 'Downloading...' : 'Download Audio'}
    </button>
  )
}