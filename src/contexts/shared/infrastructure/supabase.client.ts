import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { Service } from "diod";

import { envs } from "@/config/envs";

@Service()
export class SupabaseClientService {
  public readonly client: SupabaseClient;

  constructor() {
    const supabaseUrl = envs.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = envs.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    this.client = createClient(supabaseUrl, supabaseKey);
  }
}
