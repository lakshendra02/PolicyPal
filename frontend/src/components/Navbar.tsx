import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { isAuthenticated, logout } from "../utils/auth";

export default function Navbar() {
  const navigate = useNavigate();
  const authed = isAuthenticated();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
    setMenuOpen(false);
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50 w-full">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 flex justify-between items-center h-16">
        <Link to="/" className="text-2xl font-bold text-blue-600">
          InsureAI
        </Link>

        {/* Desktop navigation links */}
        <div className="hidden md:flex space-x-8 items-center">
          <Link
            to="/"
            className="text-gray-700 hover:text-blue-600 text-lg font-semibold px-4 py-2 rounded-md transition-colors"
          >
            Home
          </Link>
          <Link
            to="/policies"
            className="text-gray-700 hover:text-blue-600 text-lg font-semibold px-4 py-2 rounded-md transition-colors"
          >
            My Policies
          </Link>

          {!authed ? (
            <>
              <Link
                to="/login"
                className="text-white bg-blue-600 hover:bg-blue-700 text-lg font-semibold px-6 py-2 rounded-md transition-colors"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="text-white bg-green-600 hover:bg-green-700 text-lg font-semibold px-6 py-2 rounded-md transition-colors"
              >
                Register
              </Link>
            </>
          ) : (
            <button
              onClick={handleLogout}
              className="text-white bg-red-600 hover:bg-red-700 text-lg font-semibold px-6 py-2 rounded-md transition-colors"
            >
              Logout
            </button>
          )}
        </div>

        {/* Mobile hamburger menu button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-gray-700 hover:text-blue-600 focus:outline-none"
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          {menuOpen ? (
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white shadow-lg px-6 py-4 space-y-3">
          <Link
            to="/"
            onClick={() => setMenuOpen(false)}
            className="block text-gray-700 hover:text-blue-600 text-lg font-semibold px-4 py-2 rounded-md transition-colors"
          >
            Home
          </Link>
          <Link
            to="/policies"
            onClick={() => setMenuOpen(false)}
            className="block text-gray-700 hover:text-blue-600 text-lg font-semibold px-4 py-2 rounded-md transition-colors"
          >
            My Policies
          </Link>

          {!authed ? (
            <>
              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="block text-white bg-blue-600 hover:bg-blue-700 text-lg font-semibold px-6 py-2 rounded-md transition-colors"
              >
                Login
              </Link>
              <Link
                to="/register"
                onClick={() => setMenuOpen(false)}
                className="block text-white bg-green-600 hover:bg-green-700 text-lg font-semibold px-6 py-2 rounded-md transition-colors"
              >
                Register
              </Link>
            </>
          ) : (
            <button
              onClick={handleLogout}
              className="w-full text-white bg-red-600 hover:bg-red-700 text-lg font-semibold px-6 py-2 rounded-md transition-colors"
            >
              Logout
            </button>
          )}
        </div>
      )}
    </nav>
  );
}
