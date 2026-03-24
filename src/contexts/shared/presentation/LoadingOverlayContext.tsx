"use client";

import {
  createContext,
  type PropsWithChildren,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

interface LoadingOverlayContextValue {
  isLoading: boolean;
  startLoading: () => void;
  stopLoading: () => void;
  withLoading: <T>(operation: () => Promise<T>) => Promise<T>;
}

const LoadingOverlayContext = createContext<LoadingOverlayContextValue | null>(null);

export function LoadingOverlayProvider({ children }: PropsWithChildren) {
  const [pendingCount, setPendingCount] = useState(0);

  const startLoading = useCallback(() => {
    setPendingCount((prev) => prev + 1);
  }, []);

  const stopLoading = useCallback(() => {
    setPendingCount((prev) => (prev > 0 ? prev - 1 : 0));
  }, []);

  const withLoading = useCallback(
    async <T,>(operation: () => Promise<T>) => {
      startLoading();

      try {
        return await operation();
      } finally {
        stopLoading();
      }
    },
    [startLoading, stopLoading],
  );

  const value = useMemo(
    () => ({
      isLoading: pendingCount > 0,
      startLoading,
      stopLoading,
      withLoading,
    }),
    [pendingCount, startLoading, stopLoading, withLoading],
  );

  return (
    <LoadingOverlayContext.Provider value={value}>
      {children}
      {value.isLoading ? (
        <div
          className="fixed inset-0 z-[120] flex items-center justify-center bg-navy/45 backdrop-blur-sm"
          role="status"
          aria-live="polite"
          aria-label="Cargando"
        >
          <div className="inline-flex items-center gap-3 rounded-xl border border-border bg-surface px-5 py-3 shadow-2xl">
            <span className="material-symbols-outlined animate-spin text-[24px] text-secondary">
              progress_activity
            </span>
            <span className="text-sm font-medium text-on-surface">Cargando...</span>
          </div>
        </div>
      ) : null}
    </LoadingOverlayContext.Provider>
  );
}

export function useLoadingOverlay() {
  const context = useContext(LoadingOverlayContext);

  if (!context) {
    throw new Error("useLoadingOverlay must be used inside <LoadingOverlayProvider>");
  }

  return context;
}
