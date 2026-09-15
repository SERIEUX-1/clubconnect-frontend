import React, { useState } from "react";
import { CalendarPlus, X, QrCode, Sparkles, ArrowRight, RefreshCw } from "lucide-react";
import { api } from "../../lib/api";
import { useToast } from "../../context/ToastContext";

export function ScheduleEventModal({ isOpen, onClose, clubId, clubName, onEventCreated }) {
  const { toast } = useToast();

  const generateToken = () => {
    const slug = (clubName || "CAMPUS").split(" ")[0].toUpperCase();
    return `QR-${slug}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
  };

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    starts_at: new Date(Date.now() + 86400000).toISOString().slice(0, 16),
    ends_at: new Date(Date.now() + 86400000 + 7200000).toISOString().slice(0, 16),
    location: "Engineering Lab 204",
    capacity: 50,
    qr_token: generateToken(),
    check_in_open: true,
  });

  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleRefreshQr = () => {
    setFormData((prev) => ({ ...prev, qr_token: generateToken() }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.location.trim()) {
      toast.warning("Missing Fields", "Please specify event title and venue location.");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        ...formData,
        club_id: clubId || "1",
        club_name: clubName || "Robotics & AI Society",
        capacity: Number(formData.capacity),
        check_in_window: formData.check_in_open ? "Active Now (Closes in 3 hours)" : "Opens 1 hour before start",
      };

      const result = await api.events.create(payload);
      toast.success(
        "Event Scheduled Successfully!",
        `QR Token ${payload.qr_token} generated and ready for attendee scans.`
      );

      if (onEventCreated) {
        onEventCreated(result);
      }
      onClose();
    } catch (err) {
      toast.error("Scheduling Failed", err.message || "Could not schedule event.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-sky-100 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-emerald-600 via-teal-600 to-sky-600 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white shadow-inner">
              <CalendarPlus className="w-5 h-5 text-emerald-100" />
            </div>
            <div>
              <h3 className="text-lg font-bold tracking-tight">Schedule Campus Event</h3>
              <p className="text-xs text-emerald-100">Automated QR Token & Verified Check-in Window</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-white/80 hover:text-white hover:bg-white/20 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Event Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Hands-On Computer Vision & Drone Flight"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Event Description
            </label>
            <textarea
              rows={2}
              placeholder="What students should bring, learning agenda, target skill levels..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-800 placeholder:text-slate-400 focus:border-emerald-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Start Time
              </label>
              <input
                type="datetime-local"
                value={formData.starts_at}
                onChange={(e) => setFormData({ ...formData, starts_at: e.target.value })}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                End Time
              </label>
              <input
                type="datetime-local"
                value={formData.ends_at}
                onChange={(e) => setFormData({ ...formData, ends_at: e.target.value })}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Location / Hall *
              </label>
              <input
                type="text"
                required
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Max Capacity
              </label>
              <input
                type="number"
                min="5"
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 focus:border-emerald-500"
              />
            </div>
          </div>

          {/* QR Token Panel */}
          <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-emerald-900 uppercase tracking-wider flex items-center gap-1.5">
                <QrCode className="w-4 h-4 text-emerald-600" />
                <span>Generated QR Check-In Token</span>
              </label>
              <button
                type="button"
                onClick={handleRefreshQr}
                className="text-[11px] font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Regenerate</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                value={formData.qr_token}
                onChange={(e) => setFormData({ ...formData, qr_token: e.target.value })}
                className="font-mono text-sm font-bold text-slate-900 bg-white border border-emerald-200 rounded-xl px-3 py-2 flex-1"
              />
            </div>

            <label className="flex items-center gap-2 pt-1 text-xs text-slate-700 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={formData.check_in_open}
                onChange={(e) => setFormData({ ...formData, check_in_open: e.target.checked })}
                className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
              />
              <span className="font-medium">Open check-in immediately upon scheduling</span>
            </label>
          </div>

          {/* Submit buttons */}
          <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-1.5 px-6 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold shadow-md shadow-emerald-600/25 transition-all"
            >
              {submitting ? (
                <span>Publishing Event...</span>
              ) : (
                <>
                  <span>Publish Event & QR</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
