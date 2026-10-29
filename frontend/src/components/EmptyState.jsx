// Friendly, accessible empty state with a helpful call-to-action button
export default function EmptyState({
  icon = "✦",
  title,
  message,
  actionLabel,
  onAction,
}) {
  return (
    <div className="empty-state">
      <div className="empty-state-icon" aria-hidden="true">
        {icon}
      </div>
      {title && <h3 className="empty-state-title">{title}</h3>}
      <p className="empty-state-msg">{message}</p>
      {actionLabel && onAction && (
        <button
          type="button"
          className="mini-btn empty-state-btn"
          onClick={onAction}
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}

