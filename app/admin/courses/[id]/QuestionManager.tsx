'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { HelpCircle, Trash2, PlusCircle, Loader2, CheckCircle, Lock, Unlock, Sparkles, Users } from 'lucide-react'

interface Question {
  id: number
  text: string
  option_a: string
  option_b: string
  option_c: string
  option_d: string
  correct_answer: string
}

interface Props {
  courseId: number
  questions: Question[]
  requireFullVideoWatch: boolean
}

type OptionKey = 'A' | 'B' | 'C' | 'D'
const OPTIONS: OptionKey[] = ['A', 'B', 'C', 'D']

export default function QuestionManager({ courseId, questions, requireFullVideoWatch }: Props) {
  const router = useRouter()

  // Video-gate toggle
  const [videoGate, setVideoGate] = useState(requireFullVideoWatch)
  const [togglingGate, setTogglingGate] = useState(false)

  // Question form
  const [showForm, setShowForm] = useState(false)
  const [text, setText] = useState('')
  const [options, setOptions] = useState<Record<OptionKey, string>>({
    A: '', B: '', C: '', D: '',
  })
  const [correctAnswer, setCorrectAnswer] = useState<OptionKey>('A')
  const [loading, setLoading] = useState(false)
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [aiLoading, setAiLoading] = useState<number | null>(null)  // question id being improved

  function resetForm() {
    setText('')
    setOptions({ A: '', B: '', C: '', D: '' })
    setCorrectAnswer('A')
    setError(null)
  }

  async function handleToggleVideoGate() {
    setTogglingGate(true)
    const next = !videoGate
    const supabase = createClient()
    const { error: updateError } = await supabase
      .from('courses')
      .update({ require_full_video_watch: next })
      .eq('id', courseId)

    if (!updateError) {
      setVideoGate(next)
      router.refresh()
    }
    setTogglingGate(false)
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    if (!text.trim() || OPTIONS.some(o => !options[o].trim())) {
      setError('Please fill in the question and all 4 options.')
      return
    }
    setLoading(true)
    setError(null)

    const supabase = createClient()
    const { error: insertError } = await supabase
      .from('questions')
      .insert({
        course_id: courseId,
        text: text.trim(),
        option_a: options.A.trim(),
        option_b: options.B.trim(),
        option_c: options.C.trim(),
        option_d: options.D.trim(),
        correct_answer: correctAnswer,
      })

    if (insertError) {
      setError(insertError.message)
    } else {
      resetForm()
      setShowForm(false)
      router.refresh()
    }
    setLoading(false)
  }

  async function handleDelete(questionId: number) {
    if (!confirm('Delete this question?')) return
    setDeletingId(questionId)
    const supabase = createClient()
    await supabase.from('questions').delete().eq('id', questionId)
    router.refresh()
    setDeletingId(null)
  }

  async function handleAiImprove(q: Question) {
    setAiLoading(q.id)
    const content = `Question: ${q.text}\nA: ${q.option_a}\nB: ${q.option_b}\nC: ${q.option_c}\nD: ${q.option_d}\nCorrect: ${q.correct_answer}`
    try {
      const res = await fetch('/api/ai-improve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode: 'question', content }),
      })
      const data = await res.json()
      if (data.result) {
        const supabase = createClient()
        await supabase.from('questions').update({
          text: data.result.question,
          option_a: data.result.optionA,
          option_b: data.result.optionB,
          option_c: data.result.optionC,
          option_d: data.result.optionD,
        }).eq('id', q.id)
        router.refresh()
      }
    } catch { /* silent */ } finally {
      setAiLoading(null)
    }
  }

  const optionLabel: Record<OptionKey, string> = {
    A: 'Option A', B: 'Option B', C: 'Option C', D: 'Option D',
  }

  return (
    <div className="bg-[#1a1a2e] border border-[#2a2a4a] rounded-xl p-6 space-y-5">
      {/* ── Video gate toggle ─────────────────────────────────────────────── */}
      <div className="bg-[#0a0a18] border border-[#2a2a4a] rounded-xl p-4 flex items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className={`mt-0.5 p-1.5 rounded-lg ${videoGate ? 'bg-indigo-500/20 text-indigo-400' : 'bg-slate-700/40 text-slate-500'}`}>
            {videoGate ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
          </div>
          <div>
            <p className="text-white text-sm font-medium">Require video watch before quiz</p>
            <p className="text-slate-500 text-xs mt-0.5">
              Learners must mark the video as watched before the quiz unlocks.
            </p>
          </div>
        </div>
        <button
          type="button"
          disabled={togglingGate}
          onClick={handleToggleVideoGate}
          aria-checked={videoGate}
          role="switch"
          className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-[#0a0a18] ${
            videoGate ? 'bg-indigo-600' : 'bg-[#2a2a4a]'
          } ${togglingGate ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <span
            className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-lg transform ring-0 transition-transform ${
              videoGate ? 'translate-x-5' : 'translate-x-0'
            }`}
          />
        </button>
      </div>

      {/* ── Questions header ──────────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-indigo-400" />
          Quiz Questions
          <span className="text-sm font-normal text-slate-400">({questions.length})</span>
        </h2>
        <button
          onClick={() => { setShowForm(v => !v); if (showForm) resetForm() }}
          className="flex items-center gap-1.5 text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
        >
          <PlusCircle className="w-4 h-4" />
          Add Question
        </button>
      </div>

      {/* ── Add form ──────────────────────────────────────────────────────── */}
      {showForm && (
        <form onSubmit={handleAdd} className="bg-[#0a0a18] border border-[#2a2a4a] rounded-xl p-5 space-y-4">
          {error && (
            <p className="text-red-400 text-sm">{error}</p>
          )}
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Question Text</label>
            <textarea
              required
              value={text}
              onChange={e => setText(e.target.value)}
              placeholder="What is the correct procedure when…"
              rows={2}
              className="w-full bg-[#1a1a2e] border border-[#2a2a4a] rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 resize-none"
            />
          </div>

          <div className="space-y-2">
            <p className="text-xs font-medium text-slate-400">Answer Options</p>
            {OPTIONS.map(opt => (
              <div key={opt} className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setCorrectAnswer(opt)}
                  className={`shrink-0 w-7 h-7 rounded-full border text-xs font-bold flex items-center justify-center transition-colors ${
                    correctAnswer === opt
                      ? 'bg-emerald-600 border-emerald-600 text-white'
                      : 'border-[#3a3a5a] text-slate-500 hover:border-slate-400'
                  }`}
                  title={`Mark ${opt} as correct`}
                >
                  {opt}
                </button>
                <input
                  type="text"
                  required
                  value={options[opt]}
                  onChange={e => setOptions(prev => ({ ...prev, [opt]: e.target.value }))}
                  placeholder={optionLabel[opt]}
                  className="flex-1 bg-[#1a1a2e] border border-[#2a2a4a] rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            ))}
            <p className="text-xs text-slate-500">Click a letter to mark it as the correct answer.</p>
          </div>

          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={() => { setShowForm(false); resetForm() }}
              className="flex-1 bg-transparent border border-[#2a2a4a] hover:border-slate-500 text-slate-400 text-sm py-2 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-sm font-medium py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
              {loading ? 'Adding…' : 'Add Question'}
            </button>
          </div>
        </form>
      )}

      {/* ── Question list ─────────────────────────────────────────────────── */}
      {questions.length === 0 ? (
        <div className="text-center py-8 text-slate-500 text-sm">
          No questions yet. Add the first one above.
        </div>
      ) : (
        <div className="space-y-3">
          {questions.map((q, qi) => (
            <div
              key={q.id}
              className="bg-[#0a0a18] border border-[#2a2a4a] rounded-xl p-4"
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <p className="text-white text-sm font-medium flex-1">
                  <span className="text-indigo-400 font-bold">{qi + 1}.</span> {q.text}
                </p>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleAiImprove(q)}
                    disabled={aiLoading === q.id}
                    title="AI cleanup with Claude Haiku"
                    className="flex items-center gap-1 px-2 py-1 rounded text-xs bg-violet-600/20 hover:bg-violet-600/35 border border-violet-500/30 text-violet-300 transition-colors disabled:opacity-40"
                  >
                    {aiLoading === q.id
                      ? <Loader2 className="w-3 h-3 animate-spin" />
                      : <Sparkles className="w-3 h-3" />}
                    {aiLoading === q.id ? '…' : 'AI'}
                  </button>
                  <button
                    onClick={() => handleDelete(q.id)}
                    disabled={deletingId === q.id}
                    className="text-slate-500 hover:text-red-400 transition-colors disabled:opacity-50"
                  >
                    {deletingId === q.id
                      ? <Loader2 className="w-4 h-4 animate-spin" />
                      : <Trash2 className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                {OPTIONS.map(opt => {
                  const optKey = `option_${opt.toLowerCase()}` as keyof Question
                  const isCorrect = q.correct_answer.toUpperCase() === opt
                  return (
                    <div
                      key={opt}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs ${
                        isCorrect
                          ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-400'
                          : 'bg-[#1a1a2e] border border-[#2a2a4a] text-slate-400'
                      }`}
                    >
                      <span className="font-bold shrink-0">{opt}.</span>
                      <span className="truncate">{q[optKey] as string}</span>
                      {isCorrect && <CheckCircle className="w-3 h-3 shrink-0 ml-auto" />}
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Quick link to global Learner Management */}
      <div className="mt-6 flex items-center justify-between bg-[#1a1a2e] border border-[#2a2a4a] rounded-xl px-5 py-4">
        <div className="flex items-center gap-3">
          <Users className="w-5 h-5 text-indigo-400" />
          <div>
            <p className="text-sm font-medium text-white">Manage Learners & Invites</p>
            <p className="text-xs text-slate-500 mt-0.5">View all enrollments, resend invites, and track completions across every course.</p>
          </div>
        </div>
        <Link
          href="/admin/learners"
          className="shrink-0 text-sm px-4 py-2 rounded-lg bg-indigo-600/20 text-indigo-400 hover:bg-indigo-600/40 transition-colors font-medium"
        >
          Open →
        </Link>
      </div>
    </div>
  )
}
