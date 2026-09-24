import { useState } from "react";

const STATUS_LABELS = { todo: "To do", in_progress: "In progress", done: "Done" };

export default function TaskItem({ task, onUpdate }) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [dueDate, setDueDate] = useState(task.due_date || "");

  function startEdit() {
    setTitle(task.title);
    setDueDate(task.due_date || "");
    setEditing(true);
  }

  async function saveEdit() {
    const trimmed = title.trim();
    if (!trimmed) return;
    await onUpdate(task.id, { title: trimmed, due_date: dueDate || null });
    setEditing(false);
  }

  if (editing) {
    return (
      <li className={`task status-${task.status} editing`}>
        <input
          type="text"
          maxLength={200}
          aria-label="Task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          autoFocus
        />
        <input
          type="date"
          aria-label="Due date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
        <button className="btn btn-primary" type="button" onClick={saveEdit}>
          Save changes
        </button>
        <button className="btn btn-ghost" type="button" onClick={() => setEditing(false)}>
          Cancel
        </button>
      </li>
    );
  }

  return (
    <li className={`task status-${task.status}`}>
      <div className="task-info">
        {/* React escapes text automatically, which prevents script injection */}
        <span className="task-title">{task.title}</span>
        <span className="task-meta">{task.due_date ? `Due ${task.due_date}` : "No due date"}</span>
      </div>
      <div className="task-actions">
        <select
          aria-label="Status"
          value={task.status}
          onChange={(e) => onUpdate(task.id, { status: e.target.value })}
        >
          {Object.entries(STATUS_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        <button className="btn btn-ghost" type="button" onClick={startEdit}>
          Edit
        </button>
      </div>
    </li>
  );
}
