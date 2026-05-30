import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import Navbar from '@/components/Navbar'
import StatusBadge from '@/components/StatusBadge'
import { BookOpen, CheckCircle, Clock, PlayCircle, ChevronRight } from 'lucide-react'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  // Get profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('first_name, last_name, is_admin')
    .eq('id', user.id)
    .single()

  // Admin goes to admin panel
  if (profile?.is_admin) redirect('/admin')

  // Get enrollments with course data
  const { data: enrollments } = await supabase
    .from('enrollments')
    .select(`
      id,
      status,
      video_watched,
      invited_at,
      completed_at,
      courses (
        id,
        title,
        description,
        is_active
      )
    `)
    .eq('user_id', user.id)
    .order('invited_at', { ascending: false })

  type Enrollment = NonNullable<typeof enrollments>[number]

  const allEnrollments = enrollments ?? []
  const enrolled = allEnrollments.length
  const inProgress = allEnrollments.filter(e => e.status === 'in_progress').length
  const completed = allEnrollments.filter(e => e.status === 'passed').length
  const progressPct = enrolled > 0 ? Math.round((completed / enrolled) * 100) : 0

  const firstName = profile?.first_name?.trim() || 'there'

  function getVideoCount(e: Enrollment): number {
    // Video count isn't in this query, display a placeholder from enrollment data
    return e.video_watched ? 1 : 0
  }

  return (
    <div className="min-h-screen bg-[#0a0a18]">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Greeting */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-white mb-1">
            Welcome back, {firstName} 👋
          </h1>
          <p className="text-slate-400">
            {completed === enrolled && enrolled > 0
              ? 'You have completed all your courses. Great work!'
              : `You have ${enrolled - completed} course${enrolled - completed !== 1 ? 's' : ''} remaining.`}
          </p>
        </div>

        {/* Stats + progress */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
          {/* Progress card */}
          <div className="lg:col-span-2 bg-[#1a1a2e] border border-[#2a2a4a] rounded-xl p-6">
            <h2 className="text-sm font-medium text-slate-400 mb-4">Overall Progress</h2>
            <div className="flex items-end gap-4 mb-4">
              <span className="text-4xl font-bold text-white">{progressPct}%</span>
              <span className="text-slate-400 text-sm pb-1">
                {completed} of {enrolled} courses completed
              </span>
            </div>
            <div className="w-full bg-[#0a0a18] rounded-full h-3">
              <div
                className="bg-indigo-600 h-3 rounded-full transition-all duration-700"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>

          {/* Stat pills */}
          <div className="grid grid-cols-3 lg:grid-cols-1 gap-3">
            <div className="bg-[#1a1a2e] border border-[#2a2a4a] rounded-xl p-4 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-indigo-600/20 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-indigo-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{enrolled}</p>
                <p className="text-xs text-slate-400">Enrolled</p>
              </div>
            </div>
            <div className="bg-[#1a1a2e] border border-[#2a2a4a] rounded-xl p-4 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-blue-600/20 flex items-center justify-center">
                <Clock className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{inProgress}</p>
                <p className="text-xs text-slate-400">In Progress</p>
              </div>
            </div>
            <div className="bg-[#1a1a2e] border border-[#2a2a4a] rounded-xl p-4 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-600/20 flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{completed}</p>
                <p className="text-xs text-slate-400">Completed</p>
              </div>
            </div>
          </div>
        </div>

        {/* Course cards */}
        <div>
          <h2 className="text-xl font-semibold text-white mb-5">Your Courses</h2>

          {allEnrollments.length === 0 ? (
            <div className="bg-[#1a1a2e] border border-dashed border-[#2a2a4a] rounded-xl p-16 text-center">
              <div className="w-14 h-14 rounded-full bg-[#252545] flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-7 h-7 text-slate-500" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">No courses yet</h3>
              <p className="text-slate-400 text-sm max-w-sm mx-auto">
                You haven&apos;t been enrolled in any courses yet. Contact your administrator to get started.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {allEnrollments.map((enrollment) => {
                const course = Array.isArray(enrollment.courses)
                  ? enrollment.courses[0]
                  : enrollment.courses
                if (!course) return null

                const status = enrollment.status as 'invited' | 'in_progress' | 'passed' | 'failed'
                const isPassed = status === 'passed'
                const buttonLabel = status === 'invited' ? 'Start Course' : status === 'in_progress' ? 'Continue' : isPassed ? 'Review' : 'Retry'
                const buttonClass = isPassed
                  ? 'bg-emerald-600 hover:bg-emerald-500'
                  : 'bg-indigo-600 hover:bg-indigo-500'

                return (
                  <div
                    key={enrollment.id}
                    className="bg-[#1a1a2e] border border-[#2a2a4a] rounded-xl p-6 flex flex-col gap-4 hover:border-indigo-500/40 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="w-10 h-10 rounded-lg bg-indigo-600/20 flex items-center justify-center shrink-0">
                        <PlayCircle className="w-5 h-5 text-indigo-400" />
                      </div>
                      <StatusBadge status={status} />
                    </div>

                    <div className="flex-1">
                      <h3 className="text-white font-semibold text-base leading-tight mb-1.5">
                        {course.title}
                      </h3>
                      <p className="text-slate-400 text-sm line-clamp-2">
                        {course.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-[#2a2a4a]">
                      <div className="text-xs text-slate-500">
                        {enrollment.video_watched ? '✓ Video watched' : 'Video pending'}
                      </div>
                      <Link
                        href={`/course/${course.id}`}
                        className={`flex items-center gap-1.5 ${buttonClass} text-white text-xs font-medium px-3.5 py-1.5 rounded-lg transition-colors`}
                      >
                        {buttonLabel}
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
