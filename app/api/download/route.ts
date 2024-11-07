import { NextResponse } from 'next/server'
import { exec } from 'child_process'
import { promisify } from 'util'
import fs from 'fs/promises'
import { supabase } from '@/app/utils/supabase'
import os from 'os'
import path from 'path'

const execAsync = promisify(exec)

export async function POST(request: Request) {
  try {
    const { url } = await request.json()
    
    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 })
    }

    // Extract video ID from URL
    const videoId = new URL(url).searchParams.get('v')
    if (!videoId) {
      return NextResponse.json({ error: 'Invalid YouTube URL' }, { status: 400 })
    }

    // Use OS temp directory
    const tempDir = os.tmpdir()
    const outputPath = path.join(tempDir, `${videoId}.mp3`)
    console.log('Output path:', outputPath)

    try {
      // Download and convert to mp3 using yt-dlp
      const { stdout, stderr } = await execAsync(`yt-dlp -x --audio-format mp3 -o "${outputPath}" "${url}"`)
      console.log('yt-dlp stdout:', stdout)
      if (stderr) console.error('yt-dlp stderr:', stderr)
    } catch (dlError) {
      console.error('yt-dlp error:', dlError)
      throw new Error('Failed to download video: ' + dlError.message)
    }

    // Verify file exists
    try {
      await fs.access(outputPath)
    } catch (accessError) {
      console.error('File access error:', accessError)
      throw new Error('Downloaded file not found')
    }

    // Read the audio file
    const audioFile = await fs.readFile(outputPath)
    console.log('File size:', audioFile.length)

    // Upload to Supabase
    const fileName = `${videoId}.mp3`
    const { error } = await supabase
      .storage
      .from('youtube-audio')
      .upload(fileName, audioFile, {
        contentType: 'audio/mp3',
        upsert: true
      })

    if (error) {
      console.error('Supabase upload error:', error)
      throw error
    }

    // Clean up
    await fs.unlink(outputPath)

    return NextResponse.json({ 
      audioPath: fileName,
      publicUrl: supabase.storage.from('youtube-audio').getPublicUrl(fileName).data.publicUrl
    })

  } catch (error: unknown) {
    console.error('Download error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Failed to download video'
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}
