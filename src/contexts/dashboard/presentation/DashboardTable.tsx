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
import { useEffect, useMemo, useRef, useState } from "react";

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
  onReorder: (orderedIds: string[]) => void;
}

interface SortableDashboardRowProps {
  row: DashboardRowBase;
  rowIndex: number;
  sectionKey: DashboardSectionKey;
  columns: TableColumn[];
  selected: boolean;
  onToggleOne: (id: string) => void;
  onToggleActive: (id: string) => void;
  onEdit: (id: string) => void;
  onToggleServiceList: (id: string) => void;
  setServiceToggleButtonRef: (rowId: string, element: HTMLButtonElement | null) => void;
}

function SortableDashboardRow({
  row,
  rowIndex,
  sectionKey,
  columns,
  selected,
  onToggleOne,
  onToggleActive,
  onEdit,
  onToggleServiceList,
  setServiceToggleButtonRef,
}: SortableDashboardRowProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: row.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.75 : 1,
  };

  const stripedBackground = rowIndex % 2 === 0 ? "bg-surface" : "bg-surface-alt";

  return (
    <tr
      ref={setNodeRef}
      style={style}
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
            if (column.key === "orderIndex") {
              return (
                <div className="inline-flex items-center gap-2 rounded-md border border-border bg-surface-alt px-2 py-1">
                  <button
                    type="button"
                    aria-label={`Mover elemento ${row.id}`}
                    className="inline-flex h-6 w-6 items-center justify-center text-on-surface-muted"
                    {...attributes}
                    {...listeners}
                  >
                    <span className="material-symbols-outlined text-[16px]">drag_indicator</span>
                  </button>
                  <span className="text-xs font-semibold">{String(row.orderIndex + 1)}</span>
                </div>
              );
            }

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
                <div className="inline-flex flex-col gap-2">
                  <button
                    type="button"
                    ref={(element) => {
                      setServiceToggleButtonRef(row.id, element);
                    }}
                    onClick={() => onToggleServiceList(row.id)}
                    className="inline-flex items-center gap-2 rounded-md border border-border bg-surface-alt px-2.5 py-1.5 text-xs font-medium text-on-surface hover:bg-surface"
                  >
                    <span>{String(row[column.key as keyof typeof row] ?? "Sin servicios")}</span>
                    <span className="material-symbols-outlined text-[16px]">expand_more</span>
                  </button>
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
  onReorder,
}: DashboardTableProps) {
  const [openServiceListRowId, setOpenServiceListRowId] = useState<string | null>(null);
  const [serviceListPosition, setServiceListPosition] = useState<{ top: number; left: number } | null>(null);
  const serviceToggleButtonRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const serviceListRef = useRef<HTMLDivElement | null>(null);
  const sensors = useSensors(useSensor(PointerSensor));
  const sortableIds = useMemo(() => rows.map((row) => row.id), [rows]);

  const openServiceRow = useMemo(() => {
    if (!openServiceListRowId || sectionKey !== "projects") {
      return null;
    }

    return rows.find((row) => row.id === openServiceListRowId) ?? null;
  }, [openServiceListRowId, rows, sectionKey]);

  const updateServiceListPosition = (rowId: string) => {
    const button = serviceToggleButtonRefs.current[rowId];

    if (!button) {
      return;
    }

    const rect = button.getBoundingClientRect();

    setServiceListPosition({
      top: rect.bottom + 6,
      left: rect.left,
    });
  };

  const toggleServiceList = (rowId: string) => {
    setOpenServiceListRowId((prev) => {
      if (prev === rowId) {
        setServiceListPosition(null);
        return null;
      }

      updateServiceListPosition(rowId);
      return rowId;
    });
  };

  useEffect(() => {
    if (!openServiceListRowId) {
      return undefined;
    }

    const updatePosition = () => {
      updateServiceListPosition(openServiceListRowId);
    };

    updatePosition();

    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);

    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [openServiceListRowId]);

  useEffect(() => {
    if (!openServiceListRowId) {
      return undefined;
    }

    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target as Node;
      const dropdown = serviceListRef.current;
      const triggerButton = serviceToggleButtonRefs.current[openServiceListRowId];

      if (dropdown?.contains(target) || triggerButton?.contains(target)) {
        return;
      }

      setOpenServiceListRowId(null);
      setServiceListPosition(null);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpenServiceListRowId(null);
        setServiceListPosition(null);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [openServiceListRowId]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    const oldIndex = rows.findIndex((row) => row.id === String(active.id));
    const newIndex = rows.findIndex((row) => row.id === String(over.id));

    if (oldIndex < 0 || newIndex < 0) {
      return;
    }

    const nextRows = arrayMove(rows, oldIndex, newIndex);
    onReorder(nextRows.map((row) => row.id));
  };

  return (
    <div className="overflow-x-auto overflow-y-visible">
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
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
              <SortableContext items={sortableIds} strategy={verticalListSortingStrategy}>
                {rows.map((row, rowIndex) => (
                  <SortableDashboardRow
                    key={row.id}
                    row={row}
                    rowIndex={rowIndex}
                    sectionKey={sectionKey}
                    columns={columns}
                    selected={selectedIds.has(row.id)}
                    onToggleOne={onToggleOne}
                    onToggleActive={onToggleActive}
                    onEdit={onEdit}
                    onToggleServiceList={toggleServiceList}
                    setServiceToggleButtonRef={(rowId, element) => {
                      serviceToggleButtonRefs.current[rowId] = element;
                    }}
                  />
                ))}
              </SortableContext>
            )}
          </tbody>
        </table>
      </DndContext>

      {openServiceRow && serviceListPosition ? (
        <div
          ref={serviceListRef}
          className="fixed z-40 min-w-52 rounded-lg border border-border bg-surface p-2 shadow-lg"
          style={{
            top: `${serviceListPosition.top}px`,
            left: `${serviceListPosition.left}px`,
          }}
        >
          {(openServiceRow as DashboardRowBase & { projectServices?: { id: string; name: string; icon: string }[] }).projectServices
            ?.length ? (
              <ul className="space-y-1">
                {(openServiceRow as DashboardRowBase & { projectServices: { id: string; name: string; icon: string }[] }).projectServices.map((serviceItem) => (
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
