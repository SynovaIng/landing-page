CREATE POLICY "admin write" ON "public"."project_services" USING (("auth"."role"() = 'authenticated'::"text"));
CREATE POLICY "admin read" ON "public"."project_services" FOR SELECT USING (("auth"."role"() = 'authenticated'::"text"));
