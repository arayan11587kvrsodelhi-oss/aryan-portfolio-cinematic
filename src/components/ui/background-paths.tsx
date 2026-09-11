function makePath(i: number, position: number) {
  const a = 380 - i * 15 * position;
  const b = 189 + i * 16;
  const c = 312 - i * 14 * position;
  const d = 216 - i * 14;
  const e = 152 - i * 13 * position;
  const f = 343 - i * 14;
  const g = 616 - i * 13 * position;
  const h = 470 - i * 14;
  const j = 684 - i * 12 * position;
  const k = 875 - i * 14;

  return `M-${a} -${b}C-${a} -${b} -${c} ${d} ${e} ${f}C${g} ${h} ${j} ${k} ${j} ${k}`;
}

export function HeroAnimatedBackground({ className = "" }: { className?: string }) {
  const paths = [1, -1].flatMap((position, setIndex) =>
    Array.from({ length: 9 }, (_, i) => ({
      id: `${position}-${i}`,
      d: makePath(i, position),
      width: 0.72 + i * 0.055,
      alt: setIndex === 1,
      opacity: 0.34 + (i % 3) * 0.035,
    }))
  );

  return (
    <div
      className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}
      aria-hidden="true"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(25,184,154,0.14),transparent_30%),radial-gradient(circle_at_84%_18%,rgba(10,70,80,0.17),transparent_34%),linear-gradient(135deg,#03100d_0%,#041611_46%,#071c2b_100%)]" />

      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 696 316"
        fill="none"
        preserveAspectRatio="xMidYMid slice"
      >
        {paths.map((path) => (
          <path
            key={path.id}
            d={path.d}
            pathLength={1}
            className={`hero-path-flow${path.alt ? " hero-path-flow--alt" : ""}`}
            stroke={path.alt ? "#4FD1C5" : "#19B89A"}
            strokeWidth={path.width}
            strokeLinecap="round"
            opacity={path.opacity}
          />
        ))}
      </svg>

      <div className="absolute inset-0 bg-[radial-gradient(ellipse_90%_75%_at_50%_42%,transparent_34%,rgba(3,7,6,0.42)_100%)]" />
    </div>
  );
}
