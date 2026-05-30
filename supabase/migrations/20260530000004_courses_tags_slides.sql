-- Tags for course categorization (HR, Finance, Medical, etc.)
alter table public.courses add column if not exists tags text[] default '{}';
-- Slides for built-in scenario player (array of {title, body, scenario?, options?, correct?})
alter table public.courses add column if not exists slides jsonb default '[]';
-- Template ID so we know which compliance template spawned it
alter table public.courses add column if not exists template_id text default null;
