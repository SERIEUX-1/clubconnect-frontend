import { useEffect, useMemo, useRef, useState } from "react";
import { Check, Globe, Search } from "lucide-react";
import { useI18n } from "../../i18n/I18nProvider";

import { isLanguageReady } from "../../i18n/languages";

export function LanguageSelect() {
  const { language, languages, setLanguage, t, meta } = useI18n();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const rootRef = useRef(null);

  useEffect(() => {
    const onDoc = (e) => {
      if (!rootRef.current?.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return languages;
    return languages.filter(
      (l) =>
        l.native.toLowerCase().includes(q) ||
        l.name.toLowerCase().includes(q) ||
        l.code.toLowerCase().includes(q)
    );
  }, [languages, query]);

  return (
    <div className="relative" ref={rootRef}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-1.5 rounded-full border border-white/70 bg-white/55 px-2.5 py-1.5 text-xs font-semibold text-[#1e3a5f] hover:bg-white"
        aria-label={t("nav.language")}
        title={t("nav.language")}
      >
        <Globe className="h-3.5 w-3.5" />
        <span className="hidden sm:inline max-w-[7rem] truncate">{meta.native}</span>
      </button>
      {open && (
        <div className="absolute right-0 z-50 mt-2 w-72 overflow-hidden rounded-2xl border border-sky-100 bg-white shadow-xl">
          <div className="border-b border-slate-100 p-2">
            <label className="flex items-center gap-2 rounded-xl bg-slate-50 px-2.5 py-1.5">
              <Search className="h-3.5 w-3.5 text-slate-400" />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t("lang.search")}
                className="w-full bg-transparent text-xs outline-none"
              />
            </label>
          </div>
          <div className="max-h-72 overflow-y-auto py-1">
            {filtered.map((l) => {
              const ready = isLanguageReady(l.code);
              return (
              <button
                key={l.code}
                type="button"
                disabled={!ready}
                onClick={() => {
                  if (!ready) return;
                  setLanguage(l.code);
                  setOpen(false);
                  setQuery("");
                }}
                className={`flex w-full items-center justify-between px-3 py-2 text-left text-xs ${
                  !ready
                    ? "cursor-not-allowed text-slate-400"
                    : l.code === language
                      ? "bg-sky-50/80 text-sky-800 hover:bg-sky-50"
                      : "text-slate-700 hover:bg-sky-50"
                }`}
              >
                <span>
                  <span className="block font-semibold">{l.native}</span>
                  <span className="text-[10px] text-slate-400">
                    {ready ? l.name : t("lang.coming")}
                  </span>
                </span>
                {l.code === language ? <Check className="h-3.5 w-3.5 text-sky-600" /> : null}
              </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
