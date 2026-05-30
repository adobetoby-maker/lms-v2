'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { PlusCircle, Loader2, X } from 'lucide-react'

export default function CreateCourseForm() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [requireFullVideoWatch, setRequireFullVideoWatch] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim()) return
    setLoading(true)
    setError(null)

    const supabase = createClient()
    const { error: insertError } = await supabase
      .from('courses')
      .insert({
        title: title.trim(),
        description: description.trim(),
        require_full_video_watch: requireFullVideoWatch,
        is_active: true,
      })

    if (insertError) {
      setError(insertError.message)
      setLoading(false)
      return
    }

    setTitle('')
    setDescription('')
    setRequireFullVideoWatch(false)
    setOpen(false)
    router.refresh()
    setLoading(false)
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors"
      >
        <PlusCircle className="w-4 h-4" />
        Create Course
      </button>
    )
  }

  return (
    <div className="bg-[#1a1a2e] border border-indigo-500/50 rounded-xl p-6 w-full max-w-lg">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-semibold text-white">Create New Course</h2>
        <button
          onClick={() => { setOpen(false); setError(null) }}
          className="text-slate-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {error && (
        <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-2.5 mb-4">
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">Course Title</label>
          <input
            type="text"
            required
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="e.g. Workplace Safety Training"
            className="w-full bg-[#0a0a18] border border-[#2a2a4a] rounded-lg px-4 py-2.5 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">Description</label>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Brief course description…"
            rows={3}
            className="w-full bg-[#0a0a18] border border-[#2a2a4a] rounded-lg px-4 py-2.5 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 resize-none"
          />
        </div>
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={requireFullVideoWatch}
            onChange={e => setRequireFullVideoWatch(e.target.checked)}
            className="w-4 h-4 rounded border-[#2a2a4a] bg-[#0a0a18] text-indigo-600"
          />
          <span className="text-sm text-slate-300">Require full video watch before quiz</span>
        </label>
        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={() => { setOpen(false); setError(null) }}
            className="flex-1 bg-[#0a0a18] border border-[#2a2a4a] hover:border-slate-500 text-slate-300 text-sm font-medium py-2.5 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-sm font-medium py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            {loading ? 'Creating…' : 'Create Course'}
          </button>
        </div>
      </form>
    </div>
  )
}
