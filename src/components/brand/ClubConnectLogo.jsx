export function ClubConnectMark({ size = 40, className = "" }) {
  return (
    <img
      src="/brand/clubconnect-logo.png"
      alt="ClubConnect"
      width={size}
      height={size}
      className={`clubconnect-mark rounded-[22%] object-cover ${className}`}
      style={{ width: size, height: size }}
    />
  );
}

export function ClubConnectLogo({ size = 40, wordmark = true, stacked = false }) {
  return (
    <div className={`flex items-center ${stacked ? "flex-col gap-3 text-center" : "gap-2.5"}`}>
      <ClubConnectMark size={size} />
      {wordmark && (
        <div className={stacked ? "" : "flex flex-col leading-none"}>
          <span className={`font-display tracking-tight text-[#1e3a5f] ${stacked ? "text-4xl" : "text-lg font-semibold"}`}>
            ClubConnect
          </span>
          {!stacked && (
            <span className="text-[10px] mt-0.5 font-semibold text-sky-600 tracking-wide uppercase">
              Licensed campuses
            </span>
          )}
        </div>
      )}
    </div>
  );
}

function campusLogoSrc(institution, { compact = false, invert = false } = {}) {
  const url = institution?.logo_url || "";
  if (!url) return "";
  if (/alche-(logo|mark)/i.test(url) || /\/institutions\/alche/i.test(url)) {
    if (invert) return "/institutions/alche-logo-white.png";
    if (compact) return "/institutions/alche-logo-compact.png";
    return "/institutions/alche-logo.png";
  }
  return url;
}

export function InstitutionMark({
  institution,
  size = 36,
  height,
  compact = false,
  invert = false,
  className = "",
}) {
  if (!institution) return null;
  const markHeight = height || size;
  const src = campusLogoSrc(institution, { compact, invert });
  const shortName = institution.short_name || institution.name || "Campus";
  if (src) {
    return (
      <img
        src={src}
        alt={shortName}
        className={`object-contain object-left bg-transparent ${className}`}
        style={{
          height: markHeight,
          width: "auto",
          maxWidth: compact ? markHeight * 5.2 : markHeight * 3.2,
        }}
      />
    );
  }
  return (
    <div
      className={`rounded-xl flex items-center justify-center text-white font-bold text-[10px] tracking-wide ${className}`}
      style={{
        width: markHeight,
        height: markHeight,
        background: institution.primary_color || "#D00D2D",
      }}
      aria-label={shortName}
    >
      {shortName.slice(0, 4).toUpperCase()}
    </div>
  );
}
