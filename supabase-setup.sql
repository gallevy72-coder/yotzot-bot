-- הרץ את הסקריפט הזה ב-Supabase SQL Editor

create table if not exists sessions (
  id uuid default gen_random_uuid() primary key,
  session_id text unique not null,
  school text not null,
  user_name text,
  messages jsonb default '[]'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- אינדקס לחיפוש לפי בית ספר
create index if not exists idx_sessions_school on sessions(school);
create index if not exists idx_sessions_updated on sessions(updated_at desc);

-- Row Level Security (אופציונלי — מומלץ בסביבת ייצור)
alter table sessions enable row level security;
