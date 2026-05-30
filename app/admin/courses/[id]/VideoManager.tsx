'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Video, Trash2, PlusCircle, Loader2, Clock } from 'lucide-react'

interface VideoItem {
  id: number
  title: string
  url: string
  duration_seconds: number
  sort_order: number
}

interface Props {
  courseId: number
  videos: VideoItem[]
}

function formatDuration(seconds: number) {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}

export default function VideoManager({ courseId, videos }: Props) {
  const router = useRouter()
  const [showForm, setShowForm] = useState(false)
  const [title, setTitle] = useState('')
  const [url, setUrl] = useState('')
  const [durationMinutes, setDurationMinutes] = useState('')
  const [loading, setLoading] = useState(false)
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim() || !url.trim()) return
    setLoading(true)
    setError(null)

    const durationSecs = Math.round((parseFloat(durationMinutes) || 0) * 60)
    const nextOrder = videos.length > 0 ? Math.max(...videos.map(v => v.sort_order)) + 1 : 0

    const supabase = createClient()
    const { error: insertError } = await supabase
      .from('videos')
      .insert({
        course_id: courseId,
        title: title.trim(),
        url: url.trim(),
        duration_seconds: durationSecs,
        sort_order: nextOrder,
      })

    if (insertError) {
      setError(insertError.message)
    } else {
      setTitle('')
      setUrl('')
      setDurationMinutes('')
      setShowForm(false)
      router.refresh()
    }
    setLoading(false)
  }

  async function handleDelete(videoId: number) {
    if (!confirm('Delete this video?')) return
    setDeletingId(videoId)
    const supabase = createClient()
    await supabase.from('videos').delete().eq('id', videoId)
    router.refresh()
    setDeletingId(null)
  }

  return (
    <div className="bg-[#1a1a2e] border border-[#2a2a4a] rounded-xl p-6">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          <Video className="w-5 h-5 text-indigo-400" />
          Videos
          <span className="text-sm font-normal text-slate-400">({videos.length})</span>
        </h2>
        <button
          onClick={() => setShowForm(v => !v)}
          className="flex items-center gap-1.5 text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
        >
          <PlusCircle className="w-4 h-4" />
          Add Video
        </button>
      </div>

      {/* Add form */}
      {showForm && (
        <form onSubmit={handleAdd} className="bg-[#0a0a18] border border-[#2a2a4a] rounded-xl p-5 mb-5 space-y-3">
          {error && (
            <p className="text-red-400 text-sm">{error}</p>
          )}
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Video Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. Introduction to the Course"
              className="w-full bg-[#1a1a2e] border border-[#2a2a4a] rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">YouTube URL</label>
            <input
              type="url"
              required
              value={url}
              onChange={e => setUrl(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=..."
              className="w-full bg-[#1a1a2e] border border-[#2a2a4a] rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Duration (minutes)</label>
            <input
              type="number"
              min="0"
              step="0.5"
              value={durationMinutes}
              onChange={e => setDurationMinutes(e.target.value)}
              placeholder="e.g. 14.5"
              className="w-full bg-[#1a1a2e] border border-[#2a2a4a] rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
          </div>
          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={() => { setShowForm(false); setError(null) }}
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
              {loading ? 'Adding…' : 'Add Video'}
            </button>
          </div>
        </form>
      )}

      {/* Video list */}
      {videos.length === 0 ? (
        <div className="text-center py-8 text-slate-500 text-sm">
          No videos yet. Add the first one above.
        </div>
      ) : (
        <div className="space-y-2">
          {videos.map((video, i) => (
            <div
              key={video.id}
              className="flex items-center gap-3 bg-[#0a0a18] border border-[#2a2a4a] rounded-lg px-4 py-3"
            >
              <span className="text-xs font-bold text-indigo-400 w-5 text-center shrink-0">
                {i + 1}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-medium truncate">{video.title}</p>
                <p className="text-slate-500 text-xs truncate">{video.url}</p>
              </div>
              {video.duration_seconds > 0 && (
                <div className="flex items-center gap-1 text-xs text-slate-500 shrink-0">
                  <Clock className="w-3 h-3" />
                  {formatDuration(video.duration_seconds)}
                </div>
              )}
              <button
                onClick={() => handleDelete(video.id)}
                disabled={deletingId === video.id}
                className="shrink-0 text-slate-500 hover:text-red-400 transition-colors disabled:opacity-50"
                title="Delete video"
              >
                {deletingId === video.id
                  ? <Loader2 className="w-4 h-4 animate-spin" />
                  : <Trash2 className="w-4 h-4" />
                }
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
