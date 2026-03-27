"use client";

import { useState } from "react";

interface ErrorToastData {
  title: string;
  detail: string;
}

interface ErrorToastProps {
  error: ErrorToastData | null;
  onClose: () => void;
}

export default function ErrorToast({ error, onClose }: ErrorToastProps) {
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [copyFeedback, setCopyFeedback] = useState("");

  if (!error) {
    return null;
  }

  const copyErrorDetail = async () => {
    try {
      await navigator.clipboard.writeText(`${error.title}\n\n${error.detail}`);
      setCopyFeedback("Error copiado");
    } catch {
      setCopyFeedback("No se pudo copiar");
    }
  };

  return (
    <>
      <div className="fixed inset-x-0 bottom-4 z-[140] flex justify-center px-4">
        <div className="flex w-full max-w-xl items-center gap-3 rounded-xl border border-red-200 bg-white px-4 py-3 shadow-2xl">
          <span className="material-symbols-outlined text-[20px] text-red-600">error</span>
          <p className="min-w-0 flex-1 text-sm font-medium text-slate-800">{error.title}</p>
          <button
            type="button"
            onClick={() => {
              setCopyFeedback("");
              setIsDetailOpen(true);
            }}
            className="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
          >
            Ver error
          </button>
          <button
            type="button"
            onClick={() => {
              setCopyFeedback("");
              setIsDetailOpen(false);
              onClose();
            }}
            className="inline-flex h-8 w-8 items-center justify-center rounded-md text-slate-500 hover:bg-slate-100"
            aria-label="Cerrar aviso"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>
      </div>

      {isDetailOpen ? (
        <div className="fixed inset-0 z-[150] flex items-end justify-center bg-slate-900/50 px-4 py-6 sm:items-center">
          <div className="w-full max-w-2xl rounded-2xl border border-border bg-surface shadow-2xl">
            <div className="flex items-start justify-between gap-3 border-b border-border px-5 py-4">
              <div>
                <h4 className="text-lg font-bold text-navy">Detalle del error</h4>
                <p className="text-sm text-on-surface-muted">{error.title}</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setCopyFeedback("");
                  setIsDetailOpen(false);
                }}
                className="inline-flex h-8 w-8 items-center justify-center rounded-md text-on-surface-muted hover:bg-surface-alt"
                aria-label="Cerrar detalle"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="max-h-[55vh] overflow-y-auto px-5 py-4">
              <pre className="whitespace-pre-wrap break-words rounded-lg border border-border bg-surface-alt p-3 text-xs text-on-surface">
                {error.detail}
              </pre>
              {copyFeedback ? (
                <p className="mt-2 text-xs font-medium text-secondary">{copyFeedback}</p>
              ) : null}
            </div>

            <div className="flex items-center justify-end gap-2 border-t border-border px-5 py-4">
              <button
                type="button"
                onClick={copyErrorDetail}
                className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium text-on-surface hover:bg-surface-alt"
              >
                <span className="material-symbols-outlined text-[18px]">content_copy</span>
                Copiar
              </button>
              <button
                type="button"
                onClick={() => {
                  setCopyFeedback("");
                  setIsDetailOpen(false);
                }}
                className="rounded-lg bg-cyan-gradient px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
