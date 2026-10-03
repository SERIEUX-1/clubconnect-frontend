function youtubeId(url) {
  const match = String(url || "").match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([A-Za-z0-9_-]{6,})/
  );
  return match ? match[1] : null;
}

function vimeoId(url) {
  const match = String(url || "").match(/vimeo\.com\/(?:video\/)?(\d+)/);
  return match ? match[1] : null;
}

export function mediaKind(item) {
  const url = item?.url || item?.external_link || item?.file_url || "";
  if (item?.is_video || youtubeId(url) || vimeoId(url) || /\.(mp4|webm|mov)(\?|$)/i.test(url)) {
    if (youtubeId(url)) return { kind: "youtube", src: `https://www.youtube-nocookie.com/embed/${youtubeId(url)}` };
    if (vimeoId(url)) return { kind: "vimeo", src: `https://player.vimeo.com/video/${vimeoId(url)}` };
    return { kind: "file", src: url };
  }
  if (item?.is_image || /\.(jpg|jpeg|png|webp|gif)(\?|$)/i.test(url)) {
    return { kind: "image", src: url };
  }
  return url ? { kind: "link", src: url } : null;
}

export function PublishedWatch({ item, title }) {
  const resolved = mediaKind(item);
  if (!resolved) return null;
  const caption = item.caption || title || "Published media";

  if (resolved.kind === "youtube" || resolved.kind === "vimeo") {
    return (
      <figure className="overflow-hidden rounded-2xl border border-sky-100 bg-slate-950 shadow-sm">
        <div className="aspect-video w-full">
          <iframe
            title={caption}
            src={resolved.src}
            className="h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
        <figcaption className="bg-white px-4 py-2.5 text-xs font-medium text-slate-600">{caption}</figcaption>
      </figure>
    );
  }

  if (resolved.kind === "file") {
    return (
      <figure className="overflow-hidden rounded-2xl border border-sky-100 bg-slate-950 shadow-sm">
        <video className="aspect-video w-full" controls preload="metadata" src={resolved.src}>
          Your browser cannot play this video.
        </video>
        <figcaption className="bg-white px-4 py-2.5 text-xs font-medium text-slate-600">{caption}</figcaption>
      </figure>
    );
  }

  if (resolved.kind === "image") {
    return (
      <figure className="overflow-hidden rounded-2xl border border-sky-100 bg-white shadow-sm">
        <img src={resolved.src} alt={caption} className="max-h-[420px] w-full object-cover" />
        <figcaption className="px-4 py-2.5 text-xs font-medium text-slate-600">{caption}</figcaption>
      </figure>
    );
  }

  return (
    <a
      href={resolved.src}
      target="_blank"
      rel="noreferrer"
      className="block rounded-2xl border border-sky-100 bg-white px-4 py-3 text-sm font-semibold text-sky-700 hover:bg-sky-50"
    >
      Open published file — {caption}
    </a>
  );
}
