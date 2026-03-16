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

type DashboardEditableValue = string | number | boolean | string[] | File[] | null;
type ModalMode = "create" | "edit";

interface EditContext {
  mode: ModalMode;
  sectionKey: DashboardSectionKey;
  rowId?: string;
}

interface ClientOption {
  id: string;
  name: string;
  location: string;
}

interface ProjectOption {
  id: string;
  name: string;
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
  const [clientOptions, setClientOptions] = useState<ClientOption[]>([]);

  useEffect(() => {
    let isActive = true;

    const loadClientOptions = async () => {
      try {
        const response = await fetch("/api/dashboard/clients", { cache: "no-store" });

        if (!response.ok) {
          if (isActive) {
            setClientOptions([]);
          }
          return;
        }

        const payload = (await response.json()) as {
          clients?: { id?: string; name?: string; location?: string }[];
        };

        if (!isActive) {
          return;
        }

        setClientOptions(
          (payload.clients ?? [])
            .map((client) => ({
              id: String(client.id ?? ""),
              name: String(client.name ?? ""),
              location: String(client.location ?? ""),
            }))
            .filter((client) => client.id.length > 0 && client.name.length > 0),
        );
      } catch {
        if (isActive) {
          setClientOptions([]);
        }
      }
    };

    void loadClientOptions();

    return () => {
      isActive = false;
    };
  }, []);

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
  const projectServiceOptions = useMemo(
    () =>
      rowsBySection.services.map((serviceRow) => ({
        id: serviceRow.id,
        name: serviceRow.name,
        icon: serviceRow.icon,
      })),
    [rowsBySection.services],
  );
  const projectOptions = useMemo<ProjectOption[]>(
    () =>
      rowsBySection.projects.map((projectRow) => ({
        id: projectRow.id,
        name: projectRow.name,
      })),
    [rowsBySection.projects],
  );

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

    const nextDraftValues: Record<string, DashboardEditableValue> = {};
    Object.entries(row).forEach(([key, value]) => {
      nextDraftValues[key] = value as DashboardEditableValue;
    });

    setEditContext({ mode: "edit", sectionKey, rowId });
    setDraftValues(nextDraftValues);
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

  const enrichProjectRow = (row: DashboardRowBase) => {
    const projectRow = row as DashboardRowBase & {
      projectServiceIds?: string[];
      projectServiceNames?: string[];
      projectServicesSummary?: string;
      projectServices?: { id: string; name: string; icon: string }[];
    };

    const serviceIds = Array.isArray(projectRow.projectServiceIds)
      ? projectRow.projectServiceIds.map((id) => String(id))
      : [];

    const serviceItems = serviceIds.map((serviceId) => {
      const serviceOption = projectServiceOptions.find((candidate) => candidate.id === serviceId);

      return {
        id: serviceId,
        name: serviceOption?.name ?? serviceId,
        icon: serviceOption?.icon ?? "engineering",
      };
    });

    const serviceNames = serviceItems.map((serviceItem) => serviceItem.name);

    return {
      ...projectRow,
      projectServices: serviceItems,
      projectServiceIds: serviceIds,
      projectServiceNames: serviceNames,
      projectServicesSummary:
        serviceIds.length === 0
          ? "Sin servicios"
          : `${serviceIds.length} servicio${serviceIds.length === 1 ? "" : "s"}`,
    } as DashboardRowBase;
  };

