import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import Navbar from '@/components/Navbar'
import { Trophy, Clock, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default async function AdminCompletionsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .single()

  if (!profile?.is_admin) redirect('/dashboard')

  // Fetch all quiz attempts with course
  const { data: attempts } = await supabaseAdmin
    .from('quiz_attempts')
    .select(`
      id,
      user_id,
      score,
      passed,
      correct_count,
      total_count,
      attempted_at,
      courses (title)
    `)
    .order('attempted_at', { ascending: false })

  const attemptList = attempts ?? []

  // Fetch profiles for user names/emails
  const userIds = [...new Set(attemptList.map(a => a.user_id))]
  const profileMap: Record<string, { name: string }> = {}
  if (userIds.length > 0) {
    const { data: profiles } = await supabaseAdmin
      .from('profiles')
      .select('id, first_name, last_name')
      .in('id', userIds)
    for (const p of profiles ?? []) {
      profileMap[p.id] = {
        name: `${p.first_name} ${p.last_name}`.trim() || 'Unknown',
      }
    }

    // Fetch emails from auth.users via admin
    const { data: { users: authUsers } } = await supabaseAdmin.auth.admin.listUsers()
    for (const u of authUsers) {
      if (profileMap[u.id] && u.email) {
        profileMap[u.id].name = profileMap[u.id].name || u.email
      }
    }
  }

  const passedCount = attemptList.filter(a => a.passed).length
  const failedCount = attemptList.filter(a => !a.passed).length
  const avgScore = attemptList.length > 0
    ? Math.round(attemptList.reduce((sum, a) => sum + a.score, 0) / attemptList.length)
    : 0

  return (
    <div className="min-h-screen bg-[#0a0a18]">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <Link
            href="/admin"
            className="flex items-center gap-2 text-slate-400 hover:text-white text-sm transition-colors mb-5"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-white">Quiz Completions</h1>
          <p className="text-slate-400 mt-1">All quiz attempts across all courses.</p>
        </div>

        {/* Summary stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-10">
          <div className="bg-[#1a1a2e] border border-[#2a2a4a] rounded-xl p-5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-indigo-600/20 flex items-center justify-center">
              <Trophy className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{attemptList.length}</p>
              <p className="text-slate-400 text-sm">Total Attempts</p>
            </div>
          </div>
          <div className="bg-[#1a1a2e] border border-[#2a2a4a] rounded-xl p-5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-emerald-600/20 flex items-center justify-center">
              <span className="text-emerald-400 font-bold text-sm">✓</span>
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{passedCount}</p>
              <p className="text-slate-400 text-sm">Passed · {failedCount} Failed</p>
            </div>
          </div>
          <div className="bg-[#1a1a2e] border border-[#2a2a4a] rounded-xl p-5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-blue-600/20 flex items-center justify-center">
              <span className="text-blue-400 font-bold text-sm">%</span>
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{avgScore}%</p>
              <p className="text-slate-400 text-sm">Average Score</p>
            </div>
          </div>
        </div>

        {/* Table */}
        {attemptList.length === 0 ? (
          <div className="bg-[#1a1a2e] border border-dashed border-[#2a2a4a] rounded-xl p-16 text-center">
            <Trophy className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-white mb-2">No attempts yet</h2>
            <p className="text-slate-400 text-sm">Quiz attempts will appear here once learners complete courses.</p>
          </div>
        ) : (
          <div className="bg-[#1a1a2e] border border-[#2a2a4a] rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#2a2a4a]">
                    <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wide">
                      Learner
                    </th>
                    <th className="text-left px-4 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wide">
                      Course
                    </th>
                    <th className="text-center px-4 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wide">
                      Score
                    </th>
                    <th className="text-center px-4 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wide hidden sm:table-cell">
                      Correct
                    </th>
                    <th className="text-center px-4 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wide">
                      Result
                    </th>
                    <th className="text-right px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wide hidden md:table-cell">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2a2a4a]">
                  {attemptList.map(attempt => {
                    const course = Array.isArray(attempt.courses)
                      ? attempt.courses[0]
                      : attempt.courses
                    const userInfo = profileMap[attempt.user_id]
                    const date = new Date(attempt.attempted_at)

                    return (
                      <tr key={attempt.id} className="hover:bg-[#252545] transition-colors">
                        <td className="px-6 py-4">
                          <p className="text-white text-sm font-medium">
                            {userInfo?.name ?? attempt.user_id.slice(0, 8)}
                          </p>
                        </td>
                        <td className="px-4 py-4">
                          <p className="text-slate-300 text-sm truncate max-w-[200px]">
                            {course?.title ?? 'Unknown'}
                          </p>
                        </td>
                        <td className="px-4 py-4 text-center">
                          <span className={`text-sm font-bold ${
                            attempt.score >= 70 ? 'text-emerald-400' : 'text-red-400'
                          }`}>
                            {attempt.score}%
                          </span>
                        </td>
                        <td className="px-4 py-4 text-center hidden sm:table-cell">
                          <span className="text-slate-400 text-sm">
                            {attempt.correct_count}/{attempt.total_count}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-center">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                            attempt.passed
                              ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                              : 'bg-red-500/15 text-red-400 border-red-500/30'
                          }`}>
                            {attempt.passed ? 'Passed' : 'Failed'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right hidden md:table-cell">
                          <div className="flex items-center justify-end gap-1.5 text-slate-500 text-xs">
                            <Clock className="w-3 h-3" />
                            {date.toLocaleDateString()} {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
