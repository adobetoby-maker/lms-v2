import { redirect, notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import Navbar from '@/components/Navbar'
import CourseEditForm from './CourseEditForm'
import VideoManager from './VideoManager'
import QuestionManager from './QuestionManager'
import LearnerManager from './LearnerManager'
import type { LearnerRow } from './LearnerManager'
import { ArrowLeft, BookOpen, Video, HelpCircle, Users } from 'lucide-react'
import Link from 'next/link'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function AdminCourseEditPage({ params }: PageProps) {
  const { id } = await params
  const courseId = Number(id)

  if (isNaN(courseId)) notFound()

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .single()

  if (!profile?.is_admin) redirect('/dashboard')

  const { data: course } = await supabaseAdmin
    .from('courses')
    .select('id, title, description, require_full_video_watch, is_active')
    .eq('id', courseId)
    .single()

  if (!course) notFound()

  // ── Videos ──────────────────────────────────────────────────────────────────
  const { data: videos } = await supabaseAdmin
    .from('videos')
    .select('id, title, url, duration_seconds, sort_order')
    .eq('course_id', courseId)
    .order('sort_order', { ascending: true })

  // ── Questions ────────────────────────────────────────────────────────────────
  const { data: questions } = await supabaseAdmin
    .from('questions')
    .select('id, text, option_a, option_b, option_c, option_d, correct_answer')
    .eq('course_id', courseId)

  // ── Learner data ─────────────────────────────────────────────────────────────

  // Enrolled learners with latest quiz attempt
  const { data: enrollments } = await supabaseAdmin
    .from('enrollments')
    .select(`
      id,
      user_id,
      status,
      video_watched,
      invited_at,
      completed_at,
      profiles!inner (
        first_name,
        last_name
      )
    `)
    .eq('course_id', courseId)

  // Latest quiz attempt per user
  const enrolledUserIds = (enrollments ?? []).map(e => e.user_id)

  let attemptsByUser: Map<string, { score: number; passed: boolean }> = new Map()
  if (enrolledUserIds.length > 0) {
    const { data: attempts } = await supabaseAdmin
      .from('quiz_attempts')
      .select('user_id, score, passed, attempted_at')
      .eq('course_id', courseId)
      .in('user_id', enrolledUserIds)
      .order('attempted_at', { ascending: false })

    // Keep only the most recent attempt per user
    if (attempts) {
      for (const attempt of attempts) {
        if (!attemptsByUser.has(attempt.user_id)) {
          attemptsByUser.set(attempt.user_id, { score: attempt.score, passed: attempt.passed })
        }
      }
    }
  }

  // Uninvited (invite not used, no enrollment)
  const { data: pendingInvites } = await supabaseAdmin
    .from('invites')
    .select('id, email, token, created_at')
    .eq('course_id', courseId)
    .eq('is_used', false)

  // Build unified learner rows
  const learnerRows: LearnerRow[] = []

  for (const enrollment of enrollments ?? []) {
    const attempt = attemptsByUser.get(enrollment.user_id)
    // Profiles join is typed as an array in supabase-js; normalise
    const prof = Array.isArray(enrollment.profiles)
      ? enrollment.profiles[0]
      : enrollment.profiles as { first_name: string; last_name: string } | null

    const firstName = prof?.first_name ?? ''
    const lastName = prof?.last_name ?? ''

    learnerRows.push({
      id: String(enrollment.id),
      name: `${firstName} ${lastName}`.trim(),
      email: '',              // profiles table doesn't store email — auth.users does; omit or fetch separately
      status: enrollment.status as LearnerRow['status'],
      score: attempt?.score ?? null,
      passed: attempt?.passed ?? null,
      date: enrollment.invited_at,
      userId: enrollment.user_id,
    })
  }

  // Fetch emails for enrolled users from auth.users via admin
  // We do a single batch using listUsers + filter by id
  const enrolledEmails = new Map<string, string>()
  if (enrolledUserIds.length > 0) {
    // supabaseAdmin.auth.admin.listUsers returns paginated data — fetch up to 1000
    const { data: usersData } = await supabaseAdmin.auth.admin.listUsers({ perPage: 1000 })
    if (usersData?.users) {
      for (const u of usersData.users) {
        if (enrolledUserIds.includes(u.id)) {
          enrolledEmails.set(u.id, u.email ?? '')
        }
      }
    }
  }

  // Patch emails back into learner rows
  for (const row of learnerRows) {
    if (row.userId) {
      row.email = enrolledEmails.get(row.userId) ?? ''
    }
  }

  // Add pending invite rows
  for (const invite of pendingInvites ?? []) {
    learnerRows.push({
      id: `invite-${invite.id}`,
      name: '',
      email: invite.email,
      status: 'invited',
      score: null,
      passed: null,
      date: invite.created_at,
      inviteToken: invite.token,
    })
  }

  // Sort: in_progress → invited → failed → passed, then by date desc
  const statusOrder: Record<LearnerRow['status'], number> = {
    in_progress: 0, invited: 1, failed: 2, passed: 3,
  }
  learnerRows.sort((a, b) => {
    const diff = statusOrder[a.status] - statusOrder[b.status]
    if (diff !== 0) return diff
    return new Date(b.date).getTime() - new Date(a.date).getTime()
  })

  // ── Summary ──────────────────────────────────────────────────────────────────
  const registeredCount = (enrollments ?? []).length
  const passedCount = learnerRows.filter(r => r.status === 'passed').length
  const failedCount = learnerRows.filter(r => r.status === 'failed').length
  const pendingCount = (pendingInvites ?? []).length + learnerRows.filter(r => r.status === 'invited' && !r.inviteToken).length
  const totalInvited = registeredCount + pendingCount

  const summary = {
    totalInvited,
    registered: registeredCount,
    passed: passedCount,
    failed: failedCount,
    pending: pendingCount,
  }

  return (
    <div className="min-h-screen bg-[#0a0a18]">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* ── Page header ──────────────────────────────────────────────────── */}
        <div className="mb-8">
          <Link
            href="/admin/courses"
            className="inline-flex items-center gap-2 text-slate-400 hover:text-white text-sm transition-colors mb-5"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Courses
          </Link>
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white">{course.title}</h1>
              <p className="text-slate-400 mt-1">
                Manage course content, videos, quiz questions, and learners.
              </p>
            </div>
            <span className={`mt-1 px-3 py-1 rounded-full text-xs font-medium border ${
              course.is_active
                ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25'
                : 'bg-slate-700/40 text-slate-500 border-slate-700/40'
            }`}>
              {course.is_active ? 'Active' : 'Inactive'}
            </span>
          </div>
        </div>

        <div className="space-y-8">
          {/* ── Course Details ──────────────────────────────────────────────── */}
          <Section icon={<BookOpen className="w-4 h-4" />} title="Course Details">
            <CourseEditForm course={course} />
          </Section>

          {/* ── Videos ─────────────────────────────────────────────────────── */}
          <Section icon={<Video className="w-4 h-4" />} title="Videos">
            <VideoManager
              courseId={courseId}
              videos={videos ?? []}
            />
          </Section>

          {/* ── Quiz Questions ──────────────────────────────────────────────── */}
          <Section icon={<HelpCircle className="w-4 h-4" />} title="Quiz">
            <QuestionManager
              courseId={courseId}
              questions={questions ?? []}
              requireFullVideoWatch={course.require_full_video_watch}
            />
          </Section>

          {/* ── Learner Management ──────────────────────────────────────────── */}
          <Section icon={<Users className="w-4 h-4" />} title="Learners">
            <LearnerManager
              courseId={courseId}
              learners={learnerRows}
              summary={summary}
            />
          </Section>
        </div>
      </main>
    </div>
  )
}

// ─── Section wrapper ──────────────────────────────────────────────────────────

function Section({
  icon, title, children,
}: {
  icon: React.ReactNode
  title: string
  children: React.ReactNode
}) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <span className="text-indigo-400">{icon}</span>
        <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{title}</h2>
      </div>
      {children}
    </div>
  )
}
