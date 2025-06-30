"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  LogIn,
} from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name || !email || !password || !confirmPassword)
      return setError("All fields are required.");
    if (!email.includes("@") || password.length < 6)
      return setError("Invalid email or password too short.");
    if (password !== confirmPassword)
      return setError("Passwords do not match.");

    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();
      if (!res.ok) return setError(data.error || "Registration failed.");

      const login = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (login?.error)
        setError("Account created, but automatic login failed.");
      else router.push("/");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center px-2 py-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md min-w-0 card-glass rounded-3xl p-6 sm:p-8 lg:p-10 shadow-xl sm:shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none rounded-3xl" />

        <div className="relative z-10">
          {/* Header */}
          <div className="text-center mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold mb-2 sm:mb-3 bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
              Create Account
            </h1>
            <p className="text-gray-400 flex items-center justify-center gap-2 text-sm sm:text-base">
              Join Slick Link
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-5 rounded-xl-glass bg-red-500/10 border-red-500/20 p-3 sm:p-4 shadow-lg shadow-red-500/10">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center">
                  <AlertCircle className="w-4 h-4 text-red-400" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-red-400 text-sm">
                    Registration Error
                  </p>
                  <p className="text-red-300/80 text-sm break-words">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleRegister} className="space-y-4 sm:space-y-6">
            {/* Name */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300 flex gap-2">
                <User className="w-4 h-4 text-green-400" />
                Full Name
              </label>
              <div className="relative group">
                <input
                  type="text"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input-glass pr-12 h-11 sm:h-12 group-hover:border-white/20"
                  required
                />
                <div className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-gradient-to-r from-green-500/20 to-emerald-500/20">
                  <User className="w-3 h-3 text-green-400" />
                </div>
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300 flex gap-2">
                <Mail className="w-4 h-4 text-blue-400" />
                Email Address
              </label>
              <div className="relative group">
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-glass pr-12 h-11 sm:h-12 group-hover:border-white/20"
                  required
                />
                <div className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20">
                  <Mail className="w-3 h-3 text-blue-400" />
                </div>
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300 flex gap-2">
                <Lock className="w-4 h-4 text-purple-400" />
                Password
              </label>
              <div className="relative group">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-glass pr-12 h-11 sm:h-12 group-hover:border-white/20"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 hover:from-purple-500/30 hover:to-pink-500/30"
                >
                  {showPassword ? (
                    <EyeOff className="w-3 h-3 text-purple-400" />
                  ) : (
                    <Eye className="w-3 h-3 text-purple-400" />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300 flex gap-2">
                <Lock className="w-4 h-4 text-pink-400" />
                Confirm Password
              </label>
              <div className="relative group">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="input-glass pr-12 h-11 sm:h-12 group-hover:border-white/20"
                  required
                />
                <div className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-gradient-to-r from-pink-500/20 to-rose-500/20">
                  <Lock className="w-3 h-3 text-pink-400" />
                </div>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading || !name || !email || !password || !confirmPassword}
              className="btn-primary w-full h-11 sm:h-12 rounded-2xl disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 text-sm sm:text-base mt-6"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating Account...
                </>
              ) : (
                <>Create Account</>
              )}
            </button>
          </form>

          {/* Sign In link */}
          <div className="mt-6 sm:mt-8 pt-5 border-t border-white/10">
            <p className="text-xs-gray text-center mb-3">
              Already have an account?
            </p>
            <Link href="/auth/signin">
              <button className="w-full h-11 sm:h-12 rounded-xl-glass hover:bg-white/10 hover:border-white/20 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 text-sm sm:text-base">
                <LogIn className="w-4 h-4" />
                Sign in instead
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}