import type { FieldConfig } from "@/contexts/dashboard/presentation/dashboard.config";

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
