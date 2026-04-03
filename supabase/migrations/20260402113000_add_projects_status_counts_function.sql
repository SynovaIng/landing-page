create or replace function public.get_projects_status_counts()
returns table (
  active_count bigint,
  inactive_count bigint,
  total_count bigint
)
language sql
security definer
set search_path = public
as $function$
  select
    count(*) filter (where is_published = true) as active_count,
    count(*) filter (where is_published = false) as inactive_count,
    count(*) as total_count
  from public.projects;
$function$;

revoke all on function public.get_projects_status_counts() from public;

grant execute on function public.get_projects_status_counts() to anon;
grant execute on function public.get_projects_status_counts() to authenticated;
grant execute on function public.get_projects_status_counts() to service_role;
