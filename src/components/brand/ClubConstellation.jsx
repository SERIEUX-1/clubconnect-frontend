export function ClubConstellation({ className = "" }) {
  return (
    <svg
      viewBox="0 0 560 180"
      className={className}
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M48 118 C120 40, 220 36, 280 88 C340 140, 430 132, 512 62"
        stroke="rgba(30,58,95,0.22)"
        strokeWidth="1.25"
      />
      <path
        d="M72 70 C160 120, 250 128, 340 74 C410 32, 470 48, 520 96"
        stroke="rgba(224,122,95,0.28)"
        strokeWidth="1.25"
      />
      {[
        [48, 118],
        [118, 62],
        [198, 52],
        [280, 88],
        [372, 124],
        [456, 86],
        [512, 62],
        [72, 70],
        [340, 74],
        [520, 96],
      ].map(([x, y], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r={i % 3 === 0 ? 6 : 4} fill={i % 2 ? "#e07a5f" : "#1d4e89"} opacity="0.85" />
          <circle cx={x} cy={y} r={i % 3 === 0 ? 11 : 8} stroke="rgba(255,255,255,0.7)" />
        </g>
      ))}
    </svg>
  );
}
