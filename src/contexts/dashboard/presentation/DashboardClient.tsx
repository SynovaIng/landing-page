"use client";

import { useEffect, useMemo, useState } from "react";

import type {
  DashboardRowBase,
  DashboardSectionData,
  DashboardSectionKey,
} from "@/contexts/dashboard/domain/dashboard.entity";

import {
  createFieldDefaults,
  editFieldConfig,
  sectionConfig,
} from "./dashboard.config";
import DashboardEditModal from "./DashboardEditModal";
import DashboardTable from "./DashboardTable";

type DashboardEditableValue = string | number | boolean;
type ModalMode = "create" | "edit";

interface EditContext {
  mode: ModalMode;
  sectionKey: DashboardSectionKey;
  rowId?: string;
}

type DashboardClientProps = DashboardSectionData;

function createSelectedState(): Record<DashboardSectionKey, string[]> {
  return {
    projects: [],
    services: [],
    testimonials: [],
  };
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
    if (!editContext || editContext.mode !== "edit" || !editContext.rowId) {
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

    setEditContext({ mode: "edit", sectionKey, rowId });
    setDraftValues({ ...(row as unknown as Record<string, DashboardEditableValue>) });
  };

  const openCreateModal = (sectionKey: DashboardSectionKey) => {
    setEditContext({ mode: "create", sectionKey });
    setDraftValues({ ...createFieldDefaults[sectionKey] });
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

  const saveEdit = async () => {
    if (!editContext) {
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

    if (editContext.mode === "create") {
      const response = await fetch(`/api/dashboard/${editContext.sectionKey}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(normalizedValues),
      });

      if (!response.ok) {
        return;
      }

      const createdRow = (await response.json()) as DashboardRowBase;
      updateRowsForSection(editContext.sectionKey, (rows) => [createdRow, ...rows]);
      closeEditModal();
      return;
    }

    if (!editingRow || !editContext.rowId) {
      return;
    }

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
            onClick={() => openCreateModal(activeSection)}
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-cyan-gradient px-4 py-2 text-sm font-semibold text-white hover:opacity-90 sm:w-auto"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            Nuevo
          </button>
        </div>
      </div>

      <DashboardTable
        columns={section.columns}
        rows={currentRows}
        allSelected={allSelected}
        selectedIds={selectedSet}
        onToggleAll={toggleAll}
        onToggleOne={toggleOne}
        onToggleActive={toggleActive}
        onEdit={(rowId) => openEditModal(activeSection, rowId)}
      />

      <DashboardEditModal
        isOpen={Boolean(editContext && (editContext.mode === "create" || editingRow))}
        mode={editContext?.mode ?? "edit"}
        singularLabel={editContext ? sectionConfig[editContext.sectionKey].singularLabel : "registro"}
        fields={editContext ? editFieldConfig[editContext.sectionKey] : []}
        values={draftValues}
        onValueChange={updateDraftValue}
        onClose={closeEditModal}
        onSave={saveEdit}
      />
    </section>
  );
}
