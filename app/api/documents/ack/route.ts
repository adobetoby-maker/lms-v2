import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { supabaseAdmin } from '@/lib/supabase/admin'

export const dynamic = 'force-dynamic'

// POST — acknowledge a document
export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { document_id } = await req.json() as { document_id: string }
  if (!document_id) return NextResponse.json({ error: 'document_id required' }, { status: 400 })

  await supabaseAdmin.from('document_acks').upsert(
    { document_id, user_id: user.id, acked_at: new Date().toISOString() },
    { onConflict: 'document_id,user_id' }
  )

  return NextResponse.json({ ok: true })
}

// GET — compliance report (admin only) — who has/hasn't acked required docs
export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: profile } = await supabaseAdmin
    .from('profiles').select('is_admin').eq('id', user.id).single()
  if (!profile?.is_admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { data: requiredDocs } = await supabaseAdmin
    .from('documents')
    .select('id, title, category')
    .eq('requires_ack', true)

  const { data: allProfiles } = await supabaseAdmin
    .from('profiles')
    .select('id, first_name, last_name')

  const { data: allAcks } = await supabaseAdmin
    .from('document_acks')
    .select('document_id, user_id, acked_at')

  const ackMap = new Map<string, string>()
  for (const ack of allAcks ?? []) {
    ackMap.set(`${ack.document_id}:${ack.user_id}`, ack.acked_at)
  }

  const report = (requiredDocs ?? []).map((doc: { id: string; title: string; category: string }) => {
    const staffStatus = (allProfiles ?? []).map((p: { id: string; first_name: string; last_name: string }) => ({
      name: `${p.first_name} ${p.last_name}`.trim(),
      acknowledged: ackMap.has(`${doc.id}:${p.id}`),
      acked_at: ackMap.get(`${doc.id}:${p.id}`) ?? null,
    }))

    const ackedCount = staffStatus.filter((s: { acknowledged: boolean }) => s.acknowledged).length
    return {
      document: doc,
      total_staff: staffStatus.length,
      acked: ackedCount,
      pending: staffStatus.length - ackedCount,
      completion_pct: staffStatus.length > 0
        ? Math.round((ackedCount / staffStatus.length) * 100)
        : 0,
      staff: staffStatus,
    }
  })

  return NextResponse.json({ report })
}
