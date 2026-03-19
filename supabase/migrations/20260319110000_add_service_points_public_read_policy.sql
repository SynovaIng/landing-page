CREATE POLICY "public read"
ON "public"."service_points"
FOR SELECT
USING (
  EXISTS (
    SELECT 1
    FROM "public"."services"
    WHERE "services"."id" = "service_points"."service_id"
      AND "services"."is_published" = true
  )
);
