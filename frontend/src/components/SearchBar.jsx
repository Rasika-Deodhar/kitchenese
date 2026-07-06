import { useState, useEffect } from "react";

export default function SearchBar({ value, onSubmit, submitLabel, disabled }) {
  const [text, setText] = useState(value || "");

  useEffect(() => {
    setText(value || "");
  }, [value]);

  function handleSubmit(e) {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed || trimmed.length > 120) return;
    onSubmit(trimmed);
  }

  return (
    <form className="search-bar" onSubmit={handleSubmit}>
      <input
        type="text"
        className="search-bar__input"
        placeholder="Type a tech concept… e.g. recursion, load balancer, vector database"
        value={text}
        maxLength={120}
        onChange={(e) => setText(e.target.value)}
        disabled={disabled}
      />
      <button
        type="submit"
        className="search-bar__submit"
        disabled={disabled || !text.trim()}
      >
        {submitLabel}
      </button>
    </form>
  );
}
