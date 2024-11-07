import { NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

const SUMMARY_SYSTEM_PROMPT = `Your Task: Create a comprehensive video summary.

Who this is for: People who want a quick, digestible overview to decide if the content is worth watching in full.

Please follow this structured format:

## Overview
Three key points:
• Who is speaking and the context
• Main topics or themes discussed
• Content quality assessment

## Key Points
Write a concise 4-5 sentence summary of the main discussion points.

## Core Takeaways
List five essential insights in bullet points.

## Notable Quotes
Include the most impactful or memorable quotes.

## Deep Dive
Three detailed paragraphs expanding on the major topics discussed.

Important Guidelines:
1. Keep content concise and impactful
2. Stay neutral and factual
3. Do not invent or infer information
4. Avoid duplicating points across sections
5. Match the content's tone`

export async function POST(request: Request) {
  try {
    const { transcript } = await request.json()
    
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: SUMMARY_SYSTEM_PROMPT + '\n\nFormat your response using markdown with proper headings (##), bullet points (*), and blockquotes (>) for notable quotes. Use horizontal rules (---) between sections.'
        },
        {
          role: 'user',
          content: transcript
        }
      ],
      temperature: 0.7,
      max_tokens: 1500
    })

    return NextResponse.json({ summary: completion.choices[0].message.content })
  } catch (error) {
    console.error('Summarize error:', error)
    return NextResponse.json(
      { error: 'Failed to generate summary' },
      { status: 500 }
    )
  }
}
