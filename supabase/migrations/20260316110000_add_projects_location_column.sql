alter table "public"."projects"
  add column if not exists "location" text;

update "public"."projects"
set "location" = coalesce("location", "description", '')
where "location" is null;
