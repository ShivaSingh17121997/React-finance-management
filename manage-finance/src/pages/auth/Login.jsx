import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function LoginPage() {
    const [form, setForm] = useState({
        email: "",
        password: "",
    });
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setErrors({ ...errors, [e.target.name]: "" });
    };

    const validate = () => {
        const newErrors = {};
        if (!form.email) newErrors.email = "Email is required";
        else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = "Email is invalid";

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
            setErrors({ general: "Invalid email or password" });
            toast.error("Invalid email or password");
            return;
        }

        const token = Math.random().toString(36).substring(2);
        localStorage.setItem("token", token);
        localStorage.setItem("currentUser", JSON.stringify(user));

        window.dispatchEvent(new Event("token-change"));

        toast.success("Login successful");
        navigate("/");
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-500 to-purple-500 p-4">
            <div className="bg-white rounded-2xl shadow-lg max-w-md w-full p-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Login </h2>
                <p className="text-xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
                    Welcome to Fin Manager
                </p>

                {errors.general && (
                    <p className="text-red-500 text-sm mb-4 text-center">{errors.general}</p>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    {/* Email */}
                    <div>
                        <label className="text-gray-700 font-medium">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            className={`w-full mt-1 p-3 border rounded-lg focus:outline-none focus:ring-2 ${errors.email ? "border-red-500 focus:ring-red-400" : "border-gray-300 focus:ring-indigo-400"
                                }`}
                            placeholder="example@email.com"
                        />
                        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                    </div>

                    {/* Password */}
                    <div>
                        <label className="text-gray-700 font-medium">Password</label>
                        <input
                            type="password"
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            className={`w-full mt-1 p-3 border rounded-lg focus:outline-none focus:ring-2 ${errors.password ? "border-red-500 focus:ring-red-400" : "border-gray-300 focus:ring-indigo-400"
                                }`}
                            placeholder="********"
                        />
                        {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="bg-indigo-500 text-white font-bold py-3 rounded-lg hover:bg-indigo-600 transition"
                    >
                        Login
                    </button>
                </form>

                <p className="text-sm text-gray-500 mt-4 text-center">
                    Don't have an account?{" "}
                    <a href="/auth/signup" className="text-indigo-500 font-semibold hover:underline">
                        Sign Up
                    </a>
                </p>
            </div>
        </div>
    );
}
