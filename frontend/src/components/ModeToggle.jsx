export default function ModeToggle({ mode, onChange, disabled }) {
  return (
    <div className="mode-toggle" role="group" aria-label="Mode">
      <button
        type="button"
        className={mode === "cook" ? "mode-toggle__btn mode-toggle__btn--active" : "mode-toggle__btn"}
        onClick={() => onChange("cook")}
        disabled={disabled}
      >
        🍳 I cook
      </button>
      <button
        type="button"
        className={mode === "eat_out" ? "mode-toggle__btn mode-toggle__btn--active" : "mode-toggle__btn"}
        onClick={() => onChange("eat_out")}
        disabled={disabled}
      >
        🍽️ I mostly eat out
      </button>
    </div>
  );
}
