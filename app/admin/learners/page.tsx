import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Navbar from '@/components/Navbar'
import Link from 'next/link'
import { ArrowLeft, Users, Mail, CheckCircle2, Clock, XCircle, BookOpen } from 'lucide-react'
import LearnersClient from './LearnersClient'

export const metadata = { title: 'Learner Management — LMS Admin' }

export default async function LearnersPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('is_admin').eq('id', user.id).single()
  if (!profile?.is_admin) redirect('/dashboard')

  // All enrollments with profile + course info
  const { data: enrollments } = await supabase
    .from('enrollments')
    .select(`
      id, status, score, completed_at, created_at,
      profiles:user_id(id, first_name, last_name, email:id),
      courses:course_id(id, title)
    `)
    .order('created_at', { ascending: false })

  // All invites
  const { data: invites } = await supabase
    .from('invites')
    .select(`
      id, email, status, created_at, expires_at,
      courses:course_id(id, title)
    `)
    .order('created_at', { ascending: false })

  // Stats
  const totalLearners = new Set([
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ...(enrollments ?? []).map(e => (e.profiles as any)?.id as string | undefined).filter(Boolean),
    ...(invites ?? []).map(i => i.email).filter(Boolean),
  ]).size

  const passed    = (enrollments ?? []).filter(e => e.status === 'passed').length
  const pending   = (invites ?? []).filter(i => i.status === 'pending').length
  const inProgress = (enrollments ?? []).filter(e => e.status === 'in_progress').length

  return (
    <div className="min-h-screen bg-[#0a0a18]">
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-20">

        <div className="mb-8">
          <Link href="/admin" className="inline-flex items-center gap-2 text-slate-400 hover:text-white text-sm mb-5 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Admin
          </Link>
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-600/20 flex items-center justify-center shrink-0 mt-1">
              <Users className="w-6 h-6 text-indigo-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Learner Management</h1>
              <p className="text-slate-400 mt-1">Invite, track, and manage all learners across every course.</p>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Total Learners', value: totalLearners, icon: Users, color: 'text-indigo-400' },
              { label: 'Passed',         value: passed,        icon: CheckCircle2, color: 'text-emerald-400' },
              { label: 'In Progress',    value: inProgress,    icon: Clock, color: 'text-amber-400' },
              { label: 'Pending Invites',value: pending,       icon: Mail, color: 'text-sky-400' },
            ].map(s => (
              <div key={s.label} className="bg-[#1a1a2e] border border-[#2a2a4a] rounded-xl p-4">
                <div className="flex items-center gap-2 mb-1">
                  <s.icon className={`w-4 h-4 ${s.color}`} />
                  <span className="text-xs text-slate-500">{s.label}</span>
                </div>
                <div className="text-2xl font-bold text-white">{s.value}</div>
              </div>
            ))}
          </div>
        </div>

        <LearnersClient
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          enrollments={(enrollments ?? []) as any}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          invites={(invites ?? []) as any}
        />
      </main>
    </div>
  )
}
