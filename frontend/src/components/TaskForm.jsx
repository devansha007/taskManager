import { useState } from "react";
import api from "../api/axios";

const inputStyle = {
  width: "100%",
  padding: "0.75rem 1rem",
  border: "1.5px solid #e2e8f0",
  borderRadius: "10px",
  fontSize: "0.95rem",
  outline: "none",
  background: "#f8fafc",
  fontFamily: "inherit",
};

const labelStyle = {
  display: "block",
  fontSize: "0.85rem",
  fontWeight: 600,
  color: "#475569",
  marginBottom: "0.4rem",
};

export default function TaskForm({ task, onCreated, onUpdated, onClose }) {
  const isEditing = !!task;
  const [form, setForm] = useState({
    title:       task?.title       || "",
    description: task?.description || "",
    priority:    task?.priority    || "medium",
    status:      task?.status      || "todo",
    due_date:    task?.due_date    || "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  const handleChange = e =>
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const payload = { ...form };
    if (!payload.due_date) delete payload.due_date;
    try {
      if (isEditing) {
        const res = await api.patch(`/tasks/${task.id}/`, payload);
        onUpdated(res.data);
      } else {
        const res = await api.post("/tasks/", payload);
        onCreated(res.data);
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0,
        background: "rgba(0,0,0,0.4)",
        display: "flex", alignItems: "center", justifyContent: "center",
        zIndex: 1000, padding: "1rem",
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: "#fff", borderRadius: "16px", padding: "2rem",
          width: "100%", maxWidth: "480px",
          boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
          <h2 style={{ fontSize: "1.4rem", fontWeight: 700 }}>
            {isEditing ? "Edit Task" : "New Task"}
          </h2>
          <button onClick={onClose}
            style={{ background: "none", border: "none", fontSize: "1.5rem", cursor: "pointer", color: "#94a3b8" }}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <input name="title" placeholder="Task title *"
            value={form.title} onChange={handleChange} required style={inputStyle} />

          <textarea name="description" placeholder="Description (optional)"
            value={form.description} onChange={handleChange}
            rows={3} style={{ ...inputStyle, resize: "vertical" }} />

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div>
              <label style={labelStyle}>Priority</label>
              <select name="priority" value={form.priority} onChange={handleChange} style={inputStyle}>
                <option value="low">🟢 Low</option>
                <option value="medium">🟡 Medium</option>
                <option value="high">🔴 High</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>Status</label>
              <select name="status" value={form.status} onChange={handleChange} style={inputStyle}>
                <option value="todo">To Do</option>
                <option value="in_progress">In Progress</option>
                <option value="done">Done</option>
              </select>
            </div>
          </div>

          <div>
            <label style={labelStyle}>Due Date (optional)</label>
            <input type="date" name="due_date" value={form.due_date}
              onChange={handleChange} style={inputStyle} />
          </div>

          {error && <p className="error">{error}</p>}

          <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.5rem" }}>
            <button type="button" onClick={onClose}
              className="btn btn-ghost" style={{ flex: 1, padding: "0.85rem" }}>
              Cancel
            </button>
            <button type="submit" disabled={loading}
              className="btn btn-primary" style={{ flex: 2, padding: "0.85rem", fontSize: "1rem" }}>
              {loading ? "Saving..." : isEditing ? "Save Changes" : "Create Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}