  const saveEdit = async () => {
    if (!editContext) {
      return;
    }

    const fields = editFieldConfig[editContext.sectionKey];
    const normalizedValues: Record<string, DashboardEditableValue> = {};

    fields.forEach((field) => {
      const rawValue = draftValues[field.key];

      if (field.type === "file") {
        normalizedValues[field.key] = Array.isArray(rawValue)
          ? rawValue.filter((file): file is File => file instanceof File)
          : [];
        return;
      }

      if (field.key === "projectServiceIds") {
        normalizedValues[field.key] = Array.isArray(rawValue)
          ? rawValue.map((value) => String(value))
          : [];
        return;
      }

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

    if (editContext.sectionKey === "projects") {
      normalizedValues.imageUrls = Array.isArray(draftValues.imageUrls)
        ? draftValues.imageUrls.map((value) => String(value)).filter((value) => value.length > 0)
        : [];

      normalizedValues.imageFileKeys = Array.isArray(draftValues.imageFileKeys)
        ? draftValues.imageFileKeys.map((value) => String(value)).filter((value) => value.length > 0)
        : [];

      normalizedValues.imageOrderRefs = Array.isArray(draftValues.imageOrderRefs)
        ? draftValues.imageOrderRefs.map((value) => String(value)).filter((value) => value.length > 0)
        : [];

      if (!Array.isArray(normalizedValues.imageFiles)) {
        normalizedValues.imageFiles = [];
      }
    }

    if (editContext.mode === "create") {
      const requestPayload =
        editContext.sectionKey === "testimonials"
          ? {
              ...normalizedValues,
              clientId: String(normalizedValues.clientId ?? "").trim() || null,
              projectId: String(normalizedValues.projectId ?? "").trim() || null,
              companyName: String(draftValues.companyName ?? "").trim(),
              createCompany: Boolean(draftValues.createCompany),
              companyLocation: String(draftValues.companyLocation ?? "").trim(),
            }
          : normalizedValues;

      const response = await (async () => {
        if (editContext.sectionKey !== "projects") {
          return fetch(`/api/dashboard/${editContext.sectionKey}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(requestPayload),
          });
        }

        const formData = new FormData();
        formData.set("name", String(normalizedValues.name ?? ""));
        formData.set("type", String(normalizedValues.type ?? "Comercial"));
        formData.set("location", String(normalizedValues.location ?? ""));
        formData.set("description", String(normalizedValues.description ?? ""));
        formData.set("isActive", String(Boolean(normalizedValues.isActive)));
        formData.set("serviceIds", JSON.stringify(normalizedValues.projectServiceIds ?? []));

        const imageFiles = Array.isArray(normalizedValues.imageFiles)
          ? normalizedValues.imageFiles.filter((file): file is File => file instanceof File)
          : [];

        imageFiles.forEach((file) => {
          formData.append("images", file);
        });

        return fetch("/api/dashboard/projects", {
          method: "POST",
          body: formData,
        });
      })();

      if (!response.ok) {
        return;
      }

      const createdRow = (await response.json()) as DashboardRowBase;
      const normalizedCreatedRow =
        editContext.sectionKey === "projects" ? enrichProjectRow(createdRow) : createdRow;

      updateRowsForSection(editContext.sectionKey, (rows) => [normalizedCreatedRow, ...rows]);
      closeEditModal();
      return;
    }

    if (!editingRow || !editContext.rowId) {
      return;
    }

    if (editContext.sectionKey === "projects") {
      const formData = new FormData();
      formData.set("name", String(normalizedValues.name ?? ""));
      formData.set("type", String(normalizedValues.type ?? "Comercial"));
      formData.set("location", String(normalizedValues.location ?? ""));
      formData.set("description", String(normalizedValues.description ?? ""));
      formData.set("isActive", String(Boolean(normalizedValues.isActive)));
      formData.set("serviceIds", JSON.stringify(normalizedValues.projectServiceIds ?? []));

      const imageFiles = Array.isArray(normalizedValues.imageFiles)
        ? normalizedValues.imageFiles.filter((file): file is File => file instanceof File)
        : [];

      imageFiles.forEach((file) => {
        formData.append("images", file);
      });

      const imageFileKeys = Array.isArray(normalizedValues.imageFileKeys)
        ? normalizedValues.imageFileKeys.map((value) => String(value)).filter((value) => value.length > 0)
        : [];

      imageFileKeys.forEach((key) => {
        formData.append("imageKeys", key);
      });

      const existingImageUrls = Array.isArray(normalizedValues.imageUrls)
        ? normalizedValues.imageUrls.map((value) => String(value)).filter((value) => value.length > 0)
        : [];

      existingImageUrls.forEach((url) => {
        formData.append("existingImageUrls", url);
      });

      const imageOrderRefs = Array.isArray(normalizedValues.imageOrderRefs)
        ? normalizedValues.imageOrderRefs.map((value) => String(value)).filter((value) => value.length > 0)
        : [];

      imageOrderRefs.forEach((ref) => {
        formData.append("imageOrderRefs", ref);
      });

      const response = await fetch(`/api/dashboard/projects/${editContext.rowId}`, {
        method: "PATCH",
        body: formData,
      });

      if (!response.ok) {
        return;
      }

      const updatedProject = enrichProjectRow((await response.json()) as DashboardRowBase);

      updateRowsForSection(editContext.sectionKey, (rows) =>
        rows.map((row) => (row.id === editContext.rowId ? (updatedProject as typeof row) : row)),
      );

      closeEditModal();
      return;
    }

    if (editContext.sectionKey === "testimonials") {
      const testimonialPayload = {
        ...normalizedValues,
        clientId: String(normalizedValues.clientId ?? "").trim() || null,
        projectId: String(normalizedValues.projectId ?? "").trim() || null,
        companyName: String(draftValues.companyName ?? "").trim(),
        createCompany: Boolean(draftValues.createCompany),
        companyLocation: String(draftValues.companyLocation ?? "").trim(),
      };

      const response = await fetch(`/api/dashboard/testimonials/${editContext.rowId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(testimonialPayload),
      });

      if (!response.ok) {
        return;
      }

      const updatedTestimonial = (await response.json()) as DashboardRowBase;

      updateRowsForSection(editContext.sectionKey, (rows) =>
        rows.map((row) => (row.id === editContext.rowId ? (updatedTestimonial as typeof row) : row)),
      );

      closeEditModal();
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
        sectionKey={activeSection}
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
        projectServiceOptions={projectServiceOptions}
        projectOptions={projectOptions}
        clientOptions={clientOptions}
        onValueChange={updateDraftValue}
        onClose={closeEditModal}
        onSave={saveEdit}
      />
    </section>
  );
}
