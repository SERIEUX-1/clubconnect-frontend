import { NavLink } from "react-router-dom";
import { cn } from "../../lib/cn";

const LINKS = [
  { to: "/", label: "Discover" },
  { to: "/command-center", label: "Command Center" },
];

export function NavBar() {
  return (
    <header className="sticky top-0 z-20 border-b border-fog-line bg-fog/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-ink font-display text-sm text-fog">
            C
          </span>
          <span className="font-display text-lg font-semibold tracking-tight text-ink">
            ClubConnect
          </span>
        </div>
        <nav className="flex items-center gap-1">
          {LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                cn(
                  "rounded-full px-4 py-2 text-sm font-medium transition-colors",
                  isActive ? "bg-ink text-fog" : "text-ink-500 hover:bg-fog-line/70"
                )
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}
