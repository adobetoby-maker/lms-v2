import { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { supabaseAdmin } from '@/lib/supabase/admin'

interface RequestBody {
  courseId: number
  email: string
}

export async function POST(request: NextRequest) {
  // Auth check
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .single()

  if (!profile?.is_admin) {
    return Response.json({ error: 'Forbidden: admin access required' }, { status: 403 })
  }

  let body: RequestBody
  try {
    body = await request.json()
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { courseId, email } = body

  if (!courseId || !email) {
    return Response.json({ error: 'courseId and email are required' }, { status: 400 })
  }

  // Verify course exists
  const { data: course } = await supabaseAdmin
    .from('courses')
    .select('id')
    .eq('id', courseId)
    .single()

  if (!course) {
    return Response.json({ error: 'Course not found' }, { status: 404 })
  }

  // Create a fresh invite record (new token, new 7-day expiry)
  const { data: invite, error: inviteError } = await supabaseAdmin
    .from('invites')
    .insert({
      course_id: courseId,
      email: email.toLowerCase().trim(),
      is_used: false,
    })
    .select('token')
    .single()

  if (inviteError || !invite) {
    console.error('Failed to create resend invite:', inviteError)
    return Response.json({ error: 'Failed to create invite' }, { status: 500 })
  }

  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000')

  const inviteUrl = `${baseUrl}/register/${invite.token}`

  return Response.json({ inviteUrl, token: invite.token })
}
