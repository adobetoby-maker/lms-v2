import { NextResponse } from 'next/server'

export async function GET() {
  const PROJ = 'jfrupkcperwnohxsshfv'
  const SRK = process.env.SUPABASE_SERVICE_ROLE_KEY!
  
  const sql = `
    create table if not exists public.profiles (
      id uuid primary key references auth.users on delete cascade,
      first_name text not null default '',
      last_name text not null default '',
      is_admin boolean not null default false,
      created_at timestamptz not null default now()
    );

    create table if not exists public.courses (
      id bigserial primary key,
      title text not null,
      description text not null default '',
      require_full_video_watch boolean not null default false,
      is_active boolean not null default true,
      created_at timestamptz not null default now()
    );

    create table if not exists public.videos (
      id bigserial primary key,
      course_id bigint not null references public.courses on delete cascade,
      title text not null,
      url text not null,
      duration_seconds int not null default 0,
      sort_order int not null default 0
    );

    create table if not exists public.questions (
      id bigserial primary key,
      course_id bigint not null references public.courses on delete cascade,
      text text not null,
      option_a text not null,
      option_b text not null,
      option_c text not null,
      option_d text not null,
      correct_answer char(1) not null
    );

    create table if not exists public.enrollments (
      id bigserial primary key,
      user_id uuid not null references auth.users on delete cascade,
      course_id bigint not null references public.courses on delete cascade,
      status text not null default 'invited',
      video_watched boolean not null default false,
      video_progress_seconds int not null default 0,
      invited_at timestamptz not null default now(),
      completed_at timestamptz,
      unique(user_id, course_id)
    );

    create table if not exists public.quiz_attempts (
      id bigserial primary key,
      user_id uuid not null references auth.users on delete cascade,
      course_id bigint not null references public.courses on delete cascade,
      score int not null,
      passed boolean not null,
      correct_count int not null,
      total_count int not null,
      attempted_at timestamptz not null default now()
    );

    create table if not exists public.invites (
      id bigserial primary key,
      course_id bigint not null references public.courses on delete cascade,
      email text not null,
      token uuid not null default gen_random_uuid() unique,
      is_used boolean not null default false,
      expires_at timestamptz not null default (now() + interval '7 days'),
      created_at timestamptz not null default now()
    );

    -- RLS
    alter table public.profiles enable row level security;
    alter table public.courses enable row level security;
    alter table public.videos enable row level security;
    alter table public.questions enable row level security;
    alter table public.enrollments enable row level security;
    alter table public.quiz_attempts enable row level security;
    alter table public.invites enable row level security;

    -- Policies (drop first to avoid duplicates)
    drop policy if exists "profiles_own" on public.profiles;
    drop policy if exists "courses_read" on public.courses;
    drop policy if exists "courses_admin" on public.courses;
    drop policy if exists "videos_read" on public.videos;
    drop policy if exists "videos_admin" on public.videos;
    drop policy if exists "questions_read" on public.questions;
    drop policy if exists "questions_admin" on public.questions;
    drop policy if exists "enrollments_own" on public.enrollments;
    drop policy if exists "enrollments_update" on public.enrollments;
    drop policy if exists "enrollments_admin_read" on public.enrollments;
    drop policy if exists "enrollments_admin_insert" on public.enrollments;
    drop policy if exists "quiz_own_read" on public.quiz_attempts;
    drop policy if exists "quiz_own_insert" on public.quiz_attempts;
    drop policy if exists "quiz_admin" on public.quiz_attempts;
    drop policy if exists "invites_read" on public.invites;
    drop policy if exists "invites_admin" on public.invites;

    create policy "profiles_own" on public.profiles for all using (auth.uid() = id);
    create policy "courses_read" on public.courses for select using (true);
    create policy "courses_admin" on public.courses for all using (exists (select 1 from public.profiles where id = auth.uid() and is_admin = true));
    create policy "videos_read" on public.videos for select using (true);
    create policy "videos_admin" on public.videos for all using (exists (select 1 from public.profiles where id = auth.uid() and is_admin = true));
    create policy "questions_read" on public.questions for select using (exists (select 1 from public.enrollments where user_id = auth.uid() and course_id = questions.course_id) or exists (select 1 from public.profiles where id = auth.uid() and is_admin = true));
    create policy "questions_admin" on public.questions for all using (exists (select 1 from public.profiles where id = auth.uid() and is_admin = true));
    create policy "enrollments_own" on public.enrollments for select using (auth.uid() = user_id);
    create policy "enrollments_update" on public.enrollments for update using (auth.uid() = user_id);
    create policy "enrollments_admin_read" on public.enrollments for select using (exists (select 1 from public.profiles where id = auth.uid() and is_admin = true));
    create policy "enrollments_admin_insert" on public.enrollments for insert with check (exists (select 1 from public.profiles where id = auth.uid() and is_admin = true));
    create policy "quiz_own_read" on public.quiz_attempts for select using (auth.uid() = user_id);
    create policy "quiz_own_insert" on public.quiz_attempts for insert with check (auth.uid() = user_id);
    create policy "quiz_admin" on public.quiz_attempts for select using (exists (select 1 from public.profiles where id = auth.uid() and is_admin = true));
    create policy "invites_read" on public.invites for select using (true);
    create policy "invites_admin" on public.invites for all using (exists (select 1 from public.profiles where id = auth.uid() and is_admin = true));

    -- Profile trigger
    create or replace function public.handle_new_user()
    returns trigger language plpgsql security definer set search_path = public as $$
    begin
      insert into public.profiles (id, first_name, last_name)
      values (new.id, coalesce(new.raw_user_meta_data->>'first_name',''), coalesce(new.raw_user_meta_data->>'last_name',''))
      on conflict (id) do nothing;
      return new;
    end;
    $$;

    drop trigger if exists on_auth_user_created on auth.users;
    create trigger on_auth_user_created
      after insert on auth.users
      for each row execute procedure public.handle_new_user();
  `

  // Execute via supabase-js postgres function workaround
  const { createClient } = await import('@supabase/supabase-js')
  const admin = createClient(
    `https://${PROJ}.supabase.co`,
    SRK,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )

  // Use the pg extension to run raw SQL
  const statements = sql.split(';').map(s => s.trim()).filter(s => s.length > 10)
  const errors: string[] = []
  
  for (const stmt of statements) {
    const { error } = await admin.rpc('exec_sql', { sql: stmt }).catch(() => ({ error: null }))
    if (error && !error.message?.includes('already exists') && !error.message?.includes('does not exist')) {
      errors.push(`${stmt.slice(0, 50)}: ${error.message}`)
    }
  }

  return NextResponse.json({ ok: errors.length === 0, errors: errors.slice(0, 5) })
}
