import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { BarChart3, LayoutDashboard, LogIn, UserPlus, LogOut, User, Menu, X } from "lucide-react";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [hasToken, setHasToken] = useState(!!localStorage.getItem("token"));
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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
    toast.info("Logged out successfully");
    setIsMobileMenuOpen(false);
    navigate("/auth/login");
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const links = hasToken
    ? [
      { to: "/", label: "Dashboard", icon: <LayoutDashboard size={20} /> },
      { to: "/analytics", label: "Analytics", icon: <BarChart3 size={20} /> },
      // { to: "/counter", label: "Counter", icon: <BarChart3 size={20} /> },

    ]
    : [
      { to: "/auth/signup", label: "Signup", icon: <UserPlus size={20} /> },
      { to: "/auth/login", label: "Login", icon: <LogIn size={20} /> },
    ];

  if (!hasToken) return null;

  return (
    <>
      {/* Mobile Header with Hamburger Menu */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white shadow-md border-b border-gray-200">
        <div className="flex items-center justify-between px-4 py-3">
          <h2 className="text-xl font-bold text-slate-800">Fin Manager</h2>
          <button
            onClick={toggleMobileMenu}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
              onClick={closeMobileMenu}
            />
            
            {/* Mobile Sidebar */}
            <motion.nav
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="lg:hidden fixed left-0 top-0 h-screen w-80 max-w-[85vw] bg-white text-slate-900 shadow-2xl flex flex-col py-8 px-4 z-50"
            >
              {/* Mobile App Name */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-slate-800">Fin Manager</h2>
                <button
                  onClick={closeMobileMenu}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Mobile Welcome Section */}
              {currentUser && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, ease: "easeOut", delay: 0.1 }}
                  className="flex items-center gap-3 px-4 py-3 mb-6 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl shadow-md"
                >
                  <div className="h-10 w-10 flex items-center justify-center rounded-full bg-white/20 backdrop-blur text-white shadow">
                    <User size={22} />
                  </div>
                  <div className="flex flex-col">
                    <p className="text-white/80 text-xs">Welcome back,</p>
                    <p className="font-bold text-white text-lg tracking-wide truncate">
                      {currentUser.name || currentUser.email}
                    </p>
                  </div>
                </motion.div>
              )}

              {/* Mobile Navigation Links */}
              <div className="flex flex-col gap-4 flex-1">
                {links.map((link, index) => {
                  const isActive = location.pathname === link.to;
                  return (
                    <Link key={link.to} to={link.to} className="w-full" onClick={closeMobileMenu}>
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: 0.1 + index * 0.1 }}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer text-lg font-medium w-full transition-all duration-300
                          ${isActive
                            ? "bg-indigo-100 text-indigo-700 shadow-md"
                            : "hover:bg-gray-100 hover:text-indigo-600"
                          }
                          transform hover:scale-105
                        `}
                      >
                        {link.icon}
                        <span className="flex-1">{link.label}</span>
                      </motion.div>
                    </Link>
                  );
                })}
              </div>

              {/* Mobile Logout Button */}
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.3 }}
                onClick={handleLogout}
                className="mt-4 flex items-center gap-2 px-4 py-3 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition"
              >
                <LogOut size={18} />
                <span className="font-medium">Logout</span>
              </motion.button>
            </motion.nav>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <nav className="hidden lg:flex fixed left-0 top-0 h-screen w-64 bg-white text-slate-900 shadow-lg flex-col py-8 px-4">
        {/* Desktop App Name */}
        <h2 className="text-3xl font-bold text-center mb-6 text-slate-800">
          Fin Manager
        </h2>

        {/* Desktop Welcome Section */}
        {currentUser && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="flex items-center gap-3 px-4 py-3 mb-6 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl shadow-md"
          >
            <div className="h-10 w-10 flex items-center justify-center rounded-full bg-white/20 backdrop-blur text-white shadow">
              <User size={22} />
            </div>
            <div className="flex flex-col">
              <p className="text-white/80 text-xs">Welcome back,</p>
              <p className="font-bold text-white text-lg tracking-wide truncate">
                {currentUser.name || currentUser.email}
              </p>
            </div>
          </motion.div>
        )}

        {/* Desktop Navigation Links */}
        <div className="flex flex-col gap-4 flex-1">
          {links.map((link) => {
            const isActive = location.pathname === link.to;
            return (
              <Link key={link.to} to={link.to} className="w-full">
                <div
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer text-lg font-medium w-full transition-all duration-300
                    ${isActive
                      ? "bg-indigo-100 text-indigo-700 shadow-md"
                      : "hover:bg-gray-100 hover:text-indigo-600"
                    }
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

        {/* Desktop Logout Button */}
        <button
          onClick={handleLogout}
          className="mt-4 flex items-center gap-2 px-4 py-3 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition"
        >
          <LogOut size={18} />
          <span className="font-medium">Logout</span>
        </button>
      </nav>
    </>
  );
}
