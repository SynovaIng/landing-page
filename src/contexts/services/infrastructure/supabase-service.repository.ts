import { Service as DiodService } from "diod";

import { Service } from "@/contexts/services/domain/service.entity";
import type { CreateServiceInput } from "@/contexts/services/domain/service.repository";
import { ServiceRepository } from "@/contexts/services/domain/service.repository";
import { createSupabaseServerClient } from "@/lib/supabase/server";

@DiodService()
export class SupabaseServiceRepository extends ServiceRepository {
  async getAll(): Promise<Service[]> {
    const supabase = await createSupabaseServerClient();

    const [{ data: servicesData, error: servicesError }, { data: pointsData }] =
      await Promise.all([
        supabase
          .from("services")
          .select("id, name, description, cta_label, slug")
          .order("order_index", { ascending: true }),
        supabase
          .from("service_points")
          .select("service_id, label, order_index")
          .order("order_index", { ascending: true }),
      ]);

    if (servicesError || !servicesData) {
      return [];
    }

    const pointsByService = new Map<string, string[]>();
    (pointsData ?? []).forEach((point) => {
      const serviceId = String(point.service_id);
      const current = pointsByService.get(serviceId) ?? [];
      current.push(String(point.label));
      pointsByService.set(serviceId, current);
    });

    return servicesData.map((service) => new Service({
      id: String(service.id),
      icon: "engineering",
      title: String(service.name ?? ""),
      description: String(service.description ?? ""),
      features: pointsByService.get(String(service.id)) ?? [],
      ctaLabel: String(service.cta_label ?? "Cotizar"),
    }));
  }

  async getById(id: string): Promise<Service | null> {
    const supabase = await createSupabaseServerClient();

    const [{ data: serviceData, error: serviceError }, { data: pointsData }] =
      await Promise.all([
        supabase
          .from("services")
          .select("id, name, description, cta_label")
          .eq("id", id)
          .maybeSingle(),
        supabase
          .from("service_points")
          .select("label")
          .eq("service_id", id)
          .order("order_index", { ascending: true }),
      ]);

    if (serviceError || !serviceData) {
      return null;
    }

    return new Service({
      id: String(serviceData.id),
      icon: "engineering",
      title: String(serviceData.name ?? ""),
      description: String(serviceData.description ?? ""),
      features: (pointsData ?? []).map((point) => String(point.label)),
      ctaLabel: String(serviceData.cta_label ?? "Cotizar"),
    });
  }

  async create(input: CreateServiceInput): Promise<Service> {
    const supabase = await createSupabaseServerClient();

    const { data, error } = await supabase
      .from("services")
      .insert({
        name: input.title,
        slug: input.slug,
        description: input.description ?? "",
        cta_label: input.ctaLabel,
        is_published: input.isPublished,
      })
      .select("id, name, description, cta_label")
      .single();

    if (error || !data) {
      throw new Error("No se pudo crear el servicio");
    }

    const features = input.features.filter((feature) => feature.trim().length > 0);

    if (features.length > 0) {
      const pointsPayload = features.map((feature, index) => ({
        service_id: data.id,
        label: feature,
        order_index: index,
      }));

      const { error: pointsError } = await supabase.from("service_points").insert(pointsPayload);
      if (pointsError) {
        throw new Error("No se pudieron guardar las características del servicio");
      }
    }

    return new Service({
      id: String(data.id),
      icon: input.icon,
      title: String(data.name ?? input.title),
      description: String(data.description ?? input.description ?? ""),
      features,
      ctaLabel: String(data.cta_label ?? input.ctaLabel),
    });
  }
}
