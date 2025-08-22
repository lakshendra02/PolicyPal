import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [formErrors, setFormErrors] = useState({ username: "", password: "" });
  const navigate = useNavigate();

  const validateForm = () => {
    const errors = { username: "", password: "" };
    if (!username.trim()) errors.username = "Username is required.";
    if (!password) errors.password = "Password is required.";
    setFormErrors(errors);
    return !errors.username && !errors.password;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!validateForm()) return;

    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      if (res.ok) {
        setSuccess("Registration successful! Redirecting to login...");
        setTimeout(() => navigate("/login"), 1500);
      } else {
        setError(data.error || "Registration failed");
      }
    } catch {
      setError("Server error");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 px-4">
      <form onSubmit={handleRegister} className="bg-white shadow-lg rounded-2xl p-10 w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-center text-green-700">Register</h2>

        {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
        {success && <p className="text-green-600 text-sm mb-4 text-center">{success}</p>}

        <div className="mb-5">
          <input
            type="text"
            placeholder="Username"
            className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
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
            className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
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
          className="w-full bg-green-600 text-white py-3 rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold"
        >
          Register
        </button>

        <p
          onClick={() => navigate("/login")}
          className="text-sm text-center mt-4 text-blue-600 cursor-pointer hover:underline"
        >
          Already have an account? Login
        </p>
      </form>
    </div>
  );
};

export default Register;
