'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { HelpCircle, Trash2, PlusCircle, Loader2, CheckCircle } from 'lucide-react'

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
}

type OptionKey = 'A' | 'B' | 'C' | 'D'
const OPTIONS: OptionKey[] = ['A', 'B', 'C', 'D']

export default function QuestionManager({ courseId, questions }: Props) {
  const router = useRouter()
  const [showForm, setShowForm] = useState(false)
  const [text, setText] = useState('')
  const [options, setOptions] = useState<Record<OptionKey, string>>({
    A: '', B: '', C: '', D: '',
  })
  const [correctAnswer, setCorrectAnswer] = useState<OptionKey>('A')
  const [loading, setLoading] = useState(false)
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)

  function resetForm() {
    setText('')
    setOptions({ A: '', B: '', C: '', D: '' })
    setCorrectAnswer('A')
    setError(null)
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

  const optionLabel: Record<OptionKey, string> = {
    A: 'Option A',
    B: 'Option B',
    C: 'Option C',
    D: 'Option D',
  }

  return (
    <div className="bg-[#1a1a2e] border border-[#2a2a4a] rounded-xl p-6">
      <div className="flex items-center justify-between mb-5">
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

      {/* Add form */}
      {showForm && (
        <form onSubmit={handleAdd} className="bg-[#0a0a18] border border-[#2a2a4a] rounded-xl p-5 mb-5 space-y-4">
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

      {/* Question list */}
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
                <p className="text-white text-sm font-medium">
                  <span className="text-indigo-400 font-bold">{qi + 1}.</span> {q.text}
                </p>
                <button
                  onClick={() => handleDelete(q.id)}
                  disabled={deletingId === q.id}
                  className="shrink-0 text-slate-500 hover:text-red-400 transition-colors disabled:opacity-50"
                >
                  {deletingId === q.id
                    ? <Loader2 className="w-4 h-4 animate-spin" />
                    : <Trash2 className="w-4 h-4" />
                  }
                </button>
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
    </div>
  )
}
