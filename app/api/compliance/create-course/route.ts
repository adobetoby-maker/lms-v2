import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { getTemplate } from '@/lib/compliance-templates'

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: profile } = await supabase.from('profiles').select('is_admin').eq('id', user.id).single()
  if (!profile?.is_admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { templateId } = await req.json()
  const template = getTemplate(templateId)
  if (!template) return NextResponse.json({ error: 'Template not found' }, { status: 404 })

  const { data: course, error: courseError } = await supabaseAdmin
    .from('courses')
    .insert({
      title: template.title,
      description: template.description,
      tags: template.tags,
      slides: template.slides,
      template_id: template.id,
      require_full_video_watch: true,
      is_active: true,
    })
    .select('id')
    .single()

  if (courseError || !course) {
    return NextResponse.json({ error: courseError?.message ?? 'Failed to create course' }, { status: 500 })
  }

  await supabaseAdmin
    .from('questions')
    .insert(template.questions.map(q => ({ ...q, course_id: course.id })))

  return NextResponse.json({ courseId: course.id, title: template.title })
}
