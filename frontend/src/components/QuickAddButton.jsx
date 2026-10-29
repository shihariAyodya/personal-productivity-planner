import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

// Quick Add button and global keyboard shortcut:
// - On mobile: Floating "+" button in the corner to quickly focus/create a task
// - On desktop: Pressing "N" focuses the new task field (when not typing in an input)
export default function QuickAddButton() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    function handleKeyDown(e) {
      // Ignore if user is already typing in an input, textarea, or select
      const activeTag = document.activeElement?.tagName?.toLowerCase();
      if (
        activeTag === "input" ||
        activeTag === "textarea" ||
        activeTag === "select" ||
        document.activeElement?.isContentEditable
      ) {
        return;
      }

      // Check for "N" key (without Ctrl/Alt/Meta modifiers)
      if (
        (e.key === "n" || e.key === "N") &&
        !e.ctrlKey &&
        !e.metaKey &&
        !e.altKey
      ) {
        e.preventDefault();
        focusTaskInput();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [location.pathname]);

  function focusTaskInput() {
    if (location.pathname === "/tasks") {
      const input = document.getElementById("new-task-input");
      if (input) {
        input.focus();
        input.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    } else {
      // Navigate to tasks page with focus parameter
      navigate("/tasks?focus=true");
    }
  }

  return (
    <button
      type="button"
      className="floating-quick-add-btn"
      onClick={focusTaskInput}
      aria-label="Quick add new task"
      title="Quick add new task"
    >
      +
    </button>
  );
}

