const LEVEL_NAMES = {
  1: "Beginner",
  2: "Intermediate",
  3: "Advanced",
  4: "Expert",
};

const RAMP = ["#FFC93C", "#FF9F1C", "#F25C3B", "#D7263D"];

export default function SpiceMeter({ level }) {
  const clamped = Math.min(4, Math.max(1, level));
  return (
    <div className="heat-box">
      <div className="heat-box__row">
        <span className="heat-box__label">Concept Heat</span>
        <span className="heat-box__value">
          <span aria-hidden="true">{"🌶️".repeat(clamped)}</span>
          <span className="heat-box__level">
            {LEVEL_NAMES[clamped]} · {clamped}/4
          </span>
        </span>
      </div>
      <div className="heat-box__bar" title={`Spice level: ${LEVEL_NAMES[clamped]}`}>
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="heat-box__segment"
            style={{ background: i <= clamped ? RAMP[i - 1] : "var(--border)" }}
          />
        ))}
      </div>
    </div>
  );
}
