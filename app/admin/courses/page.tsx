import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import Navbar from '@/components/Navbar'
import CreateCourseForm from './CreateCourseForm'
import { BookOpen, PlusCircle, Video, HelpCircle, Users, Pencil } from 'lucide-react'

export default async function AdminCoursesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .single()

  if (!profile?.is_admin) redirect('/dashboard')

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
      enrollments (id)
    `)
    .order('created_at', { ascending: false })

  const courseList = courses ?? []

  return (
    <div className="min-h-screen bg-[#0a0a18]">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-start justify-between mb-10 gap-4 flex-wrap">
          <div>
            <h1 className="text-3xl font-bold text-white">Courses</h1>
            <p className="text-slate-400 mt-1">Manage all courses, videos, and questions.</p>
          </div>
          <CreateCourseForm />
        </div>

        {courseList.length === 0 ? (
          <div className="bg-[#1a1a2e] border border-dashed border-[#2a2a4a] rounded-xl p-16 text-center">
            <BookOpen className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-white mb-2">No courses yet</h2>
            <p className="text-slate-400 text-sm">Create your first course using the form above.</p>
          </div>
        ) : (
          <div className="bg-[#1a1a2e] border border-[#2a2a4a] rounded-xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#2a2a4a]">
                  <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wide">
                    Course
                  </th>
                  <th className="text-center px-4 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wide hidden sm:table-cell">
                    Videos
                  </th>
                  <th className="text-center px-4 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wide hidden sm:table-cell">
                    Questions
                  </th>
                  <th className="text-center px-4 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wide hidden md:table-cell">
                    Enrolled
                  </th>
                  <th className="text-center px-4 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wide">
                    Status
                  </th>
                  <th className="text-right px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wide">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2a2a4a]">
                {courseList.map(course => {
                  const videoCount = Array.isArray(course.videos) ? course.videos.length : 0
                  const questionCount = Array.isArray(course.questions) ? course.questions.length : 0
                  const enrollCount = Array.isArray(course.enrollments) ? course.enrollments.length : 0

                  return (
                    <tr key={course.id} className="hover:bg-[#252545] transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-indigo-600/20 flex items-center justify-center shrink-0">
                            <BookOpen className="w-4 h-4 text-indigo-400" />
                          </div>
                          <div>
                            <p className="text-white font-medium text-sm">{course.title}</p>
                            <p className="text-slate-500 text-xs truncate max-w-xs">
                              {course.description}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-center hidden sm:table-cell">
                        <div className="flex items-center justify-center gap-1.5 text-slate-300 text-sm">
                          <Video className="w-3.5 h-3.5 text-slate-500" />
                          {videoCount}
                        </div>
                      </td>
                      <td className="px-4 py-4 text-center hidden sm:table-cell">
                        <div className="flex items-center justify-center gap-1.5 text-slate-300 text-sm">
                          <HelpCircle className="w-3.5 h-3.5 text-slate-500" />
                          {questionCount}
                        </div>
                      </td>
                      <td className="px-4 py-4 text-center hidden md:table-cell">
                        <div className="flex items-center justify-center gap-1.5 text-slate-300 text-sm">
                          <Users className="w-3.5 h-3.5 text-slate-500" />
                          {enrollCount}
                        </div>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                          course.is_active
                            ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                            : 'bg-slate-700/50 text-slate-400 border-slate-600'
                        }`}>
                          {course.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link
                          href={`/admin/courses/${course.id}`}
                          className="inline-flex items-center gap-1.5 text-indigo-400 hover:text-indigo-300 text-sm font-medium transition-colors"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                          Edit
                        </Link>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  )
}
