-- =============================================================
-- DEADLY SINS — 결과 · 오류 익명 수집 테이블 (Supabase)
--
-- 1. Supabase 대시보드 → SQL Editor 에 이 파일 내용을 붙여 넣고 Run
-- 2. Project Settings → API 에서 Project URL 과 anon(또는 publishable) 키를 복사
-- 3. public/data.js 의 collect 에 넣기
--      collect: { url: 'https://xxxx.supabase.co', key: '<anon 키>' }
--    (anon 키는 원래 브라우저에 공개되는 키입니다. service_role 키는 절대 넣지 마세요.)
--
-- 손님 브라우저는 "넣기"만 할 수 있고, 읽기·수정·삭제는 못 합니다.
-- 이름 · 전화번호 · IP 같은 개인 정보는 보내지 않습니다.
-- sid 는 페이지를 열 때마다 새로 만드는 임의 문자열이라 사람을 특정하지 못합니다.
-- =============================================================

create table if not exists public.deadly_sins_events (
  id         uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  sid        text not null check (char_length(sid) between 1 and 16),
  type       text not null check (type in ('start','result','signature','order','menu','share','restart','lang','error')),
  lang       text check (lang in ('ko','en')),
  version    text check (char_length(version) <= 20),
  data       jsonb not null default '{}'::jsonb check (pg_column_size(data) < 4000)
);

create index if not exists deadly_sins_events_created_at on public.deadly_sins_events (created_at desc);
create index if not exists deadly_sins_events_type on public.deadly_sins_events (type);

alter table public.deadly_sins_events enable row level security;

drop policy if exists "guests can insert" on public.deadly_sins_events;
create policy "guests can insert" on public.deadly_sins_events
  for insert to anon with check (true);

revoke all on public.deadly_sins_events from anon, authenticated;
grant insert on public.deadly_sins_events to anon;


-- =============================================================
-- 자주 볼 쿼리 (SQL Editor 에서 실행)
-- =============================================================

-- 최근 30일 결과 분포 — 한쪽으로 몰리는지
-- select data->>'top' as sin, count(*), round(100.0 * count(*) / sum(count(*)) over (), 1) as pct
-- from public.deadly_sins_events
-- where type = 'result' and created_at > now() - interval '30 days'
-- group by 1 order by 2 desc;

-- 시작한 사람 중 끝까지 간 비율 / 바텐더 화면까지 연 비율
-- select
--   count(distinct sid) filter (where type = 'start')     as started,
--   count(distinct sid) filter (where type = 'result')    as finished,
--   count(distinct sid) filter (where type = 'order')     as showed_bartender,
--   count(distinct sid) filter (where type = 'share')     as shared
-- from public.deadly_sins_events
-- where created_at > now() - interval '30 days';

-- 문항별로 어떤 보기가 많이 골리는지 (picks 는 "문항-원래보기번호", 0부터)
-- select pick, count(*)
-- from public.deadly_sins_events, jsonb_array_elements_text(data->'picks') as pick
-- where type = 'result'
-- group by 1 order by 1;

-- 최근 오류
-- select created_at, data->>'message' as message, data->>'file' as file, data->>'line' as line, data->>'ua' as ua
-- from public.deadly_sins_events
-- where type = 'error'
-- order by created_at desc limit 50;
