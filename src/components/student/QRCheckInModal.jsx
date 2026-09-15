import React, { useEffect, useState } from "react";
import confetti from "canvas-confetti";
import { QrCode, X, CheckCircle2, Sparkles, Camera, ArrowRight } from "lucide-react";
import { api } from "../../lib/api";
import { useToast } from "../../context/ToastContext";

export function QRCheckInModal({ isOpen, onClose, events = [], defaultEventId = null, onCheckInSuccess }) {
  const { toast } = useToast();
  const [selectedEventId, setSelectedEventId] = useState(defaultEventId || (events[0]?.id || "evt-1"));
  const [qrToken, setQrToken] = useState("");
  const [scanning, setScanning] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [successData, setSuccessData] = useState(null);

  const firstEventId = events[0]?.id;

  useEffect(() => {
    if (!isOpen) return;
    setSelectedEventId(defaultEventId || firstEventId || "evt-1");
    setQrToken("");
    setSuccessData(null);
    setScanning(false);
    setSubmitting(false);
  }, [isOpen, defaultEventId, firstEventId]);

  if (!isOpen) return null;

  const currentEvent = events.find((e) => e.id === selectedEventId) || events[0];

  const handleSimulateScan = () => {
    setScanning(true);
    setTimeout(() => {
      if (currentEvent) {
        setQrToken(currentEvent.qr_token || "QR-ROBOTICS-2026-ACTIVE");
      } else {
        setQrToken("QR-CAMPUS-2026-VERIFIED");
      }
      setScanning(false);
      toast.info("QR Code Scanned", "Token captured from camera stream.");
    }, 1200);
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!qrToken.trim()) {
      toast.warning("Token Required", "Please enter or scan a valid event QR token.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.events.checkIn(selectedEventId, qrToken.trim());
      setSuccessData(res);

      // Trigger celebratory confetti
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#0284c7", "#10b981", "#38bdf8", "#fbbf24"],
      });

      toast.success(
        "Attendance Verified!",
        `Checked in to ${currentEvent?.title || "campus event"} with verified badge.`
      );

      if (onCheckInSuccess) {
        onCheckInSuccess({
          eventId: selectedEventId,
          eventTitle: currentEvent?.title,
          record: res,
        });
      }
    } catch (err) {
      toast.error("Check-in Failed", err.message || "Invalid or expired QR token.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setSuccessData(null);
    setQrToken("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-sky-100 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-emerald-600 via-teal-600 to-sky-600 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white shadow-inner">
              <QrCode className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold tracking-tight">QR Event Check-In</h3>
              <p className="text-xs text-emerald-100">Live Institutional Attendance Verification</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-white/80 hover:text-white hover:bg-white/20 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {successData ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div>
                <h4 className="text-xl font-bold text-slate-900">Attendance Confirmed!</h4>
                <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">
                  {currentEvent?.title} · Verified at{" "}
                  {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-left max-w-sm mx-auto space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Attendance ID</span>
                  <span className="font-mono font-bold text-slate-700">{successData.id || "ATT-2026-OK"}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Status</span>
                  <span className="font-semibold text-emerald-600 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Verified Presence
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">CCEA Score Impact</span>
                  <span className="font-semibold text-sky-600">+1.5 Participation Pts</span>
                </div>
              </div>

              <div className="pt-2 flex gap-3 justify-center">
                <button
                  onClick={handleReset}
                  className="px-4 py-2 rounded-full border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  Check In Another
                </button>
                <button
                  onClick={onClose}
                  className="px-5 py-2 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-md shadow-emerald-600/25 transition-colors"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Event Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Select Event
                </label>
                <select
                  value={selectedEventId}
                  onChange={(e) => setSelectedEventId(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-800 focus:bg-white focus:border-sky-500 transition-colors"
                >
                  {events.map((ev) => (
                    <option key={ev.id} value={ev.id}>
                      {ev.title} ({ev.club_name || "Campus Club"}) {ev.check_in_open ? "🟢 Open" : "⚪ Upcoming"}
                    </option>
                  ))}
                </select>
              </div>

              {/* Simulated Scanner Viewport */}
              <div className="relative rounded-2xl overflow-hidden border-2 border-dashed border-emerald-300 bg-slate-950 p-6 text-center text-white">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-500/10 via-transparent to-transparent pointer-events-none" />

                {scanning && (
                  <div className="absolute inset-0 bg-emerald-500/20 backdrop-blur-xs flex items-center justify-center">
                    <div className="absolute top-0 left-0 right-0 h-1 bg-emerald-400 shadow-lg shadow-emerald-400/50 animate-bounce" />
                  </div>
                )}

                <div className="relative z-10 space-y-2">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
                    <Camera className="w-6 h-6" />
                  </div>
                  <p className="text-xs font-medium text-slate-300">
                    {scanning ? "Detecting high-entropy token..." : "Simulate optical camera or enter QR token below"}
                  </p>
                  <button
                    type="button"
                    onClick={handleSimulateScan}
                    disabled={scanning}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500 text-slate-950 text-xs font-bold hover:bg-emerald-400 transition-all shadow-md active:scale-95"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{scanning ? "Scanning..." : "Simulate Instant Scan"}</span>
                  </button>
                </div>
              </div>

              {/* Token Input */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    QR Security Token
                  </label>
                  {currentEvent?.qr_token && (
                    <button
                      type="button"
                      onClick={() => setQrToken(currentEvent.qr_token)}
                      className="text-[11px] font-semibold text-sky-600 hover:text-sky-700"
                    >
                      Paste active event token
                    </button>
                  )}
                </div>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="e.g. QR-ROBOTICS-2026-ACTIVE"
                    value={qrToken}
                    onChange={(e) => setQrToken(e.target.value)}
                    className="w-full font-mono rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting || !qrToken}
                  className="flex items-center gap-1.5 px-6 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold shadow-md shadow-emerald-600/25 transition-all"
                >
                  {submitting ? (
                    <span>Verifying...</span>
                  ) : (
                    <>
                      <span>Confirm Check-In</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
