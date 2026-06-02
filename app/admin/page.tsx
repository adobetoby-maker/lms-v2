import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import Navbar from '@/components/Navbar'
import brand from '@/lib/brand'
import StatusBadge from '@/components/StatusBadge'
import { BookOpen, Users, Trophy, PlusCircle, ChevronRight, Clock } from 'lucide-react'

export default async function AdminPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .single()

  if (!profile?.is_admin) redirect('/dashboard')

  // Fetch all courses with counts
  const { data: courses } = await supabaseAdmin
    .from('courses')
    .select(`
      id,
      title,
      description,
      is_active,
      created_at,
      videos (id),
      questions (id),
      enrollments (id, status)
    `)
    .order('created_at', { ascending: false })

  const courseList = courses ?? []

  // Aggregate stats
  const totalEnrollments = courseList.reduce(
    (sum, c) => sum + (Array.isArray(c.enrollments) ? c.enrollments.length : 0),
    0
  )
  const totalCompletions = courseList.reduce(
    (sum, c) =>
      sum +
      (Array.isArray(c.enrollments)
        ? c.enrollments.filter(e => e.status === 'passed').length
        : 0),
    0
  )

  // Recent completions
  const { data: recentCompletions } = await supabaseAdmin
    .from('quiz_attempts')
    .select(`
      id,
      score,
      passed,
      attempted_at,
      courses (title),
      user_id
    `)
    .eq('passed', true)
    .order('attempted_at', { ascending: false })
    .limit(5)

  // Fetch emails for recent completions
  const userIds = [...new Set((recentCompletions ?? []).map(a => a.user_id))]
  const profileMap: Record<string, string> = {}
  if (userIds.length > 0) {
    const { data: profiles } = await supabaseAdmin
      .from('profiles')
      .select('id, first_name, last_name')
      .in('id', userIds)
    for (const p of profiles ?? []) {
      profileMap[p.id] = `${p.first_name} ${p.last_name}`.trim() || p.id
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a18]">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            {brand.logoPath && (
              <img src={brand.logoPath} alt={brand.logoAlt} className="h-10 w-auto object-contain mb-3" style={{ filter: 'brightness(0) invert(1)' }} />
            )}
            <h1 className="text-3xl font-bold text-white">{brand.name} — Admin</h1>
            <p className="text-slate-400 mt-1">Manage courses, learners, and completions.</p>
          </div>
          <Link
            href="/admin/courses"
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors"
          >
            <PlusCircle className="w-4 h-4" />
            Manage Courses
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-10">
          <div className="bg-[#1a1a2e] border border-[#2a2a4a] rounded-xl p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-600/20 flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-indigo-400" />
            </div>
            <div>
              <p className="text-3xl font-bold text-white">{courseList.length}</p>
              <p className="text-slate-400 text-sm">Total Courses</p>
            </div>
          </div>
          <div className="bg-[#1a1a2e] border border-[#2a2a4a] rounded-xl p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-600/20 flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <p className="text-3xl font-bold text-white">{totalEnrollments}</p>
              <p className="text-slate-400 text-sm">Total Enrollments</p>
            </div>
          </div>
          <div className="bg-[#1a1a2e] border border-[#2a2a4a] rounded-xl p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-600/20 flex items-center justify-center">
              <Trophy className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <p className="text-3xl font-bold text-white">{totalCompletions}</p>
              <p className="text-slate-400 text-sm">Completions</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Course list */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-semibold text-white">Courses</h2>
              <Link href="/admin/courses" className="text-sm text-indigo-400 hover:text-indigo-300">
                View all →
              </Link>
            </div>
            <div className="space-y-3">
              {courseList.length === 0 ? (
                <div className="bg-[#1a1a2e] border border-dashed border-[#2a2a4a] rounded-xl p-10 text-center">
                  <p className="text-slate-400">No courses yet. Create your first course.</p>
                </div>
              ) : (
                courseList.map(course => {
                  const videoCount = Array.isArray(course.videos) ? course.videos.length : 0
                  const questionCount = Array.isArray(course.questions) ? course.questions.length : 0
                  const enrollCount = Array.isArray(course.enrollments) ? course.enrollments.length : 0

                  return (
                    <Link
                      key={course.id}
                      href={`/admin/courses/${course.id}`}
                      className="flex items-center gap-4 bg-[#1a1a2e] border border-[#2a2a4a] hover:border-indigo-500/40 hover:bg-[#1e1e38] rounded-xl p-5 transition-all group cursor-pointer"
                    >
                      <div className="w-10 h-10 rounded-lg bg-indigo-600/20 flex items-center justify-center shrink-0">
                        <BookOpen className="w-5 h-5 text-indigo-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-white font-medium truncate">{course.title}</h3>
                          {!course.is_active && (
                            <span className="text-xs bg-slate-700 text-slate-400 px-2 py-0.5 rounded-full shrink-0">
                              Inactive
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500">
                          {videoCount} video{videoCount !== 1 ? 's' : ''} ·{' '}
                          {questionCount} question{questionCount !== 1 ? 's' : ''} ·{' '}
                          {enrollCount} enrolled
                        </p>
                      </div>
                      <span className="text-xs text-indigo-400 font-medium opacity-0 group-hover:opacity-100 transition-opacity shrink-0 mr-1">Edit →</span>
                      <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 shrink-0" />
                    </Link>
                  )
                })
              )}
            </div>
          </div>

          {/* Recent completions */}
          <div>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-semibold text-white">Recent Completions</h2>
              <Link href="/admin/completions" className="text-sm text-indigo-400 hover:text-indigo-300">
                All →
              </Link>
            </div>
            <div className="bg-[#1a1a2e] border border-[#2a2a4a] rounded-xl overflow-hidden">
              {!recentCompletions || recentCompletions.length === 0 ? (
                <div className="p-8 text-center">
                  <Trophy className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                  <p className="text-slate-400 text-sm">No completions yet.</p>
                </div>
              ) : (
                <div className="divide-y divide-[#2a2a4a]">
                  {recentCompletions.map(attempt => {
                    const course = Array.isArray(attempt.courses)
                      ? attempt.courses[0]
                      : attempt.courses
                    const name = profileMap[attempt.user_id] || 'Unknown'
                    const date = new Date(attempt.attempted_at).toLocaleDateString()

                    return (
                      <div key={attempt.id} className="px-5 py-4">
                        <div className="flex items-center justify-between mb-0.5">
                          <p className="text-white text-sm font-medium truncate">{name}</p>
                          <span className="text-emerald-400 text-sm font-bold shrink-0">
                            {attempt.score}%
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 truncate">
                          {course?.title ?? 'Unknown course'}
                        </p>
                        <div className="flex items-center gap-1 text-xs text-slate-600 mt-1">
                          <Clock className="w-3 h-3" />
                          {date}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
