import { NextResponse } from "next/server";

import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("clients")
    .select("id, name, location")
    .order("name", { ascending: true });

  if (error) {
    return NextResponse.json({ clients: [] }, { status: 200 });
  }

  return NextResponse.json({
    clients: (data ?? []).map((client) => ({
      id: String(client.id),
      name: String(client.name ?? ""),
      location: String(client.location ?? ""),
    })),
  });
}
