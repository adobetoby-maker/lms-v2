import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import Navbar from '@/components/Navbar'
import { AdminSurveysClient } from './SurveysClient'

export default async function AdminSurveysPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  const { data: profile } = await supabaseAdmin.from('profiles').select('is_admin').eq('id', user.id).single()
  if (!profile?.is_admin) redirect('/dashboard')
  return (
    <div className="min-h-screen bg-[#0a0a18]">
      <Navbar />
      <AdminSurveysClient />
    </div>
  )
}
