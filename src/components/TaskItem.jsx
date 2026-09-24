export default function TaskItem({ task }) {
  return (
    <li className={`task status-${task.status}`}>
      <div className="task-info">
        <span className="task-title">{task.title}</span>
        <span className="task-meta">{task.due_date ? `Due ${task.due_date}` : "No due date"}</span>
      </div>
    </li>
  );
}
