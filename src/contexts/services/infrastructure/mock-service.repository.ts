import { Service as DiodService } from "diod";

import { Service } from "@/contexts/services/domain/service.entity";
import type { CreateServiceInput } from "@/contexts/services/domain/service.repository";
import { ServiceRepository } from "@/contexts/services/domain/service.repository";

const mockServices: Service[] = [
  new Service({
    id: "instalaciones",
    icon: "electric_bolt",
    title: "Instalaciones Eléctricas",
    description:
      "Diseño y ejecución de proyectos eléctricos domiciliarios e industriales bajo normativa vigente.",
    features: [
      "Residencial, comercial e industrial",
      "Tableros y empalmes",
      "Iluminación LED y puntos de red",
    ],
    ctaLabel: "Cotizar Proyecto",
    orderIndex: 0,
  }),
  new Service({
    id: "certificaciones",
    icon: "verified_user",
    title: "Certificaciones SEC",
    description:
      "Regularización y certificación de instalaciones (TE1) ante la Superintendencia de Electricidad y Combustibles.",
    features: [
      "Tramitación completa TE1",
      "Visitas técnicas de inspección",
      "Planos y memorias explicativas",
    ],
    ctaLabel: "Gestionar Certificación",
    orderIndex: 1,
  }),
  new Service({
    id: "emergencias",
    icon: "emergency_home",
    title: "Emergencias 24/7",
    description:
      "Respuesta inmediata ante cortes de energía, cortocircuitos y fallas críticas en Santiago.",
    features: [
      "Atención inmediata en Santiago",
      "Reparación de cortes de luz",
      "Diagnóstico de fallas críticas",
    ],
    ctaLabel: "Llamar Urgencia",
    orderIndex: 2,
  }),
  new Service({
    id: "mantencion",
    icon: "engineering",
    title: "Mantención Preventiva",
    description:
      "Planes de mantenimiento para tableros, sistemas de iluminación y redes de distribución.",
    features: [
      "Revisión termográfica de tableros",
      "Ajuste y limpieza de conexiones",
      "Informes técnicos detallados",
    ],
    ctaLabel: "Solicitar Plan",
    orderIndex: 3,
  }),
];

@DiodService()
export class MockServiceRepository extends ServiceRepository {
  async getAll(): Promise<Service[]> {
    return mockServices;
  }

  async getById(id: string): Promise<Service | null> {
    return mockServices.find((s) => s.id === id) ?? null;
  }

  async create(input: CreateServiceInput): Promise<Service> {
    const created = new Service({
      id: input.slug || `service-${Date.now()}`,
      icon: input.icon,
      title: input.title,
      description: input.description ?? "",
      features: input.features,
      ctaLabel: input.ctaLabel,
      orderIndex: mockServices.length,
    });

    mockServices.unshift(created);
    return created;
  }

  async reorder(ids: string[]): Promise<void> {
    const serviceById = new Map(mockServices.map((service) => [service.id, service]));
    const reordered = ids
      .map((id, index) => {
        const service = serviceById.get(id);

        if (!service) {
          return null;
        }

        return new Service({
          id: service.id,
          icon: service.icon,
          title: service.title,
          description: service.description,
          features: service.features,
          ctaLabel: service.ctaLabel,
          orderIndex: index,
        });
      })
      .filter((service): service is Service => service !== null);

    mockServices.splice(0, mockServices.length, ...reordered);
  }
}
