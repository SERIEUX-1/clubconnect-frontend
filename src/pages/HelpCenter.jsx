import { useEffect, useMemo, useState } from "react";
import { CircleHelp, LifeBuoy, Send } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useI18n } from "../i18n/I18nProvider";
import { useToast } from "../context/ToastContext";
import { api } from "../lib/api";

const CATS = ["account", "clubs", "technical", "licence", "other"];

export function HelpCenter() {
  const { t, language } = useI18n();
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [query, setQuery] = useState("");
  const [tickets, setTickets] = useState([]);
  const [staffTickets, setStaffTickets] = useState([]);
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: user?.full_name || "",
    email: user?.email || "",
    category: "other",
    subject: "",
    body: "",
  });

  const staff = isAuthenticated && (user?.role === "staff" || user?.role === "system_admin");

  const articles = [
    { t: t("help.a1t"), b: t("help.a1b") },
    { t: t("help.a2t"), b: t("help.a2b") },
    { t: t("help.a3t"), b: t("help.a3b") },
    { t: t("help.a4t"), b: t("help.a4b") },
    { t: t("help.a5t"), b: t("help.a5b") },
  ];

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return articles;
    return articles.filter((a) => `${a.t} ${a.b}`.toLowerCase().includes(q));
  }, [articles, query]);

  useEffect(() => {
    if (isAuthenticated) {
      api.help.myTickets().then((rows) => setTickets(Array.isArray(rows) ? rows : [])).catch(() => {});
    }
    if (staff) {
      api.help.staffTickets().then((rows) => setStaffTickets(Array.isArray(rows) ? rows : [])).catch(() => {});
    }
  }, [isAuthenticated, staff]);

  const set = (key) => (e) => setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.help.createTicket({ ...form, language });
      setSent(true);
      toast.success(t("help.sent"), t("help.sentBody", { email: form.email || user?.email }));
      if (isAuthenticated) {
        const rows = await api.help.myTickets();
        setTickets(Array.isArray(rows) ? rows : []);
      }
    } catch (err) {
      toast.error(t("help.submitTitle"), err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 pb-24 pt-6 sm:px-6">
      <section className="morning-hero rounded-[32px] px-6 py-10 sm:px-10">
        <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#e07a5f]">{t("help.kicker")}</p>
        <h1 className="mt-2 flex items-center gap-3 font-display text-4xl text-[#1e3a5f] sm:text-5xl">
          <CircleHelp className="h-9 w-9 text-sky-600" />
          {t("help.title")}
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-600">{t("help.lead")}</p>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t("help.search")}
          className="mt-6 w-full max-w-lg rounded-full border border-white/80 bg-white/80 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-sky-400"
        />
      </section>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-3">
          {shown.map((a) => (
            <article key={a.t} className="rounded-[24px] border border-white/80 bg-white/70 p-5 shadow-sm backdrop-blur-md">
              <h2 className="font-display text-xl text-[#1e3a5f]">{a.t}</h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{a.b}</p>
            </article>
          ))}
        </div>

        <div className="rounded-[28px] border border-white/80 bg-white/80 p-6 shadow-sm backdrop-blur-md">
          <div className="mb-4 flex items-center gap-2">
            <LifeBuoy className="h-5 w-5 text-amber-600" />
            <h2 className="font-display text-2xl text-[#1e3a5f]">{t("help.submitTitle")}</h2>
          </div>
          <p className="mb-4 text-sm text-slate-600">{t("help.submitLead")}</p>
          {sent ? (
            <div className="text-center">
              <p className="font-semibold text-sky-800">{t("help.sent")}</p>
              <p className="mt-2 text-sm text-slate-600">{t("help.sentBody", { email: form.email || user?.email })}</p>
              <button
                type="button"
                onClick={() => setSent(false)}
                className="mt-4 rounded-full bg-sky-50 px-4 py-2 text-xs font-semibold text-sky-800"
              >
                {t("help.another")}
              </button>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-3">
              {!isAuthenticated && (
                <>
                  <label className="block text-xs font-semibold text-slate-600">
                    {t("help.name")}
                    <input required value={form.name} onChange={set("name")} className="mt-1 w-full rounded-xl border border-sky-100 px-3 py-2 text-sm" />
                  </label>
                  <label className="block text-xs font-semibold text-slate-600">
                    {t("help.email")}
                    <input required type="email" value={form.email} onChange={set("email")} className="mt-1 w-full rounded-xl border border-sky-100 px-3 py-2 text-sm" />
                  </label>
                </>
              )}
              <label className="block text-xs font-semibold text-slate-600">
                {t("help.category")}
                <select value={form.category} onChange={set("category")} className="mt-1 w-full rounded-xl border border-sky-100 px-3 py-2 text-sm">
                  {CATS.map((c) => (
                    <option key={c} value={c}>{t(`help.cat_${c}`)}</option>
                  ))}
                </select>
              </label>
              <label className="block text-xs font-semibold text-slate-600">
                {t("help.subject")}
                <input required value={form.subject} onChange={set("subject")} className="mt-1 w-full rounded-xl border border-sky-100 px-3 py-2 text-sm" />
              </label>
              <label className="block text-xs font-semibold text-slate-600">
                {t("help.message")}
                <textarea required minLength={10} rows={4} value={form.body} onChange={set("body")} className="mt-1 w-full rounded-xl border border-sky-100 px-3 py-2 text-sm" />
              </label>
              <button type="submit" disabled={submitting} className="sun-cta flex w-full items-center justify-center gap-2 rounded-full py-2.5 text-sm font-semibold text-white">
                <Send className="h-4 w-4" />
                {submitting ? t("help.sending") : t("help.send")}
              </button>
            </form>
          )}

          {isAuthenticated && (
            <div className="mt-8 border-t border-slate-100 pt-5">
              <h3 className="text-sm font-bold text-slate-800">{t("help.myTickets")}</h3>
              {tickets.length === 0 ? (
                <p className="mt-2 text-xs text-slate-500">{t("help.noTickets")}</p>
              ) : (
                <ul className="mt-3 space-y-2">
                  {tickets.map((row) => (
                    <li key={row.id} className="rounded-xl bg-slate-50 px-3 py-2 text-xs">
                      <span className="font-semibold text-slate-800">{row.subject}</span>
                      <span className="ml-2 text-sky-700">{t(`help.status_${row.status}`) || row.status}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {staff && staffTickets.length > 0 && (
            <div className="mt-6 border-t border-slate-100 pt-5">
              <h3 className="text-sm font-bold text-slate-800">{t("help.staffInbox")}</h3>
              <ul className="mt-3 space-y-2">
                {staffTickets.slice(0, 8).map((row) => (
                  <li key={row.id} className="rounded-xl bg-amber-50 px-3 py-2 text-xs">
                    <span className="font-semibold">{row.subject}</span>
                    <span className="ml-2 text-slate-500">{row.email}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
