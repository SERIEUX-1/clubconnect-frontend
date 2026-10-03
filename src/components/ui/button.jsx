import { cn } from "../../lib/cn";

const VARIANTS = {
  primary: "sun-cta text-white hover:opacity-95",
  brass: "bg-sun text-sky-950 hover:bg-amber-400",
  ghost: "bg-transparent text-ink hover:bg-fog-line/60",
  outline: "bg-transparent text-ink border border-ink/20 hover:border-ink/40",
};

export function Button({ variant = "primary", className, children, ...props }) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5",
        "text-sm font-medium tracking-wide transition-colors duration-150",
        "disabled:opacity-40 disabled:pointer-events-none",
        VARIANTS[variant],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
