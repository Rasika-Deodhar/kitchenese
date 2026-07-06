const LEVEL_NAMES = {
  1: "Beginner",
  2: "Intermediate",
  3: "Advanced",
  4: "Expert",
};

export default function SpiceMeter({ level }) {
  const clamped = Math.min(4, Math.max(1, level));
  return (
    <div className="spice-meter" title={`Spice level: ${LEVEL_NAMES[clamped]}`}>
      <span className="spice-meter__peppers" aria-hidden="true">
        {[1, 2, 3, 4].map((i) => (
          <span key={i} className={i <= clamped ? "pepper pepper--lit" : "pepper"}>
            🌶️
          </span>
        ))}
      </span>
      <span className="spice-meter__label">{LEVEL_NAMES[clamped]}</span>
    </div>
  );
}
