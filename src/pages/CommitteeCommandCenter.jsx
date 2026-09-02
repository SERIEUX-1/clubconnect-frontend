import { StatCard } from "../components/ui/StatCard";
import { StatusBadge } from "../components/ui/StatusBadge";
import { MOCK_HEALTH_SUMMARY, MOCK_PENDING_REVIEWS } from "../data/mockClubs";

/**
 * PRS §15: "All clubs, pending work, health alerts and evaluation status"
 * at a glance. Built as the Committee Head's daily-driver screen, not a
 * generic admin table — health status reads as "here's how to help," per
 * the "development before punishment" principle: no red warning triangles,
 * just a clear status chip and the specific indicator behind it.
 */
export function CommitteeCommandCenter() {
  const atRiskCount = MOCK_HEALTH_SUMMARY.filter((c) => c.status === "at_risk").length;
  const needsAttentionCount = MOCK_HEALTH_SUMMARY.filter((c) => c.status === "needs_attention").length;

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <div className="mb-8">
        <p className="font-mono text-xs uppercase tracking-widest text-ink-300">
          Clubs &amp; Societies Committee
        </p>
        <h1 className="font-display text-3xl font-semibold text-ink">Command Center</h1>
      </div>

      <div className="mb-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard label="Recognized clubs" value="24" />
        <StatCard label="Pending review items" value={MOCK_PENDING_REVIEWS.length} tone="brass" />
        <StatCard label="Needs attention" value={needsAttentionCount} />
        <StatCard label="At risk" value={atRiskCount} />
      </div>

      <div className="grid gap-10 lg:grid-cols-3">
        {/* Club Health roster */}
        <div className="lg:col-span-2">
          <h2 className="mb-4 font-display text-lg font-semibold text-ink">Club health</h2>
          <div className="overflow-hidden rounded-card bg-fog-card shadow-card">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-fog-line text-xs uppercase tracking-wide text-ink-300">
                  <th className="px-5 py-3 font-medium">Club</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium">Last activity</th>
                  <th className="px-5 py-3 font-medium">Report completion</th>
                </tr>
              </thead>
              <tbody>
                {MOCK_HEALTH_SUMMARY.map((row) => (
                  <tr key={row.club} className="border-b border-fog-line last:border-0">
                    <td className="px-5 py-3.5 font-medium text-ink">{row.club}</td>
                    <td className="px-5 py-3.5">
                      <StatusBadge status={row.status} />
                    </td>
                    <td className="px-5 py-3.5 font-mono text-ink-500">
                      {row.days_since_last_activity}d ago
                    </td>
                    <td className="px-5 py-3.5 font-mono text-ink-500">
                      {Math.round(row.report_completion_rate * 100)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pending review queue */}
        <div>
          <h2 className="mb-4 font-display text-lg font-semibold text-ink">Needs your review</h2>
          <div className="space-y-3">
            {MOCK_PENDING_REVIEWS.map((item, i) => (
              <div key={i} className="rounded-card bg-fog-card p-4 shadow-card">
                <p className="font-mono text-[10px] uppercase tracking-widest text-brass-dark">
                  {item.criterion}
                </p>
                <p className="mt-1 font-medium text-ink">{item.club}</p>
                <p className="mt-0.5 text-sm text-ink-500">{item.item}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
