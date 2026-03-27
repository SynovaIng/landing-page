import {
  closestCenter,
  DndContext,
  type DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Image from "next/image";
import { type ReactElement, useEffect, useMemo, useState } from "react";

import {
  type FieldConfig,
  serviceIconOptions,
} from "@/contexts/dashboard/presentation/dashboard.config";

import RoundedCheckbox from "./RoundedCheckbox";

interface GalleryItem {
  id: string;
  kind: "existing" | "new";
  url?: string;
  file?: File;
  key?: string;
}

interface SortableGalleryRowProps {
  item: GalleryItem;
  index: number;
  previewUrl?: string;
  isCover: boolean;
  onDelete: () => void;
}

function SortableGalleryRow({ item, index, previewUrl, isCover, onDelete }: SortableGalleryRowProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.75 : 1,
  };

  return (
    <li
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-3 rounded-md border border-border bg-surface-alt p-2"
    >
      <button
        type="button"
        className="inline-flex h-7 w-7 items-center justify-center text-on-surface-muted"
        aria-label={`Mover imagen ${index + 1}`}
        {...attributes}
        {...listeners}
      >
        <span className="material-symbols-outlined">drag_indicator</span>
      </button>

      {previewUrl ? (
        <Image
          src={previewUrl}
          alt={`Imagen ${index + 1}`}
          width={80}
          height={56}
          unoptimized
          className="h-14 w-20 rounded object-cover"
        />
      ) : (
        <div className="flex h-14 w-20 items-center justify-center rounded bg-surface text-xs text-on-surface-muted">
          Sin preview
        </div>
      )}

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm text-on-surface">
          {item.kind === "existing" ? `Imagen ${index + 1}` : item.file?.name ?? `Nueva imagen ${index + 1}`}
        </p>
        {isCover && (
          <p className="text-xs font-medium text-secondary">Portada</p>
        )}
      </div>

      <button
        type="button"
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          onDelete();
        }}
        className="inline-flex h-8 w-8 shrink-0 items-center justify-center text-on-surface-muted hover:text-red-600"
        aria-label={`Eliminar imagen ${index + 1}`}
      >
        <span className="material-symbols-outlined text-[18px]">delete</span>
      </button>
    </li>
  );
}

interface DashboardEditModalProps {
  isOpen: boolean;
  mode: "create" | "edit";
  singularLabel: string;
  fields: FieldConfig[];
  values: Record<string, string | number | boolean | string[] | File[] | null>;
  projectServiceOptions: { id: string; name: string; icon?: string }[];
  projectOptions: { id: string; name: string }[];
  clientOptions: { id: string; name: string; location?: string }[];
  isSubmitting: boolean;
  onValueChange: (fieldKey: string, value: string | number | boolean | string[] | File[] | null) => void;
  onFileValidationError: (title: string, detail: string) => void;
  onClose: () => void;
  onSave: () => void;
}

const MAX_IMAGE_FILE_SIZE_BYTES = 15 * 1024 * 1024;

const formatSizeMb = (sizeInBytes: number): string => {
  return `${(sizeInBytes / (1024 * 1024)).toFixed(1)} MB`;
};

