import { useCallback, useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import TaskForm from "./TaskForm";
import TaskItem from "./TaskItem";

const FILTERS = [
  { value: "all", label: "All" },
  { value: "todo", label: "To do" },
  { value: "in_progress", label: "In progress" },
  { value: "done", label: "Done" },
];

export default function TaskBoard({ user }) {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("all");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const loadTasks = useCallback(async () => {
    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) setError("Could not load tasks: " + error.message);
    else {
      setTasks(data);
      setError("");
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    loadTasks();
  }, [loadTasks, user.id]);

  async function addTask(title, dueDate) {
    const { error } = await supabase.from("tasks").insert({ title, due_date: dueDate || null });
    if (error) {
      setError("Could not add task: " + error.message);
      return false;
    }
    await loadTasks();
    return true;
  }

  async function updateTask(id, changes) {
    const { error } = await supabase.from("tasks").update(changes).eq("id", id);
    if (error) setError("Could not update task: " + error.message);
    await loadTasks();
  }

  async function deleteTask(id) {
    if (!window.confirm("Delete this task?")) return;
    const { error } = await supabase.from("tasks").delete().eq("id", id);
    if (error) setError("Could not delete task: " + error.message);
    await loadTasks();
  }

  const visible = filter === "all" ? tasks : tasks.filter((t) => t.status === filter);

  return (
    <section>
      <TaskForm onAdd={addTask} />
      {error && <p className="message error" role="status">{error}</p>}

      <div className="filters" role="group" aria-label="Filter tasks">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            type="button"
            className={`filter ${filter === f.value ? "active" : ""}`}
            onClick={() => setFilter(f.value)}
          >
            {f.label}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="empty">Loading tasks...</p>
      ) : visible.length === 0 ? (
        <p className="empty">No tasks here. Add one above.</p>
      ) : (
        <ul className="task-list">
          {visible.map((task) => (
            <TaskItem key={task.id} task={task} onUpdate={updateTask} onDelete={deleteTask} />
          ))}
        </ul>
      )}
    </section>
  );
}
