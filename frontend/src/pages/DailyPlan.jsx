import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useLocalStorage from "../hooks/useLocalStorage";
import Celebration from "../components/Celebration";
import ActivityTimer from "../components/ActivityTimer";
import EmptyState from "../components/EmptyState";
import { STUDY_TARGET_MIN, CROCHET_TARGET_MIN } from "../utils/constants";
import { todayString } from "../utils/dates";
import { formatMinutes } from "../utils/format";

function GoalCard({ title, minutes, target, color, onAdd }) {
  const percent = Math.min(100, Math.round((minutes / target) * 100));

  return (
    <div className="goal-card">
      <div className="goal-label">{title}</div>
      <div className="goal-value">
        {formatMinutes(minutes)}
        <span> / {formatMinutes(target)}</span>
      </div>

      <div
        className="bar"
        role="progressbar"
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="bar-fill"
          style={{ width: `${percent}%`, background: color }}
        />
      </div>

      <div className="goal-buttons">
        <button
          className="mini-btn"
          onClick={() => onAdd(-15)}
          aria-label={`Subtract 15 minutes from ${title}`}
        >
          −15
        </button>
        <button
          className="mini-btn"
          onClick={() => onAdd(15)}
          aria-label={`Add 15 minutes to ${title}`}
        >
          +15
        </button>
        <button
          className="mini-btn"
          onClick={() => onAdd(30)}
          aria-label={`Add 30 minutes to ${title}`}
        >
          +30
        </button>
        <button
          className="mini-btn"
          onClick={() => onAdd(60)}
          aria-label={`Add 60 minutes to ${title}`}
        >
          +60
        </button>
      </div>
    </div>
  );
}

export default function DailyPlan() {
  const today = todayString();
  const navigate = useNavigate();
  const [logs, setLogs] = useLocalStorage("dailyLogs", {});
  const [tasks, setTasks] = useLocalStorage("tasks", []);
  const [celebration, setCelebration] = useState(null);

  const todayLog = logs[today] || { studyMinutes: 0, crochetMinutes: 0 };

  function addMinutes(field, amount) {
    const prev = todayLog[field] || 0;
    const target =
      field === "studyMinutes" ? STUDY_TARGET_MIN : CROCHET_TARGET_MIN;
    const newValue = Math.max(0, prev + amount);

    // Subtle celebration when reaching the goal for the first time today
    const sessionKey = `celebrated_${today}_${field}`;
    if (
      prev < target &&
      newValue >= target &&
      !sessionStorage.getItem(sessionKey)
    ) {
      sessionStorage.setItem(sessionKey, "true");
      setCelebration(
        field === "studyMinutes"
          ? "🎉 Daily study goal reached (240 min)! Wonderful focus!"
          : "🧶 Daily crochet goal reached (60 min)! Beautiful work!"
      );
    }

    setLogs({ ...logs, [today]: { ...todayLog, [field]: newValue } });
  }

  function toggleTask(id) {
    setTasks(tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  }

  const todaysTasks = tasks.filter((t) => t.date === today);
  const doneCount = todaysTasks.filter((t) => t.done).length;

  const prettyDate = new Date().toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return (
    <div>
      {celebration && (
        <Celebration
          message={celebration}
          onDone={() => setCelebration(null)}
        />
      )}

      <h1>Daily Plan</h1>
      <p className="subtitle">{prettyDate}</p>

      <div className="goal-grid">
        <GoalCard
          title="Study (outside lectures)"
          minutes={todayLog.studyMinutes}
          target={STUDY_TARGET_MIN}
          color="var(--rose)"
          onAdd={(amount) => addMinutes("studyMinutes", amount)}
        />
        <GoalCard
          title="Crochet hour"
          minutes={todayLog.crochetMinutes}
          target={CROCHET_TARGET_MIN}
          color="var(--rose-dark)"
          onAdd={(amount) => addMinutes("crochetMinutes", amount)}
        />
      </div>

      {/* Real-time Focus Timer for Study & Crochet */}
      <ActivityTimer
        onLogMinutes={(field, mins) => addMinutes(field, mins)}
      />

      <h2 className="section-title">
        Today's tasks ({doneCount}/{todaysTasks.length} done)
      </h2>

      <div className="task-list">
        {todaysTasks.length === 0 ? (
          <EmptyState
            icon="☕"
            title="All clear for today"
            message="No tasks scheduled for today yet. Take a breather or add a new task."
            actionLabel="+ Add a task on Tasks page"
            onAction={() => navigate("/tasks")}
          />
        ) : (
          todaysTasks.map((t) => (
            <div key={t.id} className={t.done ? "task done" : "task"}>
              <input
                type="checkbox"
                checked={t.done}
                onChange={() => toggleTask(t.id)}
                aria-label={`Mark "${t.title}" as ${
                  t.done ? "incomplete" : "complete"
                }`}
              />
              <div className="task-main">
                <span className="task-title">{t.title}</span>
              </div>
              <span className={`chip chip-${t.category.toLowerCase()}`}>
                {t.category}
                {t.subtype && ` · ${t.subtype}`}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