export default function DashboardEditModal({
  isOpen,
  mode,
  singularLabel,
  fields,
  values,
  projectServiceOptions,
  projectOptions,
  clientOptions,
  isSubmitting,
  onValueChange,
  onFileValidationError,
  onClose,
  onSave,
}: DashboardEditModalProps) {
  const [newServicePoint, setNewServicePoint] = useState("");
  const [iconSearchTerm, setIconSearchTerm] = useState("");
  const [projectSearchTerm, setProjectSearchTerm] = useState("");
  const [remoteIconSuggestions, setRemoteIconSuggestions] = useState<string[]>([]);
  const [isSearchingIcons, setIsSearchingIcons] = useState(false);
  const [isProjectServicesOpen, setIsProjectServicesOpen] = useState(false);
  const sensors = useSensors(useSensor(PointerSensor));

  const imagePreviewUrls = useMemo(() => {
    const imageFiles = Array.isArray(values.imageFiles)
      ? values.imageFiles.filter((file): file is File => file instanceof File)
      : [];

    return imageFiles.map((file) => URL.createObjectURL(file));
  }, [values.imageFiles]);

  useEffect(() => {
    return () => {
      imagePreviewUrls.forEach((previewUrl) => {
        URL.revokeObjectURL(previewUrl);
      });
    };
  }, [imagePreviewUrls]);

  useEffect(() => {
    const selectedProjectId = values.projectId ? String(values.projectId).trim() : null;

    if (!selectedProjectId) {
      return;
    }

    const selectedProject = projectOptions.find((projectOption) => projectOption.id === selectedProjectId);
    setProjectSearchTerm(selectedProject?.name ?? "");
  }, [isOpen, projectOptions, values.projectId]);

  useEffect(() => {
    if (!isOpen) {
      setProjectSearchTerm("");
    }
  }, [isOpen]);

  const selectedIcon = String(values.icon ?? "").trim();

  const searchMaterialIcons = async (searchTerm: string) => {
    const query = searchTerm.trim();

    if (!query) {
      setRemoteIconSuggestions([]);
      return;
    }

    setIsSearchingIcons(true);

    try {
      const response = await fetch(
        `/api/material-icons/search?q=${encodeURIComponent(query)}&limit=40`,
      );

      if (!response.ok) {
        setRemoteIconSuggestions([]);
        return;
      }

      const payload = (await response.json()) as { icons?: string[] };
      const normalized = (payload.icons ?? [])
        .map((iconName) => String(iconName ?? "").trim())
        .filter((iconName) => iconName.length > 0);

      setRemoteIconSuggestions(normalized);
    } catch {
      setRemoteIconSuggestions([]);
    } finally {
      setIsSearchingIcons(false);
    }
  };

  const filteredServiceIcons = useMemo(() => {
    const query = iconSearchTerm.trim().toLowerCase();
    const defaults = serviceIconOptions.filter((iconName) =>
      iconName.toLowerCase().includes(query),
    );
    const combined = [...defaults, ...remoteIconSuggestions];

    return [...new Set(combined)].slice(0, 40);
  }, [iconSearchTerm, remoteIconSuggestions]);

  const defaultIconSet = useMemo(
    () => new Set<string>(serviceIconOptions as readonly string[]),
    [],
  );

  const canRenderSelectedIcon = useMemo(() => {
    if (!selectedIcon) {
      return false;
    }

    return filteredServiceIcons.includes(selectedIcon) || defaultIconSet.has(selectedIcon);
  }, [defaultIconSet, filteredServiceIcons, selectedIcon]);

  let submitButtonLabel = mode === "create" ? "Crear" : "Guardar cambios";

  if (isSubmitting) {
    submitButtonLabel = "Guardando...";
  }

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy/40 px-4 py-8">
      <div className="w-full max-w-2xl rounded-2xl border border-border bg-surface shadow-2xl">
        <div className="flex items-start justify-between gap-3 border-b border-border px-6 py-4">
          <div>
            <h3 className="text-xl font-bold text-navy">
              {mode === "create" ? "Nuevo registro" : "Editar registro"}
            </h3>
            <p className="text-sm text-on-surface-muted">
              {mode === "create"
                ? `Completa los campos para crear ${singularLabel}.`
                : `Actualiza los campos de ${singularLabel}.`}
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              if (!isSubmitting) {
                onClose();
              }
            }}
            disabled={isSubmitting}
            className="inline-flex h-8 w-8 items-center justify-center rounded-md text-on-surface-muted hover:bg-surface-alt"
            aria-label="Cerrar modal"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <div className="max-h-[70vh] space-y-4 overflow-y-auto px-6 py-5">
          {fields.map((field) => {
            const value = values[field.key];

            if (field.key === "icon") {
              return (
                <div key={field.key} className="space-y-2">
                  <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-on-surface-muted">
                    {field.label}
                  </span>

                  <div className="rounded-lg border border-border bg-surface-alt p-3">
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={iconSearchTerm}
                        onChange={(event) => {
                          const nextValue = event.target.value;
                          setIconSearchTerm(nextValue);
                          void searchMaterialIcons(nextValue);
                        }}
                        onKeyDown={(event) => {
                          if (event.key === "Enter" && filteredServiceIcons.length > 0) {
                            event.preventDefault();
                            onValueChange(field.key, filteredServiceIcons[0]);
                            setIconSearchTerm(filteredServiceIcons[0]);
                          }
                        }}
                        placeholder="Buscar icono material (ej: electric_bolt)"
                        className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-on-surface shadow-sm focus:border-primary focus:outline-none"
                      />
                      <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-surface text-secondary">
                        <span className="material-symbols-outlined text-[20px]">
                          {canRenderSelectedIcon ? selectedIcon : "help"}
                        </span>
                      </div>
                    </div>

                    <p className="mt-2 text-xs text-on-surface-muted">
                      Seleccionado: {selectedIcon || "ninguno"}
                    </p>
                    <p className="mt-1 text-xs text-on-surface-muted">
                      Encuentra más iconos aquí:{" "}
                      <a
                        href="https://fonts.google.com/icons"
                        target="_blank"
                        rel="noreferrer"
                        className="font-medium text-secondary hover:underline"
                      >
                        Google Material Icons
                      </a>
                    </p>

                    <div className="mt-2 max-h-44 overflow-y-auto rounded-lg border border-border bg-surface">
                      {filteredServiceIcons.length === 0 ? (
                        <p className="px-3 py-2 text-sm text-on-surface-muted">
                          {isSearchingIcons ? "Buscando iconos..." : "No se encontraron iconos."}
                        </p>
                      ) : (
                        <ul className="py-1">
                          {filteredServiceIcons.map((iconName) => (
                            <li key={iconName}>
                              <button
                                type="button"
                                onClick={() => {
                                  onValueChange(field.key, iconName);
                                  setIconSearchTerm(iconName);
                                }}
                                className="flex w-full items-center gap-3 px-3 py-2 text-left text-sm text-on-surface hover:bg-surface-alt"
                              >
                                <span className="material-symbols-outlined text-[19px] text-secondary">
                                  {iconName}
                                </span>
                                <span>{iconName}</span>
                              </button>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </div>
              );
            }

            if (field.key === "features") {
              const featureItems = String(value ?? "")
                .split(/\n|·/)
                .map((item) => item.trim())
                .filter(Boolean);

              const addFeature = () => {
                const nextValue = newServicePoint.trim();
                if (!nextValue) {
                  return;
                }

                const updated = [...featureItems, nextValue].join(" · ");
                onValueChange(field.key, updated);
                setNewServicePoint("");
              };

              const removeFeature = (index: number) => {
                const updated = featureItems.filter((_, idx) => idx !== index).join(" · ");
                onValueChange(field.key, updated);
              };

              return (
                <div key={field.key} className="space-y-3">
                  <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-on-surface-muted">
                    {field.label}
                  </span>

                  <div className="space-y-2 rounded-lg border border-border bg-surface-alt p-3">
                    {featureItems.length === 0 ? (
                      <p className="text-sm text-on-surface-muted">Sin puntos agregados.</p>
                    ) : (
                      <ul className="space-y-2">
                        {featureItems.map((item, index) => (
                          <li
                            key={item}
                            className="flex items-center justify-between gap-2 rounded-md bg-surface px-3 py-2 text-sm text-on-surface"
                          >
                            <span className="line-clamp-2">{item}</span>
                            <button
                              type="button"
                              onClick={() => removeFeature(index)}
                              className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-border text-on-surface-muted hover:bg-surface-alt"
                              aria-label={`Eliminar punto ${index + 1}`}
                            >
                              <span className="material-symbols-outlined text-[16px]">close</span>
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}

                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newServicePoint}
                        onChange={(event) => setNewServicePoint(event.target.value)}
                        onKeyDown={(event) => {
                          if (event.key === "Enter") {
                            event.preventDefault();
                            addFeature();
                          }
                        }}
                        placeholder="Agregar punto del servicio"
                        className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-on-surface shadow-sm focus:border-primary focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={addFeature}
                        className="inline-flex items-center justify-center rounded-lg border border-border px-3 text-sm font-medium text-on-surface hover:bg-surface"
                      >
                        Agregar
                      </button>
                    </div>
                  </div>
                </div>
              );
            }

            if (field.key === "projectServiceIds") {
              const selectedServiceIds = Array.isArray(value)
                ? value.map((item) => String(item))
                : [];
              const selectedCount = selectedServiceIds.length;

              const toggleService = (serviceId: string) => {
                const exists = selectedServiceIds.includes(serviceId);
                const nextValue = exists
                  ? selectedServiceIds.filter((id) => id !== serviceId)
                  : [...selectedServiceIds, serviceId];

                onValueChange(field.key, nextValue);
              };

              return (
                <div key={field.key} className="space-y-2">
                  <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-on-surface-muted">
                    {field.label}
                  </span>
                  <div className="rounded-lg border border-border bg-surface-alt p-3">
                    <button
                      type="button"
                      onClick={() => setIsProjectServicesOpen((prev) => !prev)}
                      className="inline-flex w-full items-center justify-between rounded-lg border border-border bg-surface px-3 py-2 text-left text-sm font-medium text-on-surface hover:bg-surface-alt"
                    >
                      <span>
                        {selectedCount === 0
                          ? "Seleccionar servicios"
                          : `${selectedCount} servicio${selectedCount === 1 ? "" : "s"} seleccionado${selectedCount === 1 ? "" : "s"}`}
                      </span>
                      <span className="material-symbols-outlined text-[18px]">
                        {isProjectServicesOpen ? "expand_less" : "expand_more"}
                      </span>
                    </button>

                    {isProjectServicesOpen ? (
                      <div className="mt-2 max-h-48 space-y-2 overflow-y-auto rounded-lg border border-border bg-surface p-3">
                        {projectServiceOptions.length === 0 ? (
                          <p className="text-sm text-on-surface-muted">No hay servicios disponibles.</p>
                        ) : (
                          projectServiceOptions.map((serviceOption) => (
                            <label key={serviceOption.id} className="flex cursor-pointer items-center gap-3">
                              <RoundedCheckbox
                                checked={selectedServiceIds.includes(serviceOption.id)}
                                onChange={() => toggleService(serviceOption.id)}
                                ariaLabel={`Seleccionar ${serviceOption.name}`}
                              />
                              <span className="material-symbols-outlined text-[18px] text-secondary">
                                {serviceOption.icon ?? "engineering"}
                              </span>
                              <span className="text-sm text-on-surface">{serviceOption.name}</span>
                            </label>
                          ))
                        )}
                      </div>
                    ) : null}
                  </div>
                </div>
              );
            }

            if (field.type === "checkbox") {
              return (
                <div key={field.key} className="flex items-center gap-3">
                  <RoundedCheckbox
                    checked={Boolean(value)}
                    onChange={() => onValueChange(field.key, !Boolean(value))}
                    ariaLabel={`Editar ${field.label}`}
                  />
                  <span className="text-sm font-medium text-on-surface">{field.label}</span>
                </div>
              );
            }

            if (field.key === "clientId") {
              const selectedClientId = value ? String(value) : null;
              const companyName = String(values.companyName ?? "");
              const isCreatingCompany = Boolean(values.createCompany);
              const companyLocation = String(values.companyLocation ?? "");

              const filteredClients = clientOptions
                .filter((clientOption) =>
                  clientOption.name.toLowerCase().includes(companyName.trim().toLowerCase()),
                );

              const updateFromCompanyName = (nextCompanyName: string) => {
                onValueChange("companyName", nextCompanyName);

                if (isCreatingCompany) {
                  return;
                }

                const exactMatch = clientOptions.find(
                  (clientOption) =>
                    clientOption.name.trim().toLowerCase() === nextCompanyName.trim().toLowerCase(),
                );

                onValueChange(field.key, exactMatch?.id ?? null);
              };

              return (
                <div key={field.key} className="space-y-2">
                  <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-on-surface-muted">
                    {field.label}
                  </span>

                  <div className="space-y-3 rounded-lg border border-border bg-surface-alt p-3">
                    <input
                      type="text"
                      value={companyName}
                      onChange={(event) => updateFromCompanyName(event.target.value)}
                      placeholder={
                        isCreatingCompany
                          ? "Escribe el nombre de la nueva empresa"
                          : "Selecciona o busca una empresa"
                      }
                      className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-on-surface shadow-sm focus:border-primary focus:outline-none"
                    />

                    {!isCreatingCompany ? (
                      <div className="max-h-36 overflow-y-auto rounded-lg border border-border bg-surface">
                        {filteredClients.length === 0 ? (
                          <p className="px-3 py-2 text-xs text-on-surface-muted">
                            No hay coincidencias. Activa el switch para crear una empresa.
                          </p>
                        ) : (
                          <ul className="py-1">
                            {filteredClients.map((clientOption) => (
                              <li key={clientOption.id}>
                                <button
                                  type="button"
                                  onClick={() => {
                                    onValueChange(field.key, clientOption.id);
                                    onValueChange("companyName", clientOption.name);
                                  }}
                                  className="flex w-full items-center justify-between gap-2 px-3 py-2 text-left hover:bg-surface-alt"
                                >
                                  <span className="text-sm text-on-surface">{clientOption.name}</span>
                                  {selectedClientId === clientOption.id ? (
                                    <span className="material-symbols-outlined text-[18px] text-secondary">check</span>
                                  ) : null}
                                </button>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ) : null}

                    <div className="flex items-center justify-between rounded-lg border border-border bg-surface px-3 py-2">
                      <span className="text-sm text-on-surface">Agregar nueva empresa</span>
                      <label className="relative inline-flex cursor-pointer items-center">
                        <input
                          type="checkbox"
                          className="peer sr-only"
                          checked={isCreatingCompany}
                          onChange={() => {
                            const nextCreateValue = !isCreatingCompany;
                            onValueChange("createCompany", nextCreateValue);

                            if (nextCreateValue) {
                              onValueChange(field.key, null);
                              return;
                            }

                            const exactMatch = clientOptions.find(
                              (clientOption) =>
                                clientOption.name.trim().toLowerCase() === companyName.trim().toLowerCase(),
                            );

                            onValueChange(field.key, exactMatch?.id ?? null);
                          }}
                        />
                        <span className="h-6 w-11 rounded-full bg-border transition-colors peer-checked:bg-secondary" />
                        <span className="pointer-events-none absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-surface shadow-sm transition-transform peer-checked:translate-x-5" />
                      </label>
                    </div>

                    {isCreatingCompany ? (
                      <label className="block">
                        <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-on-surface-muted">
                          Dirección empresa (opcional)
                        </span>
                        <input
                          type="text"
                          value={companyLocation}
                          onChange={(event) => onValueChange("companyLocation", event.target.value)}
                          placeholder="Ej: Las Condes, Santiago"
                          className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-on-surface shadow-sm focus:border-primary focus:outline-none"
                        />
                      </label>
                    ) : (
                      <p className="text-xs text-on-surface-muted">
                        Solo se aceptan empresas existentes mientras el switch esté desactivado.
                      </p>
                    )}
                  </div>
                </div>
              );
            }

            if (field.key === "projectId") {
              const selectedProjectId = value ? String(value).trim() : null;
              const normalizedSearch = projectSearchTerm.trim().toLowerCase();
              const filteredProjects = projectOptions
                .filter((projectOption) => projectOption.name.toLowerCase().includes(normalizedSearch))
                .slice(0, 10);

              return (
                <div key={field.key} className="space-y-2">
                  <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-on-surface-muted">
                    {field.label}
                  </span>

                  <div className="space-y-2 rounded-lg border border-border bg-surface-alt p-3">
                    <input
                      type="text"
                      value={projectSearchTerm}
                      onChange={(event) => {
                        const nextSearch = event.target.value;
                        setProjectSearchTerm(nextSearch);

                        const exactMatch = projectOptions.find(
                          (projectOption) =>
                            projectOption.name.trim().toLowerCase() === nextSearch.trim().toLowerCase(),
                        );

                        onValueChange(field.key, exactMatch?.id ?? null);
                      }}
                      placeholder="Sin proyecto asignado - Buscar proyecto"
                      className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-on-surface shadow-sm focus:border-primary focus:outline-none"
                    />

                    <div className="max-h-40 overflow-y-auto rounded-lg border border-border bg-surface">
                      {filteredProjects.length === 0 ? (
                        <p className="px-3 py-2 text-xs text-on-surface-muted">
                          No hay proyectos que coincidan.
                        </p>
                      ) : (
                        <ul className="py-1">
                          {filteredProjects.map((projectOption) => (
                            <li key={projectOption.id}>
                              <button
                                type="button"
                                onClick={() => {
                                  onValueChange(field.key, projectOption.id);
                                  setProjectSearchTerm(projectOption.name);
                                }}
                                className="flex w-full items-center justify-between gap-2 px-3 py-2 text-left hover:bg-surface-alt"
                              >
                                <span className="text-sm text-on-surface">{projectOption.name}</span>
                                {selectedProjectId === projectOption.id ? (
                                  <span className="material-symbols-outlined text-[18px] text-secondary">check</span>
                                ) : null}
                              </button>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </div>
              );
            }

            if (field.type === "file") {
              const inputId = `${field.key}-input`;
              const selectedFiles = Array.isArray(value)
                ? value.filter((file): file is File => file instanceof File)
                : [];
              const imageFileKeys = Array.isArray(values.imageFileKeys)
                ? values.imageFileKeys.map((entry) => String(entry))
                : selectedFiles.map((_, index) => `new-${index}`);

              const normalizedImageFileKeys = selectedFiles.map((file, index) => {
                const key = imageFileKeys[index];

                if (key && key.trim().length > 0) {
                  return key;
                }

                return `new-${file.name}-${file.lastModified}-${file.size}-${index}`;
              });

              const currentImageUrl = String(values.imageUrl ?? "").trim();
              const currentImageUrls = Array.isArray(values.imageUrls)
                ? values.imageUrls.map((image) => String(image).trim()).filter(Boolean)
                : [];

              if (currentImageUrls.length === 0 && currentImageUrl) {
                currentImageUrls.push(currentImageUrl);
              }

              const existingItems: GalleryItem[] = currentImageUrls.map((url) => ({
                id: `existing:${url}`,
                kind: "existing",
                url,
              }));

              const newItems: GalleryItem[] = selectedFiles.map((file, index) => ({
                id: `new:${normalizedImageFileKeys[index]}`,
                kind: "new",
                file,
                key: normalizedImageFileKeys[index],
              }));

              const allItems = [...existingItems, ...newItems];

              const existingItemMap = new Map(existingItems.map((item) => [item.id, item]));
              const newItemMap = new Map(newItems.map((item) => [item.id, item]));

              const defaultOrder = allItems.map((item) => item.id);
              const persistedOrder = Array.isArray(values.imageOrderRefs)
                ? values.imageOrderRefs.map((entry) => String(entry))
                : [];

              const orderedIds = persistedOrder.length > 0
                ? [
                    ...persistedOrder.filter((id) => existingItemMap.has(id) || newItemMap.has(id)),
                    ...defaultOrder.filter((id) => !persistedOrder.includes(id)),
                  ]
                : defaultOrder;

              const orderedItems = orderedIds
                .map((id) => existingItemMap.get(id) ?? newItemMap.get(id))
                .filter((item): item is GalleryItem => Boolean(item));

              const syncImageStateFromOrder = (items: GalleryItem[]) => {
                const nextExistingImageUrls = items
                  .filter((item) => item.kind === "existing")
                  .map((item) => String(item.url ?? ""))
                  .filter((url) => url.length > 0);

                const nextNewItems = items.filter((item) => item.kind === "new");
                const nextImageFiles = nextNewItems
                  .map((item) => item.file)
                  .filter((file): file is File => Boolean(file));
                const nextImageFileKeys = nextNewItems
                  .map((item) => item.key)
                  .filter((key): key is string => Boolean(key));
                const nextOrderRefs = items.map((item) => item.id);

                onValueChange("imageUrls", nextExistingImageUrls);
                onValueChange("imageFiles", nextImageFiles);
                onValueChange("imageFileKeys", nextImageFileKeys);
                onValueChange("imageOrderRefs", nextOrderRefs);
              };

              const handleDragEnd = (event: DragEndEvent) => {
                const { active, over } = event;

                if (!over || active.id === over.id) {
                  return;
                }

                const fromIndex = orderedItems.findIndex((item) => item.id === String(active.id));
                const toIndex = orderedItems.findIndex((item) => item.id === String(over.id));

                if (fromIndex === -1 || toIndex === -1) {
                  return;
                }

                const reorderedItems = arrayMove(orderedItems, fromIndex, toIndex);
                syncImageStateFromOrder(reorderedItems);
              };

              return (
                <div key={field.key} className="block">
                  <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-on-surface-muted">
                    {field.label}
                  </span>

                  <div className="space-y-3 rounded-lg border border-border bg-surface-alt p-3">
                    <input
                      id={inputId}
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(event) => {
                        const pickedFiles = event.target.files ? Array.from(event.target.files) : [];
                        const acceptedFiles: File[] = [];
                        const rejectedMessages: string[] = [];

                        pickedFiles.forEach((file) => {
                          const fileLabel = file.name || "archivo sin nombre";

                          if (!file.type || !file.type.startsWith("image/")) {
                            rejectedMessages.push(`${fileLabel}: formato no soportado.`);
                            return;
                          }

                          if (file.size <= 0) {
                            rejectedMessages.push(
                              `${fileLabel}: no se pudo leer el archivo. Si viene de Drive, descárgalo localmente e intenta nuevamente.`,
                            );
                            return;
                          }

                          if (file.size > MAX_IMAGE_FILE_SIZE_BYTES) {
                            rejectedMessages.push(
                              `${fileLabel}: supera el máximo por archivo (${formatSizeMb(MAX_IMAGE_FILE_SIZE_BYTES)}).`,
                            );
                            return;
                          }

                          acceptedFiles.push(file);
                        });

                        if (rejectedMessages.length > 0) {
                          onFileValidationError(
                            "No se pudieron agregar una o más imágenes.",
                            rejectedMessages.join("\n"),
                          );
                        }

                        if (acceptedFiles.length === 0) {
                          event.target.value = "";
                          return;
                        }

                        const nextKeys = acceptedFiles.map(
                          (file, index) => `new-${file.name}-${file.lastModified}-${file.size}-${index}-${crypto.randomUUID()}`,
                        );

                        const appendedNewItems: GalleryItem[] = [
                          ...selectedFiles.map((file, index) => ({
                            id: `new:${normalizedImageFileKeys[index]}`,
                            kind: "new" as const,
                            file,
                            key: normalizedImageFileKeys[index],
                          })),
                          ...acceptedFiles.map((file, index) => ({
                            id: `new:${nextKeys[index]}`,
                            kind: "new" as const,
                            file,
                            key: nextKeys[index],
                          })),
                        ];

                        const mergedItems: GalleryItem[] = [
                          ...currentImageUrls.map((url) => ({
                            id: `existing:${url}`,
                            kind: "existing" as const,
                            url,
                          })),
                          ...appendedNewItems,
                        ];

                        syncImageStateFromOrder(mergedItems);
                        event.target.value = "";
                      }}
                      className="sr-only"
                    />

                    <label
                      htmlFor={inputId}
                      className="inline-flex cursor-pointer items-center rounded-lg border border-border bg-surface px-3 py-2 text-sm font-medium text-on-surface hover:bg-surface-alt"
                    >
                      Elegir archivos
                    </label>

                    <p className="text-xs text-on-surface-muted">
                      {selectedFiles.length > 0
                        ? `${selectedFiles.length} archivo${selectedFiles.length === 1 ? "" : "s"} seleccionado${selectedFiles.length === 1 ? "" : "s"}`
                        : "No hay archivos seleccionados."}
                    </p>

                    {orderedItems.length > 0 ? (
                      <div className="rounded-lg border border-border bg-surface p-2">
                        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-on-surface-muted">
                          Imágenes del proyecto (arrastra para ordenar)
                        </p>
                        <DndContext
                          sensors={sensors}
                          collisionDetection={closestCenter}
                          onDragEnd={handleDragEnd}
                        >
                          <SortableContext items={orderedItems.map((item) => item.id)} strategy={verticalListSortingStrategy}>
                            <ul className="space-y-2">
                              {orderedItems.map((item, index) => (
                                <SortableGalleryRow
                                  key={item.id}
                                  item={item}
                                  index={index}
                                  isCover={index === 0}
                                  previewUrl={
                                    item.kind === "existing"
                                      ? item.url
                                      : imagePreviewUrls[
                                          normalizedImageFileKeys.findIndex((key) => key === item.key)
                                        ]
                                  }
                                  onDelete={() => {
                                    const remainingItems = orderedItems.filter((candidate) => candidate.id !== item.id);
                                    syncImageStateFromOrder(remainingItems);
                                  }}
                                />
                              ))}
                            </ul>
                          </SortableContext>
                        </DndContext>
                      </div>
                    ) : null}
                  </div>
                </div>
              );
            }

            let inputElement: ReactElement;

            if (field.type === "textarea") {
              inputElement = (
                <textarea
                  value={String(value ?? "")}
                  onChange={(event) => onValueChange(field.key, event.target.value)}
                  rows={4}
                  className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-on-surface shadow-sm focus:border-primary focus:outline-none"
                />
              );
            } else if (field.type === "select") {
              inputElement = (
                <select
                  value={String(value ?? "")}
                  onChange={(event) => onValueChange(field.key, event.target.value)}
                  className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-on-surface shadow-sm focus:border-primary focus:outline-none"
                >
                  {(field.options ?? []).map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              );
            } else {
              inputElement = (
                <input
                  type={field.type}
                  min={field.type === "number" ? field.min : undefined}
                  max={field.type === "number" ? field.max : undefined}
                  step={field.type === "number" ? field.step : undefined}
                  value={field.type === "number" ? Number(value ?? 0) : String(value ?? "")}
                  onChange={(event) =>
                    onValueChange(
                      field.key,
                      field.type === "number" ? Number(event.target.value || 0) : event.target.value,
                    )
                  }
                  className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-on-surface shadow-sm focus:border-primary focus:outline-none"
                />
              );
            }

            return (
              <label key={field.key} className="block">
                <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-on-surface-muted">
                  {field.label}
                </span>

                {inputElement}
              </label>
            );
          })}
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-border px-6 py-4">
          <button
            type="button"
            onClick={() => {
              if (!isSubmitting) {
                onClose();
              }
            }}
            disabled={isSubmitting}
            className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-on-surface hover:bg-surface-alt disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onSave}
            disabled={isSubmitting}
            className="rounded-lg bg-cyan-gradient px-4 py-2 text-sm font-semibold text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitButtonLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
