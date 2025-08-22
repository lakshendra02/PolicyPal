import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [formErrors, setFormErrors] = useState({ username: "", password: "" });
  const navigate = useNavigate();

  // Basic validation: checks empty username/password
  const validateForm = () => {
    const errors = { username: "", password: "" };
    if (!username.trim()) errors.username = "Username is required.";
    if (!password) errors.password = "Password is required.";
    setFormErrors(errors);
    return !errors.username && !errors.password;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) {
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("token", data.token);
        navigate("/");
      } else {
        setError(data.error || "Login failed");
      }
    } catch {
      setError("Server error");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 px-4">
      <form onSubmit={handleLogin} className="bg-white shadow-lg rounded-2xl p-10 w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-center text-blue-700">Login</h2>

        {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}

        <div className="mb-5">
          <input
            type="text"
            placeholder="Username"
            className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              formErrors.username ? "border-red-500" : "border-gray-300"
            }`}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          {formErrors.username && (
            <p className="text-red-500 text-xs mt-1">{formErrors.username}</p>
          )}
        </div>

        <div className="mb-6">
          <input
            type="password"
            placeholder="Password"
            className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              formErrors.password ? "border-red-500" : "border-gray-300"
            }`}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {formErrors.password && (
            <p className="text-red-500 text-xs mt-1">{formErrors.password}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={!username || !password}
          className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold"
        >
          Login
        </button>

        <p
          onClick={() => navigate("/register")}
          className="text-sm text-center mt-4 text-blue-600 cursor-pointer hover:underline"
        >
          Don’t have an account? Register
        </p>
      </form>
    </div>
  );
};

export default Login;
