import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { BarChart3, LayoutDashboard, LogIn, UserPlus, LogOut, User } from "lucide-react";
import { toast } from "react-toastify";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [hasToken, setHasToken] = useState(!!localStorage.getItem("token"));
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("currentUser")) || null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    const handleTokenChange = () => {
      setHasToken(!!localStorage.getItem("token"));
      try {
        setCurrentUser(JSON.parse(localStorage.getItem("currentUser")) || null);
      } catch {
        setCurrentUser(null);
      }
    };
    window.addEventListener("storage", handleTokenChange);
    window.addEventListener("token-change", handleTokenChange);
    return () => {
      window.removeEventListener("storage", handleTokenChange);
      window.removeEventListener("token-change", handleTokenChange);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("currentUser");
    window.dispatchEvent(new Event("token-change"));
    toast.info("Logged out");
    navigate("/auth/login");
  };

  const links = hasToken
    ? [
        { to: "/", label: "Dashboard", icon: <LayoutDashboard size={20} /> },
        { to: "/analytics", label: "Analytics", icon: <BarChart3 size={20} /> },
      ]
    : [
        { to: "/auth/signup", label: "Signup", icon: <UserPlus size={20} /> },
        { to: "/auth/login", label: "Login", icon: <LogIn size={20} /> },
      ];

  if (!hasToken) return null;

  return (
    <nav className="fixed left-0 top-0 h-screen w-64 bg-white text-slate-900 shadow-lg flex flex-col py-8 px-4">
      <h2 className="text-3xl font-bold text-center mb-6 text-slate-800">Fin Manager</h2>

      {currentUser && (
        <div className="flex items-center gap-3 px-4 py-3 mb-4 bg-gray-100 rounded text-blue-500">
          <User size={20} />
          <div className="flex justify-around">
            <p className="text-semibold">Welcome</p>
            <p className="font-semibold text-base truncate ml-5">{currentUser.name || currentUser.email}</p>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-4 flex-1">
        {links.map((link) => {
          const isActive = location.pathname === link.to;
          return (
            <Link key={link.to} to={link.to} className="w-full">
              <div
                className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer text-lg font-medium w-full transition-all duration-300
                  ${isActive ? "bg-indigo-100 text-indigo-700 shadow-md" : "hover:bg-gray-100 hover:text-indigo-600"}
                  transform hover:scale-105
                `}
              >
                {link.icon}
                <span className="flex-1">{link.label}</span>
              </div>
            </Link>
          );
        })}
      </div>

      <button
        onClick={handleLogout}
        className="mt-4 flex items-center gap-2 px-4 py-3 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition"
      >
        <LogOut size={18} />
        <span className="font-medium">Logout</span>
      </button>
    </nav>
  );
}
