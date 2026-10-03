import { useState } from "react";
import { PlayCircle, X, ArrowRight, Link2, Image, Film } from "lucide-react";
import { api } from "../../lib/api";
import { useToast } from "../../context/ToastContext";

const KINDS = [
  { value: "video", label: "Video / film", hint: "YouTube, Vimeo, or an .mp4 file" },
  { value: "image", label: "Photo", hint: "A still everyone on campus can see" },
  { value: "project_documentation", label: "Project film or document", hint: "What the club built or delivered" },
  { value: "poster", label: "Poster", hint: "Event or campaign artwork" },
];

export function PublishWatchModal({ isOpen, onClose, clubId, clubName, onPublished }) {
  const { toast } = useToast();
  const [kind, setKind] = useState("video");
  const [caption, setCaption] = useState("");
  const [link, setLink] = useState("");
  const [file, setFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!caption.trim()) {
      toast.warning("Add a title", "Give this piece a short caption so visitors know what they are watching.");
      return;
    }
    if (!link.trim() && !file) {
      toast.warning("Nothing to publish", "Paste a video or photo link, or attach a file.");
      return;
    }
    setSubmitting(true);
    try {
      const result = await api.clubs.publishWatch(clubId, {
        caption: caption.trim(),
        evidence_type: kind,
        external_link: link.trim(),
        file,
      });
      toast.success(
        "Published on the campus club page",
        `Anyone signed in at this institution can watch this on ${clubName || "your club"}.`
      );
      onPublished?.(result);
      setCaption("");
      setLink("");
      setFile(null);
      onClose();
    } catch (err) {
      toast.error("Could not publish", err.message || "The campus page was not updated.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="relative flex max-h-[90vh] w-full max-w-xl flex-col overflow-hidden rounded-3xl border border-sky-100 bg-white shadow-2xl">
        <div className="flex items-center justify-between bg-gradient-to-r from-sky-600 via-cyan-600 to-amber-500 px-6 py-5 text-white">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/20">
              <PlayCircle className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold tracking-tight">Publish for the campus to watch</h3>
              <p className="text-xs text-sky-50">
                Students, staff, and other leaders see this on the {clubName || "club"} page after they sign in.
              </p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="rounded-full p-1.5 hover:bg-white/20">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 space-y-4 overflow-y-auto p-6">
          <div>
            <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-700">What is this?</label>
            <div className="grid grid-cols-2 gap-2">
              {KINDS.map((item) => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => setKind(item.value)}
                  className={`rounded-2xl border px-3 py-2.5 text-left text-xs ${
                    kind === item.value
                      ? "border-sky-500 bg-sky-50 text-sky-900"
                      : "border-slate-200 bg-white text-slate-600"
                  }`}
                >
                  <span className="font-bold">{item.label}</span>
                  <span className="mt-0.5 block text-[11px] font-medium text-slate-400">{item.hint}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-700">Caption *</label>
            <input
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="e.g. Match highlights, garden build, rehearsal film"
              className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm"
            />
          </div>

          <div>
            <label className="mb-1 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-700">
              <Link2 className="h-3.5 w-3.5" /> Public watch link
            </label>
            <input
              value={link}
              onChange={(e) => setLink(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=… or a photo URL"
              className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm"
            />
            <p className="mt-1 text-[11px] text-slate-400">Best for films hosted on YouTube or Vimeo.</p>
          </div>

          <div>
            <label className="mb-1 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-700">
              {kind === "image" ? <Image className="h-3.5 w-3.5" /> : <Film className="h-3.5 w-3.5" />}
              Or attach a file
            </label>
            <label className="flex cursor-pointer flex-col items-center rounded-2xl border-2 border-dashed border-sky-200 bg-sky-50/50 px-4 py-6 text-center hover:bg-sky-50">
              <p className="text-xs font-semibold text-slate-700">
                {file ? file.name : "Click to attach mp4, mov, jpg, png, pdf"}
              </p>
              <input
                type="file"
                accept="video/*,image/*,.pdf,.mp4,.mov,.webm"
                className="hidden"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />
            </label>
          </div>

          <div className="flex justify-end gap-3 border-t border-slate-100 pt-4">
            <button type="button" onClick={onClose} className="rounded-full px-4 py-2 text-xs font-semibold text-slate-600">
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-1.5 rounded-full bg-sky-600 px-6 py-2.5 text-xs font-bold text-white shadow-md disabled:opacity-50"
            >
              {submitting ? "Publishing…" : "Publish to campus"}
              {!submitting && <ArrowRight className="h-3.5 w-3.5" />}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
