import { createContext, useContext, useState, useCallback } from "react";

const ToastContext = createContext();

export function useToast() {
  return useContext(ToastContext);
}

export default function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = "success") => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3500);
  }, []);

  const removeToast = (id) => setToasts(prev => prev.filter(t => t.id !== id));

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      {/* Toast Container */}
      <div style={{
        position: "fixed", bottom: "1.5rem", right: "1.5rem",
        display: "flex", flexDirection: "column", gap: "0.75rem",
        zIndex: 9999, maxWidth: "340px", width: "100%",
      }}>
        {toasts.map(toast => (
          <div key={toast.id} onClick={() => removeToast(toast.id)} style={{
            display: "flex", alignItems: "center", gap: "0.75rem",
            padding: "0.9rem 1.2rem",
            borderRadius: "12px",
            boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
            cursor: "pointer",
            animation: "slideIn 0.3s ease",
            fontWeight: 500,
            fontSize: "0.92rem",
            ...toastStyles[toast.type],
          }}>
            <span style={{ fontSize: "1.1rem" }}>{toastIcons[toast.type]}</span>
            <span style={{ flex: 1 }}>{toast.message}</span>
            <span style={{ opacity: 0.5, fontSize: "1rem" }}>×</span>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes slideIn {
          from { transform: translateX(110%); opacity: 0; }
          to   { transform: translateX(0);   opacity: 1; }
        }
      `}</style>
    </ToastContext.Provider>
  );
}

const toastStyles = {
  success: { background: "#f0fdf4", color: "#166534", border: "1px solid #bbf7d0" },
  error:   { background: "#fef2f2", color: "#991b1b", border: "1px solid #fecaca" },
  info:    { background: "#eff6ff", color: "#1e40af", border: "1px solid #bfdbfe" },
  warning: { background: "#fffbeb", color: "#92400e", border: "1px solid #fde68a" },
};

const toastIcons = {
  success: "✅",
  error:   "❌",
  info:    "ℹ️",
  warning: "⚠️",
};