import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { CertActions } from './CertActions'

interface Props {
  params: Promise<{ enrollmentId: string }>
}

export default async function CertificatePage({ params }: Props) {
  const { enrollmentId } = await params

  // Require authenticated user — certificates contain learner PII
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect(`/login?next=/certificate/${enrollmentId}`)

  // Fetch enrollment via admin client to join profiles, but enforce ownership below
  // Only fetch full_name (not email) to minimise PII exposure
  const { data: enrollment } = await supabaseAdmin
    .from('enrollments')
    .select(`
      id,
      completed_at,
      status,
      user_id,
      courses ( title, description ),
      profiles ( full_name )
    `)
    .eq('id', enrollmentId)
    .eq('status', 'passed')
    .single()

  if (!enrollment || !enrollment.completed_at) return notFound()

  // Only the owner or an admin may view this certificate
  const { data: profile } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .single()

  const isOwner = enrollment.user_id === user.id
  const isAdmin = !!profile?.is_admin
  if (!isOwner && !isAdmin) return notFound()

  const course = enrollment.courses as unknown as { title: string; description: string }
  const learnerProfile = enrollment.profiles as unknown as { full_name: string }

  const completedDate = new Date(enrollment.completed_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  // Use full_name only — never fall back to email (PII)
  const recipientName = learnerProfile?.full_name || 'Learner'
  const certId = `VC-${enrollmentId.slice(0, 8).toUpperCase()}`

  return (
    <>
      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }

        body {
          background: #0a0f0a;
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          font-family: 'Georgia', 'Times New Roman', serif;
        }

        .screen-actions {
          position: fixed;
          top: 24px;
          right: 24px;
          display: flex;
          gap: 12px;
          z-index: 100;
        }

        .btn {
          padding: 10px 20px;
          border-radius: 8px;
          font-family: system-ui, sans-serif;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          border: none;
          text-decoration: none;
          display: inline-block;
        }

        .btn-primary { background: #00ff87; color: #0a0a0a; }
        .btn-ghost { background: rgba(255,255,255,0.1); color: #fff; }

        .cert-wrapper {
          padding: 40px 20px;
          width: 100%;
          display: flex;
          justify-content: center;
        }

        .cert {
          width: 900px;
          min-height: 640px;
          background: #fff;
          position: relative;
          padding: 60px 70px;
          overflow: hidden;
        }

        /* Border frame */
        .cert::before {
          content: '';
          position: absolute;
          inset: 14px;
          border: 2px solid #00b560;
          pointer-events: none;
        }
        .cert::after {
          content: '';
          position: absolute;
          inset: 18px;
          border: 0.5px solid rgba(0,181,96,0.3);
          pointer-events: none;
        }

        /* Corner ornaments */
        .corner {
          position: absolute;
          width: 48px;
          height: 48px;
        }
        .corner-tl { top: 8px; left: 8px; }
        .corner-tr { top: 8px; right: 8px; transform: scaleX(-1); }
        .corner-bl { bottom: 8px; left: 8px; transform: scaleY(-1); }
        .corner-br { bottom: 8px; right: 8px; transform: scale(-1); }

        .cert-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 36px;
        }

        .logo-area {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .logo-mark {
          width: 48px;
          height: 48px;
        }

        .logo-text {
          font-family: system-ui, sans-serif;
          font-weight: 800;
          font-size: 22px;
          color: #0a2a0a;
          letter-spacing: -0.02em;
        }

        .logo-sub {
          font-family: system-ui, sans-serif;
          font-size: 10px;
          color: #00b560;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          font-weight: 600;
        }

        .cert-type {
          font-family: system-ui, sans-serif;
          font-size: 10px;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          color: #00b560;
          font-weight: 700;
          text-align: right;
        }

        .divider {
          height: 1px;
          background: linear-gradient(to right, transparent, #00b560, transparent);
          margin: 0 0 32px;
        }

        .cert-title {
          text-align: center;
          margin-bottom: 6px;
          font-size: 13px;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: #555;
          font-family: system-ui, sans-serif;
          font-weight: 500;
        }

        .cert-declares {
          text-align: center;
          font-size: 13px;
          color: #888;
          margin-bottom: 20px;
          font-family: system-ui, sans-serif;
        }

        .recipient {
          text-align: center;
          font-size: 48px;
          color: #0a1a0a;
          font-style: italic;
          margin-bottom: 20px;
          letter-spacing: 0.02em;
          line-height: 1.1;
        }

        .cert-body {
          text-align: center;
          font-size: 14px;
          color: #444;
          line-height: 1.8;
          margin-bottom: 32px;
          font-family: system-ui, sans-serif;
        }

        .course-name {
          display: block;
          font-size: 22px;
          font-weight: 700;
          color: #0a2a0a;
          font-family: 'Georgia', serif;
          font-style: italic;
          margin: 8px 0;
        }

        .cert-footer {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          margin-top: 40px;
        }

        .sig-block {
          text-align: center;
          min-width: 160px;
        }

        .sig-line {
          width: 160px;
          height: 1px;
          background: #333;
          margin: 0 auto 6px;
        }

        .sig-name {
          font-size: 12px;
          font-weight: 700;
          color: #0a2a0a;
          font-family: system-ui, sans-serif;
        }

        .sig-title {
          font-size: 10px;
          color: #888;
          font-family: system-ui, sans-serif;
          letter-spacing: 0.1em;
        }

        /* Vericore Seal */
        .seal-area {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
        }

        .seal {
          width: 100px;
          height: 100px;
        }

        .cert-id {
          font-size: 9px;
          color: #bbb;
          font-family: system-ui, sans-serif;
          letter-spacing: 0.12em;
          text-align: center;
        }

        .date-block {
          text-align: center;
          min-width: 160px;
        }

        .date-label {
          font-size: 10px;
          color: #888;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          font-family: system-ui, sans-serif;
          margin-bottom: 4px;
        }

        .date-value {
          font-size: 14px;
          color: #0a2a0a;
          font-family: system-ui, sans-serif;
          font-weight: 600;
        }

        @media print {
          body { background: white; }
          .screen-actions { display: none !important; }
          .cert-wrapper { padding: 0; }
          .cert {
            width: 100%;
            min-height: 100vh;
            box-shadow: none;
          }
          @page {
            size: landscape;
            margin: 0;
          }
        }
      `}</style>

      <CertActions />

      <div className="cert-wrapper">
        <div className="cert">
          {/* Corner ornaments */}
          {['corner corner-tl','corner corner-tr','corner corner-bl','corner corner-br'].map((c,i) => (
            <svg key={i} className={c} viewBox="0 0 48 48" fill="none">
              <path d="M4 44 L4 4 L44 4" stroke="#00b560" strokeWidth="2" fill="none"/>
              <circle cx="4" cy="4" r="3" fill="#00b560"/>
            </svg>
          ))}

          {/* Header */}
          <div className="cert-header">
            <div className="logo-area">
              {/* Vericore V logo */}
              <svg className="logo-mark" viewBox="0 0 48 48" fill="none">
                <circle cx="24" cy="24" r="23" stroke="#00b560" strokeWidth="1.5"/>
                <path d="M12 14 L24 34 L36 14" stroke="#00b560" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                <path d="M18 14 L24 26 L30 14" stroke="#00ff87" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
              </svg>
              <div>
                <div className="logo-text">VERICORE</div>
                <div className="logo-sub">Fractional Compliance · Blockchain</div>
              </div>
            </div>
            <div className="cert-type">
              Certificate of<br/>Completion
            </div>
          </div>

          <div className="divider" />

          {/* Body */}
          <div className="cert-title">This certifies that</div>
          <div className="recipient">{recipientName}</div>

          <div className="cert-body">
            has successfully completed the required coursework and assessment for
            <span className="course-name">{course.title}</span>
            demonstrating proficiency in compliance knowledge as required by<br/>
            Vericore CG's professional training standards.
          </div>

          {/* Footer */}
          <div className="cert-footer">
            {/* Signature */}
            <div className="sig-block">
              <div className="sig-line" />
              <div className="sig-name">Vericore Compliance Team</div>
              <div className="sig-title">Authorized Signatory</div>
            </div>

            {/* Seal */}
            <div className="seal-area">
              <svg className="seal" viewBox="0 0 100 100" fill="none">
                {/* Outer ring */}
                <circle cx="50" cy="50" r="47" stroke="#00b560" strokeWidth="1.5" strokeDasharray="4 2"/>
                {/* Inner ring */}
                <circle cx="50" cy="50" r="40" stroke="#00b560" strokeWidth="0.75"/>
                {/* Background fill */}
                <circle cx="50" cy="50" r="39" fill="rgba(0,181,96,0.04)"/>
                {/* V mark */}
                <path d="M32 36 L50 66 L68 36" stroke="#00b560" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M38 36 L50 58 L62 36" stroke="#00ff87" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                {/* Text arc top */}
                <text fill="#00b560" fontSize="7" fontFamily="system-ui" fontWeight="700" letterSpacing="2">
                  <textPath href="#topArc">VERICORE · CERTIFIED ·</textPath>
                </text>
                <path id="topArc" d="M 15,50 A 35,35 0 0,1 85,50" fill="none"/>
                {/* Text arc bottom */}
                <text fill="#00b560" fontSize="6.5" fontFamily="system-ui" fontWeight="600" letterSpacing="1.5">
                  <textPath href="#botArc">BLOCKCHAIN COMPLIANCE</textPath>
                </text>
                <path id="botArc" d="M 18,55 A 35,35 0 0,0 82,55" fill="none"/>
              </svg>
              <div className="cert-id">ID: {certId}</div>
            </div>

            {/* Date */}
            <div className="date-block">
              <div className="date-label">Date Issued</div>
              <div className="date-value">{completedDate}</div>
            </div>
          </div>
        </div>
      </div>

    </>
  )
}
