DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'clients'
      AND policyname = 'admin write'
  ) THEN
    CREATE POLICY "admin write"
      ON "public"."clients"
      USING (("auth"."role"() = 'authenticated'::text));
  END IF;
END;
$$;
