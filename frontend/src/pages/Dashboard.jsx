import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";  // ← uncommented
import api from "../api/axios";
import TaskCard from "../components/TaskCard";
import TaskForm from "../components/TaskForm";

export default function Dashboard() {
  const { user, logout } = useContext(AuthContext);
  const { addToast } = useToast();                   // ← add this
  const navigate = useNavigate();

  const [tasks, setTasks]         = useState([]);
  const [stats, setStats]         = useState({ total: 0, todo: 0, in_progress: 0, done: 0, urgent: 0 });
  const [filter, setFilter]       = useState("all");
  const [search, setSearch]       = useState("");
  const [loading, setLoading]     = useState(true);
  const [showForm, setShowForm]   = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { fetchTasks(); fetchStats(); }, []);

  const fetchTasks = async () => {
    try {
      const res = await api.get("/tasks/");
      const data = Array.isArray(res.data) ? res.data : (res.data.results ?? []);
      setTasks(data);
    } catch (err) {
      addToast("Failed to load tasks.", "error");
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await api.get("/tasks/stats/");
      setStats(res.data);
    } catch (err) {
      console.error("Failed to fetch stats", err);
    }
  };

  const handleLogout = () => {
    logout();
    addToast("Logged out successfully.", "info");
    navigate("/login");
  };

  const handleTaskCreated = (newTask) => {
    setTasks(prev => [newTask, ...prev]);
    fetchStats();
    setShowForm(false);
    addToast("Task created! 🎉", "success");
  };

  const handleTaskUpdated = (updatedTask) => {
    setTasks(prev => prev.map(t => t.id === updatedTask.id ? updatedTask : t));
    fetchStats();
    setEditingTask(null);
    setShowForm(false);
    addToast("Task updated.", "success");
  };

  const handleTaskDeleted = (taskId) => {
    setTasks(prev => prev.filter(t => t.id !== taskId));
    fetchStats();
    addToast("Task deleted.", "warning");
  };

  const handleComplete = async (taskId) => {
    try {
      const res = await api.post(`/tasks/${taskId}/complete/`);
      setTasks(prev => prev.map(t => t.id === taskId ? res.data : t));
      fetchStats();
      addToast("Task completed! ✓", "success");
    } catch (err) {
      addToast("Failed to complete task.", "error");
    }
  };

  const handleEdit = (task) => { setEditingTask(task); setShowForm(true); };
  const handleCloseForm = () => { setShowForm(false); setEditingTask(null); };

  const filteredTasks = tasks
    .filter(task => task != null)
    .filter(task => {
      const matchesFilter = filter === "all" || task.status === filter;
      const matchesSearch =
        task.title.toLowerCase().includes(search.toLowerCase()) ||
        (task.description || "").toLowerCase().includes(search.toLowerCase());
      return matchesFilter && matchesSearch;
    });
 
  return (
    <div className="dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <h1>👋 Hey, {user?.username || "there"}!</h1>
        <button className="btn-logout" onClick={handleLogout}>Logout</button>
      </div>

      {/* Stats Bar */}
      <div className="stats-bar">
        <div className="stat-card">
          <div className="stat-number">{stats.total ?? tasks.length}</div>
          <div className="stat-label">Total Tasks</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.todo ?? 0}</div>
          <div className="stat-label">To Do</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.in_progress ?? 0}</div>
          <div className="stat-label">In Progress</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.done ?? 0}</div>
          <div className="stat-label">Done</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.urgent ?? 0}</div>
          <div className="stat-label">🔥 Urgent</div>
        </div>
      </div>

      {/* Search + New Task */}
      <div style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
        <input
          type="text"
          placeholder="🔍 Search tasks..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            flex: 1,
            padding: "0.75rem 1rem",
            border: "1.5px solid #e2e8f0",
            borderRadius: "10px",
            fontSize: "0.95rem",
            outline: "none",
            background: "#fff",
            minWidth: "200px",
          }}
        />
        <button
          className="btn btn-primary"
          onClick={() => { setEditingTask(null); setShowForm(true); }}
          style={{ padding: "0.75rem 1.5rem", fontSize: "0.95rem" }}
        >
          + New Task
        </button>
      </div>

      {/* Filter Buttons */}
      <div className="filters">
        {["all", "todo", "in_progress", "done"].map(f => (
          <button
            key={f}
            className={`filter-btn ${filter === f ? "active" : ""}`}
            onClick={() => setFilter(f)}
          >
            {f === "all" ? "All" : f === "in_progress" ? "In Progress" : f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Task Form Modal */}
      {showForm && (
        <TaskForm
          task={editingTask}
          onCreated={handleTaskCreated}
          onUpdated={handleTaskUpdated}
          onClose={handleCloseForm}
        />
      )}

      {/* Task List */}
      {loading ? (
        <div className="spinner" />
      ) : filteredTasks.length === 0 ? (
        <div className="empty-state">
          <h3>{search ? "No tasks match your search." : "No tasks yet!"}</h3>
          <p>{search ? "Try a different keyword." : "Click '+ New Task' to get started."}</p>
        </div>
      ) : (
        <div className="task-list">
          {filteredTasks.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              onComplete={handleComplete}
              onEdit={handleEdit}
              onDelete={handleTaskDeleted}
            />
          ))}
        </div>
      )}
    </div>
  );
}
