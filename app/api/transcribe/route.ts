import { NextResponse } from 'next/server'
import OpenAI from 'openai'
import { supabase } from '@/app/utils/supabase'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export async function POST(request: Request) {
  try {
    const { audioPath } = await request.json()
    
    // Get the audio file from Supabase
    const { data: audioData, error: downloadError } = await supabase
      .storage
      .from('youtube-audio')
      .download(audioPath)
    
    if (downloadError) {
      throw downloadError
    }

    // Convert the audio data to a Buffer
    const audioBuffer = Buffer.from(await audioData.arrayBuffer())

    // Create a Blob from the buffer
    const audioBlob = new Blob([audioBuffer], { type: 'audio/mp3' })

    // Create a File object from the Blob
    const audioFile = new File([audioBlob], audioPath, { type: 'audio/mp3' })

    // Transcribe with Whisper
    const transcription = await openai.audio.transcriptions.create({
      file: audioFile,
      model: 'whisper-1',
      response_format: 'text'
    })

    // Post-process with GPT-4
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant that improves transcription accuracy and readability. Add proper punctuation and formatting while maintaining the original meaning.'
        },
        {
          role: 'user',
          content: transcription
        }
      ]
    })

    const improvedTranscript = completion.choices[0].message.content

    return NextResponse.json({ transcript: improvedTranscript })
  } catch (error) {
    console.error('Transcribe error:', error)
    return NextResponse.json(
      { error: 'Failed to transcribe audio' },
      { status: 500 }
    )
  }
}
