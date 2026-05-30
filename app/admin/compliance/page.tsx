import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Navbar from '@/components/Navbar'
import Link from 'next/link'
import { ArrowLeft, ShieldCheck, AlertTriangle, ExternalLink } from 'lucide-react'
import { COMPLIANCE_TEMPLATES } from '@/lib/compliance-templates'
import ComplianceClient from './ComplianceClient'

export const metadata = { title: 'Compliance Training Guide — LMS Admin' }

export default async function CompliancePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('is_admin').eq('id', user.id).single()
  if (!profile?.is_admin) redirect('/dashboard')

  const totalModules = COMPLIANCE_TEMPLATES.reduce((a, t) => a + t.questions.length, 0)
  const totalSlides  = COMPLIANCE_TEMPLATES.reduce((a, t) => a + t.slides.length, 0)
  const freeCount    = COMPLIANCE_TEMPLATES.reduce((a, t) => a + t.sources.filter(s => s.type !== 'paid').length, 0)

  return (
    <div className="min-h-screen bg-[#0a0a18]">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-20">

        {/* Header */}
        <div className="mb-8">
          <Link href="/admin" className="inline-flex items-center gap-2 text-slate-400 hover:text-white text-sm mb-5 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Admin
          </Link>
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-600/20 flex items-center justify-center shrink-0 mt-1">
              <ShieldCheck className="w-6 h-6 text-indigo-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Compliance Training Templates</h1>
              <p className="text-slate-400 mt-1 max-w-2xl">
                One-click course creation with pre-built questions, scenario slideshows, and curated sources.
                Each template is audit-ready out of the box.
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Templates', value: COMPLIANCE_TEMPLATES.length.toString() },
              { label: 'Pre-built questions', value: totalModules.toString() },
              { label: 'Scenario slides', value: totalSlides.toString() },
              { label: 'Free sources', value: freeCount.toString() },
            ].map(s => (
              <div key={s.label} className="bg-[#1a1a2e] border border-[#2a2a4a] rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-white">{s.value}</div>
                <div className="text-xs text-slate-500 mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Disclaimer */}
        <div className="flex items-start gap-3 bg-amber-500/8 border border-amber-500/25 rounded-xl p-4 mb-8">
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <p className="text-amber-200/80 text-sm">
            <strong className="text-amber-300">Reference only.</strong>{' '}
            Requirements vary by jurisdiction, company size, and operations.
            Always verify with qualified legal counsel. Course creation is instant — add your own videos via the course editor.
          </p>
        </div>

        {/* Interactive template list */}
        <ComplianceClient templates={COMPLIANCE_TEMPLATES} />

        {/* Footer */}
        <div className="mt-10 text-center">
          <p className="text-slate-500 text-sm">
            Video sources:{' '}
            {[
              { label: 'LinkedIn Learning', url: 'https://www.linkedin.com/learning/' },
              { label: 'Coursera', url: 'https://www.coursera.org/' },
              { label: 'OSHA Education Center', url: 'https://www.oshaeducationcenter.com/' },
            ].map((s, i) => (
              <span key={s.label}>
                {i > 0 && ' · '}
                <a href={s.url} target="_blank" rel="noopener noreferrer"
                   className="text-indigo-400 hover:underline inline-flex items-center gap-0.5">
                  {s.label} <ExternalLink className="w-3 h-3" />
                </a>
              </span>
            ))}
          </p>
        </div>
      </main>
    </div>
  )
}
