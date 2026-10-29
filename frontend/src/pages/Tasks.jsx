import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import useLocalStorage from "../hooks/useLocalStorage";
import { useToast } from "../components/Toast";
import EmptyState from "../components/EmptyState";
import { CATEGORIES, SHIZELLE_SUBTYPES } from "../utils/constants";
import { todayString } from "../utils/dates";

export default function Tasks() {
  const [tasks, setTasks] = useLocalStorage("tasks", []);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [subtype, setSubtype] = useState(SHIZELLE_SUBTYPES[0]);
  const [date, setDate] = useState(todayString());
  const [filter, setFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("date-desc"); // "date-desc", "date-asc", "category", "title"
  const [editingId, setEditingId] = useState(null);

  const [searchParams, setSearchParams] = useSearchParams();
  const titleInputRef = useRef(null);
  const { showToast } = useToast();

  // Focus the new task field if redirected here via quick-add ("?focus=true")
  useEffect(() => {
    if (searchParams.get("focus") === "true") {
      titleInputRef.current?.focus();
      // Remove the query param cleanly without reloading
      setSearchParams({}, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  function resetForm() {
    setEditingId(null);
    setTitle("");
    setCategory(CATEGORIES[0]);
    setSubtype(SHIZELLE_SUBTYPES[0]);
    setDate(todayString());
  }

  function saveTask(e) {
    e.preventDefault();
    if (!title.trim()) return;

    const taskData = {
      title: title.trim(),
      category,
      subtype: category === "Shizelle" ? subtype : "",
      date,
    };

    if (editingId) {
      setTasks(
        tasks.map((t) => (t.id === editingId ? { ...t, ...taskData } : t))
      );
      showToast("Changes saved");
    } else {
      setTasks([{ id: Date.now(), ...taskData, done: false }, ...tasks]);
      showToast("Task added");
    }

    resetForm();
  }

  function startEdit(task) {
    setEditingId(task.id);
    setTitle(task.title);
    setCategory(task.category);
    setSubtype(task.subtype || SHIZELLE_SUBTYPES[0]);
    setDate(task.date);
    window.scrollTo({ top: 0, behavior: "smooth" });
    titleInputRef.current?.focus();
  }

  function toggleTask(id) {
    setTasks(tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  }

  function deleteTask(id) {
    const taskToDelete = tasks.find((t) => t.id === id);
    const originalTasks = tasks;
    setTasks(tasks.filter((t) => t.id !== id));
    if (id === editingId) resetForm();

    showToast({
      message: `Deleted "${taskToDelete?.title || "Task"}"`,
      actionLabel: "Undo",
      onAction: () => {
        setTasks(originalTasks);
        showToast("Task restored");
      },
    });
  }

  // Filter tasks by category and search query
  const filteredTasks = tasks.filter((t) => {
    const matchesCategory = filter === "All" || t.category === filter;
    const matchesSearch =
      searchQuery.trim() === "" ||
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.subtype && t.subtype.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  // Sort tasks based on selected option
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortBy === "date-desc") {
      return b.date.localeCompare(a.date);
    }
    if (sortBy === "date-asc") {
      return a.date.localeCompare(b.date);
    }
    if (sortBy === "category") {
      const catCompare = a.category.localeCompare(b.category);
      return catCompare !== 0 ? catCompare : a.title.localeCompare(b.title);
    }
    if (sortBy === "title") {
      return a.title.localeCompare(b.title);
    }
    return 0;
  });

  return (
    <div>
      <h1>
        Tasks
        <span className="kbd-shortcut" title="Press N on keyboard to add a task">
          Press 'N' to add
        </span>
      </h1>

      <form className="task-form" onSubmit={saveTask}>
        <input
          id="new-task-input"
          ref={titleInputRef}
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
          {editingId ? "Save changes" : "+ Add task"}
        </button>

        {editingId && (
          <button type="button" className="mini-btn" onClick={resetForm}>
            Cancel
          </button>
        )}
      </form>

      {/* Category Filter Tabs */}
      <div className="filters" role="tablist" aria-label="Filter tasks by category">
        {["All", ...CATEGORIES].map((c) => (
          <button
            key={c}
            className={filter === c ? "filter active" : "filter"}
            onClick={() => setFilter(c)}
            role="tab"
            aria-selected={filter === c}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Search Box and Sort Controls */}
      <div className="toolbar-row">
        <div className="search-input-wrap">
          <span className="search-icon" aria-hidden="true">
            🔍
          </span>
          <input
            type="search"
            className="search-input"
            placeholder="Search tasks by title or tag..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search tasks"
          />
          {searchQuery && (
            <button
              type="button"
              className="search-clear-btn"
              onClick={() => setSearchQuery("")}
              aria-label="Clear search"
            >
              ✕
            </button>
          )}
        </div>

        <div className="sort-wrap">
          <label htmlFor="task-sort-select" className="sort-label">
            Sort by:
          </label>
          <select
            id="task-sort-select"
            className="sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            aria-label="Sort tasks by"
          >
            <option value="date-desc">Date (Newest first)</option>
            <option value="date-asc">Date (Oldest first)</option>
            <option value="category">Category</option>
            <option value="title">Title (A–Z)</option>
          </select>
        </div>
      </div>

      <div className="task-list">
        {sortedTasks.length === 0 ? (
          searchQuery.trim() !== "" ? (
            <EmptyState
              icon="🔍"
              title="No matching tasks"
              message={`No tasks match "${searchQuery}".`}
              actionLabel="Clear search"
              onAction={() => setSearchQuery("")}
            />
          ) : filter !== "All" ? (
            <EmptyState
              icon="📁"
              title={`No ${filter} tasks`}
              message={`There are no tasks categorized under "${filter}".`}
              actionLabel="Show all tasks"
              onAction={() => setFilter("All")}
            />
          ) : (
            <EmptyState
              icon="📝"
              title="No tasks yet"
              message="Ready to capture what needs doing? Add your first task above or press 'N'."
              actionLabel="+ Create a task"
              onAction={() => titleInputRef.current?.focus()}
            />
          )
        ) : (
          sortedTasks.map((t) => (
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
                <span className="task-date">{t.date}</span>
              </div>
              <span className={`chip chip-${t.category.toLowerCase()}`}>
                {t.category}
                {t.subtype && ` · ${t.subtype}`}
              </span>
              <button
                className="edit-btn"
                onClick={() => startEdit(t)}
                aria-label={`Edit ${t.title}`}
              >
                Edit
              </button>
              <button
                className="delete"
                onClick={() => deleteTask(t.id)}
                aria-label={`Delete ${t.title}`}
              >
                ✕
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
