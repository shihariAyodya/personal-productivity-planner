import { useState } from "react";
import useLocalStorage from "../hooks/useLocalStorage";
import { CATEGORIES, SHIZELLE_SUBTYPES } from "../utils/constants";
import { todayString } from "../utils/dates";

export default function Tasks() {
  const [tasks, setTasks] = useLocalStorage("tasks", []);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [subtype, setSubtype] = useState(SHIZELLE_SUBTYPES[0]);
  const [date, setDate] = useState(todayString());
  const [filter, setFilter] = useState("All");

  function addTask(e) {
    e.preventDefault();
    if (!title.trim()) return;

    const newTask = {
      id: Date.now(),
      title: title.trim(),
      category,
      subtype: category === "Shizelle" ? subtype : "",
      date,
      done: false,
    };

    setTasks([newTask, ...tasks]);
    setTitle("");
  }

  function toggleTask(id) {
    setTasks(tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  }

  function deleteTask(id) {
    setTasks(tasks.filter((t) => t.id !== id));
  }

  const visibleTasks =
    filter === "All" ? tasks : tasks.filter((t) => t.category === filter);

  return (
    <div>
      <h1>Tasks</h1>

      <form className="task-form" onSubmit={addTask}>
        <input
          type="text"
          placeholder="What needs doing?"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        {category === "Shizelle" && (
          <select value={subtype} onChange={(e) => setSubtype(e.target.value)}>
            {SHIZELLE_SUBTYPES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        )}

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />

        <button type="submit" className="btn">
          + Add task
        </button>
      </form>

      <div className="filters">
        {["All", ...CATEGORIES].map((c) => (
          <button
            key={c}
            className={filter === c ? "filter active" : "filter"}
            onClick={() => setFilter(c)}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="task-list">
        {visibleTasks.length === 0 && (
          <p className="empty">No tasks here yet.</p>
        )}

        {visibleTasks.map((t) => (
          <div key={t.id} className={t.done ? "task done" : "task"}>
            <input
              type="checkbox"
              checked={t.done}
              onChange={() => toggleTask(t.id)}
            />
            <div className="task-main">
              <span className="task-title">{t.title}</span>
              <span className="task-date">{t.date}</span>
            </div>
            <span className={`chip chip-${t.category.toLowerCase()}`}>
              {t.category}
              {t.subtype && ` · ${t.subtype}`}
            </span>
            <button
              className="delete"
              onClick={() => deleteTask(t.id)}
              aria-label="Delete task"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}