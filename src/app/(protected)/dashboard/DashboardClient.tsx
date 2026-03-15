"use client";

import { useMemo, useState } from "react";

import type {
  DashboardRowBase,
  DashboardSectionData,
  DashboardSectionKey,
} from "@/app/(protected)/dashboard/dashboard.types";

interface TableColumn {
  key: string;
  label: string;
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
      { key: "title", label: "Título" },
      { key: "location", label: "Ubicación" },
      { key: "category", label: "Categoría" },
    ],
  },
  services: {
    label: "Servicios",
    singularLabel: "servicio",
    columns: [
      { key: "title", label: "Título" },
      { key: "description", label: "Descripción" },
      { key: "features", label: "Características" },
    ],
  },
  testimonials: {
    label: "Reseñas",
    singularLabel: "reseña",
    columns: [
      { key: "authorName", label: "Autor" },
      { key: "authorLocation", label: "Ubicación" },
      { key: "rating", label: "Calificación" },
      { key: "text", label: "Comentario" },
    ],
  },
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

  const section = sectionConfig[activeSection];
  const currentRows = rowsBySection[activeSection];
  const selectedIds = selectedBySection[activeSection];

  const selectedSet = useMemo(() => new Set(selectedIds), [selectedIds]);
  const allSelected = currentRows.length > 0 && selectedIds.length === currentRows.length;

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

  return (
    <section className="rounded-2xl border border-border bg-surface shadow-subtle">
      <div className="border-b border-border px-6 py-5">
        <h1 className="text-2xl font-bold text-navy">Panel de Contenido</h1>
        <p className="mt-1 text-sm text-on-surface-muted">
          Administra proyectos, servicios y reseñas públicas desde un solo tablero.
        </p>
      </div>

      <div className="border-b border-border px-6 py-4">
        <div className="inline-flex rounded-lg border border-border bg-surface-alt p-1">
          {(Object.keys(sectionConfig) as DashboardSectionKey[]).map((sectionKey) => {
            const isActiveSection = sectionKey === activeSection;

            return (
              <button
                key={sectionKey}
                type="button"
                onClick={() => setActiveSection(sectionKey)}
                className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
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

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={removeSelected}
            disabled={selectedIds.length === 0}
            className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium text-on-surface disabled:cursor-not-allowed disabled:opacity-50 hover:bg-surface-alt"
          >
            <span className="material-symbols-outlined text-[18px]">delete</span>
            Eliminar seleccionados
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-lg bg-cyan-gradient px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
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
            </tr>
          </thead>

          <tbody>
            {currentRows.length === 0 ? (
              <tr>
                <td
                  colSpan={section.columns.length + 2}
                  className="px-4 py-10 text-center text-sm text-on-surface-muted"
                >
                  No hay elementos en esta sección.
                </td>
              </tr>
            ) : (
              currentRows.map((row) => {
                const selected = selectedSet.has(row.id);

                return (
                  <tr
                    key={row.id}
                    className={`border-t transition-colors ${
                      selected
                        ? "border-primary bg-background-alt/60 outline-1 -outline-offset-1 outline-primary"
                        : "border-border bg-surface"
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
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
