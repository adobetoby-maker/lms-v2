import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@/lib/supabase/server'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

type Mode = 'title' | 'description' | 'question'

const PROMPTS: Record<Mode, (input: string) => string> = {
  title: (t) =>
    `Improve this course title to be clear, engaging, and professional. Return ONLY the improved title, nothing else.\n\nTitle: ${t}`,
  description: (d) =>
    `Improve this course description to be clear, compelling, and professional. Use 2-3 concise sentences. Return ONLY the improved description, nothing else.\n\nDescription: ${d}`,
  question: (q) =>
    `You are improving a multiple choice quiz question for a professional training course. Clean up the question text and all 4 answer options to be clear, concise, and grammatically correct. Fix any typos or awkward phrasing. Keep the same meaning and correct answer.\n\nReturn ONLY a JSON object in this exact format with no extra text:\n{"question":"...", "optionA":"...", "optionB":"...", "optionC":"...", "optionD":"..."}\n\nInput:\n${q}`,
}

export async function POST(req: NextRequest) {
  // Require admin auth
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: profile } = await supabase.from('profiles').select('is_admin').eq('id', user.id).single()
  if (!profile?.is_admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { mode, content } = await req.json() as { mode: Mode; content: string }

  if (!mode || !content?.trim()) {
    return NextResponse.json({ error: 'mode and content are required' }, { status: 400 })
  }

  const prompt = PROMPTS[mode]
  if (!prompt) return NextResponse.json({ error: 'Invalid mode' }, { status: 400 })

  const message = await client.messages.create({
    model: 'claude-haiku-4-5',   // cheapest — ~1/10 Sonnet cost
    max_tokens: 512,
    messages: [{ role: 'user', content: prompt(content.trim()) }],
  })

  const text = (message.content[0] as { text: string }).text.trim()

  if (mode === 'question') {
    try {
      // Strip markdown code fences if present
      const cleaned = text.replace(/```json\n?|\n?```/g, '').trim()
      const parsed = JSON.parse(cleaned)
      return NextResponse.json({ result: parsed })
    } catch {
      return NextResponse.json({ error: 'AI returned invalid JSON', raw: text }, { status: 500 })
    }
  }

  return NextResponse.json({ result: text })
}
