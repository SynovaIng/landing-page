import { useState } from "react";

import type { DashboardRowBase } from "@/contexts/dashboard/domain/dashboard.entity";
import type { DashboardSectionKey } from "@/contexts/dashboard/domain/dashboard.entity";
import type { TableColumn } from "@/contexts/dashboard/presentation/dashboard.config";
import RoundedCheckbox from "@/contexts/dashboard/presentation/RoundedCheckbox";

interface DashboardTableProps {
  sectionKey: DashboardSectionKey;
  columns: TableColumn[];
  rows: DashboardRowBase[];
  allSelected: boolean;
  selectedIds: Set<string>;
  onToggleAll: () => void;
  onToggleOne: (id: string) => void;
  onToggleActive: (id: string) => void;
  onEdit: (id: string) => void;
}

export default function DashboardTable({
  sectionKey,
  columns,
  rows,
  allSelected,
  selectedIds,
  onToggleAll,
  onToggleOne,
  onToggleActive,
  onEdit,
}: DashboardTableProps) {
  const [openServiceListByRow, setOpenServiceListByRow] = useState<Record<string, boolean>>({});

  const toggleServiceList = (rowId: string) => {
    setOpenServiceListByRow((prev) => ({
      ...prev,
      [rowId]: !prev[rowId],
    }));
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full">
        <thead className="bg-surface-alt text-left">
          <tr>
            <th className="w-12 px-4 py-3">
              <RoundedCheckbox
                checked={allSelected}
                onChange={onToggleAll}
                ariaLabel="Seleccionar todos"
              />
            </th>

            {columns.map((column) => (
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
          {rows.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length + 3}
                className="px-4 py-10 text-center text-sm text-on-surface-muted"
              >
                No hay elementos en esta sección.
              </td>
            </tr>
          ) : (
            rows.map((row, index) => {
              const selected = selectedIds.has(row.id);
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
                      onChange={() => onToggleOne(row.id)}
                      className="mt-1"
                      ariaLabel={`Seleccionar ${row.id}`}
                    />
                  </td>

                  {columns.map((column) => (
                    <td key={column.key} className="px-4 py-3 text-sm text-on-surface align-top">
                      {(() => {
                        if (column.key === "icon") {
                          return (
                            <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-surface-alt text-secondary">
                              <span className="material-symbols-outlined text-[20px]">
                                {String(row[column.key as keyof typeof row] ?? "help")}
                              </span>
                            </span>
                          );
                        }

                        if (sectionKey === "projects" && column.key === "projectServicesSummary") {
                          return (
                            <div className="relative inline-flex flex-col gap-2">
                              <button
                                type="button"
                                onClick={() => toggleServiceList(row.id)}
                                className="inline-flex items-center gap-2 rounded-md border border-border bg-surface-alt px-2.5 py-1.5 text-xs font-medium text-on-surface hover:bg-surface"
                              >
                                <span>{String(row[column.key as keyof typeof row] ?? "Sin servicios")}</span>
                                <span className="material-symbols-outlined text-[16px]">expand_more</span>
                              </button>

                              {openServiceListByRow[row.id] ? (
                                <div className="absolute left-0 top-9 z-20 min-w-52 rounded-lg border border-border bg-surface p-2 shadow-lg">
                                  {(row as DashboardRowBase & { projectServices?: { id: string; name: string; icon: string }[] }).projectServices
                                    ?.length ? (
                                      <ul className="space-y-1">
                                        {(row as DashboardRowBase & { projectServices: { id: string; name: string; icon: string }[] }).projectServices.map((serviceItem) => (
                                          <li key={serviceItem.id} className="flex items-center gap-2 rounded-md bg-surface-alt px-2 py-1 text-xs text-on-surface">
                                            <span className="material-symbols-outlined text-[16px] text-secondary">
                                              {serviceItem.icon}
                                            </span>
                                            <span>{serviceItem.name}</span>
                                          </li>
                                        ))}
                                      </ul>
                                    ) : (
                                      <p className="px-1 py-1 text-xs text-on-surface-muted">Sin servicios asociados.</p>
                                    )}
                                </div>
                              ) : null}
                            </div>
                          );
                        }

                        return (
                        <span className="line-clamp-2">
                          {String(row[column.key as keyof typeof row] ?? "—")}
                        </span>
                        );
                      })()}
                    </td>
                  ))}

                  <td className="px-4 py-3 align-top">
                    <button
                      type="button"
                      onClick={() => onToggleActive(row.id)}
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
                      onClick={() => onEdit(row.id)}
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
  );
}
