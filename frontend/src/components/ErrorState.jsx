export default function ErrorState({ message, onRetry }) {
  return (
    <div className="error-state">
      <p className="error-state__message">⚠️ {message}</p>
      {onRetry && (
        <button type="button" className="error-state__retry" onClick={onRetry}>
          Try again
        </button>
      )}
    </div>
  );
}
