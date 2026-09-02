import { cn } from "../../lib/cn";

/**
 * Used for the Club Portfolio's storytelling structure (PRS §6): Problem
 * -> Objective -> What we did -> ... Each heading gets a short mono
 * "chapter mark" -- not a decorative 01/02/03 counter, but the actual
 * word from the narrative sequence, since here the order genuinely is
 * the content (a portfolio reads front-to-back like a report).
 */
export function SectionHeading({ mark, title, className }) {
  return (
    <div className={cn("flex items-baseline gap-3", className)}>
      {mark && (
        <span className="font-mono text-xs uppercase tracking-widest text-brass-dark">
          {mark}
        </span>
      )}
      <h2 className="font-display text-xl font-semibold text-ink">{title}</h2>
    </div>
  );
}
