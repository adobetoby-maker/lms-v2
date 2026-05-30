import { redirect, notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import Navbar from '@/components/Navbar'
import CourseEditForm from './CourseEditForm'
import VideoManager from './VideoManager'
import QuestionManager from './QuestionManager'
import InviteForm from './InviteForm'
import { ArrowLeft } from 'lucide-react'
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

  const { data: videos } = await supabaseAdmin
    .from('videos')
    .select('id, title, url, duration_seconds, sort_order')
    .eq('course_id', courseId)
    .order('sort_order', { ascending: true })

  const { data: questions } = await supabaseAdmin
    .from('questions')
    .select('id, text, option_a, option_b, option_c, option_d, correct_answer')
    .eq('course_id', courseId)

  return (
    <div className="min-h-screen bg-[#0a0a18]">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <Link
            href="/admin/courses"
            className="flex items-center gap-2 text-slate-400 hover:text-white text-sm transition-colors mb-5"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Courses
          </Link>
          <h1 className="text-3xl font-bold text-white">{course.title}</h1>
          <p className="text-slate-400 mt-1">Edit course content, videos, questions, and invite learners.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Course details */}
            <CourseEditForm course={course} />

            {/* Videos */}
            <VideoManager
              courseId={courseId}
              videos={videos ?? []}
            />

            {/* Questions */}
            <QuestionManager
              courseId={courseId}
              questions={questions ?? []}
            />
          </div>

          <div>
            {/* Invite learner */}
            <InviteForm courseId={courseId} />
          </div>
        </div>
      </main>
    </div>
  )
}
