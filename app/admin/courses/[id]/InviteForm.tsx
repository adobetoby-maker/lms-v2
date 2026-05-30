'use client'

import { useState } from 'react'
import { Mail, Loader2, Copy, Check, AlertCircle } from 'lucide-react'

interface Props {
  courseId: number
}

export default function InviteForm({ courseId }: Props) {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [inviteUrl, setInviteUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  async function handleInvite(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim()) return
    setLoading(true)
    setError(null)
    setInviteUrl(null)

    const res = await fetch('/api/invite', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.trim(), courseId }),
    })

    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      setError(data.error ?? 'Failed to create invite.')
      setLoading(false)
      return
    }

    const data = await res.json()
    setInviteUrl(data.inviteUrl)
    setEmail('')
    setLoading(false)
  }

  async function handleCopy() {
    if (!inviteUrl) return
    await navigator.clipboard.writeText(inviteUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="bg-[#1a1a2e] border border-[#2a2a4a] rounded-xl p-6">
      <h2 className="text-lg font-semibold text-white mb-1 flex items-center gap-2">
        <Mail className="w-5 h-5 text-indigo-400" />
        Invite Learner
      </h2>
      <p className="text-slate-400 text-sm mb-5">
        Generate a registration link for a learner and automatically enroll them in this course.
      </p>

      {error && (
        <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3 mb-4">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      <form onSubmit={handleInvite} className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">
            Learner Email
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="learner@company.com"
            className="w-full bg-[#0a0a18] border border-[#2a2a4a] rounded-lg px-4 py-2.5 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-sm font-medium py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Generating…
            </>
          ) : (
            <>
              <Mail className="w-4 h-4" />
              Generate Invite Link
            </>
          )}
        </button>
      </form>

      {inviteUrl && (
        <div className="mt-5 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
          <p className="text-emerald-400 text-sm font-medium mb-2">✓ Invite link generated!</p>
          <div className="flex items-center gap-2">
            <p className="text-xs text-slate-400 font-mono bg-[#0a0a18] rounded-lg px-3 py-2 flex-1 truncate">
              {inviteUrl}
            </p>
            <button
              onClick={handleCopy}
              className="shrink-0 p-2 bg-[#0a0a18] border border-[#2a2a4a] hover:border-indigo-500 rounded-lg text-slate-400 hover:text-white transition-colors"
              title="Copy link"
            >
              {copied ? (
                <Check className="w-4 h-4 text-emerald-400" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
          </div>
          <p className="text-xs text-slate-500 mt-2">
            This link expires in 7 days. Share it directly with the learner.
          </p>
        </div>
      )}
    </div>
  )
}
