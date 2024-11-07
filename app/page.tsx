'use client'

import { useState } from 'react'
import VideoInput from './components/VideoInput'
import SummaryDisplay from './components/SummaryDisplay'
import LoadingState from './components/LoadingState'
import VideoPlayer from './components/VideoPlayer'

export default function Home() {
  const [summary, setSummary] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [videoId, setVideoId] = useState<string>('')

  const handleSummarize = async (url: string) => {
    try {
      setLoading(true)
      
      // Extract video ID
      const videoId = new URL(url).searchParams.get('v')
      if (!videoId) throw new Error('Invalid YouTube URL')
      setVideoId(videoId)
      
      // Step 1: Download audio
      const downloadRes = await fetch('/api/download', {
        method: 'POST',
        body: JSON.stringify({ url })
      })
      const { audioPath } = await downloadRes.json()

      // Step 2: Transcribe
      const transcribeRes = await fetch('/api/transcribe', {
        method: 'POST',
        body: JSON.stringify({ audioPath })
      })
      const { transcript } = await transcribeRes.json()

      // Step 3: Summarize
      const summarizeRes = await fetch('/api/summarize', {
        method: 'POST',
        body: JSON.stringify({ transcript })
      })
      const { summary } = await summarizeRes.json()

      setSummary(summary)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-900 to-purple-950 text-white p-8">
      <div className="max-w-4xl mx-auto space-y-12">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-purple-400 rounded-lg" />
          <h1 className="text-2xl font-bold">1 Minute Summarizer</h1>
        </div>

        <div className="space-y-4">
          <h2 className="text-6xl font-bold">Transform long videos into</h2>
          <h2 className="text-6xl font-bold">
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 text-transparent bg-clip-text">
              1-minute summaries
            </span>
          </h2>
        </div>

        <VideoInput onSubmit={handleSummarize} disabled={loading} />

        <div className="p-8 bg-purple-800/30 rounded-2xl backdrop-blur-sm border border-purple-700/50">
          <h3 className="text-3xl font-extrabold bg-gradient-to-r from-blue-400 to-purple-400 text-transparent bg-clip-text mb-8">
            Video Summary
          </h3>
          {loading ? (
            <LoadingState />
          ) : summary ? (
            <>
              <SummaryDisplay summary={summary} />
              {videoId && <VideoPlayer videoId={videoId} />}
            </>
          ) : (
            <p className="text-purple-300 italic">Your video summary will appear here...</p>
          )}
        </div>
      </div>
    </main>
  )
}