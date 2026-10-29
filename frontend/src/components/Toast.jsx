import { createContext, useContext, useState, useRef, useCallback } from "react";

// Context to provide toast notifications anywhere in the app
const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null);
  const timeoutRef = useRef(null);

  // Trigger a new toast notification.
  // Can be a simple string ("Task added") or an object with an Undo action:
  // showToast({ message: "Task deleted", actionLabel: "Undo", onAction: () => ... })
  const showToast = useCallback((options) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    const toastData =
      typeof options === "string" ? { message: options } : options;
    setToast(toastData);

    const duration = toastData.duration || 4500;
    timeoutRef.current = setTimeout(() => {
      setToast(null);
    }, duration);
  }, []);

  const hideToast = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setToast(null);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}
      {toast && (
        <div className="toast-container" role="status" aria-live="polite">
          <div className="toast-card">
            <span className="toast-message">{toast.message}</span>
            {toast.onAction && (
              <button
                type="button"
                className="toast-action-btn"
                onClick={() => {
                  toast.onAction();
                  hideToast();
                }}
              >
                {toast.actionLabel || "Undo"}
              </button>
            )}
            <button
              type="button"
              className="toast-close-btn"
              onClick={hideToast}
              aria-label="Dismiss notification"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}

