'use client'

import { useState } from 'react'
import { Search, Mail, CheckCircle2, Clock, XCircle, BookOpen, Send } from 'lucide-react'
import StatusBadge from '@/components/StatusBadge'
import Link from 'next/link'

type Enrollment = {
  id: string
  status: string
  score: number | null
  completed_at: string | null
  created_at: string
  profiles: { id: string; first_name: string; last_name: string } | null
  courses: { id: string; title: string } | null
}

type Invite = {
  id: string
  email: string
  status: string
  created_at: string
  expires_at: string | null
  courses: { id: string; title: string } | null
}

interface Props {
  enrollments: Enrollment[]
  invites: Invite[]
}

type Tab = 'enrollments' | 'invites'

export default function LearnersClient({ enrollments, invites }: Props) {
  const [tab, setTab]     = useState<Tab>('enrollments')
  const [search, setSearch] = useState('')
  const [resending, setResending] = useState<string | null>(null)
  const [resent, setResent] = useState<Set<string>>(new Set())

  const filteredEnrollments = enrollments.filter(e => {
    const name = `${e.profiles?.first_name ?? ''} ${e.profiles?.last_name ?? ''}`.toLowerCase()
    const course = (e.courses?.title ?? '').toLowerCase()
    const q = search.toLowerCase()
    return name.includes(q) || course.includes(q)
  })

  const filteredInvites = invites.filter(i => {
    const q = search.toLowerCase()
    return i.email.toLowerCase().includes(q) || (i.courses?.title ?? '').toLowerCase().includes(q)
  })

  async function resendInvite(inviteId: string) {
    setResending(inviteId)
    await fetch('/api/resend-invite', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ inviteId }),
    })
    setResent(prev => new Set([...prev, inviteId]))
    setResending(null)
  }

  const tabs: { id: Tab; label: string; count: number }[] = [
    { id: 'enrollments', label: 'Enrollments', count: enrollments.length },
    { id: 'invites',     label: 'Invites',     count: invites.length },
  ]

  return (
    <div>
      {/* Tabs + search */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-5">
        <div className="flex gap-1 bg-[#1a1a2e] rounded-xl p-1 border border-[#2a2a4a]">
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                tab === t.id ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              {t.label}
              <span className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-full ${
                tab === t.id ? 'bg-white/20' : 'bg-[#2a2a4a]'
              }`}>{t.count}</span>
            </button>
          ))}
        </div>

        <div className="relative flex-1 sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search learner or course…"
            className="w-full bg-[#1a1a2e] border border-[#2a2a4a] rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Enrollments table */}
      {tab === 'enrollments' && (
        <div className="bg-[#1a1a2e] border border-[#2a2a4a] rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#2a2a4a]">
                <th className="text-left px-5 py-3.5 text-xs text-slate-500 font-medium uppercase tracking-wide">Learner</th>
                <th className="text-left px-5 py-3.5 text-xs text-slate-500 font-medium uppercase tracking-wide hidden md:table-cell">Course</th>
                <th className="text-left px-5 py-3.5 text-xs text-slate-500 font-medium uppercase tracking-wide">Status</th>
                <th className="text-left px-5 py-3.5 text-xs text-slate-500 font-medium uppercase tracking-wide hidden sm:table-cell">Score</th>
                <th className="px-5 py-3.5" />
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2a2a4a]/50">
              {filteredEnrollments.length === 0 ? (
                <tr><td colSpan={5} className="px-5 py-8 text-center text-slate-500 text-sm">No enrollments found.</td></tr>
              ) : filteredEnrollments.map(e => (
                <tr key={e.id} className="hover:bg-[#252545] transition-colors">
                  <td className="px-5 py-4">
                    <div className="font-medium text-white">
                      {e.profiles ? `${e.profiles.first_name} ${e.profiles.last_name}`.trim() || '—' : '—'}
                    </div>
                  </td>
                  <td className="px-5 py-4 hidden md:table-cell">
                    {e.courses ? (
                      <Link href={`/admin/courses/${e.courses.id}`} className="text-indigo-400 hover:underline flex items-center gap-1.5">
                        <BookOpen className="w-3.5 h-3.5" />
                        {e.courses.title}
                      </Link>
                    ) : '—'}
                  </td>
                  <td className="px-5 py-4"><StatusBadge status={e.status as 'invited' | 'in_progress' | 'passed' | 'failed'} /></td>
                  <td className="px-5 py-4 hidden sm:table-cell text-slate-300">
                    {e.score !== null ? `${e.score}%` : '—'}
                  </td>
                  <td className="px-5 py-4">
                    {e.courses && (
                      <Link
                        href={`/admin/courses/${e.courses.id}`}
                        className="text-xs text-slate-500 hover:text-white transition-colors"
                      >
                        View →
                      </Link>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Invites table */}
      {tab === 'invites' && (
        <div className="bg-[#1a1a2e] border border-[#2a2a4a] rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#2a2a4a]">
                <th className="text-left px-5 py-3.5 text-xs text-slate-500 font-medium uppercase tracking-wide">Email</th>
                <th className="text-left px-5 py-3.5 text-xs text-slate-500 font-medium uppercase tracking-wide hidden md:table-cell">Course</th>
                <th className="text-left px-5 py-3.5 text-xs text-slate-500 font-medium uppercase tracking-wide">Status</th>
                <th className="px-5 py-3.5" />
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2a2a4a]/50">
              {filteredInvites.length === 0 ? (
                <tr><td colSpan={4} className="px-5 py-8 text-center text-slate-500 text-sm">No invites found.</td></tr>
              ) : filteredInvites.map(i => (
                <tr key={i.id} className="hover:bg-[#252545] transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-slate-500" />
                      <span className="text-white">{i.email}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 hidden md:table-cell">
                    {i.courses ? (
                      <Link href={`/admin/courses/${i.courses.id}`} className="text-indigo-400 hover:underline flex items-center gap-1.5">
                        <BookOpen className="w-3.5 h-3.5" />
                        {i.courses.title}
                      </Link>
                    ) : '—'}
                  </td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${
                      i.status === 'accepted' ? 'bg-emerald-500/10 text-emerald-400' :
                      i.status === 'pending'  ? 'bg-amber-500/10 text-amber-400' :
                      'bg-red-500/10 text-red-400'
                    }`}>
                      {i.status === 'accepted' ? <CheckCircle2 className="w-3 h-3" /> :
                       i.status === 'pending'  ? <Clock className="w-3 h-3" /> :
                       <XCircle className="w-3 h-3" />}
                      {i.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    {i.status === 'pending' && (
                      <button
                        onClick={() => resendInvite(i.id)}
                        disabled={!!resending || resent.has(i.id)}
                        className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-indigo-600/20 text-indigo-400 hover:bg-indigo-600/40 transition-colors cursor-pointer disabled:opacity-50"
                      >
                        <Send className="w-3 h-3" />
                        {resent.has(i.id) ? 'Sent ✓' : resending === i.id ? 'Sending…' : 'Resend'}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
