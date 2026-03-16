interface RoundedCheckboxProps {
  checked: boolean;
  onChange: () => void;
  ariaLabel: string;
  className?: string;
}

export default function RoundedCheckbox({
  checked,
  onChange,
  ariaLabel,
  className = "",
}: RoundedCheckboxProps) {
  return (
    <label
      className={`relative inline-flex h-5 w-5 cursor-pointer items-center justify-center ${className}`}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="peer sr-only"
        aria-label={ariaLabel}
      />
      <span className="h-5 w-5 rounded-md border-2 border-border bg-surface shadow-sm transition-colors peer-checked:border-green-600 peer-checked:bg-green-600 peer-focus-visible:ring-2 peer-focus-visible:ring-primary/30" />
      <span className="material-symbols-outlined pointer-events-none absolute text-[14px] leading-none text-white opacity-0 transition-opacity peer-checked:opacity-100">
        check
      </span>
    </label>
  );
}
