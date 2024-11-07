'use client'

interface VideoInputProps {
  onSubmit: (url: string) => void;
  disabled: boolean;
}

export default function VideoInput({ onSubmit, disabled }: VideoInputProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const url = formData.get('url') as string
    onSubmit(url)
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-4">
      <input
        type="text"
        name="url"
        placeholder="Paste your YouTube URL here"
        className="flex-1 px-6 py-4 rounded-xl bg-purple-800/30 text-white placeholder-purple-300 border border-purple-700 focus:outline-none focus:border-purple-500"
        disabled={disabled}
      />
      <button 
        type="submit" 
        disabled={disabled}
        className="px-8 py-4 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 font-semibold hover:opacity-90 disabled:opacity-50 transition-opacity"
      >
        Summarize Video
      </button>
    </form>
  )
}
