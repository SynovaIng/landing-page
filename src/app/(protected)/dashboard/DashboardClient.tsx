"use client";

import { useEffect, useMemo, useState } from "react";

import type {
  DashboardRowBase,
  DashboardSectionData,
  DashboardSectionKey,
} from "@/app/(protected)/dashboard/dashboard.types";

interface TableColumn {
  key: string;
  label: string;
}

type DashboardEditableValue = string | number | boolean;

interface EditContext {
  sectionKey: DashboardSectionKey;
  rowId: string;
}

interface FieldConfig {
  key: string;
  label: string;
  type: "text" | "textarea" | "number" | "checkbox";
  min?: number;
  max?: number;
  step?: number;
}

type DashboardClientProps = DashboardSectionData;

const sectionConfig: Record<
  DashboardSectionKey,
  {
    label: string;
    singularLabel: string;
    columns: TableColumn[];
  }
> = {
  projects: {
    label: "Proyectos",
    singularLabel: "proyecto",
    columns: [
      { key: "name", label: "Nombre" },
      { key: "type", label: "Tipo" },
      { key: "location", label: "Ubicación" },
    ],
  },
  services: {
    label: "Servicios",
    singularLabel: "servicio",
    columns: [
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
      { key: "stars", label: "Estrellas" },
      { key: "clientLocation", label: "Ubicación" },
      { key: "message", label: "Comentario" },
    ],
  },
};

const editFieldConfig: Record<DashboardSectionKey, FieldConfig[]> = {
  projects: [
    { key: "id", label: "ID", type: "text" },
    { key: "name", label: "Nombre", type: "text" },
    { key: "description", label: "Descripción", type: "textarea" },
    { key: "type", label: "Tipo", type: "text" },
    { key: "location", label: "Ubicación", type: "text" },
    { key: "isActive", label: "Visible", type: "checkbox" },
  ],
  services: [
    { key: "id", label: "ID", type: "text" },
    { key: "name", label: "Nombre", type: "text" },
    { key: "slug", label: "Slug", type: "text" },
    { key: "description", label: "Descripción", type: "textarea" },
    { key: "ctaLabel", label: "Texto del botón", type: "text" },
    { key: "features", label: "Características", type: "textarea" },
    { key: "isActive", label: "Visible", type: "checkbox" },
  ],
  testimonials: [
    { key: "id", label: "ID", type: "text" },
    { key: "clientName", label: "Nombre cliente", type: "text" },
    { key: "clientInitials", label: "Iniciales", type: "text" },
    { key: "clientLocation", label: "Ubicación", type: "text" },
    { key: "stars", label: "Estrellas", type: "number", min: 0, max: 5, step: 0.5 },
    { key: "message", label: "Comentario", type: "textarea" },
    { key: "isActive", label: "Visible", type: "checkbox" },
  ],
};

function createSelectedState(): Record<DashboardSectionKey, string[]> {
  return {
    projects: [],
    services: [],
    testimonials: [],
  };
}

interface RoundedCheckboxProps {
  checked: boolean;
  onChange: () => void;
  ariaLabel: string;
  className?: string;
}

function RoundedCheckbox({
  checked,
  onChange,
  ariaLabel,
  className = "",
}: RoundedCheckboxProps) {
  return (
    <label
      className={`relative inline-flex h-5 w-5 cursor-pointer items-center justify-center ${className}`}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="peer sr-only"
        aria-label={ariaLabel}
      />
      <span className="h-5 w-5 rounded-md border-2 border-border bg-surface shadow-sm transition-colors peer-checked:border-green-600 peer-checked:bg-green-600 peer-focus-visible:ring-2 peer-focus-visible:ring-primary/30" />
      <span className="material-symbols-outlined pointer-events-none absolute text-[14px] leading-none text-white opacity-0 transition-opacity peer-checked:opacity-100">
        check
      </span>
    </label>
  );
}

