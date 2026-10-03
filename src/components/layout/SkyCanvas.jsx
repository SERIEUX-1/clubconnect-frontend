export function EternalSun() {
  return (
    <div className="eternal-sun" aria-hidden="true">
      <div className="eternal-sun__atmosphere" />
      <div className="eternal-sun__bloom" />
      <div className="eternal-sun__disc">
        <img src="/brand/sun-disc.jpg" alt="" />
        <span className="eternal-sun__glare" />
      </div>
    </div>
  );
}

export function SkyCanvas() {
  const stars = [
    { top: "7%", left: "18%" },
    { top: "11%", left: "34%" },
    { top: "6%", left: "52%" },
    { top: "13%", left: "63%" },
    { top: "16%", left: "12%" },
    { top: "4%", left: "41%" },
  ];

  return (
    <div className="sky-canvas" aria-hidden="true">
      <div className="sky-canvas__wash" />
      <div className="sky-canvas__aurora" />
      {stars.map((star, i) => (
        <span
          key={i}
          className="sky-canvas__star"
          style={{ top: star.top, left: star.left, animationDelay: `${i * 0.55}s` }}
        />
      ))}
      <div className="sky-canvas__cloud sky-canvas__cloud--a" />
      <div className="sky-canvas__cloud sky-canvas__cloud--b" />
      <div className="sky-canvas__cloud sky-canvas__cloud--c" />
      <div className="sky-canvas__grain" />
    </div>
  );
}
