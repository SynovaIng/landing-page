CREATE POLICY "admin write" ON "public"."service_points" USING (("auth"."role"() = 'authenticated'::"text"));
