
  create table "public"."contact_tokens" (
    "id" uuid not null default gen_random_uuid(),
    "token" text not null default encode(extensions.gen_random_bytes(32), 'hex'::text),
    "service_id" uuid,
    "used_at" timestamp with time zone,
    "expires_at" timestamp with time zone,
    "created_by" uuid,
    "created_at" timestamp with time zone default now()
      );


alter table "public"."contact_tokens" enable row level security;

alter table "public"."contact_submissions" add column "token_id" uuid;

CREATE UNIQUE INDEX contact_tokens_pkey ON public.contact_tokens USING btree (id);

CREATE UNIQUE INDEX contact_tokens_token_key ON public.contact_tokens USING btree (token);

alter table "public"."contact_tokens" add constraint "contact_tokens_pkey" PRIMARY KEY using index "contact_tokens_pkey";

alter table "public"."contact_submissions" add constraint "contact_submissions_token_id_fkey" FOREIGN KEY (token_id) REFERENCES public.contact_tokens(id) ON DELETE SET NULL not valid;

alter table "public"."contact_submissions" validate constraint "contact_submissions_token_id_fkey";

alter table "public"."contact_tokens" add constraint "contact_tokens_created_by_fkey" FOREIGN KEY (created_by) REFERENCES public.profiles(id) ON DELETE SET NULL not valid;

alter table "public"."contact_tokens" validate constraint "contact_tokens_created_by_fkey";

alter table "public"."contact_tokens" add constraint "contact_tokens_service_id_fkey" FOREIGN KEY (service_id) REFERENCES public.services(id) ON DELETE SET NULL not valid;

alter table "public"."contact_tokens" validate constraint "contact_tokens_service_id_fkey";

alter table "public"."contact_tokens" add constraint "contact_tokens_token_key" UNIQUE using index "contact_tokens_token_key";

grant delete on table "public"."contact_tokens" to "anon";

grant insert on table "public"."contact_tokens" to "anon";

grant references on table "public"."contact_tokens" to "anon";

grant select on table "public"."contact_tokens" to "anon";

grant trigger on table "public"."contact_tokens" to "anon";

grant truncate on table "public"."contact_tokens" to "anon";

grant update on table "public"."contact_tokens" to "anon";

grant delete on table "public"."contact_tokens" to "authenticated";

grant insert on table "public"."contact_tokens" to "authenticated";

grant references on table "public"."contact_tokens" to "authenticated";

grant select on table "public"."contact_tokens" to "authenticated";

grant trigger on table "public"."contact_tokens" to "authenticated";

grant truncate on table "public"."contact_tokens" to "authenticated";

grant update on table "public"."contact_tokens" to "authenticated";

grant delete on table "public"."contact_tokens" to "service_role";

grant insert on table "public"."contact_tokens" to "service_role";

grant references on table "public"."contact_tokens" to "service_role";

grant select on table "public"."contact_tokens" to "service_role";

grant trigger on table "public"."contact_tokens" to "service_role";

grant truncate on table "public"."contact_tokens" to "service_role";

grant update on table "public"."contact_tokens" to "service_role";


  create policy "admin insert"
  on "public"."contact_tokens"
  as permissive
  for insert
  to public
with check ((auth.role() = 'authenticated'::text));



  create policy "admin update"
  on "public"."contact_tokens"
  as permissive
  for update
  to public
using ((auth.role() = 'authenticated'::text));



  create policy "public read"
  on "public"."contact_tokens"
  as permissive
  for select
  to public
using (((used_at IS NULL) AND (expires_at > now())));



