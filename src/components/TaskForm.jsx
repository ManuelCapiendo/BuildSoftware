import { useState } from "react";

export default function TaskForm({ onAdd }) {
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) {
      setMessage("Enter a task title.");
      return;
    }
    setBusy(true);
    const ok = await onAdd(trimmed, dueDate);
    setBusy(false);
    if (ok) {
      setTitle("");
      setDueDate("");
      setMessage("");
    }
  }

  return (
    <div className="panel add-task">
      <h2>Add a task</h2>
      <form className="add-row" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="What needs doing?"
          maxLength={200}
          aria-label="Task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="date"
          aria-label="Due date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
        <button className="btn btn-primary" type="submit" disabled={busy}>
          Add task
        </button>
      </form>
      <p className="message error" role="status">{message}</p>
    </div>
  );
}
