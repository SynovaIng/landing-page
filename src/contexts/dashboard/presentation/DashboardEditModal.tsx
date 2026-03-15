import { useMemo, useState } from "react";

import {
  type FieldConfig,
  serviceIconOptions,
} from "@/contexts/dashboard/presentation/dashboard.config";

import RoundedCheckbox from "./RoundedCheckbox";

interface DashboardEditModalProps {
  isOpen: boolean;
  mode: "create" | "edit";
  singularLabel: string;
  fields: FieldConfig[];
  values: Record<string, string | number | boolean>;
  onValueChange: (fieldKey: string, value: string | number | boolean) => void;
  onClose: () => void;
  onSave: () => void;
}

export default function DashboardEditModal({
  isOpen,
  mode,
  singularLabel,
  fields,
  values,
  onValueChange,
  onClose,
  onSave,
}: DashboardEditModalProps) {
  const [newServicePoint, setNewServicePoint] = useState("");
  const [iconSearchTerm, setIconSearchTerm] = useState("");
  const [remoteIconSuggestions, setRemoteIconSuggestions] = useState<string[]>([]);
  const [isSearchingIcons, setIsSearchingIcons] = useState(false);

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

      const payload = (await response.json()) as { icons?: unknown[] };
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
            onClick={onClose}
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

            return (
              <label key={field.key} className="block">
                <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-on-surface-muted">
                  {field.label}
                </span>

                {field.type === "textarea" ? (
                  <textarea
                    value={String(value ?? "")}
                    onChange={(event) => onValueChange(field.key, event.target.value)}
                    rows={4}
                    className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-on-surface shadow-sm focus:border-primary focus:outline-none"
                  />
                ) : (
                  <input
                    type={field.type}
                    min={field.type === "number" ? field.min : undefined}
                    max={field.type === "number" ? field.max : undefined}
                    step={field.type === "number" ? field.step : undefined}
                    value={field.type === "number" ? Number(value ?? 0) : String(value ?? "")}
                    onChange={(event) =>
                      onValueChange(
                        field.key,
                        field.type === "number"
                          ? Number(event.target.value || 0)
                          : event.target.value,
                      )
                    }
                    className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-on-surface shadow-sm focus:border-primary focus:outline-none"
                  />
                )}
              </label>
            );
          })}
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-border px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-on-surface hover:bg-surface-alt"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onSave}
            className="rounded-lg bg-cyan-gradient px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
          >
            {mode === "create" ? "Crear" : "Guardar cambios"}
          </button>
        </div>
      </div>
    </div>
  );
}
