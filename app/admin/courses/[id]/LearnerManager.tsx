'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Users, Mail, Loader2, Copy, Check, AlertCircle, RefreshCw,
  UserCheck, Clock, XCircle, CheckCircle2, Send,
} from 'lucide-react'

// ─── Types ────────────────────────────────────────────────────────────────────

export type LearnerStatus = 'invited' | 'in_progress' | 'passed' | 'failed'

export interface LearnerRow {
  id: string            // user id (enrolled) or invite id (invited-only)
  name: string
  email: string
  status: LearnerStatus
  score: number | null  // percentage 0-100, null if not attempted
  passed: boolean | null
  date: string          // enrolled_at / invited_at ISO string
  inviteToken?: string  // for not-yet-registered invites
  userId?: string       // for enrolled learners (to generate resend link)
}

interface ScoreSummary {
  totalInvited: number
  registered: number
  passed: number
  failed: number
  pending: number
}

interface Props {
  courseId: number
  learners: LearnerRow[]
  summary: ScoreSummary
}

// ─── Status badge ─────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: LearnerStatus }) {
  const map: Record<LearnerStatus, { label: string; cls: string }> = {
    invited:     { label: 'Invited',     cls: 'bg-amber-500/15 text-amber-400 border-amber-500/25' },
    in_progress: { label: 'In Progress', cls: 'bg-blue-500/15 text-blue-400 border-blue-500/25' },
    passed:      { label: 'Passed',      cls: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25' },
    failed:      { label: 'Failed',      cls: 'bg-red-500/15 text-red-400 border-red-500/25' },
  }
  const { label, cls } = map[status]
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${cls}`}>
      {label}
    </span>
  )
}

// ─── Copy-link button ─────────────────────────────────────────────────────────

function CopyLinkButton({ url, label = 'Copy Link' }: { url: string; label?: string }) {
  const [copied, setCopied] = useState(false)
  async function handleCopy() {
    await navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <button
      onClick={handleCopy}
      className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg bg-[#1a1a2e] border border-[#2a2a4a] hover:border-indigo-500 text-slate-400 hover:text-white transition-colors"
    >
      {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
      {copied ? 'Copied!' : label}
    </button>
  )
}

// ─── Resend button ────────────────────────────────────────────────────────────

function ResendButton({
  courseId, email, onLink,
}: { courseId: number; email: string; onLink: (url: string) => void }) {
  const [loading, setLoading] = useState(false)

  async function handleResend() {
    setLoading(true)
    const res = await fetch('/api/resend-invite', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ courseId, email }),
    })
    if (res.ok) {
      const data = await res.json()
      onLink(data.inviteUrl)
    }
    setLoading(false)
  }

  return (
    <button
      onClick={handleResend}
      disabled={loading}
      className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-600/30 transition-colors disabled:opacity-50"
    >
      {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : <RefreshCw className="w-3 h-3" />}
      Resend
    </button>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function LearnerManager({ courseId, learners, summary }: Props) {
  const router = useRouter()

  // ── Invite state
  const [singleEmail, setSingleEmail] = useState('')
  const [singleLoading, setSingleLoading] = useState(false)
  const [singleResult, setSingleResult] = useState<string | null>(null)
  const [singleError, setSingleError] = useState<string | null>(null)

  const [bulkText, setBulkText] = useState('')
  const [bulkLoading, setBulkLoading] = useState(false)
  const [bulkResults, setBulkResults] = useState<{ email: string; url: string }[]>([])
  const [bulkError, setBulkError] = useState<string | null>(null)

  // ── Resend link state (keyed by learner id)
  const [resendLinks, setResendLinks] = useState<Record<string, string>>({})

  async function handleSingleInvite(e: React.FormEvent) {
    e.preventDefault()
    if (!singleEmail.trim()) return
    setSingleLoading(true)
    setSingleError(null)
    setSingleResult(null)

    const res = await fetch('/api/invite', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: singleEmail.trim(), courseId }),
    })
    const data = await res.json()

    if (!res.ok) {
      setSingleError(data.error ?? 'Failed to create invite.')
    } else {
      setSingleResult(data.inviteUrl)
      setSingleEmail('')
      router.refresh()
    }
    setSingleLoading(false)
  }

  async function handleBulkInvite(e: React.FormEvent) {
    e.preventDefault()
    const raw = bulkText.trim()
    if (!raw) return

    // Parse comma-separated or newline-separated emails
    const emails = raw
      .split(/[\n,]+/)
      .map(s => s.trim().toLowerCase())
      .filter(s => s.includes('@'))

    if (emails.length === 0) {
      setBulkError('No valid emails found. Enter one email per line or separate with commas.')
      return
    }

    setBulkLoading(true)
    setBulkError(null)
    setBulkResults([])

    const results: { email: string; url: string }[] = []

    for (const email of emails) {
      const res = await fetch('/api/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, courseId }),
      })
      if (res.ok) {
        const data = await res.json()
        results.push({ email, url: data.inviteUrl })
      }
    }

    setBulkResults(results)
    if (results.length > 0) {
      setBulkText('')
      router.refresh()
    } else {
      setBulkError('All invites failed. Check the emails and try again.')
    }
    setBulkLoading(false)
  }

  function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
    })
  }

  return (
    <div className="bg-[#1a1a2e] border border-[#2a2a4a] rounded-xl p-6 space-y-8">
      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-2">
        <Users className="w-5 h-5 text-indigo-400" />
        <h2 className="text-lg font-semibold text-white">Learner Management</h2>
      </div>

      {/* ── Section A: Invite ────────────────────────────────────────────────── */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wide">
          Invite Learners
        </h3>

        {/* Single invite */}
        <div className="bg-[#0a0a18] border border-[#2a2a4a] rounded-xl p-5 space-y-3">
          <p className="text-sm font-medium text-white flex items-center gap-2">
            <Mail className="w-4 h-4 text-indigo-400" />
            Single Invite
          </p>

          {singleError && (
            <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-2.5">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <p className="text-red-400 text-sm">{singleError}</p>
            </div>
          )}

          <form onSubmit={handleSingleInvite} className="flex gap-3">
            <input
              type="email"
              required
              value={singleEmail}
              onChange={e => setSingleEmail(e.target.value)}
              placeholder="learner@company.com"
              className="flex-1 bg-[#0a0a18] border border-[#2a2a4a] rounded-lg px-4 py-2.5 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-indigo-500"
            />
            <button
              type="submit"
              disabled={singleLoading}
              className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors flex items-center gap-2"
            >
              {singleLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
              Send Invite
            </button>
          </form>

          {singleResult && (
            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-3 space-y-2">
              <p className="text-emerald-400 text-xs font-medium flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Invite link generated — expires in 7 days
              </p>
              <div className="flex items-center gap-2">
                <p className="text-xs text-slate-400 font-mono bg-[#0a0a18] rounded px-3 py-1.5 flex-1 truncate">
                  {singleResult}
                </p>
                <CopyLinkButton url={singleResult} />
              </div>
            </div>
          )}
        </div>

        {/* Bulk invite */}
        <div className="bg-[#0a0a18] border border-[#2a2a4a] rounded-xl p-5 space-y-3">
          <p className="text-sm font-medium text-white flex items-center gap-2">
            <Users className="w-4 h-4 text-indigo-400" />
            Bulk Invite
          </p>

          {bulkError && (
            <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-2.5">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <p className="text-red-400 text-sm">{bulkError}</p>
            </div>
          )}

          <form onSubmit={handleBulkInvite} className="space-y-3">
            <textarea
              value={bulkText}
              onChange={e => setBulkText(e.target.value)}
              placeholder={"alice@company.com\nbob@company.com\ncarol@company.com\n\nor separate with commas"}
              rows={5}
              className="w-full bg-[#0a0a18] border border-[#2a2a4a] rounded-lg px-4 py-2.5 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-indigo-500 resize-none"
            />
            <button
              type="submit"
              disabled={bulkLoading}
              className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-sm font-medium py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {bulkLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
              {bulkLoading ? 'Inviting…' : 'Invite All'}
            </button>
          </form>

          {bulkResults.length > 0 && (
            <div className="space-y-2">
              <p className="text-emerald-400 text-xs font-medium">
                {bulkResults.length} invite{bulkResults.length !== 1 ? 's' : ''} created
              </p>
              {bulkResults.map(r => (
                <div key={r.email} className="flex items-center gap-3 bg-[#1a1a2e] border border-[#2a2a4a] rounded-lg px-3 py-2">
                  <span className="text-slate-400 text-xs flex-1 truncate">{r.email}</span>
                  <CopyLinkButton url={r.url} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Section B: Learner list ─────────────────────────────────────────── */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wide">
          Enrolled &amp; Invited
        </h3>

        {learners.length === 0 ? (
          <div className="text-center py-10 text-slate-500 text-sm">
            No learners yet. Send the first invite above.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left border-b border-[#2a2a4a]">
                  <th className="pb-3 pr-4 text-xs font-medium text-slate-500 uppercase tracking-wide">Name</th>
                  <th className="pb-3 pr-4 text-xs font-medium text-slate-500 uppercase tracking-wide">Email</th>
                  <th className="pb-3 pr-4 text-xs font-medium text-slate-500 uppercase tracking-wide">Status</th>
                  <th className="pb-3 pr-4 text-xs font-medium text-slate-500 uppercase tracking-wide">Score</th>
                  <th className="pb-3 pr-4 text-xs font-medium text-slate-500 uppercase tracking-wide">Date</th>
                  <th className="pb-3 text-xs font-medium text-slate-500 uppercase tracking-wide">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1e1e38]">
                {learners.map(learner => {
                  const resendLink = resendLinks[learner.id]
                  return (
                    <tr key={learner.id} className="group">
                      <td className="py-3 pr-4">
                        <span className="text-white font-medium">
                          {learner.name || <span className="text-slate-500 italic">Not registered</span>}
                        </span>
                      </td>
                      <td className="py-3 pr-4 text-slate-400 text-xs">{learner.email}</td>
                      <td className="py-3 pr-4">
                        <StatusBadge status={learner.status} />
                      </td>
                      <td className="py-3 pr-4">
                        {learner.score !== null ? (
                          <span className={`font-semibold ${learner.passed ? 'text-emerald-400' : 'text-red-400'}`}>
                            {learner.score}%
                          </span>
                        ) : (
                          <span className="text-slate-600">—</span>
                        )}
                      </td>
                      <td className="py-3 pr-4 text-slate-500 text-xs whitespace-nowrap">
                        {formatDate(learner.date)}
                      </td>
                      <td className="py-3">
                        <div className="flex items-center gap-2 flex-wrap">
                          {/* Invite link for not-yet-registered */}
                          {learner.status === 'invited' && learner.inviteToken && (
                            <CopyLinkButton
                              url={`${getBaseUrl()}/register/${learner.inviteToken}`}
                              label="Copy Link"
                            />
                          )}

                          {/* Resend for failed learners */}
                          {learner.status === 'failed' && (
                            <ResendButton
                              courseId={courseId}
                              email={learner.email}
                              onLink={url => setResendLinks(prev => ({ ...prev, [learner.id]: url }))}
                            />
                          )}

                          {/* Show generated resend link inline */}
                          {resendLink && (
                            <div className="flex items-center gap-1.5 mt-1 w-full">
                              <p className="text-xs text-slate-500 font-mono truncate max-w-[200px]">
                                {resendLink}
                              </p>
                              <CopyLinkButton url={resendLink} label="Copy" />
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Section C: Score summary ────────────────────────────────────────── */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wide">
          Summary
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          <SummaryCard
            icon={<Users className="w-4 h-4" />}
            label="Total Invited"
            value={summary.totalInvited}
            colorClass="text-slate-300"
          />
          <SummaryCard
            icon={<UserCheck className="w-4 h-4" />}
            label="Registered"
            value={summary.registered}
            colorClass="text-blue-400"
          />
          <SummaryCard
            icon={<CheckCircle2 className="w-4 h-4" />}
            label="Passed"
            value={summary.passed}
            sub={summary.registered > 0 ? `${Math.round((summary.passed / summary.registered) * 100)}%` : undefined}
            colorClass="text-emerald-400"
          />
          <SummaryCard
            icon={<XCircle className="w-4 h-4" />}
            label="Failed"
            value={summary.failed}
            colorClass="text-red-400"
          />
          <SummaryCard
            icon={<Clock className="w-4 h-4" />}
            label="Pending"
            value={summary.pending}
            colorClass="text-amber-400"
          />
        </div>
      </div>
    </div>
  )
}

// ─── Summary card ─────────────────────────────────────────────────────────────

function SummaryCard({
  icon, label, value, sub, colorClass,
}: {
  icon: React.ReactNode
  label: string
  value: number
  sub?: string
  colorClass: string
}) {
  return (
    <div className="bg-[#0a0a18] border border-[#2a2a4a] rounded-xl p-4">
      <div className={`flex items-center gap-1.5 text-xs text-slate-500 mb-2 ${colorClass}`}>
        {icon}
        <span className="text-slate-500">{label}</span>
      </div>
      <p className={`text-2xl font-bold ${colorClass}`}>{value}</p>
      {sub && <p className="text-xs text-slate-500 mt-0.5">{sub} pass rate</p>}
    </div>
  )
}

// ─── Utility ──────────────────────────────────────────────────────────────────

function getBaseUrl() {
  if (typeof window !== 'undefined') return window.location.origin
  return process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'
}
