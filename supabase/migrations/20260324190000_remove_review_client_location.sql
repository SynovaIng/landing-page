drop function if exists public.get_review_by_token(text);
drop function if exists public.submit_review_by_token(text, text, text, numeric);

create function public.get_review_by_token(p_token text)
returns table (
  id uuid,
  message text,
  client_name text,
  stars numeric,
  is_published boolean,
  project_id uuid,
  order_index integer,
  token text,
  token_active boolean,
  project_name text,
  project_location text
)
language plpgsql
security definer
set search_path = public
as $$
begin
  if p_token is null or btrim(p_token) = '' then
    return;
  end if;

  return query
  select
    r.id,
    r.message,
    r.client_name,
    r.stars,
    r.is_published,
    r.project_id,
    r.order_index,
    r.token,
    r.token_active,
    p.name as project_name,
    p.location as project_location
  from public.reviews r
  left join public.projects p on p.id = r.project_id
  where r.token = btrim(p_token)
  limit 1;
end;
$$;

create function public.submit_review_by_token(
  p_token text,
  p_author_name text,
  p_message text,
  p_stars numeric
)
returns table (
  id uuid,
  message text,
  client_name text,
  stars numeric,
  is_published boolean,
  project_id uuid,
  order_index integer,
  token text,
  token_active boolean,
  project_name text,
  project_location text
)
language plpgsql
security definer
set search_path = public
as $$
begin
  if p_token is null
    or btrim(p_token) = ''
    or p_author_name is null
    or btrim(p_author_name) = ''
    or p_message is null
    or btrim(p_message) = ''
  then
    return;
  end if;

  return query
  with updated_review as (
    update public.reviews as r
    set
      client_name = btrim(p_author_name),
      message = btrim(p_message),
      stars = p_stars,
      token_active = false,
      is_published = false
    where r.token = btrim(p_token)
      and r.token_active = true
    returning
      r.id,
      r.message,
      r.client_name,
      r.stars,
      r.is_published,
      r.project_id,
      r.order_index,
      r.token,
      r.token_active
  )
  select
    u.id,
    u.message,
    u.client_name,
    u.stars,
    u.is_published,
    u.project_id,
    u.order_index,
    u.token,
    u.token_active,
    p.name as project_name,
    p.location as project_location
  from updated_review u
  left join public.projects p on p.id = u.project_id;
end;
$$;

revoke all on function public.get_review_by_token(text) from public;
revoke all on function public.submit_review_by_token(text, text, text, numeric) from public;

grant execute on function public.get_review_by_token(text) to anon;
grant execute on function public.get_review_by_token(text) to authenticated;
grant execute on function public.get_review_by_token(text) to service_role;

grant execute on function public.submit_review_by_token(text, text, text, numeric) to anon;
grant execute on function public.submit_review_by_token(text, text, text, numeric) to authenticated;
grant execute on function public.submit_review_by_token(text, text, text, numeric) to service_role;

alter table public.reviews
  drop column if exists client_location;
