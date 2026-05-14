import { useToast } from "../context/ToastContext";
import api from "../api/axios";

export default function TaskCard({ task, onComplete, onEdit, onDelete }) {
  const { addToast } = useToast();

  const handleDelete = async () => {
    if (!window.confirm("Delete this task?")) return;
    try {
      await api.delete(`/tasks/${task.id}/`);
      onDelete(task.id);
    } catch (err) {
      addToast("Failed to delete task.", "error");
    }
  };

  const isDone = task.status === "done";

  return (
    <div className={`task-card priority-${task.priority}`} style={{ opacity: isDone ? 0.7 : 1 }}>
      <div style={{ flex: 1 }}>
        <h3 style={{ textDecoration: isDone ? "line-through" : "none" }}>{task.title}</h3>
        {task.description && <p>{task.description}</p>}
        <div className="task-meta">
          <span className={`badge badge-${task.priority}`}>{task.priority}</span>
          <span className={`badge badge-${task.status}`}>
            {task.status === "in_progress" ? "In Progress" : task.status}
          </span>
          {task.due_date && (
            <span style={{ fontSize: "0.8rem", color: "#94a3b8" }}>
              📅 {new Date(task.due_date).toLocaleDateString()}
            </span>
          )}
        </div>
      </div>
      <div className="task-actions">
        {!isDone && (
          <button className="btn btn-success" onClick={() => onComplete(task.id)}>✓ Done</button>
        )}
        <button className="btn btn-ghost" onClick={() => onEdit(task)}>✏️</button>
        <button className="btn btn-danger" onClick={handleDelete}>🗑️</button>
      </div>
    </div>
  );
}