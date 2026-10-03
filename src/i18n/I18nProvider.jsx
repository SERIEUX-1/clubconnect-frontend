import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { en } from "./en";
import { fr } from "./fr";
import { rw } from "./rw";
import { LANGUAGES, RTL, languageMeta, READY_LANGUAGE_CODES } from "./languages";

const DICTS = { en, fr, rw };

const I18nContext = createContext(null);
const STORAGE_KEY = "cc_lang";

function lookup(dict, key) {
  return key.split(".").reduce((node, part) => (node && node[part] != null ? node[part] : null), dict);
}

function interpolate(text, vars) {
  if (!vars) return text;
  return Object.entries(vars).reduce((out, [k, v]) => out.replaceAll(`{${k}}`, String(v ?? "")), text);
}

export function I18nProvider({ children, userLanguage, onPersist }) {
  const [code, setCode] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) || "en";
    } catch {
      return "en";
    }
  });

  useEffect(() => {
    if (!userLanguage) return;
    try {
      if (!localStorage.getItem(STORAGE_KEY)) setCode(userLanguage);
    } catch {
      setCode(userLanguage);
    }
  }, [userLanguage]);

  useEffect(() => {
    const meta = languageMeta(code);
    document.documentElement.lang = code;
    document.documentElement.dir = RTL.has(code) ? "rtl" : "ltr";
    try {
      localStorage.setItem(STORAGE_KEY, code);
    } catch {
      /* ignore */
    }
    const title = lookup(DICTS[code] || en, "app.titlePublic") || en.app.titlePublic;
    if (!document.title.includes("·")) document.title = title;
  }, [code]);

  const setLanguage = useCallback(
    (next) => {
      const resolved = DICTS[next] ? next : "en";
      setCode(resolved);
      onPersist?.(resolved);
    },
    [onPersist]
  );

  const t = useCallback(
    (key, vars) => {
      const dict = DICTS[code] || en;
      const raw = lookup(dict, key) ?? lookup(en, key) ?? key;
      return interpolate(typeof raw === "string" ? raw : key, vars);
    },
    [code]
  );

  const value = useMemo(
    () => ({
      language: code,
      languages: LANGUAGES,
      readyLanguages: LANGUAGES.filter((l) => READY_LANGUAGE_CODES.includes(l.code)),
      meta: languageMeta(code),
      dir: RTL.has(code) ? "rtl" : "ltr",
      setLanguage,
      t,
      hasPack: Boolean(DICTS[code]),
    }),
    [code, setLanguage, t]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}
