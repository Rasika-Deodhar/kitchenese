export default function HistoryChips({ history, onSelect, disabled }) {
  if (!history.length) return null;
  return (
    <div className="history-chips">
      <span className="history-chips__label">Recent:</span>
      {history.map((item) => (
        <button
          key={item}
          type="button"
          className="chip chip--history"
          onClick={() => onSelect(item)}
          disabled={disabled}
        >
          {item}
        </button>
      ))}
    </div>
  );
}
