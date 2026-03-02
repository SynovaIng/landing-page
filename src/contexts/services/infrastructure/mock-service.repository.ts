import { Service as DiodService } from "diod";

import type { Service } from "@/contexts/services/domain/service.entity";
import { ServiceRepository } from "@/contexts/services/domain/service.repository";

const mockServices: Service[] = [
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
  },
];

@DiodService()
export class MockServiceRepository extends ServiceRepository {
  async getAll(): Promise<Service[]> {
    return mockServices;
  }

  async getById(id: string): Promise<Service | null> {
    return mockServices.find((s) => s.id === id) ?? null;
  }
}
