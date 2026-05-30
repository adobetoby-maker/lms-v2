-- Fix overly permissive invites policy
drop policy if exists "invites_all" on public.invites;

-- Admins can manage all invites
create policy "invites_admin" on public.invites
  for all using (exists (select 1 from public.profiles where id = auth.uid() and is_admin = true));

-- Public can read a single invite by token (for registration flow) via a secure function
create or replace function public.get_invite_by_token(p_token uuid)
returns table(id bigint, course_id bigint, email text, is_used boolean, expires_at timestamptz)
language plpgsql security definer set search_path = public as $$
begin
  return query
    select i.id, i.course_id, i.email, i.is_used, i.expires_at
    from public.invites i
    where i.token = p_token and i.is_used = false and i.expires_at > now();
end;
$$;
