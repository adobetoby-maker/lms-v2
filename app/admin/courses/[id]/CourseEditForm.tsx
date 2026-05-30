'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Loader2, Save, Sparkles } from 'lucide-react'

interface Course {
  id: number
  title: string
  description: string
  require_full_video_watch: boolean
  is_active: boolean
}

function AiButton({ onClick, loading }: { onClick: () => void; loading: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={loading}
      title="AI cleanup with Claude Haiku"
      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-violet-600/20 hover:bg-violet-600/35 border border-violet-500/30 text-violet-300 hover:text-violet-200 transition-colors disabled:opacity-40"
    >
      {loading
        ? <Loader2 className="w-3 h-3 animate-spin" />
        : <Sparkles className="w-3 h-3" />}
      {loading ? 'Improving…' : 'AI Improve'}
    </button>
  )
}

export default function CourseEditForm({ course }: { course: Course }) {
  const router = useRouter()
  const [title, setTitle] = useState(course.title)
  const [description, setDescription] = useState(course.description)
  const [requireFullVideoWatch, setRequireFullVideoWatch] = useState(course.require_full_video_watch)
  const [isActive, setIsActive] = useState(course.is_active)
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [aiLoadingTitle, setAiLoadingTitle] = useState(false)
  const [aiLoadingDesc, setAiLoadingDesc] = useState(false)

  async function aiImprove(mode: 'title' | 'description') {
    const content = mode === 'title' ? title : description
    if (!content.trim()) return

    const setAi = mode === 'title' ? setAiLoadingTitle : setAiLoadingDesc
    setAi(true)
    try {
      const res = await fetch('/api/ai-improve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode, content }),
      })
      const data = await res.json()
      if (data.result) {
        if (mode === 'title') setTitle(data.result)
        else setDescription(data.result)
      }
    } catch { /* silent */ } finally {
      setAi(false)
    }
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSaved(false)

    const supabase = createClient()
    const { error: updateError } = await supabase
      .from('courses')
      .update({
        title: title.trim(),
        description: description.trim(),
        require_full_video_watch: requireFullVideoWatch,
        is_active: isActive,
      })
      .eq('id', course.id)

    if (updateError) {
      setError(updateError.message)
    } else {
      setSaved(true)
      router.refresh()
      setTimeout(() => setSaved(false), 3000)
    }
    setLoading(false)
  }

  return (
    <div className="bg-[#1a1a2e] border border-[#2a2a4a] rounded-xl p-6">
      <h2 className="text-lg font-semibold text-white mb-5">Course Details</h2>

      {error && (
        <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-2.5 mb-4">
          {error}
        </p>
      )}

      <form onSubmit={handleSave} className="space-y-4">
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-sm font-medium text-slate-300">Title</label>
            <AiButton onClick={() => aiImprove('title')} loading={aiLoadingTitle} />
          </div>
          <input
            type="text"
            required
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="w-full bg-[#0a0a18] border border-[#2a2a4a] rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-sm font-medium text-slate-300">Description</label>
            <AiButton onClick={() => aiImprove('description')} loading={aiLoadingDesc} />
          </div>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            rows={3}
            className="w-full bg-[#0a0a18] border border-[#2a2a4a] rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 resize-none"
          />
        </div>

        <div className="flex flex-col gap-3">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={requireFullVideoWatch}
              onChange={e => setRequireFullVideoWatch(e.target.checked)}
              className="w-4 h-4 rounded border-[#2a2a4a] bg-[#0a0a18] text-indigo-600 focus:ring-indigo-500"
            />
            <span className="text-sm text-slate-300">Require full video watch before quiz</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={isActive}
              onChange={e => setIsActive(e.target.checked)}
              className="w-4 h-4 rounded border-[#2a2a4a] bg-[#0a0a18] text-indigo-600 focus:ring-indigo-500"
            />
            <span className="text-sm text-slate-300">Course is active (visible to learners)</span>
          </label>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {loading ? 'Saving…' : 'Save Changes'}
          </button>
          {saved && <span className="text-emerald-400 text-sm">✓ Saved</span>}
        </div>
      </form>
    </div>
  )
}
