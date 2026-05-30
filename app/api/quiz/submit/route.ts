import { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { supabaseAdmin } from '@/lib/supabase/admin'

interface AnswerPayload {
  questionId: number
  answer: string
}

interface RequestBody {
  courseId: number
  answers: AnswerPayload[]
}

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: RequestBody
  try {
    body = await request.json()
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { courseId, answers } = body

  if (!courseId || !Array.isArray(answers) || answers.length === 0) {
    return Response.json({ error: 'Missing courseId or answers' }, { status: 400 })
  }

  // Verify enrollment
  const { data: enrollment } = await supabase
    .from('enrollments')
    .select('id, video_watched')
    .eq('user_id', user.id)
    .eq('course_id', courseId)
    .single()

  if (!enrollment) {
    return Response.json({ error: 'Not enrolled in this course' }, { status: 403 })
  }

  if (!enrollment.video_watched) {
    return Response.json({ error: 'Must watch the video before taking the quiz' }, { status: 403 })
  }

  // Fetch correct answers via admin client (bypasses RLS to get correct_answer column)
  const questionIds = answers.map(a => a.questionId)
  const { data: questions, error: qError } = await supabaseAdmin
    .from('questions')
    .select('id, correct_answer')
    .in('id', questionIds)
    .eq('course_id', courseId)

  if (qError || !questions) {
    return Response.json({ error: 'Failed to fetch questions' }, { status: 500 })
  }

  // Calculate score
  const correctMap = new Map(questions.map(q => [q.id, q.correct_answer]))
  const totalCount = questions.length
  let correctCount = 0

  for (const answer of answers) {
    const correct = correctMap.get(answer.questionId)
    if (correct && correct.toUpperCase() === answer.answer.toUpperCase()) {
      correctCount++
    }
  }

  const score = totalCount > 0 ? Math.round((correctCount / totalCount) * 100) : 0
  const passed = score >= 70 // 70% pass threshold

  // Insert quiz attempt using admin client (user insert via RLS is allowed but admin is safer here)
  const { error: attemptError } = await supabaseAdmin
    .from('quiz_attempts')
    .insert({
      user_id: user.id,
      course_id: courseId,
      score,
      passed,
      correct_count: correctCount,
      total_count: totalCount,
    })

  if (attemptError) {
    console.error('Failed to insert quiz_attempt:', attemptError)
  }

  // Update enrollment status
  const newStatus = passed ? 'passed' : 'failed'
  const updatePayload: Record<string, unknown> = { status: newStatus }
  if (passed) {
    updatePayload.completed_at = new Date().toISOString()
  }

  await supabaseAdmin
    .from('enrollments')
    .update(updatePayload)
    .eq('id', enrollment.id)

  return Response.json({ score, passed, correctCount, totalCount })
}
