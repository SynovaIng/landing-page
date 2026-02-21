import { type ReactNode } from "react";
import Link from "next/link";

type Variant = "primary" | "outline" | "ghost";
type Size = "sm" | "md" | "lg";

interface ButtonProps {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  href?: string;
  type?: "button" | "submit" | "reset";
  className?: string;
  onClick?: () => void;
}

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-cyan-gradient text-white font-bold hover:brightness-110 shadow-lg hover:shadow-glow",
  outline:
    "border-2 border-[#1A3A8F] text-[#1A3A8F] font-bold hover:bg-[#1A3A8F]/5",
  ghost: "text-[#1A3A8F] font-medium hover:text-[#00C8E0]",
};

const sizeClasses: Record<Size, string> = {
  sm: "px-4 py-2 text-sm rounded-sm",
  md: "px-8 py-3 text-base rounded-sm",
  lg: "px-10 py-4 text-lg rounded-sm",
};

export default function Button({
  children,
  variant = "primary",
  size = "md",
  href,
  type = "button",
  className = "",
  onClick,
}: ButtonProps) {
  const classes = `inline-flex items-center justify-center gap-2 transition-all duration-300 transform hover:-translate-y-0.5 ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} className={classes}>
      {children}
    </button>
  );
}
