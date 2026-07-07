import { CUISINES } from "../labels";

export default function CuisineSelect({ value, onChange, disabled }) {
  return (
    <div className="cuisine-pills" role="group" aria-label="Cuisine">
      {CUISINES.map((c) => (
        <button
          key={c}
          type="button"
          className={c === value ? "cuisine-pill cuisine-pill--active" : "cuisine-pill"}
          onClick={() => onChange(c)}
          disabled={disabled}
        >
          {c === "Surprise me" ? "🎲 Surprise me" : c}
        </button>
      ))}
    </div>
  );
}
