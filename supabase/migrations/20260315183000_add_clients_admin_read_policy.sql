DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'clients'
      AND policyname = 'admin read'
  ) THEN
    CREATE POLICY "admin read"
      ON "public"."clients"
      FOR SELECT
      USING (("auth"."role"() = 'authenticated'::text));
  END IF;
END;
$$;
