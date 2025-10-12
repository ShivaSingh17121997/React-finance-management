import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

export default function SignupPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Full Name is required";
    if (!form.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email))
      newErrors.email = "Email is invalid";
    if (!form.password) newErrors.password = "Password is required";
    else if (form.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";
    if (!form.confirmPassword)
      newErrors.confirmPassword = "Confirm Password is required";
    else if (form.confirmPassword !== form.password)
      newErrors.confirmPassword = "Passwords do not match";
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
    if (savedUsers.find((u) => u.email === form.email)) {
      setErrors({ email: "Email is already registered" });
      toast.error("Email is already registered");
      return;
    }

    const newUser = {
      name: form.name,
      email: form.email,
      password: form.password,
    };
    savedUsers.push(newUser);
    localStorage.setItem("users", JSON.stringify(savedUsers));

    toast.success("Signup successful. Please login.");
    setForm({ name: "", email: "", password: "", confirmPassword: "" });
    navigate("/auth/login");
  };

  return (
    <div
      className="h-screen w-full flex items-center justify-center 
                 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 
                 px-4 overflow-hidden relative"
    >
      {/* Animated Floating Illustration */}
      <motion.img
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 0.15, y: [0, -10, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        src="https://undraw.co/api/illustrations/undraw_mobile_encryption_re_yw3o.svg"
        alt="signup illustration"
        className="absolute bottom-0 right-0 w-[320px] sm:w-[400px] md:w-[440px] hidden sm:block pointer-events-none select-none"
      />

      {/* Signup Card */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-2xl bg-white/20 backdrop-blur-xl 
                   rounded-3xl shadow-2xl p-6 sm:p-8 border border-white/30
                   flex flex-col justify-center items-center 
                   max-h-[90vh] overflow-y-auto hide-scrollbar"
      >
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-2 text-center">
          Create Account
        </h2>
        <p className="text-gray-200 mb-6 text-sm sm:text-base text-center">
          Join the community — it only takes a minute ✨
        </p>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full"
        >
          {/* Full Name */}
          <div className="col-span-1">
            <label className="text-gray-100 font-medium block text-left text-sm sm:text-base">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className={`w-full mt-1 p-3 rounded-xl bg-white/10 text-white placeholder-gray-300 
                focus:outline-none focus:ring-2 focus:ring-pink-400 transition-all duration-200 
                ${errors.name ? "ring-red-400 border-red-400" : "border-transparent"}`}
              placeholder="John Doe"
            />
            {errors.name && (
              <p className="text-red-300 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          {/* Email */}
          <div className="col-span-1">
            <label className="text-gray-100 font-medium block text-left text-sm sm:text-base">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className={`w-full mt-1 p-3 rounded-xl bg-white/10 text-white placeholder-gray-300 
                focus:outline-none focus:ring-2 focus:ring-pink-400 transition-all duration-200 
                ${errors.email ? "ring-red-400 border-red-400" : "border-transparent"}`}
              placeholder="example@email.com"
            />
            {errors.email && (
              <p className="text-red-300 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div className="col-span-1">
            <label className="text-gray-100 font-medium block text-left text-sm sm:text-base">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className={`w-full mt-1 p-3 rounded-xl bg-white/10 text-white placeholder-gray-300 
                focus:outline-none focus:ring-2 focus:ring-pink-400 transition-all duration-200 
                ${errors.password ? "ring-red-400 border-red-400" : "border-transparent"}`}
              placeholder="********"
            />
            {errors.password && (
              <p className="text-red-300 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="col-span-1">
            <label className="text-gray-100 font-medium block text-left text-sm sm:text-base">
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              className={`w-full mt-1 p-3 rounded-xl bg-white/10 text-white placeholder-gray-300 
                focus:outline-none focus:ring-2 focus:ring-pink-400 transition-all duration-200 
                ${errors.confirmPassword ? "ring-red-400 border-red-400" : "border-transparent"}`}
              placeholder="********"
            />
            {errors.confirmPassword && (
              <p className="text-red-300 text-sm mt-1">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          {/* Button spans both columns */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            type="submit"
            className="col-span-1 sm:col-span-2 mt-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 
                       text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-2xl 
                       transition-all duration-200 text-sm sm:text-base"
          >
            Sign Up
          </motion.button>
        </form>

        <p className="text-sm text-gray-200 mt-4 text-center col-span-2">
          Already have an account?{" "}
          <a
            href="/auth/login"
            className="text-pink-300 font-semibold hover:underline"
          >
            Login
          </a>
        </p>
      </motion.div>
    </div>
  );
}
