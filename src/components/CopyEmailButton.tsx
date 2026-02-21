"use client";

import { useState } from "react";

interface CopyEmailButtonProps {
  email: string;
}

export default function CopyEmailButton({ email }: CopyEmailButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback for older browsers
      const el = document.createElement("textarea");
      el.value = email;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="mt-3 flex items-center gap-3">
      {/* Email link */}
      <a
        href={`mailto:${email}`}
        className="text-base font-medium text-slate-700 hover:text-[#00C8E0] transition-colors"
      >
        {email}
      </a>

      {/* Copy button */}
      <div className="relative">
        <button
          type="button"
          onClick={handleCopy}
          aria-label="Copiar correo al portapapeles"
          className="flex items-center justify-center w-8 h-8 rounded-lg border border-slate-200 bg-slate-50 text-slate-400 hover:bg-[#00C8E0]/10 hover:border-[#00C8E0]/40 hover:text-[#00C8E0] transition-all duration-200 active:scale-95"
        >
          {copied ? (
            /* Check icon */
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className="w-4 h-4 fill-none stroke-[#00C8E0] stroke-2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          ) : (
            /* Clipboard icon */
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className="w-4 h-4 fill-none stroke-current stroke-2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="9" y="2" width="6" height="4" rx="1" />
              <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
            </svg>
          )}
        </button>

        {/* Tooltip */}
        <div
          className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 rounded-lg bg-[#0F1A2E] text-white text-xs font-medium whitespace-nowrap shadow-lg pointer-events-none transition-all duration-300 ${
            copied
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-1"
          }`}
        >
          <span className="flex items-center gap-1.5">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className="w-3.5 h-3.5 fill-none stroke-[#00C8E0] stroke-2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
            ¡Correo copiado!
          </span>
          {/* Arrow */}
          <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#0F1A2E]" />
        </div>
      </div>
    </div>
  );
}
