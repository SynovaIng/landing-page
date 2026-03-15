insert into storage.buckets (id, name, public)
values ('project-images', 'project-images', true)
on conflict (id) do update set public = true;

drop policy if exists "Public read project images" on storage.objects;
create policy "Public read project images"
on storage.objects
for select
to public
using (bucket_id = 'project-images');

drop policy if exists "Authenticated upload project images" on storage.objects;
create policy "Authenticated upload project images"
on storage.objects
for insert
to authenticated
with check (bucket_id = 'project-images');

drop policy if exists "Authenticated update project images" on storage.objects;
create policy "Authenticated update project images"
on storage.objects
for update
to authenticated
using (bucket_id = 'project-images')
with check (bucket_id = 'project-images');

drop policy if exists "Authenticated delete project images" on storage.objects;
create policy "Authenticated delete project images"
on storage.objects
for delete
to authenticated
using (bucket_id = 'project-images');

drop policy if exists "admin read" on public.project_images;
create policy "admin read"
on public.project_images
for select
to public
using (auth.role() = 'authenticated');

drop policy if exists "admin write" on public.project_images;
create policy "admin write"
on public.project_images
for all
to public
using (auth.role() = 'authenticated')
with check (auth.role() = 'authenticated');

drop policy if exists "public read" on public.project_images;
create policy "public read"
on public.project_images
for select
to public
using (
  exists (
    select 1
    from public.projects
    where projects.id = project_images.project_id
      and projects.is_published = true
  )
);
