import { useMemo, useState } from "react";
import { PassportCard } from "../components/ui/PassportCard";
import { MOCK_CLUBS } from "../data/mockClubs";

const CATEGORIES = ["All", ...new Set(MOCK_CLUBS.map((c) => c.category))];

export function DiscoverClubs() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");

  const filtered = useMemo(() => {
    return MOCK_CLUBS.filter((c) => {
      const matchesQuery = c.name.toLowerCase().includes(query.toLowerCase());
      const matchesCategory = category === "All" || c.category === category;
      return matchesQuery && matchesCategory;
    });
  }, [query, category]);

  return (
    <div>
      {/* Hero: the thesis. A passport cover, not a generic gradient headline. */}
      <section className="border-b border-fog-line bg-ink">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-brass">
            Institutional Digital Ecosystem
          </p>
          <h1 className="mt-4 max-w-2xl font-display text-5xl font-semibold leading-[1.05] text-fog">
            One campus.
            <br />
            Every club, verified.
          </h1>
          <p className="mt-5 max-w-lg text-base leading-relaxed text-fog/70">
            Every recognized club carries a living digital passport — its
            activities, evidence, and impact, documented and verified in
            one place instead of scattered across chats and folders.
          </p>
        </div>
      </section>

      {/* Directory */}
      <section className="mx-auto max-w-6xl px-6 py-12">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-display text-2xl font-semibold text-ink">Discover clubs</h2>
            <p className="text-sm text-ink-500">{filtered.length} clubs found</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={
                  "rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors " +
                  (category === cat
                    ? "border-ink bg-ink text-fog"
                    : "border-fog-line bg-fog-card text-ink-500 hover:border-ink/30")
                }
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <input
          type="search"
          placeholder="Search clubs by name…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="mb-8 w-full max-w-sm rounded-full border border-fog-line bg-fog-card px-4 py-2.5 text-sm text-ink placeholder:text-ink-300"
          aria-label="Search clubs"
        />

        {filtered.length === 0 ? (
          <div className="rounded-card border border-dashed border-fog-line bg-fog-card px-8 py-16 text-center">
            <p className="font-display text-lg text-ink">No clubs match that search.</p>
            <p className="mt-1 text-sm text-ink-500">
              Try a different name, or browse another category above.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((club) => (
              <PassportCard key={club.id} club={club} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