export default function DashboardClient({
  projects,
  services,
  testimonials,
}: DashboardClientProps) {
  const [activeSection, setActiveSection] = useState<DashboardSectionKey>("projects");
  const [rowsBySection, setRowsBySection] = useState<DashboardSectionData>({
    projects,
    services,
    testimonials,
  });
  const [selectedBySection, setSelectedBySection] = useState<
    Record<DashboardSectionKey, string[]>
  >(createSelectedState());
  const [editContext, setEditContext] = useState<EditContext | null>(null);
  const [draftValues, setDraftValues] = useState<Record<string, DashboardEditableValue>>({});

  useEffect(() => {
    if (!editContext) {
      return () => {};
    }

    const scrollY = window.scrollY;
    const body = document.body;
    const previousOverflow = body.style.overflow;
    const previousPosition = body.style.position;
    const previousTop = body.style.top;
    const previousWidth = body.style.width;

    body.style.overflow = "hidden";
    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.width = "100%";

    return () => {
      body.style.overflow = previousOverflow;
      body.style.position = previousPosition;
      body.style.top = previousTop;
      body.style.width = previousWidth;
      window.scrollTo(0, scrollY);
    };
  }, [editContext]);

  const section = sectionConfig[activeSection];
  const currentRows = rowsBySection[activeSection];
  const selectedIds = selectedBySection[activeSection];

  const selectedSet = useMemo(() => new Set(selectedIds), [selectedIds]);
  const allSelected = currentRows.length > 0 && selectedIds.length === currentRows.length;
  const editingRow = useMemo(() => {
    if (!editContext) {
      return null;
    }

    return (
      rowsBySection[editContext.sectionKey].find((row) => row.id === editContext.rowId) ?? null
    );
  }, [editContext, rowsBySection]);

  const updateRowsForSection = (
    sectionKey: DashboardSectionKey,
    updater: (rows: DashboardRowBase[]) => DashboardRowBase[],
  ) => {
    setRowsBySection((prev) => {
      const updatedRows = updater(prev[sectionKey]);
      return {
        ...prev,
        [sectionKey]: updatedRows as DashboardSectionData[typeof sectionKey],
      };
    });
  };

  const toggleAll = () => {
    setSelectedBySection((prev) => ({
      ...prev,
      [activeSection]: allSelected ? [] : currentRows.map((row) => row.id),
    }));
  };

  const toggleOne = (id: string) => {
    setSelectedBySection((prev) => {
      const current = prev[activeSection];
      const exists = current.includes(id);
      return {
        ...prev,
        [activeSection]: exists ? current.filter((rowId) => rowId !== id) : [...current, id],
      };
    });
  };

  const removeSelected = () => {
    if (selectedIds.length === 0) {
      return;
    }

    updateRowsForSection(activeSection, (rows) =>
      rows.filter((row) => !selectedSet.has(row.id)),
    );

    setSelectedBySection((prev) => ({
      ...prev,
      [activeSection]: [],
    }));
  };

  const toggleActive = (id: string) => {
    updateRowsForSection(activeSection, (rows) =>
      rows.map((row) => (row.id === id ? { ...row, isActive: !row.isActive } : row)),
    );
  };

  const openEditModal = (sectionKey: DashboardSectionKey, rowId: string) => {
    const row = rowsBySection[sectionKey].find((item) => item.id === rowId);
    if (!row) {
      return;
    }

    setEditContext({ sectionKey, rowId });
    setDraftValues({ ...(row as unknown as Record<string, DashboardEditableValue>) });
  };

  const closeEditModal = () => {
    setEditContext(null);
    setDraftValues({});
  };

  const updateDraftValue = (fieldKey: string, value: DashboardEditableValue) => {
    setDraftValues((prev) => ({
      ...prev,
      [fieldKey]: value,
    }));
  };

  const saveEdit = () => {
    if (!editContext || !editingRow) {
      return;
    }

    const fields = editFieldConfig[editContext.sectionKey];
    const normalizedValues: Record<string, DashboardEditableValue> = {};

    fields.forEach((field) => {
      const rawValue = draftValues[field.key];

      if (field.type === "checkbox") {
        normalizedValues[field.key] = Boolean(rawValue);
        return;
      }

      if (field.type === "number") {
        const nextValue = typeof rawValue === "number" ? rawValue : Number(rawValue ?? 0);
        normalizedValues[field.key] = Number.isFinite(nextValue) ? nextValue : 0;
        return;
      }

      normalizedValues[field.key] = String(rawValue ?? "");
    });

    const updatedRow = {
      ...editingRow,
      ...normalizedValues,
    } as DashboardRowBase;

    updateRowsForSection(editContext.sectionKey, (rows) =>
      rows.map((row) => (row.id === editContext.rowId ? updatedRow : row)),
    );

    if (String(updatedRow.id) !== editContext.rowId) {
      setSelectedBySection((prev) => ({
        ...prev,
        [editContext.sectionKey]: prev[editContext.sectionKey].map((id) =>
          id === editContext.rowId ? String(updatedRow.id) : id,
        ),
      }));
    }

    closeEditModal();
  };

  return (
    <section className="rounded-2xl border border-border bg-surface shadow-subtle">
      <div className="border-b border-border px-6 py-5">
        <h1 className="text-2xl font-bold text-navy">Panel de Contenido</h1>
        <p className="mt-1 text-sm text-on-surface-muted">
          Administra proyectos, servicios y reseñas públicas desde un solo tablero.
        </p>
      </div>

      <div className="border-b border-border px-6 py-4">
        <div className="flex w-full flex-col gap-1 rounded-lg border border-border bg-surface-alt p-1 sm:inline-flex sm:w-auto sm:flex-row sm:gap-0">
          {(Object.keys(sectionConfig) as DashboardSectionKey[]).map((sectionKey) => {
            const isActiveSection = sectionKey === activeSection;

            return (
              <button
                key={sectionKey}
                type="button"
                onClick={() => setActiveSection(sectionKey)}
                className={`w-full rounded-md px-4 py-2 text-left text-sm font-medium transition-colors sm:w-auto sm:text-center ${
                  isActiveSection
                    ? "bg-surface text-secondary shadow-sm"
                    : "text-on-surface-muted hover:text-navy"
                }`}
              >
                {sectionConfig[sectionKey].label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-6 py-4">
        <div>
          <h2 className="text-lg font-semibold text-navy">{section.label}</h2>
          <p className="text-sm text-on-surface-muted">
            {currentRows.length} {currentRows.length === 1 ? section.singularLabel : section.label.toLowerCase()}
          </p>
        </div>

        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
          <button
            type="button"
            onClick={removeSelected}
            disabled={selectedIds.length === 0}
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium text-on-surface disabled:cursor-not-allowed disabled:opacity-50 hover:bg-surface-alt sm:w-auto"
          >
            <span className="material-symbols-outlined text-[18px]">delete</span>
            Eliminar seleccionados
          </button>
          <button
            type="button"
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-cyan-gradient px-4 py-2 text-sm font-semibold text-white hover:opacity-90 sm:w-auto"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            Nuevo
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-surface-alt text-left">
            <tr>
              <th className="w-12 px-4 py-3">
                <RoundedCheckbox
                  checked={allSelected}
                  onChange={toggleAll}
                  ariaLabel="Seleccionar todos"
                />
              </th>

              {section.columns.map((column) => (
                <th
                  key={column.key}
                  className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-on-surface-muted"
                >
                  {column.label}
                </th>
              ))}

              <th className="w-40 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-on-surface-muted">
                Visible
              </th>
              <th className="w-28 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-on-surface-muted">
                Editar
              </th>
            </tr>
          </thead>

          <tbody>
            {currentRows.length === 0 ? (
              <tr>
                <td
                  colSpan={section.columns.length + 3}
                  className="px-4 py-10 text-center text-sm text-on-surface-muted"
                >
                  No hay elementos en esta sección.
                </td>
              </tr>
            ) : (
              currentRows.map((row, index) => {
                const selected = selectedSet.has(row.id);
                const stripedBackground = index % 2 === 0 ? "bg-surface" : "bg-surface-alt";

                return (
                  <tr
                    key={row.id}
                    className={`border-t transition-colors ${
                      selected
                        ? "border-primary bg-background-alt/60 outline-1 -outline-offset-1 outline-primary"
                        : `border-border ${stripedBackground}`
                    }`}
                  >
                    <td className="px-4 py-3 align-top">
                      <RoundedCheckbox
                        checked={selected}
                        onChange={() => toggleOne(row.id)}
                        className="mt-1"
                        ariaLabel={`Seleccionar ${row.id}`}
                      />
                    </td>

                    {section.columns.map((column) => (
                      <td key={column.key} className="px-4 py-3 text-sm text-on-surface align-top">
                        <span className="line-clamp-2">{String(row[column.key as keyof typeof row] ?? "—")}</span>
                      </td>
                    ))}

                    <td className="px-4 py-3 align-top">
                      <button
                        type="button"
                        onClick={() => toggleActive(row.id)}
                        className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors ${
                          row.isActive ? "bg-primary" : "bg-border"
                        }`}
                        aria-label={`Cambiar visibilidad de ${row.id}`}
                        aria-pressed={row.isActive}
                      >
                        <span
                          className={`inline-block h-5 w-5 transform rounded-full bg-surface shadow transition-transform ${
                            row.isActive ? "translate-x-8" : "translate-x-1"
                          }`}
                        />
                      </button>
                    </td>

                    <td className="px-4 py-3 align-top">
                      <button
                        type="button"
                        onClick={() => openEditModal(activeSection, row.id)}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border text-on-surface-muted transition-colors hover:bg-surface-alt hover:text-secondary"
                        aria-label={`Editar ${row.id}`}
                      >
                        <span className="material-symbols-outlined text-[18px]">edit</span>
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {editContext && editingRow ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy/40 px-4 py-8">
          <div className="w-full max-w-2xl rounded-2xl border border-border bg-surface shadow-2xl">
            <div className="flex items-start justify-between gap-3 border-b border-border px-6 py-4">
              <div>
                <h3 className="text-xl font-bold text-navy">Editar registro</h3>
                <p className="text-sm text-on-surface-muted">
                  Actualiza los campos de {sectionConfig[editContext.sectionKey].singularLabel}.
                </p>
              </div>
              <button
                type="button"
                onClick={closeEditModal}
                className="inline-flex h-8 w-8 items-center justify-center rounded-md text-on-surface-muted hover:bg-surface-alt"
                aria-label="Cerrar modal"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="max-h-[70vh] space-y-4 overflow-y-auto px-6 py-5">
              {editFieldConfig[editContext.sectionKey].map((field) => {
                const value = draftValues[field.key];

                if (field.type === "checkbox") {
                  return (
                    <div key={field.key} className="flex items-center gap-3">
                      <RoundedCheckbox
                        checked={Boolean(value)}
                        onChange={() => updateDraftValue(field.key, !Boolean(value))}
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
                        onChange={(event) => updateDraftValue(field.key, event.target.value)}
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
                          updateDraftValue(
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
                onClick={closeEditModal}
                className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-on-surface hover:bg-surface-alt"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={saveEdit}
                className="rounded-lg bg-cyan-gradient px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
              >
                Guardar cambios
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
