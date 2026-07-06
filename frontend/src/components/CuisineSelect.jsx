import { CUISINES } from "../labels";

export default function CuisineSelect({ value, onChange, disabled }) {
  return (
    <select
      className="cuisine-select"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      aria-label="Cuisine"
    >
      {CUISINES.map((c) => (
        <option key={c} value={c}>
          {c === "Surprise me" ? "🎲 Surprise me" : c}
        </option>
      ))}
    </select>
  );
}
