import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { GraduationCap, LayoutDashboard, Settings, ShieldCheck } from 'lucide-react'
import SignOutButton from './SignOutButton'

export default async function Navbar() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  const { data: profile } = await supabase
    .from('profiles')
    .select('first_name, last_name, is_admin')
    .eq('id', user.id)
    .single()

  const displayName = profile
    ? `${profile.first_name} ${profile.last_name}`.trim() || user.email
    : user.email

  return (
    <header className="sticky top-0 z-50 bg-[#0a0a18]/80 backdrop-blur-md border-b border-[#2a2a4a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href={profile?.is_admin ? '/admin' : '/dashboard'} className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center group-hover:bg-indigo-500 transition-colors">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-white text-lg">LMS</span>
          </Link>

          {/* Nav links */}
          <nav className="hidden sm:flex items-center gap-1">
            {profile?.is_admin ? (
              <>
                <Link
                  href="/admin"
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-slate-300 hover:text-white hover:bg-[#1a1a2e] transition-colors"
                >
                  <Settings className="w-4 h-4" />
                  Admin
                </Link>
                <Link
                  href="/admin/courses"
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-slate-300 hover:text-white hover:bg-[#1a1a2e] transition-colors"
                >
                  Courses
                </Link>
                <Link
                  href="/admin/completions"
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-slate-300 hover:text-white hover:bg-[#1a1a2e] transition-colors"
                >
                  Completions
                </Link>
                <Link
                  href="/admin/compliance"
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-slate-300 hover:text-white hover:bg-[#1a1a2e] transition-colors"
                >
                  <ShieldCheck className="w-4 h-4" />
                  Compliance
                </Link>
              </>
            ) : (
              <Link
                href="/dashboard"
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-slate-300 hover:text-white hover:bg-[#1a1a2e] transition-colors"
              >
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </Link>
            )}
          </nav>

          {/* User + sign out */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:block">
              <p className="text-sm text-white font-medium leading-none">{displayName}</p>
              {profile?.is_admin && (
                <p className="text-xs text-indigo-400 mt-0.5">Administrator</p>
              )}
            </div>
            <div className="w-px h-6 bg-[#2a2a4a] hidden sm:block" />
            <SignOutButton />
          </div>
        </div>
      </div>
    </header>
  )
}
