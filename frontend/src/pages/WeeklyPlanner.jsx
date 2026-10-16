import { useState } from "react";
import useLocalStorage from "../hooks/useLocalStorage";
import { getWeekDates, toDateString, todayString } from "../utils/dates";
import { formatMinutes } from "../utils/format";

export default function WeeklyPlanner() {
  const [weekOffset, setWeekOffset] = useState(0);
  const [tasks, setTasks] = useLocalStorage("tasks", []);
  const [logs] = useLocalStorage("dailyLogs", {});

  const today = todayString();
  const days = getWeekDates(weekOffset);

  function toggleTask(id) {
    setTasks(tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
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
        <button className="mini-btn" onClick={() => setWeekOffset(weekOffset - 1)}>
          ← Previous
        </button>
        <strong>{rangeLabel}</strong>
        <button className="mini-btn" onClick={() => setWeekOffset(weekOffset + 1)}>
          Next →
        </button>
        {weekOffset !== 0 && (
          <button className="mini-btn" onClick={() => setWeekOffset(0)}>
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

            return (
              <div
                key={dateStr}
                className={isToday ? "day-card today" : "day-card"}
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

                {dayTasks.length === 0 && <p className="empty">No tasks</p>}

                {dayTasks.map((t) => (
                  <label
                    key={t.id}
                    className={t.done ? "mini-task done" : "mini-task"}
                  >
                    <input
                      type="checkbox"
                      checked={t.done}
                      onChange={() => toggleTask(t.id)}
                    />
                    <span>
                      {t.title}
                      <span className={`dot dot-${t.category.toLowerCase()}`} />
                    </span>
                  </label>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}