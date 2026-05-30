import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Navbar from '@/components/Navbar'
import Link from 'next/link'
import {
  ArrowLeft, ShieldCheck, AlertTriangle, Building2, Stethoscope,
  HardHat, Cpu, Leaf, Plane, Scale, Bitcoin, FileText, Clock,
  ExternalLink, BookOpen,
} from 'lucide-react'

export const metadata = { title: 'Compliance Training Guide — LMS Admin' }

// ─── Data ────────────────────────────────────────────────────────────────────

interface Module {
  title: string
  description: string
  frequency: string
  required: boolean
}

interface Industry {
  id: string
  name: string
  icon: React.ReactNode
  color: string
  regulators: string[]
  overview: string
  modules: Module[]
  notes?: string
}

const INDUSTRIES: Industry[] = [
  {
    id: 'financial',
    name: 'Financial Services & Banking',
    icon: <Building2 className="w-5 h-5" />,
    color: 'blue',
    regulators: ['FINRA', 'SEC', 'OCC', 'FDIC', 'CFPB', 'FinCEN', 'Federal Reserve'],
    overview: 'Financial institutions face the most comprehensive compliance training requirements of any industry. Failure results in fines up to $1M+ per violation.',
    modules: [
      { title: 'Anti-Money Laundering (AML)', description: 'Red flags, suspicious activity reports (SARs), currency transaction reports (CTRs), structuring', frequency: 'Annual', required: true },
      { title: 'Bank Secrecy Act (BSA)', description: 'Recordkeeping, reporting requirements, customer due diligence, beneficial ownership', frequency: 'Annual', required: true },
      { title: 'Know Your Customer (KYC)', description: 'Customer identification program, enhanced due diligence, PEP screening', frequency: 'Annual', required: true },
      { title: 'Insider Trading Prevention', description: 'Material non-public information, blackout periods, pre-clearance, wall crossing', frequency: 'Annual', required: true },
      { title: 'FINRA Rules & Ethics', description: 'Suitability, best interest standard, communications with the public, gifts & entertainment', frequency: 'Annual', required: true },
      { title: 'Data Privacy (GLBA, CCPA)', description: 'Safeguards rule, privacy notices, opt-out rights, data breach response', frequency: 'Annual', required: true },
      { title: 'Cybersecurity Awareness', description: 'Phishing, social engineering, password hygiene, incident reporting, NIST framework', frequency: 'Semi-Annual', required: true },
      { title: 'OFAC Sanctions Compliance', description: 'Sanctioned countries/individuals, SDN list screening, blocking procedures', frequency: 'Annual', required: true },
      { title: 'Fair Lending (ECOA, HMDA)', description: 'Disparate treatment, disparate impact, redlining prevention, adverse action notices', frequency: 'Annual', required: true },
      { title: 'Market Manipulation Prevention', description: 'Spoofing, layering, wash trading, front-running — recognition and reporting', frequency: 'Annual', required: false },
    ],
    notes: 'New hires must complete AML, BSA, KYC, and Ethics before handling any client accounts. FINRA Rule 1240 mandates annual CE for registered reps.',
  },
  {
    id: 'crypto',
    name: 'Crypto / Digital Assets',
    icon: <Bitcoin className="w-5 h-5" />,
    color: 'amber',
    regulators: ['FinCEN', 'SEC', 'CFTC', 'FATF', 'State Money Transmitter Laws', 'MiCA (EU)'],
    overview: 'Digital asset businesses are money services businesses (MSBs) subject to BSA requirements plus evolving crypto-specific rules. The regulatory landscape shifts quarterly.',
    modules: [
      { title: 'Crypto AML Fundamentals', description: 'Travel Rule compliance, blockchain analytics, mixer/tumbler red flags, chain-hopping patterns', frequency: 'Annual', required: true },
      { title: 'Virtual Asset Service Provider (VASP) Rules', description: 'FATF Recommendation 15, VASP registration, counterparty VASP due diligence', frequency: 'Annual', required: true },
      { title: 'Wallet Screening & TRM/Chainalysis', description: 'Risk scoring, sanctions exposure, darknet market exposure, address clustering', frequency: 'Annual', required: true },
      { title: 'Travel Rule Compliance', description: 'Originator/beneficiary information requirements, threshold triggers, VASP verification', frequency: 'Annual', required: true },
      { title: 'Securities Law — When Tokens Are Securities', description: 'Howey test, Reves test, utility vs. security tokens, registration exemptions', frequency: 'Annual', required: true },
      { title: 'DeFi & Smart Contract Risk', description: 'Protocol interaction risks, bridge vulnerabilities, MEV, rug pull red flags', frequency: 'Annual', required: false },
      { title: 'Stablecoin Compliance', description: 'Reserve requirements, redemption rights, issuer due diligence', frequency: 'Annual', required: false },
      { title: 'NFT & Digital Asset Classification', description: 'IP rights, royalties, wash trading, market manipulation in NFT markets', frequency: 'Annual', required: false },
    ],
    notes: 'FinCEN requires MSBs (including crypto exchanges) to file SARs within 30 days. The Travel Rule applies to transfers ≥$3,000 for US MSBs.',
  },
  {
    id: 'medical',
    name: 'Healthcare & Medical',
    icon: <Stethoscope className="w-5 h-5" />,
    color: 'emerald',
    regulators: ['CMS', 'OSHA', 'FDA', 'DEA', 'Joint Commission (TJC)', 'State Medical Boards', 'OCR (HIPAA)'],
    overview: 'Healthcare compliance is patient safety + regulatory compliance. HIPAA violations can result in $1.9M+ per incident. Clinical staff have the most extensive annual training requirements.',
    modules: [
      { title: 'HIPAA Privacy Rule', description: 'PHI definition, minimum necessary standard, patient rights, authorization requirements', frequency: 'Annual', required: true },
      { title: 'HIPAA Security Rule', description: 'Administrative, physical, and technical safeguards, risk analysis, workforce training', frequency: 'Annual', required: true },
      { title: 'OSHA Bloodborne Pathogens', description: 'Universal precautions, exposure control plan, needlestick prevention, PPE use', frequency: 'Annual', required: true },
      { title: 'Infection Control & Prevention', description: 'Hand hygiene, isolation precautions, sterilization, HAI prevention, COVID protocols', frequency: 'Annual', required: true },
      { title: 'Emergency Preparedness (NIMS)', description: 'Disaster response, evacuation procedures, mass casualty incidents, ICS structure', frequency: 'Annual', required: true },
      { title: 'Patient Rights & Informed Consent', description: 'Advance directives, capacity assessment, surrogate decision-making, language access', frequency: 'Annual', required: true },
      { title: 'Medication Safety & High-Alert Drugs', description: 'Look-alike/sound-alike drugs, rights of medication administration, error reporting', frequency: 'Annual', required: true },
      { title: 'Corporate Integrity & False Claims Act', description: 'Anti-kickback statute, Stark Law, upcoding, unbundling, whistleblower protections', frequency: 'Annual', required: true },
      { title: 'Workplace Violence Prevention', description: 'De-escalation, type II violence (patient-to-staff), reporting, code procedures', frequency: 'Annual', required: true },
      { title: 'Cultural Competency & Health Equity', description: 'CLAS standards, implicit bias, interpreter services, LGBTQ+ affirming care', frequency: 'Annual', required: true },
      { title: 'DEA Controlled Substance Compliance', description: 'Schedules I-V, prescribing limits, diversion prevention, inventory reconciliation', frequency: 'Annual', required: false },
    ],
    notes: 'The Joint Commission surveys every 3 years but can conduct unannounced visits. 100% staff completion is required for HIPAA and Bloodborne Pathogens.',
  },
  {
    id: 'trades',
    name: 'Trades & Construction',
    icon: <HardHat className="w-5 h-5" />,
    color: 'orange',
    regulators: ['OSHA', 'EPA', 'NIOSH', 'State Labor Boards', 'NFPA', 'NEC (electrical)'],
    overview: 'Construction has the highest occupational fatality rate of any industry. OSHA\'s "Fatal Four" (falls, struck-by, caught-in, electrocution) cause 60% of deaths. Training is a primary legal defense.',
    modules: [
      { title: 'OSHA 10-Hour General Industry', description: 'Hazard recognition, rights & responsibilities, walking-working surfaces, PPE overview', frequency: 'Once (refresh every 3-5 yrs)', required: true },
      { title: 'OSHA 30-Hour Construction (Supervisors)', description: 'Full OSHA 29 CFR 1926 coverage, supervisory responsibility, recordkeeping 300 logs', frequency: 'Once (supervisors)', required: true },
      { title: 'Fall Protection', description: 'PFAS, guardrails, safety nets, aerial lifts, leading edge, rescue plans', frequency: 'Annual', required: true },
      { title: 'Hazard Communication (HazCom/GHS)', description: 'SDS, GHS labeling, chemical exposure limits, secondary labeling', frequency: 'Annual', required: true },
      { title: 'Lockout/Tagout (LOTO)', description: 'Energy control program, authorized vs. affected employees, group LOTO', frequency: 'Annual', required: true },
      { title: 'Electrical Safety (NFPA 70E)', description: 'Arc flash, shock protection, PPE categories, energized work permits', frequency: 'Annual', required: true },
      { title: 'Confined Space Entry', description: 'Permit-required vs. non-permit spaces, atmospheric testing, attendant duties', frequency: 'Annual', required: true },
      { title: 'Forklift / Powered Industrial Trucks', description: 'Pre-shift inspection, load capacity, pedestrian safety, tip-over procedures', frequency: 'Every 3 years or after incident', required: true },
      { title: 'Silica Dust Control (1926.1153)', description: 'Table 1 controls, exposure assessment, medical surveillance, written plan', frequency: 'Annual', required: true },
      { title: 'Scaffold Safety', description: 'Supported, suspended, rolling scaffolds — erection, use, fall protection', frequency: 'Annual', required: false },
      { title: 'Lead & Asbestos Awareness', description: 'Renovation/demolition triggers, OSHA 1926.62, EPA RRP rule, sampling protocols', frequency: 'Annual', required: false },
    ],
    notes: 'OSHA citations average $15,625 per serious violation, up to $156,259 for willful/repeated. A documented training program reduces fines by 20-40% via good faith credit.',
  },
  {
    id: 'hr',
    name: 'Human Resources & Employment',
    icon: <Scale className="w-5 h-5" />,
    color: 'purple',
    regulators: ['EEOC', 'DOL', 'NLRB', 'State Labor Commissioners', 'OFCCP (federal contractors)'],
    overview: 'Employment law training applies to ALL industries. Most employment lawsuits name the employer\'s failure to train as evidence of negligence. Many states now mandate specific training durations.',
    modules: [
      { title: 'Sexual Harassment Prevention', description: 'Quid pro quo, hostile work environment, supervisor vs. co-worker harassment, reporting', frequency: 'Annual (CA/NY/IL mandate)', required: true },
      { title: 'Discrimination & Equal Employment Opportunity', description: 'Protected classes, disparate treatment, disparate impact, retaliation prohibition', frequency: 'Annual', required: true },
      { title: 'Workplace Violence Prevention', description: 'Types I-IV, threat assessment, de-escalation, active shooter response', frequency: 'Annual', required: true },
      { title: 'ADA & Reasonable Accommodation', description: 'Interactive process, essential functions, undue hardship, direct threat defense', frequency: 'Annual', required: true },
      { title: 'Wage & Hour Compliance (FLSA)', description: 'Exempt vs. non-exempt, overtime, off-the-clock work, tip credit, FMLA interaction', frequency: 'Annual', required: true },
      { title: 'Leave Laws (FMLA, ADA, USERRA)', description: 'Eligibility, notice requirements, concurrent leave, retaliation prevention', frequency: 'Annual', required: true },
      { title: 'Manager Essentials: Hiring & Firing', description: 'Lawful interview questions, background checks, documentation, progressive discipline', frequency: 'Annual', required: true },
      { title: 'Diversity, Equity & Inclusion (DEI)', description: 'Implicit bias, microaggressions, bystander intervention, inclusive leadership', frequency: 'Annual', required: false },
    ],
    notes: 'California requires 2 hours of sexual harassment training for managers and 1 hour for all employees every 2 years. New York requires annual training for all employees.',
  },
  {
    id: 'tech',
    name: 'Technology & Software',
    icon: <Cpu className="w-5 h-5" />,
    color: 'cyan',
    regulators: ['FTC', 'NIST', 'SOC 2 auditors', 'ISO 27001 bodies', 'GDPR (EU)', 'CCPA', 'HIPAA (if health data)'],
    overview: 'Tech companies handling personal data face GDPR fines up to 4% of global annual revenue. SOC 2 certification (required by enterprise buyers) mandates documented security training.',
    modules: [
      { title: 'Security Awareness Fundamentals', description: 'Phishing/spear-phishing, social engineering, password managers, MFA, incident reporting', frequency: 'Quarterly', required: true },
      { title: 'Secure Coding Practices (OWASP Top 10)', description: 'Injection, broken auth, XSS, IDOR, security misconfiguration — recognition & prevention', frequency: 'Annual', required: true },
      { title: 'Data Privacy — GDPR & CCPA', description: 'Lawful basis, consent management, data subject rights, breach notification (72 hrs)', frequency: 'Annual', required: true },
      { title: 'Acceptable Use Policy', description: 'Company device use, shadow IT, software installation, personal use boundaries', frequency: 'Annual', required: true },
      { title: 'Incident Response Procedures', description: 'Classification, containment, eradication, recovery, lessons learned, tabletop drills', frequency: 'Annual', required: true },
      { title: 'Vendor & Third-Party Risk', description: 'SLAs, data processing agreements (DPAs), fourth-party risk, right-to-audit clauses', frequency: 'Annual', required: true },
      { title: 'AI Ethics & Responsible Use', description: 'Bias in ML, model transparency, prohibited use cases, data minimization in AI systems', frequency: 'Annual', required: false },
      { title: 'Insider Threat Awareness', description: 'Behavioral indicators, data exfiltration patterns, offboarding procedures', frequency: 'Annual', required: false },
    ],
    notes: 'SOC 2 Type II auditors will look for documented annual security training completion records. GDPR Article 39 requires DPOs to be involved in training programs.',
  },
  {
    id: 'food',
    name: 'Food Service & Hospitality',
    icon: <Leaf className="w-5 h-5" />,
    color: 'lime',
    regulators: ['FDA (FSMA)', 'USDA', 'CDC', 'State Health Departments', 'ServSafe / ANSI'],
    overview: 'Foodborne illness outbreaks cause an average of $1.9M in legal costs per incident. Health department closures average $50K/day in revenue loss. Most are 100% preventable through training.',
    modules: [
      { title: 'Food Handler Certification', description: 'Temperature danger zone, cross-contamination, personal hygiene, storage FIFO', frequency: 'Every 3 years (ServSafe)', required: true },
      { title: 'Food Manager Certification (ANSI)', description: 'HACCP principles, critical control points, corrective actions, record-keeping', frequency: 'Every 5 years', required: true },
      { title: 'Allergen Awareness', description: 'Big-9 allergens, cross-contact prevention, communication with guests, epinephrine', frequency: 'Annual', required: true },
      { title: 'Alcohol Service & TIPS Certification', description: 'Checking ID, signs of intoxication, responsible service, liability (dram shop laws)', frequency: 'Every 3 years', required: true },
      { title: 'Cleaning & Sanitizing Procedures', description: 'PPM concentrations, contact time, test strips, surface-specific protocols', frequency: 'Annual', required: true },
      { title: 'FSMA Preventive Controls', description: 'Hazard analysis, supply chain program, recall procedures, environmental monitoring', frequency: 'Annual', required: false },
    ],
    notes: 'Many states require at least 1 certified Food Protection Manager (CFM) per establishment. California, Illinois, and New York require all food handlers to be certified.',
  },
  {
    id: 'aviation',
    name: 'Aviation & Transportation',
    icon: <Plane className="w-5 h-5" />,
    color: 'sky',
    regulators: ['FAA', 'DOT', 'TSA', 'FMCSA (trucking)', 'FRA (rail)', 'PHMSA (hazmat)'],
    overview: 'Aviation has the highest regulatory training standards of any civilian industry. FAA violations can ground aircraft and revoke certificates. DOT drug testing is mandatory.',
    modules: [
      { title: 'DOT Drug & Alcohol Testing', description: 'Pre-employment, random, post-accident, reasonable suspicion, return-to-duty', frequency: 'Annual', required: true },
      { title: 'Security Awareness (DHS/TSA)', description: 'Insider threat, access control, prohibited items, suspicious activity reporting', frequency: 'Annual', required: true },
      { title: 'Hazardous Materials (IATA/49 CFR)', description: 'Classification, packaging, labeling, documentation, emergency response', frequency: 'Every 2 years (recurrent)', required: true },
      { title: 'SMS (Safety Management System)', description: 'Hazard identification, risk assessment, safety reporting culture, safety assurance', frequency: 'Annual', required: true },
      { title: 'FMCSA Hours of Service (trucking)', description: 'ELD requirements, 11/14-hour rule, 30-min break, 60/70-hour limits, exemptions', frequency: 'Annual', required: true },
    ],
    notes: 'FAA mandates recurrent training intervals in Part 121/135/91 operations. DOT drug/alcohol testing non-compliance can result in immediate removal from safety-sensitive functions.',
  },
]

