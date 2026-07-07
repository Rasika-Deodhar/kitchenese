import { useState, useEffect } from "react";
import { COOK_LOADING_MESSAGES, EAT_OUT_LOADING_MESSAGES } from "../labels";

export default function LoadingState({ mode }) {
  const messages = mode === "cook" ? COOK_LOADING_MESSAGES : EAT_OUT_LOADING_MESSAGES;
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % messages.length);
    }, 1400);
    return () => clearInterval(id);
  }, [messages]);

  return (
    <div className="loading-state">
      <div className="loading-state__spinner" aria-hidden="true">
        🌶️
      </div>
      <p className="loading-state__message">{messages[index]}</p>
      <div className="loading-state__bar" aria-hidden="true">
        <div style={{ background: "#FFC93C" }} />
        <div style={{ background: "#FF9F1C" }} />
        <div style={{ background: "var(--border)" }} />
        <div style={{ background: "var(--border)" }} />
      </div>
    </div>
  );
}
