import useLocalStorage from "../hooks/useLocalStorage";
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
        <button className="mini-btn" onClick={() => onAdd(-15)}>
          −15
        </button>
        <button className="mini-btn" onClick={() => onAdd(15)}>
          +15
        </button>
        <button className="mini-btn" onClick={() => onAdd(30)}>
          +30
        </button>
        <button className="mini-btn" onClick={() => onAdd(60)}>
          +60
        </button>
      </div>
    </div>
  );
}

export default function DailyPlan() {
  const today = todayString();
  const [logs, setLogs] = useLocalStorage("dailyLogs", {});
  const [tasks, setTasks] = useLocalStorage("tasks", []);

  const todayLog = logs[today] || { studyMinutes: 0, crochetMinutes: 0 };

  function addMinutes(field, amount) {
    const newValue = Math.max(0, todayLog[field] + amount);
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

      <h2 className="section-title">
        Today's tasks ({doneCount}/{todaysTasks.length} done)
      </h2>

      <div className="task-list">
        {todaysTasks.length === 0 && (
          <p className="empty">
            No tasks for today. Add one on the Tasks page with today's date.
          </p>
        )}

        {todaysTasks.map((t) => (
          <div key={t.id} className={t.done ? "task done" : "task"}>
            <input
              type="checkbox"
              checked={t.done}
              onChange={() => toggleTask(t.id)}
            />
            <div className="task-main">
              <span className="task-title">{t.title}</span>
            </div>
            <span className={`chip chip-${t.category.toLowerCase()}`}>
              {t.category}
              {t.subtype && ` · ${t.subtype}`}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}