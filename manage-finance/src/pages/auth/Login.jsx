import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validate = () => {
    const newErrors = {};
    if (!form.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email))
      newErrors.email = "Invalid email format";
    if (!form.password) newErrors.password = "Password is required";
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const savedUsers = JSON.parse(localStorage.getItem("users")) || [];
    const user = savedUsers.find(
      (u) => u.email === form.email && u.password === form.password
    );

    if (!user) {
      toast.error("Invalid email or password");
      setErrors({ general: "Invalid email or password" });
      return;
    }

    const token = Math.random().toString(36).substring(2);
    localStorage.setItem("token", token);
    localStorage.setItem("currentUser", JSON.stringify(user));
    window.dispatchEvent(new Event("token-change"));

    toast.success("Login successful!");
    navigate("/");
  };

  return (
    <div
      className="min-h-screen w-full flex flex-col items-center justify-center 
                 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 
                 px-4 overflow-hidden relative"
    >
      {/* Floating background illustration */}
      <motion.img
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 0.15, y: [0, -10, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        src="https://undraw.co/api/illustrations/undraw_secure_login_pdn4.svg"
        alt="login illustration"
        className="absolute bottom-0 right-0 w-[320px] sm:w-[400px] md:w-[440px] hidden sm:block pointer-events-none select-none"
      />

      {/* Top heading - Welcome to Manage Finance */}
      <motion.div
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-center mb-6 sm:mb-10"
      >
        <h1
          className="text-xl sm:text-5xl md:text-2xl font-extrabold text-white drop-shadow-lg"
        >
          Welcome to{" "}
          <span className="bg-gradient-to-r from-yellow-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent animate-gradient-x">
            Manage Finance
          </span>
        </h1>
        <p className="text-gray-200 mt-2 text-base sm:text-lg">
          Track, manage, and grow your wealth with ease 🚀
        </p>
      </motion.div>

      {/* Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-md bg-white/20 backdrop-blur-xl 
                   rounded-3xl shadow-2xl p-2 sm:p-8 border  border-white/30
                   flex flex-col justify-center items-center"
      >
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-2">
          Welcome Back
        </h2>
        <p className="text-gray-200 mb-6 text-sm sm:text-base text-center">
          Login to continue your journey ✨
        </p>

        {errors.general && (
          <p className="text-red-300 text-sm mb-3 text-center">
            {errors.general}
          </p>
        )}

        {/* Login Form */}
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 gap-4 -m-4 w-full"
        >
          {/* Email Field */}
          <div>
            <label className="text-gray-100 font-medium block text-left text-sm sm:text-base">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="abc@email.com"
              className={`w-full mt-1 p-3 rounded-xl bg-white/10 text-white placeholder-gray-300 
              focus:outline-none focus:ring-2 focus:ring-pink-400 transition-all duration-200 
              ${
                errors.email
                  ? "ring-red-400 border-red-400"
                  : "border-transparent"
              }`}
            />
            {errors.email && (
              <p className="text-red-300 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <label className="text-gray-100 font-medium block text-left text-sm sm:text-base">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="********"
              className={`w-full mt-1 p-3 rounded-xl bg-white/10 text-white placeholder-gray-300 
              focus:outline-none focus:ring-2 focus:ring-pink-400 transition-all duration-200 
              ${
                errors.password
                  ? "ring-red-400 border-red-400"
                  : "border-transparent"
              }`}
            />
            {errors.password && (
              <p className="text-red-300 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          {/* Login Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            type="submit"
            className="mt-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 
                       text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-2xl 
                       transition-all duration-200 text-sm sm:text-base"
          >
            Login
          </motion.button>
        </form>

        <p className="text-sm text-gray-200 mt-4 text-center">
          Don’t have an account?{" "}
          <a
            href="/auth/signup"
            className="text-pink-300 font-semibold hover:underline"
          >
            Sign Up
          </a>
        </p>
      </motion.div>
    </div>
  );
}
