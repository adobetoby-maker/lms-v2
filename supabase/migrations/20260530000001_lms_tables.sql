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
  correct_answer char(1) not null check (correct_answer in ('A','B','C','D'))
);

create table if not exists public.enrollments (
  id bigserial primary key,
  user_id uuid not null references auth.users on delete cascade,
  course_id bigint not null references public.courses on delete cascade,
  status text not null default 'invited' check (status in ('invited','in_progress','passed','failed')),
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
