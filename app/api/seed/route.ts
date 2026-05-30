import { NextRequest } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'

// Safety: only allow in development OR with a secret key
const SEED_SECRET = process.env.SEED_SECRET

export async function GET(request: NextRequest) {
  const isDev = process.env.NODE_ENV === 'development'
  const providedSecret = request.nextUrl.searchParams.get('secret')

  if (!isDev && SEED_SECRET && providedSecret !== SEED_SECRET) {
    return Response.json({ error: 'Forbidden' }, { status: 403 })
  }

  const log: string[] = []

  try {
    // ── 1. Create demo users ────────────────────────────────────────────────

    // Admin user
    let adminId: string
    const { data: existingAdmin } = await supabaseAdmin.auth.admin.listUsers()
    const existingAdminUser = existingAdmin.users.find(u => u.email === 'admin@demo.com')

    if (existingAdminUser) {
      adminId = existingAdminUser.id
      log.push('Admin user already exists, skipping creation.')
    } else {
      const { data: adminData, error: adminError } = await supabaseAdmin.auth.admin.createUser({
        email: 'admin@demo.com',
        password: 'Admin123!',
        email_confirm: true,
        user_metadata: { first_name: 'Admin', last_name: 'User' },
      })
      if (adminError) throw new Error(`Admin user: ${adminError.message}`)
      adminId = adminData.user.id
      log.push('Created admin user: admin@demo.com')
    }

    // Learner user
    let learnerId: string
    const existingLearnerUser = existingAdmin.users.find(u => u.email === 'learner@demo.com')

    if (existingLearnerUser) {
      learnerId = existingLearnerUser.id
      log.push('Learner user already exists, skipping creation.')
    } else {
      const { data: learnerData, error: learnerError } = await supabaseAdmin.auth.admin.createUser({
        email: 'learner@demo.com',
        password: 'Learner123!',
        email_confirm: true,
        user_metadata: { first_name: 'Demo', last_name: 'Learner' },
      })
      if (learnerError) throw new Error(`Learner user: ${learnerError.message}`)
      learnerId = learnerData.user.id
      log.push('Created learner user: learner@demo.com')
    }

    // Set admin flag on profile
    await supabaseAdmin
      .from('profiles')
      .update({ is_admin: true, first_name: 'Admin', last_name: 'User' })
      .eq('id', adminId)
    log.push('Set is_admin=true on admin profile')

    // Ensure learner profile exists
    await supabaseAdmin
      .from('profiles')
      .update({ first_name: 'Demo', last_name: 'Learner' })
      .eq('id', learnerId)

    // ── 2. Seed courses ─────────────────────────────────────────────────────

    const courseSeed = [
      {
        title: 'Professional Development Fundamentals',
        description: 'Build the essential skills for career growth: effective communication, time management, and a growth mindset. Learn from world-class TED speakers.',
        require_full_video_watch: false,
        videos: [
          {
            title: 'How great leaders inspire action',
            url: 'https://www.youtube.com/watch?v=qp0HIF3SfI4',
            duration_seconds: 1082,
            sort_order: 0,
          },
          {
            title: 'The power of vulnerability',
            url: 'https://www.youtube.com/watch?v=iCvmsMzlF7o',
            duration_seconds: 1206,
            sort_order: 1,
          },
          {
            title: 'Grit: The power of passion and perseverance',
            url: 'https://www.youtube.com/watch?v=H14bBuluwB8',
            duration_seconds: 367,
            sort_order: 2,
          },
        ],
        questions: [
          {
            text: 'According to Simon Sinek, what is the "Golden Circle" concept about?',
            option_a: 'Starting with Why — the purpose, cause, or belief behind what you do',
            option_b: 'Setting financial goals before anything else',
            option_c: 'Building the largest team possible',
            option_d: 'Focusing only on product features',
            correct_answer: 'A',
          },
          {
            text: 'Brené Brown defines vulnerability as:',
            option_a: 'A weakness to be avoided at all costs',
            option_b: 'The birthplace of innovation, creativity, and change',
            option_c: 'Sharing too much personal information at work',
            option_d: 'Being overly emotional in professional settings',
            correct_answer: 'B',
          },
          {
            text: 'Angela Duckworth defines "grit" as:',
            option_a: 'Natural talent and intelligence',
            option_b: 'Passion and perseverance for very long-term goals',
            option_c: 'The ability to work without sleep',
            option_d: 'A fixed personality trait you are born with',
            correct_answer: 'B',
          },
        ],
      },
      {
        title: 'Workplace Communication Excellence',
        description: 'Master the art of communication in modern workplaces. From difficult conversations to public speaking, build the confidence to communicate with impact.',
        require_full_video_watch: false,
        videos: [
          {
            title: 'Your body language may shape who you are',
            url: 'https://www.youtube.com/watch?v=Ks-_Mh1QhMc',
            duration_seconds: 1262,
            sort_order: 0,
          },
          {
            title: '10 ways to have a better conversation',
            url: 'https://www.youtube.com/watch?v=R1vskiVDwl4',
            duration_seconds: 688,
            sort_order: 1,
          },
          {
            title: 'The puzzle of motivation',
            url: 'https://www.youtube.com/watch?v=rrkrvAUbU9Y',
            duration_seconds: 1101,
            sort_order: 2,
          },
        ],
        questions: [
          {
            text: 'Amy Cuddy\'s research on "power posing" suggests that body language:',
            option_a: 'Has no effect on how others perceive you',
            option_b: 'Can shape your own feelings and hormone levels, not just others\' impressions',
            option_c: 'Only matters in job interviews',
            option_d: 'Is less important than what you say',
            correct_answer: 'B',
          },
          {
            text: 'Celeste Headlee\'s key rule for better conversations is:',
            option_a: 'Always have three talking points prepared',
            option_b: 'Be present and genuinely interested — listen more than you speak',
            option_c: 'Repeat everything back to confirm understanding',
            option_d: 'Avoid asking personal questions',
            correct_answer: 'B',
          },
          {
            text: 'Daniel Pink argues that the best motivator for creative work is:',
            option_a: 'Higher financial bonuses',
            option_b: 'Strict deadlines and close supervision',
            option_c: 'Intrinsic motivation: autonomy, mastery, and purpose',
            option_d: 'Competition with colleagues',
            correct_answer: 'C',
          },
        ],
      },
    ]

    const courseIds: number[] = []

    for (const courseDef of courseSeed) {
      // Check if course exists
      const { data: existingCourse } = await supabaseAdmin
        .from('courses')
        .select('id')
        .eq('title', courseDef.title)
        .single()

      let courseId: number

      if (existingCourse) {
        courseId = existingCourse.id
        log.push(`Course already exists: "${courseDef.title}"`)
      } else {
        const { data: newCourse, error: courseError } = await supabaseAdmin
          .from('courses')
          .insert({
            title: courseDef.title,
            description: courseDef.description,
            require_full_video_watch: courseDef.require_full_video_watch,
            is_active: true,
          })
          .select('id')
          .single()

        if (courseError || !newCourse) throw new Error(`Course "${courseDef.title}": ${courseError?.message}`)
        courseId = newCourse.id
        log.push(`Created course: "${courseDef.title}" (id=${courseId})`)

        // Insert videos
        await supabaseAdmin.from('videos').insert(
          courseDef.videos.map(v => ({ ...v, course_id: courseId }))
        )
        log.push(`  Added ${courseDef.videos.length} videos`)

        // Insert questions
        await supabaseAdmin.from('questions').insert(
          courseDef.questions.map(q => ({ ...q, course_id: courseId }))
        )
        log.push(`  Added ${courseDef.questions.length} questions`)
      }

      courseIds.push(courseId)
    }

    // ── 3. Enroll learner ───────────────────────────────────────────────────

    for (const courseId of courseIds) {
      const { data: existing } = await supabaseAdmin
        .from('enrollments')
        .select('id')
        .eq('user_id', learnerId)
        .eq('course_id', courseId)
        .single()

      if (existing) {
        log.push(`Learner already enrolled in course id=${courseId}`)
      } else {
        const { error: enrollError } = await supabaseAdmin
          .from('enrollments')
          .insert({
            user_id: learnerId,
            course_id: courseId,
            status: 'invited',
          })
        if (enrollError) throw new Error(`Enrollment for course ${courseId}: ${enrollError.message}`)
        log.push(`Enrolled learner in course id=${courseId}`)
      }
    }

    return Response.json({
      ok: true,
      message: 'Seed completed successfully.',
      log,
      demoAccounts: {
        admin: { email: 'admin@demo.com', password: 'Admin123!' },
        learner: { email: 'learner@demo.com', password: 'Learner123!' },
      },
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    console.error('Seed error:', message)
    return Response.json({ ok: false, error: message, log }, { status: 500 })
  }
}
