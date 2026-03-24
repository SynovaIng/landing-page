alter table "public"."reviews"
  add column if not exists "token" text;

alter table "public"."reviews"
  add column if not exists "token_active" boolean not null default true;

create unique index if not exists "reviews_token_unique"
  on "public"."reviews" ("token")
  where "token" is not null;
