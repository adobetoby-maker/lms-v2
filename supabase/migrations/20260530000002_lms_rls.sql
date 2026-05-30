alter table public.profiles enable row level security;
alter table public.courses enable row level security;
alter table public.videos enable row level security;
alter table public.questions enable row level security;
alter table public.enrollments enable row level security;
alter table public.quiz_attempts enable row level security;
alter table public.invites enable row level security;

create policy "profiles_all" on public.profiles for all using (auth.uid() = id);
create policy "courses_read" on public.courses for select using (true);
create policy "courses_admin" on public.courses for all using (exists (select 1 from public.profiles where id = auth.uid() and is_admin = true));
create policy "videos_read" on public.videos for select using (true);
create policy "videos_admin" on public.videos for all using (exists (select 1 from public.profiles where id = auth.uid() and is_admin = true));
create policy "questions_enrolled" on public.questions for select using (
  exists (select 1 from public.enrollments where user_id = auth.uid() and course_id = questions.course_id)
  or exists (select 1 from public.profiles where id = auth.uid() and is_admin = true)
);
create policy "questions_admin" on public.questions for all using (exists (select 1 from public.profiles where id = auth.uid() and is_admin = true));
create policy "enrollments_read" on public.enrollments for select using (auth.uid() = user_id or exists (select 1 from public.profiles where id = auth.uid() and is_admin = true));
create policy "enrollments_insert" on public.enrollments for insert with check (exists (select 1 from public.profiles where id = auth.uid() and is_admin = true));
create policy "enrollments_update" on public.enrollments for update using (auth.uid() = user_id);
create policy "quiz_read" on public.quiz_attempts for select using (auth.uid() = user_id or exists (select 1 from public.profiles where id = auth.uid() and is_admin = true));
create policy "quiz_insert" on public.quiz_attempts for insert with check (auth.uid() = user_id);
create policy "invites_all" on public.invites for all using (true);

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, first_name, last_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'first_name', ''),
    coalesce(new.raw_user_meta_data->>'last_name', '')
  ) on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
