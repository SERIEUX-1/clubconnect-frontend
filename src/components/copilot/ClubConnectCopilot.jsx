import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Compass, Send, Sparkles, X } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../lib/api";
import { useI18n } from "../../i18n/I18nProvider";

export function emitCopilotAction(action, path) {
  window.dispatchEvent(new CustomEvent("cc-copilot-action", { detail: { action, path } }));
}

function CopilotText({ text }) {
  const parts = String(text || "").split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) =>
    part.startsWith("**") && part.endsWith("**") ? (
      <strong key={i}>{part.slice(2, -2)}</strong>
    ) : (
      <span key={i}>{part}</span>
    )
  );
}

export function ClubConnectCopilot() {
  const { user, isAuthenticated, openAuthModal } = useAuth();
  const { t } = useI18n();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [messages, setMessages] = useState([]);
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  const handleAction = (btn) => {
    if (btn.action === "open_auth") {
      openAuthModal("login");
      return;
    }
    if (btn.path) navigate(btn.path);
    if (btn.action) emitCopilotAction(btn.action, btn.path);
  };

  const send = async (text) => {
    const message = (text || input).trim();
    if (!message || busy) return;
    setInput("");
    setMessages((prev) => [...prev, { from: "user", text: message }]);
    setBusy(true);
    const history = messages.slice(-6).map((m) => ({ from: m.from, text: m.text }));
    const lastTopic = [...messages].reverse().find((m) => m.topic)?.topic;
    try {
      const res = await api.copilot.chat(message, {
        role: user?.role || "guest",
        path: location.pathname,
        user_name: user?.full_name,
        history,
        last_topic: lastTopic,
      });
      setMessages((prev) => [
        ...prev,
        {
                  from: "copilot",
                  text: res.reply,
                  analysis: res.analysis || [],
                  usesModel: Boolean(res.uses_model),
                  topic: res.topic,
                  steps: res.steps || [],
                  actions: res.action_buttons || [],
                  suggestions: res.suggestions || [],
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          from: "copilot",
          text: "I could not reach the Copilot service. You can still use Discover Clubs, or sign in with your school email.",
          steps: [],
          actions: [{ label: "Discover clubs", path: "/" }],
          suggestions: ["What can I do in my role?"],
        },
      ]);
    } finally {
      setBusy(false);
    }
  };

  if (!isAuthenticated) return null;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="sun-cta fixed bottom-5 right-5 z-40 flex items-center gap-2 rounded-full px-4 py-3 text-sm font-semibold text-white"
        aria-label={t("copilot.open")}
      >
        <Compass className="h-4 w-4" />
        {t("copilot.title")}
      </button>

      {open && (
        <div className="fixed bottom-5 right-5 z-50 flex h-[min(640px,80vh)] w-[min(420px,calc(100vw-1.5rem))] flex-col overflow-hidden rounded-3xl border border-sky-100 bg-white shadow-2xl">
          <div className="cc-dusk flex items-start justify-between px-4 py-3 text-white">
            <div>
              <p className="flex items-center gap-1.5 text-sm font-bold">
                <Sparkles className="h-4 w-4" /> ClubConnect Copilot
              </p>
              <p className="mt-0.5 text-[11px] text-sky-100">
                Ask me like a person. I only answer for ClubConnect.
              </p>
            </div>
            <button type="button" onClick={() => setOpen(false)} className="rounded-full p-1 hover:bg-white/15" aria-label="Close copilot">
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto bg-slate-50 p-3">
            {messages.length === 0 && (
              <div className="rounded-2xl border border-sky-100 bg-white p-3 text-xs leading-relaxed text-slate-600">
                Hi
                {isAuthenticated && user?.full_name ? ` ${user.full_name.split(" ")[0]}` : ""}
                — what do you need to do in ClubConnect?
                {user?.role === "committee_head" ? (
                  <button
                    type="button"
                    onClick={() => send("Catch me up — summary of everything, most urgent first")}
                    className="mt-2 block w-full rounded-xl bg-sky-50 px-3 py-2 text-left text-[11px] font-semibold text-sky-800 ring-1 ring-sky-100"
                  >
                    Catch me up (most urgent → least)
                  </button>
                ) : user?.role === "staff" || user?.role === "system_admin" ? (
                  <button
                    type="button"
                    onClick={() => send("How do I broadcast a campus notice?")}
                    className="mt-2 block w-full rounded-xl bg-sky-50 px-3 py-2 text-left text-[11px] font-semibold text-sky-800 ring-1 ring-sky-100"
                  >
                    Broadcast a campus notice
                  </button>
                ) : (
                  <span className="mt-2 block text-[11px] text-slate-500">
                    Try “How do I submit a ticket?”, “How do I join a club?”, or “What can I do?”
                  </span>
                )}
              </div>
            )}
            {messages.map((m, i) => (
              <div key={i} className={m.from === "user" ? "text-right" : "text-left"}>
                {m.from === "user" ? (
                <div className="inline-block max-w-[95%] whitespace-pre-wrap rounded-2xl bg-sky-600 px-3 py-2 text-xs leading-relaxed text-white">
                  {m.text}
                </div>
                ) : (
                <>
                <div className="inline-block max-w-[95%] whitespace-pre-wrap rounded-2xl border border-slate-100 bg-white px-3 py-2 text-xs leading-relaxed text-slate-800">
                  <CopilotText text={m.text} />
                </div>
                {m.steps?.length > 0 && (
                  <ol className="mt-2 list-decimal space-y-1 pl-5 text-[11px] text-slate-600">
                    {m.steps.map((s) => (
                      <li key={s}><CopilotText text={s} /></li>
                    ))}
                  </ol>
                )}
                {m.actions?.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {m.actions.map((btn) => (
                      <button
                        key={btn.label}
                        type="button"
                        onClick={() => handleAction(btn)}
                        className="rounded-full border border-sky-200 bg-sky-50 px-2.5 py-1 text-[11px] font-semibold text-sky-700"
                      >
                        {btn.label}
                      </button>
                    ))}
                  </div>
                )}
                {m.suggestions?.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {m.suggestions.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => send(s)}
                        className="rounded-full bg-white px-2.5 py-1 text-[11px] text-slate-500 ring-1 ring-slate-200"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                )}
                </>
                )}
              </div>
            ))}
            {busy && (
              <p className="px-1 text-[11px] text-slate-500">One moment…</p>
            )}
          </div>

          <form
            className="flex gap-2 border-t border-slate-100 p-3"
            onSubmit={(e) => {
              e.preventDefault();
              send();
            }}
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask one task: ticket, join, QR, report…"
              className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-sky-400 focus:bg-white"
            />
            <button
              type="submit"
              disabled={busy}
              className="rounded-xl bg-sky-600 px-3 text-white disabled:opacity-50"
              aria-label="Send"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
