import { createClient } from '@/lib/supabase/server'
import RegisterForm from './RegisterForm'

interface PageProps {
  params: Promise<{ token: string }>
}

export default async function RegisterPage({ params }: PageProps) {
  const { token } = await params
  const supabase = await createClient()

  // Validate invite token
  const { data: invite, error } = await supabase
    .from('invites')
    .select('id, email, course_id, is_used, expires_at')
    .eq('token', token)
    .single()

  if (error || !invite) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a18]">
        <div className="bg-[#1a1a2e] border border-red-500/30 rounded-2xl p-8 max-w-md w-full mx-4 text-center">
          <div className="text-4xl mb-4">⚠️</div>
          <h1 className="text-xl font-semibold text-white mb-2">Invalid Invite Link</h1>
          <p className="text-slate-400 text-sm">
            This invite link is invalid or does not exist. Please contact your administrator.
          </p>
        </div>
      </div>
    )
  }

  if (invite.is_used) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a18]">
        <div className="bg-[#1a1a2e] border border-amber-500/30 rounded-2xl p-8 max-w-md w-full mx-4 text-center">
          <div className="text-4xl mb-4">🔒</div>
          <h1 className="text-xl font-semibold text-white mb-2">Invite Already Used</h1>
          <p className="text-slate-400 text-sm">
            This invite link has already been used. If you already have an account,{' '}
            <a href="/login" className="text-indigo-400 hover:text-indigo-300 underline">
              sign in here
            </a>.
          </p>
        </div>
      </div>
    )
  }

  const now = new Date()
  const expiresAt = new Date(invite.expires_at)
  if (now > expiresAt) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a18]">
        <div className="bg-[#1a1a2e] border border-red-500/30 rounded-2xl p-8 max-w-md w-full mx-4 text-center">
          <div className="text-4xl mb-4">⏰</div>
          <h1 className="text-xl font-semibold text-white mb-2">Invite Expired</h1>
          <p className="text-slate-400 text-sm">
            This invite link expired on {expiresAt.toLocaleDateString()}. Please contact your administrator for a new invite.
          </p>
        </div>
      </div>
    )
  }

  return (
    <RegisterForm
      token={token}
      inviteId={invite.id}
      email={invite.email}
    />
  )
}
