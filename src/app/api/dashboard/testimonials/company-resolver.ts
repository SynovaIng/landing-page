import { createSupabaseServerClient } from "@/lib/supabase/server";

type DashboardSupabaseClient = Awaited<ReturnType<typeof createSupabaseServerClient>>;

interface ResolveReviewCompanyInput {
  supabase: DashboardSupabaseClient;
  clientId: string | null;
  companyName: string;
  createCompany: boolean;
  companyLocation: string;
}

interface ResolvedReviewCompany {
  clientId: string | null;
  companyName: string;
}

export async function resolveReviewCompany({
  supabase,
  clientId,
  companyName,
  createCompany,
  companyLocation,
}: ResolveReviewCompanyInput): Promise<ResolvedReviewCompany> {
  const normalizedClientId = String(clientId ?? "").trim();
  const normalizedCompanyName = companyName.trim();
  const normalizedCompanyLocation = companyLocation.trim();

  if (createCompany) {
    if (!normalizedCompanyName) {
      throw new Error("Debes ingresar el nombre de la empresa.");
    }

    const { data: existingClient, error: existingClientError } = await supabase
      .from("clients")
      .select("id, name")
      .ilike("name", normalizedCompanyName)
      .limit(1)
      .maybeSingle();

    if (existingClientError) {
      throw new Error("No se pudo validar la empresa seleccionada.");
    }

    if (existingClient) {
      return {
        clientId: String(existingClient.id),
        companyName: String(existingClient.name ?? normalizedCompanyName),
      };
    }

    const { data: createdClient, error: createdClientError } = await supabase
      .from("clients")
      .insert({
        name: normalizedCompanyName,
        location: normalizedCompanyLocation || null,
      })
      .select("id, name")
      .single();

    if (createdClientError || !createdClient) {
      throw new Error("No se pudo crear la empresa.");
    }

    return {
      clientId: String(createdClient.id),
      companyName: String(createdClient.name ?? normalizedCompanyName),
    };
  }

  if (normalizedClientId) {
    const { data: clientById, error: clientByIdError } = await supabase
      .from("clients")
      .select("id, name")
      .eq("id", normalizedClientId)
      .maybeSingle();

    if (clientByIdError) {
      throw new Error("No se pudo validar la empresa seleccionada.");
    }

    if (!clientById) {
      throw new Error("La empresa seleccionada ya no existe.");
    }

    return {
      clientId: String(clientById.id),
      companyName: String(clientById.name ?? ""),
    };
  }

  if (!normalizedCompanyName) {
    return {
      clientId: null,
      companyName: "",
    };
  }

  const { data: matchedClient, error: matchedClientError } = await supabase
    .from("clients")
    .select("id, name")
    .ilike("name", normalizedCompanyName)
    .limit(1)
    .maybeSingle();

  if (matchedClientError) {
    throw new Error("No se pudo validar la empresa ingresada.");
  }

  if (!matchedClient) {
    throw new Error("La empresa ingresada no existe. Activa el switch para crear una nueva.");
  }

  return {
    clientId: String(matchedClient.id),
    companyName: String(matchedClient.name ?? normalizedCompanyName),
  };
}
