'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { ComplianceTemplate, Slide } from '@/lib/compliance-templates'
import {
  BookOpen, ExternalLink, ChevronDown, ChevronUp, PlayCircle,
  Plus, Loader2, CheckCircle2, XCircle, ChevronRight, ChevronLeft,
  Sparkles, Link2,
} from 'lucide-react'

// ─── Safe bold renderer — splits **text** into React <strong> nodes, no innerHTML ──

function renderBoldSegments(text: string): React.ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*)/g)
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className="text-white">{part.slice(2, -2)}</strong>
    }
    return <span key={i}>{part}</span>
  })
}

// ─── Scenario slide player ───────────────────────────────────────────────────

function SlidePlayer({ slides, onClose }: { slides: Slide[]; onClose: () => void }) {
  const [idx, setIdx] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [revealed, setRevealed] = useState(false)
  const [score, setScore] = useState(0)
  const [done, setDone] = useState(false)

  const slide = slides[idx]
  const isLast = idx === slides.length - 1
  const hasScenario = !!slide?.scenario

  function handleAnswer(i: number) {
    if (revealed) return
    setSelected(i)
    setRevealed(true)
    if (i === slide.correct) setScore(s => s + 1)
  }

  function next() {
    if (isLast) { setDone(true); return }
    setIdx(i => i + 1)
    setSelected(null)
    setRevealed(false)
  }

  const scenarioSlides = slides.filter(s => s.scenario)

  if (done) {
    const pct = scenarioSlides.length > 0
      ? Math.round((score / scenarioSlides.length) * 100)
      : 100
    return (
      <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="bg-[#1a1a2e] border border-[#2a2a4a] rounded-2xl p-8 max-w-md w-full text-center">
          {pct >= 70
            ? <CheckCircle2 className="w-14 h-14 text-emerald-400 mx-auto mb-4" />
            : <XCircle className="w-14 h-14 text-red-400 mx-auto mb-4" />}
          <h2 className="text-2xl font-bold text-white mb-2">
            {pct >= 70 ? 'Module Complete!' : 'Review Recommended'}
          </h2>
          <p className="text-4xl font-black mb-2" style={{ color: pct >= 70 ? '#34d399' : '#f87171' }}>
            {pct}%
          </p>
          {scenarioSlides.length > 0 && (
            <p className="text-slate-400 text-sm mb-6">
              {score} of {scenarioSlides.length} scenario questions correct
            </p>
          )}
          <button
            onClick={onClose}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 rounded-xl transition-colors"
          >
            Close Module
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#0a0a18] border border-[#2a2a4a] rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#2a2a4a] sticky top-0 bg-[#0a0a18]">
          <div className="flex items-center gap-3">
            <PlayCircle className="w-5 h-5 text-indigo-400" />
            <span className="text-white font-semibold text-sm">Slide {idx + 1} of {slides.length}</span>
          </div>
          <div className="flex items-center gap-3">
            {/* Progress dots */}
            <div className="flex gap-1">
              {slides.map((_, i) => (
                <div key={i} className={`w-2 h-2 rounded-full transition-colors ${i === idx ? 'bg-indigo-400' : i < idx ? 'bg-emerald-500' : 'bg-[#2a2a4a]'}`} />
              ))}
            </div>
            <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors text-lg leading-none">×</button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          <h2 className="text-xl font-bold text-white">{slide.title}</h2>

          {/* Body — safe markdown-lite renderer (no dangerouslySetInnerHTML) */}
          <div className="text-slate-300 text-sm leading-relaxed">
            {slide.body.split('\n').map((line, i) => (
              <p key={i} className="mb-1 min-h-[1em]">
                {line ? renderBoldSegments(line) : null}
              </p>
            ))}
          </div>

          {/* Scenario */}
          {hasScenario && (
            <div className="bg-[#1a1a2e] border border-[#2a2a4a] rounded-xl p-5 space-y-4">
              <p className="text-white font-medium text-sm">
                <span className="text-indigo-400 font-bold">Scenario: </span>
                {slide.scenario}
              </p>
              <div className="space-y-2">
                {slide.options!.map((opt, i) => {
                  const isCorrect = i === slide.correct
                  const isSelected = i === selected
                  let cls = 'bg-[#0a0a18] border-[#2a2a4a] text-slate-300 hover:border-indigo-500/50'
                  if (revealed) {
                    if (isCorrect) cls = 'bg-emerald-500/15 border-emerald-500 text-emerald-300'
                    else if (isSelected) cls = 'bg-red-500/15 border-red-500 text-red-300'
                    else cls = 'bg-[#0a0a18] border-[#2a2a4a] text-slate-500'
                  }
                  return (
                    <button
                      key={i}
                      onClick={() => handleAnswer(i)}
                      className={`w-full text-left flex items-start gap-3 px-4 py-3 rounded-lg border text-sm transition-colors ${cls}`}
                    >
                      <span className="shrink-0 font-bold">{String.fromCharCode(65 + i)}.</span>
                      <span>{opt}</span>
                      {revealed && isCorrect && <CheckCircle2 className="w-4 h-4 shrink-0 ml-auto text-emerald-400" />}
                      {revealed && isSelected && !isCorrect && <XCircle className="w-4 h-4 shrink-0 ml-auto text-red-400" />}
                    </button>
                  )
                })}
              </div>
              {revealed && slide.tip && (
                <div className="bg-indigo-500/10 border border-indigo-500/25 rounded-lg p-3 text-xs text-indigo-300">
                  <strong>Explanation: </strong>{slide.tip}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Nav */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-[#2a2a4a] sticky bottom-0 bg-[#0a0a18]">
          <button
            onClick={() => { setIdx(i => i - 1); setSelected(null); setRevealed(false) }}
            disabled={idx === 0}
            className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-white disabled:opacity-30 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" /> Previous
          </button>

          {hasScenario && !revealed ? (
            <span className="text-xs text-slate-500">Select an answer to continue</span>
          ) : (
            <button
              onClick={next}
              className="flex items-center gap-1.5 text-sm bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg transition-colors"
            >
              {isLast ? 'Finish' : 'Next'} <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Template card ───────────────────────────────────────────────────────────

function TemplateCard({ template }: { template: ComplianceTemplate }) {
  const router = useRouter()
  const [expanded, setExpanded] = useState(false)
  const [creating, setCreating] = useState(false)
  const [created, setCreated] = useState<{ courseId: number; title: string } | null>(null)
  const [playing, setPlaying] = useState(false)

  const colorMap: Record<string, string> = {
    Finance: 'bg-blue-500/15 text-blue-400 border-blue-500/25',
    Banking: 'bg-blue-500/15 text-blue-400 border-blue-500/25',
    Crypto: 'bg-amber-500/15 text-amber-400 border-amber-500/25',
    Healthcare: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25',
    HIPAA: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25',
    Construction: 'bg-orange-500/15 text-orange-400 border-orange-500/25',
    OSHA: 'bg-orange-500/15 text-orange-400 border-orange-500/25',
    HR: 'bg-purple-500/15 text-purple-400 border-purple-500/25',
    Technology: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/25',
    Cybersecurity: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/25',
    Annual: 'bg-slate-600/30 text-slate-400 border-slate-600/30',
    default: 'bg-slate-700/30 text-slate-400 border-slate-600/25',
  }

  async function createCourse() {
    setCreating(true)
    const res = await fetch('/api/compliance/create-course', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ templateId: template.id }),
    })
    const data = await res.json()
    if (res.ok) {
      setCreated(data)
    }
    setCreating(false)
  }

  return (
    <div className="bg-[#1a1a2e] border border-[#2a2a4a] rounded-2xl overflow-hidden">
      {playing && <SlidePlayer slides={template.slides} onClose={() => setPlaying(false)} />}

      {/* Header */}
      <div className="p-5">
        <div className="flex items-start gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-2">
              <h3 className="text-base font-bold text-white">{template.title}</h3>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed mb-3">{template.description}</p>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5 mb-3">
              {template.tags.slice(0, 6).map(tag => (
                <span key={tag} className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${colorMap[tag] ?? colorMap.default}`}>
                  {tag}
                </span>
              ))}
              <span className="text-[10px] px-2 py-0.5 rounded-full border bg-slate-700/30 text-slate-500 border-slate-600/25">
                {template.frequency}
              </span>
            </div>

            {/* Meta */}
            <div className="flex items-center gap-4 text-xs text-slate-500">
              <span>{template.questions.length} questions</span>
              <span>{template.slides.length} slides</span>
              <span>{template.slides.filter(s => s.scenario).length} scenarios</span>
              <span>{template.sources.length} sources</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-2 shrink-0">
            {created ? (
              <button
                onClick={() => router.push(`/admin/courses/${created.courseId}`)}
                className="flex items-center gap-1.5 text-xs bg-emerald-600/20 hover:bg-emerald-600/35 border border-emerald-500/30 text-emerald-300 px-3 py-2 rounded-lg transition-colors"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                Open Course
              </button>
            ) : (
              <button
                onClick={createCourse}
                disabled={creating}
                className="flex items-center gap-1.5 text-xs bg-indigo-600/20 hover:bg-indigo-600/35 border border-indigo-500/30 text-indigo-300 px-3 py-2 rounded-lg transition-colors disabled:opacity-40"
              >
                {creating
                  ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  : <Plus className="w-3.5 h-3.5" />}
                {creating ? 'Creating…' : 'Create Course'}
              </button>
            )}
            <button
              onClick={() => setPlaying(true)}
              className="flex items-center gap-1.5 text-xs bg-violet-600/20 hover:bg-violet-600/35 border border-violet-500/30 text-violet-300 px-3 py-2 rounded-lg transition-colors"
            >
              <PlayCircle className="w-3.5 h-3.5" />
              Preview Slides
            </button>
          </div>
        </div>

        {/* Expand toggle */}
        <button
          onClick={() => setExpanded(e => !e)}
          className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 mt-3 transition-colors"
        >
          {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          {expanded ? 'Hide details' : 'Show questions & sources'}
        </button>
      </div>

      {/* Expanded: questions + sources */}
      {expanded && (
        <div className="border-t border-[#2a2a4a] divide-y divide-[#2a2a4a]">

          {/* Questions preview */}
          <div className="p-5">
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-violet-400" />
              Pre-built Questions ({template.questions.length})
            </h4>
            <div className="space-y-2">
              {template.questions.map((q, i) => (
                <div key={i} className="flex items-start gap-2 text-xs">
                  <span className="text-indigo-400 font-bold shrink-0 mt-0.5">{i + 1}.</span>
                  <div className="flex-1">
                    <p className="text-slate-300">{q.text}</p>
                    <p className="text-slate-600 mt-0.5">
                      Correct: <span className="text-emerald-500 font-medium">{q[`option_${q.correct_answer.toLowerCase()}` as keyof typeof q]}</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sources */}
          <div className="p-5">
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Link2 className="w-3.5 h-3.5 text-blue-400" />
              Curated Sources
            </h4>
            <div className="space-y-2">
              {template.sources.map((src, i) => (
                <a
                  key={i}
                  href={src.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3 p-3 rounded-lg bg-[#0a0a18] border border-[#2a2a4a] hover:border-indigo-500/40 transition-colors group"
                >
                  <div className={`shrink-0 px-2 py-0.5 rounded text-[9px] font-bold uppercase mt-0.5 ${
                    src.type === 'government' ? 'bg-blue-500/20 text-blue-400' :
                    src.type === 'free' ? 'bg-emerald-500/20 text-emerald-400' :
                    'bg-amber-500/20 text-amber-400'
                  }`}>
                    {src.type === 'government' ? 'GOV' : src.type === 'free' ? 'FREE' : 'PAID'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-xs font-medium group-hover:text-indigo-300 transition-colors">{src.label}</p>
                    <p className="text-slate-500 text-[10px] mt-0.5 leading-relaxed">{src.description}</p>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-600 group-hover:text-indigo-400 shrink-0 mt-0.5 transition-colors" />
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Main export ─────────────────────────────────────────────────────────────

export default function ComplianceClient({ templates }: { templates: ComplianceTemplate[] }) {
  const [filter, setFilter] = useState<string>('All')
  const industries = ['All', ...Array.from(new Set(templates.map(t => t.industry)))]

  const filtered = filter === 'All' ? templates : templates.filter(t => t.industry === filter)

  return (
    <div className="space-y-6">
      {/* Filter pills */}
      <div className="flex gap-2 flex-wrap">
        {industries.map(ind => (
          <button
            key={ind}
            onClick={() => setFilter(ind)}
            className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
              filter === ind
                ? 'bg-indigo-600 border-indigo-600 text-white'
                : 'bg-transparent border-[#2a2a4a] text-slate-400 hover:text-white hover:border-slate-500'
            }`}
          >
            {ind}
          </button>
        ))}
      </div>

      {/* Template cards */}
      {filtered.map(t => <TemplateCard key={t.id} template={t} />)}
    </div>
  )
}
