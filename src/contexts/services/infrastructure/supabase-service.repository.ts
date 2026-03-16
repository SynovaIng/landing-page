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
          .select("id, name, description, cta_label, slug, icon, order_index")
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
      icon: String(service.icon ?? "engineering"),
      title: String(service.name ?? ""),
      description: String(service.description ?? ""),
      features: pointsByService.get(String(service.id)) ?? [],
      ctaLabel: String(service.cta_label ?? "Cotizar"),
      orderIndex: Number(service.order_index ?? 0),
    }));
  }

  async getById(id: string): Promise<Service | null> {
    const supabase = await createSupabaseServerClient();

    const [{ data: serviceData, error: serviceError }, { data: pointsData }] =
      await Promise.all([
        supabase
          .from("services")
          .select("id, name, description, cta_label, icon, order_index")
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
      icon: String(serviceData.icon ?? "engineering"),
      title: String(serviceData.name ?? ""),
      description: String(serviceData.description ?? ""),
      features: (pointsData ?? []).map((point) => String(point.label)),
      ctaLabel: String(serviceData.cta_label ?? "Cotizar"),
      orderIndex: Number(serviceData.order_index ?? 0),
    });
  }

  async create(input: CreateServiceInput): Promise<Service> {
    const supabase = await createSupabaseServerClient();
    const { data: maxOrderService } = await supabase
      .from("services")
      .select("order_index")
      .order("order_index", { ascending: false })
      .limit(1)
      .maybeSingle();

    const nextOrderIndex = Number(maxOrderService?.order_index ?? -1) + 1;

    const { data, error } = await supabase
      .from("services")
      .insert({
        name: input.title,
        slug: input.slug,
        description: input.description ?? "",
        icon: input.icon,
        cta_label: input.ctaLabel,
        is_published: input.isPublished,
        order_index: nextOrderIndex,
      })
      .select("id, name, description, cta_label, icon, order_index")
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
        console.warn("No se pudieron guardar los service_points:", pointsError.message);
      }
    }

    return new Service({
      id: String(data.id),
      icon: String(data.icon ?? input.icon),
      title: String(data.name ?? input.title),
      description: String(data.description ?? input.description ?? ""),
      features,
      ctaLabel: String(data.cta_label ?? input.ctaLabel),
      orderIndex: Number(data.order_index ?? nextOrderIndex),
    });
  }

  async reorder(ids: string[]): Promise<void> {
    const supabase = await createSupabaseServerClient();

    const updates = ids.map((id, index) =>
      supabase
        .from("services")
        .update({ order_index: index })
        .eq("id", id),
    );

    const results = await Promise.all(updates);
    const hasError = results.some((result) => Boolean(result.error));

    if (hasError) {
      throw new Error("No se pudo actualizar el orden de servicios");
    }
  }
}
