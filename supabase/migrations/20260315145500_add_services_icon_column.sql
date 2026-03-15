ALTER TABLE "public"."services"
ADD COLUMN IF NOT EXISTS "icon" "text" NOT NULL DEFAULT 'engineering';
