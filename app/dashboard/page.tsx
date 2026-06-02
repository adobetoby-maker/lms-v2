import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Navbar from '@/components/Navbar'
import { DashboardClient } from './DashboardClient'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('first_name, is_admin')
    .eq('id', user.id)
    .single()

  if (profile?.is_admin) redirect('/admin')

  const { data: enrollments } = await supabase
    .from('enrollments')
    .select(`
      id,
      status,
      video_watched,
      invited_at,
      completed_at,
      courses ( id, title, description, is_active )
    `)
    .eq('user_id', user.id)
    .order('invited_at', { ascending: false })

  const { data: attempts } = await supabase
    .from('quiz_attempts')
    .select('course_id, score, passed')
    .eq('user_id', user.id)

  const firstName = profile?.first_name?.trim() || 'there'

  return (
    <div className="min-h-screen bg-[#0a0a18]">
      <Navbar />
      <DashboardClient
        firstName={firstName}
        enrollments={(enrollments ?? []) as unknown as Parameters<typeof DashboardClient>[0]["enrollments"]}
        attempts={attempts ?? []}
      />
    </div>
  )
}
