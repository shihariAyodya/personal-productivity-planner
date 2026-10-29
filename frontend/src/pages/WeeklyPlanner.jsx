import { useState, useEffect } from "react";
import useLocalStorage from "../hooks/useLocalStorage";
import { useToast } from "../components/Toast";
import { getWeekDates, toDateString, todayString } from "../utils/dates";
import { formatMinutes } from "../utils/format";

export default function WeeklyPlanner() {
  const [weekOffset, setWeekOffset] = useState(0);
  const [tasks, setTasks] = useLocalStorage("tasks", []);
  const [logs] = useLocalStorage("dailyLogs", {});
  const { showToast } = useToast();

  // Drag and drop state
  const [draggedTaskId, setDraggedTaskId] = useState(null);
  const [dragOverDate, setDragOverDate] = useState(null);

  // Non-drag date move modal state (for mobile & keyboard access)
  const [movingTask, setMovingTask] = useState(null);
  const [customMoveDate, setCustomMoveDate] = useState("");

  const today = todayString();
  const days = getWeekDates(weekOffset);

  // Close move dialog on Escape
  useEffect(() => {
    function onKeyDown(e) {
      if (e.key === "Escape" && movingTask) {
        setMovingTask(null);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [movingTask]);

  function toggleTask(id) {
    setTasks(tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  }

  // Move task to a new date with an Undo toast notification
  function moveTask(taskId, newDateStr) {
    const task = tasks.find((t) => t.id === taskId);
    if (!task || task.date === newDateStr) return;

    const originalTasks = tasks;
    setTasks(
      tasks.map((t) => (t.id === taskId ? { ...t, date: newDateStr } : t))
    );

    const formattedTarget = new Date(
      newDateStr + "T00:00:00"
    ).toLocaleDateString("en-GB", {
      weekday: "short",
      day: "numeric",
      month: "short",
    });

    showToast({
      message: `Moved "${task.title}" to ${formattedTarget}`,
      actionLabel: "Undo",
      onAction: () => {
        setTasks(originalTasks);
        showToast("Task moved back");
      },
    });
  }

  // Drag event handlers
  function handleDragStart(e, taskId) {
    e.dataTransfer.setData("text/plain", String(taskId));
    e.dataTransfer.effectAllowed = "move";
    setDraggedTaskId(taskId);
  }

  function handleDragEnd() {
    setDraggedTaskId(null);
    setDragOverDate(null);
  }

  function handleDragOver(e, dateStr) {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (dragOverDate !== dateStr) {
      setDragOverDate(dateStr);
    }
  }

  function handleDrop(e, dateStr) {
    e.preventDefault();
    const taskIdStr = e.dataTransfer.getData("text/plain");
    const taskId = Number(taskIdStr) || draggedTaskId;
    if (taskId) {
      moveTask(taskId, dateStr);
    }
    setDraggedTaskId(null);
    setDragOverDate(null);
  }

  function openMoveModal(task) {
    setMovingTask(task);
    setCustomMoveDate(task.date);
  }

  function handleCustomDateMove(e) {
    e.preventDefault();
    if (movingTask && customMoveDate) {
      moveTask(movingTask.id, customMoveDate);
      setMovingTask(null);
    }
  }

  const rangeLabel =
    days[0].toLocaleDateString("en-GB", { day: "numeric", month: "short" }) +
    " – " +
    days[6].toLocaleDateString("en-GB", { day: "numeric", month: "short" });

  const weekDateStrings = days.map(toDateString);
  const weekTasks = tasks.filter((t) => weekDateStrings.includes(t.date));
  const weekDone = weekTasks.filter((t) => t.done).length;
  const weekStudy = weekDateStrings.reduce(
    (sum, d) => sum + (logs[d]?.studyMinutes || 0),
    0
  );
  const weekCrochet = weekDateStrings.reduce(
    (sum, d) => sum + (logs[d]?.crochetMinutes || 0),
    0
  );

  return (
    <div>
      <h1>Weekly Planner</h1>

      <div className="week-nav">
        <button
          className="mini-btn"
          onClick={() => setWeekOffset(weekOffset - 1)}
          aria-label="View previous week"
        >
          ← Previous
        </button>
        <strong>{rangeLabel}</strong>
        <button
          className="mini-btn"
          onClick={() => setWeekOffset(weekOffset + 1)}
          aria-label="View next week"
        >
          Next →
        </button>
        {weekOffset !== 0 && (
          <button
            className="mini-btn"
            onClick={() => setWeekOffset(0)}
            aria-label="Jump to current week"
          >
            This week
          </button>
        )}
      </div>

      <p className="subtitle">
        Tasks done: {weekDone}/{weekTasks.length} · Study: {formatMinutes(weekStudy)} ·
        Crochet: {formatMinutes(weekCrochet)}
      </p>

      <div className="week-scroll">
        <div className="week-grid">
          {days.map((d) => {
            const dateStr = toDateString(d);
            const dayTasks = tasks.filter((t) => t.date === dateStr);
            const log = logs[dateStr] || { studyMinutes: 0, crochetMinutes: 0 };
            const isToday = dateStr === today;
            const isDragOver = dragOverDate === dateStr;

            return (
              <div
                key={dateStr}
                className={`day-card ${isToday ? "today" : ""} ${
                  isDragOver ? "drag-over" : ""
                }`}
                onDragOver={(e) => handleDragOver(e, dateStr)}
                onDragLeave={() => {
                  if (dragOverDate === dateStr) setDragOverDate(null);
                }}
                onDrop={(e) => handleDrop(e, dateStr)}
              >
                <div className="day-head">
                  <span className="day-name">
                    {d.toLocaleDateString("en-GB", { weekday: "short" })}
                  </span>
                  <span className="day-num">{d.getDate()}</span>
                </div>

                <div className="day-times">
                  <span>Study {formatMinutes(log.studyMinutes)}</span>
                  <span>Crochet {formatMinutes(log.crochetMinutes)}</span>
                </div>

                {dayTasks.length === 0 && (
                  <p
                    className="empty"
                    style={{ fontSize: "13px", padding: "10px 0" }}
                  >
                    No tasks
                  </p>
                )}

                {dayTasks.map((t) => (
                  <div
                    key={t.id}
                    className={`mini-task-row ${t.done ? "done" : ""} ${
                      draggedTaskId === t.id ? "dragging" : ""
                    }`}
                    draggable="true"
                    onDragStart={(e) => handleDragStart(e, t.id)}
                    onDragEnd={handleDragEnd}
                    title="Drag to another day or click 📅 to move"
                  >
                    <label className="mini-task-label">
                      <input
                        type="checkbox"
                        checked={t.done}
                        onChange={() => toggleTask(t.id)}
                        aria-label={`Mark "${t.title}" as ${
                          t.done ? "incomplete" : "complete"
                        }`}
                      />
                      <span className="mini-task-title">
                        {t.title}
                        <span
                          className={`dot dot-${t.category.toLowerCase()}`}
                        />
                      </span>
                    </label>

                    {/* Non-drag button for mobile and accessible date changing */}
                    <button
                      type="button"
                      className="move-task-btn"
                      onClick={() => openMoveModal(t)}
                      aria-label={`Move "${t.title}" to another day`}
                      title="Move to another date"
                    >
                      📅
                    </button>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>

      {/* Accessible Date Move Modal for Mobile & Keyboard Users */}
      {movingTask && (
        <div
          className="move-modal-backdrop"
          onClick={() => setMovingTask(null)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="move-modal-title"
        >
          <div className="move-modal" onClick={(e) => e.stopPropagation()}>
            <h3 id="move-modal-title">Move Task</h3>
            <p>
              Select a new date for "<strong>{movingTask.title}</strong>":
            </p>

            <div className="move-days-grid">
              {days.map((d) => {
                const dayDateStr = toDateString(d);
                const isCurrent = movingTask.date === dayDateStr;
                return (
                  <button
                    key={dayDateStr}
                    type="button"
                    className={`move-day-choice ${isCurrent ? "current" : ""}`}
                    onClick={() => {
                      moveTask(movingTask.id, dayDateStr);
                      setMovingTask(null);
                    }}
                  >
                    {d.toLocaleDateString("en-GB", {
                      weekday: "short",
                      day: "numeric",
                    })}
                    {isCurrent ? " (Current)" : ""}
                  </button>
                );
              })}
            </div>

            <form onSubmit={handleCustomDateMove} className="move-custom-date">
              <label htmlFor="custom-move-input">Or choose another date:</label>
              <input
                id="custom-move-input"
                type="date"
                value={customMoveDate}
                onChange={(e) => setCustomMoveDate(e.target.value)}
                required
              />
              <button type="submit" className="btn" style={{ minHeight: "44px" }}>
                Move to date
              </button>
            </form>

            <div className="move-modal-actions">
              <button
                type="button"
                className="mini-btn"
                onClick={() => setMovingTask(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
