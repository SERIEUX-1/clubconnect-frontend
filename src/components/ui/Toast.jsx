import React, { useEffect } from "react";
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from "lucide-react";

export function Toast({ id, type = "success", title, message, duration = 4000, onDismiss }) {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onDismiss(id);
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [id, duration, onDismiss]);

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />,
    error: <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />,
    info: <Info className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />,
  };

  const borders = {
    success: "border-emerald-500/30",
    error: "border-rose-500/30",
    info: "border-sky-500/30",
    warning: "border-amber-500/30",
  };

  const glowBg = {
    success: "bg-emerald-500/10",
    error: "bg-rose-500/10",
    info: "bg-sky-500/10",
    warning: "bg-amber-500/10",
  };

  return (
    <div
      role="alert"
      className={`relative overflow-hidden flex items-start gap-3 p-4 rounded-2xl bg-slate-900/95 backdrop-blur-xl border ${borders[type]} text-white shadow-2xl shadow-slate-950/40 min-w-[320px] max-w-md transition-all duration-300 animate-in fade-in slide-in-from-bottom-4`}
    >
      <div className={`p-1.5 rounded-xl ${glowBg[type]}`}>
        {icons[type] || icons.info}
      </div>

      <div className="flex-1 min-w-0 pr-2">
        {title && <p className="text-xs font-bold text-white tracking-wide">{title}</p>}
        {message && <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">{message}</p>}
      </div>

      <button
        onClick={() => onDismiss(id)}
        className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
        aria-label="Close notification"
      >
        <X className="w-4 h-4" />
      </button>

      {/* Progress bar animation */}
      {duration > 0 && (
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-800">
          <div
            className={`h-full ${
              type === "success"
                ? "bg-emerald-400"
                : type === "error"
                ? "bg-rose-400"
                : type === "warning"
                ? "bg-amber-400"
                : "bg-sky-400"
            } transition-all`}
            style={{
              animation: `shrinkWidth ${duration}ms linear forwards`,
            }}
          />
        </div>
      )}
    </div>
  );
}
