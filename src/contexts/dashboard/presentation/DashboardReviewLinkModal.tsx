interface ProjectOption {
  id: string;
  name: string;
}

interface DashboardReviewLinkModalProps {
  isOpen: boolean;
  projectOptions: ProjectOption[];
  selectedProjectId: string;
  generatedLink: string;
  copyFeedback: string;
  onClose: () => void;
  onProjectChange: (projectId: string) => void;
  onGenerate: () => void;
  onCopyLink: () => void;
}

export default function DashboardReviewLinkModal({
  isOpen,
  projectOptions,
  selectedProjectId,
  generatedLink,
  copyFeedback,
  onClose,
  onProjectChange,
  onGenerate,
  onCopyLink,
}: DashboardReviewLinkModalProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl rounded-2xl border border-border bg-surface p-6 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-secondary">Reseñas</p>
            <h3 className="text-2xl font-bold text-navy">Generar link de reseña</h3>
            <p className="mt-1 text-sm text-on-surface-muted">
              Selecciona un proyecto y crea un enlace para compartir el formulario de reseña.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border text-on-surface-muted transition-colors hover:bg-surface-alt hover:text-navy"
            aria-label="Cerrar"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-on-surface" htmlFor="review-project-select">
              Proyecto
            </label>
            <div className="relative">
              <select
                id="review-project-select"
                value={selectedProjectId}
                onChange={(event) => onProjectChange(event.target.value)}
                className="block w-full appearance-none rounded-lg border border-border bg-surface px-3 py-2.5 pr-10 text-sm text-on-surface transition-colors hover:border-primary focus:border-primary focus:outline-none"
              >
                <option value="">Selecciona un proyecto</option>
                {projectOptions.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>
              <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-on-surface-muted">
                <span className="material-symbols-outlined text-[18px]">expand_more</span>
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onGenerate}
            disabled={!selectedProjectId}
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-cyan-gradient px-4 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-[18px]">link</span>
            Generar link
          </button>

          <div className="rounded-xl border border-border bg-surface-alt p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-on-surface-muted">Link generado</p>
            <p className="mt-2 break-all text-sm text-on-surface">
              {generatedLink || "Aun no se genera un link."}
            </p>

            <div className="mt-3 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={onCopyLink}
                disabled={!generatedLink}
                className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-medium text-on-surface transition-colors hover:bg-surface disabled:cursor-not-allowed disabled:opacity-50"
              >
                <span className="material-symbols-outlined text-[18px]">content_copy</span>
                Copiar link
              </button>
              <span className="text-xs text-on-surface-muted">{copyFeedback}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
