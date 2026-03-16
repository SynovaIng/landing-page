import type { DashboardSectionKey } from "@/contexts/dashboard/domain/dashboard.entity";
import { PROJECT_CATEGORIES } from "@/contexts/projects/domain/project.entity";

export interface TableColumn {
  key: string;
  label: string;
}

export interface FieldConfig {
  key: string;
  label: string;
  type: "text" | "textarea" | "number" | "checkbox" | "select" | "file";
  options?: readonly string[];
  min?: number;
  max?: number;
  step?: number;
}

export const serviceIconOptions = [
  "engineering",
  "electric_bolt",
  "verified_user",
  "emergency_home",
  "build",
  "construction",
  "electrical_services",
  "lightbulb",
  "settings",
  "plumbing",
  "handyman",
  "home_repair_service",
  "security",
  "solar_power",
  "power",
  "bolt",
  "monitoring",
  "precision_manufacturing",
  "support_agent",
  "energy_savings_leaf",
] as const;

interface SectionConfig {
  label: string;
  singularLabel: string;
  columns: TableColumn[];
}

export const sectionConfig: Record<DashboardSectionKey, SectionConfig> = {
  projects: {
    label: "Proyectos",
    singularLabel: "proyecto",
    columns: [
      { key: "name", label: "Nombre" },
      { key: "type", label: "Tipo" },
      { key: "location", label: "Ubicación" },
      { key: "projectServicesSummary", label: "Servicios" },
    ],
  },
  services: {
    label: "Servicios",
    singularLabel: "servicio",
    columns: [
      { key: "icon", label: "Icono" },
      { key: "name", label: "Nombre" },
      { key: "slug", label: "Slug" },
      { key: "ctaLabel", label: "Texto del botón" },
    ],
  },
  testimonials: {
    label: "Reseñas",
    singularLabel: "reseña",
    columns: [
      { key: "clientName", label: "Cliente" },
      { key: "companyName", label: "Empresa" },
      { key: "stars", label: "Estrellas" },
      { key: "clientLocation", label: "Ubicación" },
      { key: "message", label: "Comentario" },
    ],
  },
};

export const editFieldConfig: Record<DashboardSectionKey, FieldConfig[]> = {
  projects: [
    { key: "name", label: "Nombre", type: "text" },
    { key: "description", label: "Descripción", type: "textarea" },
    { key: "type", label: "Tipo", type: "select", options: PROJECT_CATEGORIES },
    { key: "location", label: "Ubicación", type: "text" },
    { key: "projectServiceIds", label: "Servicios", type: "text" },
    { key: "imageFiles", label: "Imágenes del proyecto", type: "file" },
    { key: "isActive", label: "Visible", type: "checkbox" },
  ],
  services: [
    { key: "icon", label: "Icono", type: "text" },
    { key: "name", label: "Nombre", type: "text" },
    { key: "slug", label: "Slug", type: "text" },
    { key: "description", label: "Descripción", type: "textarea" },
    { key: "ctaLabel", label: "Texto del botón", type: "text" },
    { key: "features", label: "Características", type: "textarea" },
    { key: "isActive", label: "Visible", type: "checkbox" },
  ],
  testimonials: [
    { key: "clientId", label: "Empresa", type: "select" },
    { key: "clientName", label: "Nombre cliente", type: "text" },
    { key: "clientInitials", label: "Iniciales", type: "text" },
    { key: "clientLocation", label: "Ubicación", type: "text" },
    { key: "stars", label: "Estrellas", type: "number", min: 0, max: 5, step: 0.5 },
    { key: "message", label: "Comentario", type: "textarea" },
    { key: "isActive", label: "Visible", type: "checkbox" },
  ],
};

export const createFieldDefaults: Record<
  DashboardSectionKey,
  Record<string, string | number | boolean | string[] | File[] | null>
> = {
  projects: {
    name: "",
    description: "",
    type: "Comercial",
    location: "",
    projectServiceIds: [],
    imageUrl: "",
    imageUrls: [],
    imageFiles: [],
    imageFileKeys: [],
    imageOrderRefs: [],
    isActive: true,
  },
  services: {
    icon: "engineering",
    name: "",
    slug: "",
    description: "",
    ctaLabel: "Cotizar",
    features: "",
    isActive: true,
  },
  testimonials: {
    clientId: "",
    companyName: "",
    createCompany: false,
    companyLocation: "",
    clientName: "",
    clientInitials: "",
    clientLocation: "",
    stars: 5,
    message: "",
    isActive: true,
  },
};