// ─── Color map ────────────────────────────────────────────────────────────────

const colorMap: Record<string, string> = {
  blue:    'bg-blue-500/15 text-blue-400 border-blue-500/25',
  amber:   'bg-amber-500/15 text-amber-400 border-amber-500/25',
  emerald: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25',
  orange:  'bg-orange-500/15 text-orange-400 border-orange-500/25',
  purple:  'bg-purple-500/15 text-purple-400 border-purple-500/25',
  cyan:    'bg-cyan-500/15 text-cyan-400 border-cyan-500/25',
  lime:    'bg-lime-500/15 text-lime-400 border-lime-500/25',
  sky:     'bg-sky-500/15 text-sky-400 border-sky-500/25',
}

const iconBg: Record<string, string> = {
  blue:    'bg-blue-500/20 text-blue-400',
  amber:   'bg-amber-500/20 text-amber-400',
  emerald: 'bg-emerald-500/20 text-emerald-400',
  orange:  'bg-orange-500/20 text-orange-400',
  purple:  'bg-purple-500/20 text-purple-400',
  cyan:    'bg-cyan-500/20 text-cyan-400',
  lime:    'bg-lime-500/20 text-lime-400',
  sky:     'bg-sky-500/20 text-sky-400',
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function CompliancePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('is_admin').eq('id', user.id).single()
  if (!profile?.is_admin) redirect('/dashboard')

  return (
    <div className="min-h-screen bg-[#0a0a18]">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-20">

        {/* Header */}
        <div className="mb-10">
          <Link href="/admin" className="inline-flex items-center gap-2 text-slate-400 hover:text-white text-sm mb-5 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Admin
          </Link>
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-600/20 flex items-center justify-center shrink-0 mt-1">
              <ShieldCheck className="w-6 h-6 text-indigo-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Compliance Training Cheat Sheet</h1>
              <p className="text-slate-400 mt-1 max-w-2xl">
                Industry-by-industry guide to required training modules, regulatory bodies, and recommended course content. Use this to build your compliance curriculum.
              </p>
            </div>
          </div>

          {/* Quick stat */}
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Industries covered', value: INDUSTRIES.length.toString() },
              { label: 'Training modules listed', value: INDUSTRIES.reduce((a, i) => a + i.modules.length, 0).toString() },
              { label: 'Regulatory bodies', value: '40+' },
              { label: 'Avg modules per industry', value: Math.round(INDUSTRIES.reduce((a, i) => a + i.modules.length, 0) / INDUSTRIES.length).toString() },
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
            <strong className="text-amber-300">Disclaimer:</strong> This is a reference guide only. Compliance requirements vary by state, country, company size, and specific operations. Always consult qualified legal counsel and your industry&apos;s regulatory bodies to determine your exact training obligations.
          </p>
        </div>

        {/* Industry cards */}
        <div className="space-y-8">
          {INDUSTRIES.map(industry => (
            <div key={industry.id} className="bg-[#1a1a2e] border border-[#2a2a4a] rounded-2xl overflow-hidden">

              {/* Industry header */}
              <div className="p-6 border-b border-[#2a2a4a]">
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${iconBg[industry.color]}`}>
                    {industry.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2 className="text-xl font-bold text-white">{industry.name}</h2>
                    <p className="text-slate-400 text-sm mt-1">{industry.overview}</p>

                    {/* Regulators */}
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {industry.regulators.map(r => (
                        <span key={r} className={`text-xs px-2 py-0.5 rounded-full border ${colorMap[industry.color]}`}>
                          {r}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Create course link */}
                  <Link
                    href="/admin/courses"
                    className="shrink-0 flex items-center gap-1.5 text-xs bg-indigo-600/20 hover:bg-indigo-600/35 border border-indigo-500/30 text-indigo-300 px-3 py-2 rounded-lg transition-colors"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    Build Courses
                  </Link>
                </div>
              </div>

              {/* Modules table */}
              <div className="divide-y divide-[#2a2a4a]">
                {industry.modules.map((mod, i) => (
                  <div key={i} className="flex items-start gap-4 px-6 py-4 hover:bg-[#1e1e38] transition-colors">
                    <div className="flex items-center gap-2 shrink-0 mt-0.5">
                      {mod.required ? (
                        <span className="w-5 h-5 rounded-full bg-red-500/20 border border-red-500/40 flex items-center justify-center" title="Required by regulation">
                          <span className="text-red-400 text-[9px] font-bold">R</span>
                        </span>
                      ) : (
                        <span className="w-5 h-5 rounded-full bg-slate-700/40 border border-slate-600/40 flex items-center justify-center" title="Recommended">
                          <span className="text-slate-500 text-[9px] font-bold">•</span>
                        </span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-white text-sm font-medium">{mod.title}</p>
                        {mod.required && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-500/15 text-red-400 border border-red-500/25 font-medium">
                            REQUIRED
                          </span>
                        )}
                      </div>
                      <p className="text-slate-400 text-xs mt-0.5 leading-relaxed">{mod.description}</p>
                    </div>
                    <div className="shrink-0 flex items-center gap-1 text-xs text-slate-500 mt-0.5">
                      <Clock className="w-3 h-3" />
                      {mod.frequency}
                    </div>
                  </div>
                ))}
              </div>

              {/* Notes */}
              {industry.notes && (
                <div className="px-6 py-4 bg-[#0a0a18] border-t border-[#2a2a4a] flex items-start gap-2">
                  <FileText className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                  <p className="text-xs text-slate-400">{industry.notes}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer note */}
        <div className="mt-10 text-center">
          <p className="text-slate-500 text-sm">
            Need industry-specific content? Consider sourcing videos from{' '}
            <a href="https://www.linkedin.com/learning/" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline inline-flex items-center gap-0.5">LinkedIn Learning <ExternalLink className="w-3 h-3" /></a>,{' '}
            <a href="https://www.coursera.org/" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline inline-flex items-center gap-0.5">Coursera <ExternalLink className="w-3 h-3" /></a>,{' '}
            or <a href="https://www.oshaeducationcenter.com/" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline inline-flex items-center gap-0.5">OSHA Education Center <ExternalLink className="w-3 h-3" /></a>{' '}
            for pre-built compliance content.
          </p>
        </div>
      </main>
    </div>
  )
}
