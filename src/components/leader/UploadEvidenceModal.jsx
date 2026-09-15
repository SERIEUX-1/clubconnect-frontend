import React, { useState } from "react";
import { Upload, X, FileCheck, Sparkles, ArrowRight, Paperclip } from "lucide-react";
import { api } from "../../lib/api";
import { useToast } from "../../context/ToastContext";

export function UploadEvidenceModal({ isOpen, onClose, clubId, clubName, activities = [], onEvidenceUploaded }) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    activity_id: activities[0]?.id || "",
    activity_title: activities[0]?.title || "Beginner Machine Learning Bootcamp",
    evidence_type: "attendance_record",
    caption: "",
    file_name: "evidence_roster_scan.pdf",
    description: "",
  });

  const [simulatedFile, setSimulatedFile] = useState("evidence_document_scan.pdf");
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSimulatedFile(file.name);
      setFormData((p) => ({ ...p, file_name: file.name }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.caption.trim() || !formData.description.trim()) {
      toast.warning("Incomplete Details", "Please provide a descriptive caption and verification context.");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        ...formData,
        club_id: clubId || "1",
        club_name: clubName || "Robotics & AI Society",
        status: "under_review",
        file_name: simulatedFile,
        created_at: new Date().toISOString(),
      };

      const result = await api.evidence.upload(payload);
      toast.success(
        "Evidence Uploaded to Review Queue",
        `Submitted for verification by assigned Committee Reviewers.`
      );

      if (onEvidenceUploaded) {
        onEvidenceUploaded(result);
      }
      onClose();
    } catch (err) {
      toast.error("Upload Failed", err.message || "Failed to upload evidence.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-sky-100 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-700 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white shadow-inner">
              <Upload className="w-5 h-5 text-violet-100" />
            </div>
            <div>
              <h3 className="text-lg font-bold tracking-tight">Upload Evidence Documentation</h3>
              <p className="text-xs text-violet-100">Attach Signatures, Photos, or Financial Vouchers</p>
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
              Associated Club Activity
            </label>
            <select
              value={formData.activity_title}
              onChange={(e) => setFormData({ ...formData, activity_title: e.target.value })}
              className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 focus:border-violet-500"
            >
              {activities.length > 0 ? (
                activities.map((act) => (
                  <option key={act.id} value={act.title}>
                    {act.title} ({new Date(act.date_time).toLocaleDateString()})
                  </option>
                ))
              ) : (
                <option value="Beginner Machine Learning Bootcamp">Beginner Machine Learning Bootcamp</option>
              )}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Evidence Category
              </label>
              <select
                value={formData.evidence_type}
                onChange={(e) => setFormData({ ...formData, evidence_type: e.target.value })}
                className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 focus:border-violet-500"
              >
                <option value="attendance_record">Attendance Roster / Sign-in</option>
                <option value="image">Action Photography / Media</option>
                <option value="document">Faculty / Advisor Letter</option>
                <option value="finance">Receipts / Financial Vouchers</option>
                <option value="link">Official Video / Code Repository</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Caption / File Title *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Scanned Attendee Sign-in Sheet"
                value={formData.caption}
                onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
                className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:border-violet-500"
              />
            </div>
          </div>

          {/* Drag and Drop Zone */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Select or Drop File
            </label>
            <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-violet-200 rounded-2xl bg-violet-50/40 hover:bg-violet-50 cursor-pointer transition-colors group">
              <Paperclip className="w-8 h-8 text-violet-400 group-hover:scale-110 transition-transform mb-2" />
              <p className="text-xs font-semibold text-slate-700">
                Click to browse or drop document / image
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Current attached: <strong className="text-violet-700 font-mono">{simulatedFile}</strong>
              </p>
              <input type="file" onChange={handleFileChange} className="hidden" />
            </label>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Verification Context / Detailed Description *
            </label>
            <textarea
              required
              rows={3}
              placeholder="Explain how this file substantiates the activity (e.g. 42 distinct attendee signatures matching student ID roster)..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-800 placeholder:text-slate-400 focus:border-violet-500"
            />
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
              className="flex items-center gap-1.5 px-6 py-2.5 rounded-full bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white text-xs font-bold shadow-md shadow-violet-600/25 transition-all"
            >
              {submitting ? (
                <span>Uploading...</span>
              ) : (
                <>
                  <span>Submit for Review</span>
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
