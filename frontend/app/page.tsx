"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { API_URL } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const [rememberAppointment, setRememberAppointment] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username || username.length < 3) {
      setError("Username must be at least 3 characters");
      return;
    }

    if (!password || password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    const endpoint = isRegister ? "register" : "login";

    try {
      const response = await fetch(`${API_URL}/auth/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          password,
          rememberProjectAppointment: rememberAppointment,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(isRegister ? "Registration successful! You can now login." : "Login successful!");
        console.log("User:", data.user);
        if (isRegister) {
          setIsRegister(false);
        } else {
          // Redirect to home page after successful login
          setTimeout(() => {
            router.push("/home");
          }, 1000);
        }
      } else {
        setError(data.message || "Something went wrong");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.5)), url('/city-bg.jpg')`,
        backgroundColor: '#1a1a2e',
      }}>

      {/* Login Card */}
      <div className="w-full max-w-md mx-4">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-lg flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
          </div>
          <div>
            <span className="text-amber-400 text-sm font-semibold tracking-wider">ELITE</span>
            <h1 className="text-white text-xl font-bold -mt-1">PropConnect</h1>
          </div>
        </div>

        {/* Card */}
        <div className="bg-black/70 backdrop-blur-md rounded-lg p-8 border border-gray-700/50">
          <h2 className="text-white text-2xl font-semibold text-center mb-6">
            {isRegister ? "Create Account" : "Welcome Back!"}
          </h2>

          <form onSubmit={handleSubmit}>
            {/* Username Input */}
            <div className="mb-4">
              <label className="text-gray-300 text-sm mb-2 block">Username</label>
              <input
                type="text"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:border-amber-500 transition"
              />
            </div>

            {/* Password Input */}
            <div className="mb-4">
              <label className="text-gray-300 text-sm mb-2 block">Password</label>
              <input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:border-amber-500 transition"
              />
            </div>

            {/* Remember Checkbox */}
            {!isRegister && (
              <div className="flex items-center mb-6">
                <input
                  type="checkbox"
                  id="remember"
                  checked={rememberAppointment}
                  onChange={(e) => setRememberAppointment(e.target.checked)}
                  className="w-4 h-4 bg-gray-800 border-gray-600 rounded accent-amber-500"
                />
                <label htmlFor="remember" className="ml-2 text-gray-300 text-sm">
                  Remember Project/Site appointment
                </label>
              </div>
            )}

            {/* Error/Success Messages */}
            {error && (
              <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-md text-red-400 text-sm text-center">
                {error}
              </div>
            )}
            {success && (
              <div className="mb-4 p-3 bg-green-500/20 border border-green-500/50 rounded-md text-green-400 text-sm text-center">
                {success}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-transparent border-2 border-amber-500 text-amber-500 rounded-md font-semibold hover:bg-amber-500 hover:text-black transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Please wait..." : isRegister ? "Register" : "Login"}
            </button>
          </form>

          {/* Toggle Register/Login */}
          <button
            onClick={() => {
              setIsRegister(!isRegister);
              setError("");
              setSuccess("");
            }}
            className="w-full mt-3 text-gray-400 text-sm hover:text-amber-500 transition"
          >
            {isRegister ? "Already have an account? Login" : "Don't have an account? Register"}
          </button>

          {/* Forgot Password */}
          {!isRegister && (
            <div className="text-center mt-6">
              <a href="#" className="text-amber-500 text-sm hover:underline">
                Forgot Password?
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
