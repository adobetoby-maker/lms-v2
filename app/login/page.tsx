'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { GraduationCap, Loader2, AlertCircle } from 'lucide-react'
import brand from '@/lib/brand'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSignIn(emailVal: string, passwordVal: string) {
    setLoading(true)
    setError(null)
    const supabase = createClient()

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: emailVal,
      password: passwordVal,
    })

    if (signInError) {
      setError(signInError.message)
      setLoading(false)
      return
    }

    // Check admin status
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      setError('Authentication failed.')
      setLoading(false)
      return
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .single()

    if (profile?.is_admin) {
      router.push('/admin')
    } else {
      router.push('/dashboard')
    }
    router.refresh()
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    await handleSignIn(email, password)
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[#0a0a18]">
      {/* Blue grid background */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(rgba(99,102,241,0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(99,102,241,0.3) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />
      {/* Radial glow */}
      <div className="absolute inset-0 bg-radial-gradient" style={{
        background: 'radial-gradient(ellipse at center, rgba(99,102,241,0.15) 0%, transparent 70%)'
      }} />

      {/* Card */}
      <div className="relative z-10 w-full max-w-md mx-4">
        <div className="bg-[#1a1a2e] border border-[#2a2a4a] rounded-2xl p-8 shadow-2xl">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            {brand.logoPath ? (
              <img
                src={brand.logoPath}
                alt={brand.logoAlt}
                className="h-10 w-auto object-contain"
                style={{ filter: 'brightness(0) invert(1)' }}
              />
            ) : (
              <>
                <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center">
                  <GraduationCap className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">{brand.name}</h1>
                  <p className="text-xs text-slate-400">{brand.tagline}</p>
                </div>
              </>
            )}
            {brand.logoPath && (
              <div className="border-l border-white/10 pl-3">
                <p className="text-xs text-slate-400 leading-tight">{brand.tagline}</p>
              </div>
            )}
          </div>

          <h2 className="text-2xl font-semibold text-white mb-1">Welcome back</h2>
          <p className="text-slate-400 text-sm mb-6">Sign in to your account to continue</p>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3 mb-5">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-1.5">
                Email address
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-[#0a0a18] border border-[#2a2a4a] rounded-lg px-4 py-2.5 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-1.5">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#0a0a18] border border-[#2a2a4a] rounded-lg px-4 py-2.5 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg py-2.5 text-sm transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Signing in…
                </>
              ) : (
                'Sign in'
              )}
            </button>
          </form>

          {/* Demo buttons */}
          <div className="mt-6 pt-6 border-t border-[#2a2a4a]">
            <p className="text-xs text-slate-500 mb-3 text-center">Quick demo access</p>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleSignIn('learner@demo.com', 'Learner123!')}
                disabled={loading}
                className="flex items-center justify-center gap-2 bg-[#0a0a18] hover:bg-[#252545] border border-[#2a2a4a] hover:border-indigo-500/50 rounded-lg px-3 py-2.5 text-sm text-slate-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>🎓</span>
                <span>Learner Demo</span>
              </button>
              <button
                onClick={() => handleSignIn('admin@demo.com', 'Admin123!')}
                disabled={loading}
                className="flex items-center justify-center gap-2 bg-[#0a0a18] hover:bg-[#252545] border border-[#2a2a4a] hover:border-indigo-500/50 rounded-lg px-3 py-2.5 text-sm text-slate-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>⚙️</span>
                <span>Admin Demo</span>
              </button>
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-slate-600 mt-4">
          Don&apos;t have an account? Ask your administrator for an invite link.
        </p>
      </div>
    </div>
  )
}
