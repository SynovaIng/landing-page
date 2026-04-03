"use client";

import { useEffect, useId, useRef } from "react";

declare global {
  interface Window {
    turnstile?: {
      render: (container: HTMLElement, options: Record<string, unknown>) => string;
      execute: (widgetId: string) => void;
      reset: (widgetId: string) => void;
      remove: (widgetId: string) => void;
    };
  }
}

export default function TurnstileInvisible() {
  const widgetContainerRef = useRef<HTMLDivElement>(null);
  const hiddenTokenRef = useRef<HTMLInputElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const pendingSubmitRef = useRef(false);
  const id = useId().replace(/:/g, "");
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  useEffect(() => {
    if (!widgetContainerRef.current || !siteKey) {
      return () => undefined;
    }

    const form = widgetContainerRef.current.closest("form");

    if (!form) {
      return () => undefined;
    }

    const ensureWidget = () => {
      if (!widgetContainerRef.current || !window.turnstile || widgetIdRef.current) {
        return;
      }

      widgetIdRef.current = window.turnstile.render(widgetContainerRef.current, {
        sitekey: siteKey,
        size: "invisible",
        callback: (token: string) => {
          if (hiddenTokenRef.current) {
            hiddenTokenRef.current.value = token;
          }

          if (pendingSubmitRef.current) {
            pendingSubmitRef.current = false;
            form.requestSubmit();
          }
        },
        "expired-callback": () => {
          if (hiddenTokenRef.current) {
            hiddenTokenRef.current.value = "";
          }
        },
        "error-callback": () => {
          if (hiddenTokenRef.current) {
            hiddenTokenRef.current.value = "";
          }
          pendingSubmitRef.current = false;
        },
      });
    };

    const onSubmit = (event: Event) => {
      const token = hiddenTokenRef.current?.value.trim() ?? "";

      if (token) {
        return;
      }

      event.preventDefault();

      if (!window.turnstile) {
        return;
      }

      ensureWidget();

      if (!widgetIdRef.current) {
        return;
      }

      pendingSubmitRef.current = true;
      window.turnstile.execute(widgetIdRef.current);
    };

    const interval = window.setInterval(() => {
      ensureWidget();
      if (widgetIdRef.current) {
        window.clearInterval(interval);
      }
    }, 100);

    form.addEventListener("submit", onSubmit);

    return () => {
      form.removeEventListener("submit", onSubmit);
      window.clearInterval(interval);

      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current);
        widgetIdRef.current = null;
      }
    };
  }, [siteKey]);

  return (
    <>
      <input ref={hiddenTokenRef} type="hidden" name="cf-turnstile-response" id={`turnstile-token-${id}`} />
      <div ref={widgetContainerRef} className="sr-only" aria-hidden="true" />
    </>
  );
}
