// frontend/src/pages/Register.jsx
import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import api from "../api/axios";

export default function Register() {
  const [form, setForm] = useState({ email: "", username: "", password: "" });
  const [error, setError] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = e =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/auth/register/", form);
      // Auto-login after register
      const res = await api.post("/auth/login/", {
        email: form.email,
        password: form.password,
      });
      login(res.data.access, res.data.refresh);
      navigate("/dashboard");
    } catch (err) {
      setError("Registration failed. Email may already exist.");
    }
  };

  return (
    <div className="auth-container">
      <h2>Create Account</h2>
      <form onSubmit={handleSubmit}>
        <input name="username" placeholder="Username"
          onChange={handleChange} required />
        <input name="email" type="email" placeholder="Email"
          onChange={handleChange} required />
        <input name="password" type="password" placeholder="Password"
          onChange={handleChange} required />
        {error && <p className="error">{error}</p>}
        <button type="submit">Register</button>
      </form>
      <p>Have an account? <Link to="/login">Login</Link></p>
    </div>
  );
}