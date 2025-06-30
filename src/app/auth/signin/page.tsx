"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Github,
  UserPlus,
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleCredentialsSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setIsLoading(true);
    setError("");

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });
      if (res?.error) setError("Invalid email or password. Please try again.");
      else if (res?.ok) router.push("/");
    } catch {
      setError("Something went wrong. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
      <div className="w-full max-w-md min-w-0 card-glass rounded-3xl p-5 sm:p-6 lg:p-8 shadow-xl sm:shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none rounded-3xl" />

        <div className="relative z-10">
          {/* Header */}
          <header className="text-center mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold mb-2 sm:mb-3 bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
              Welcome back
            </h1>
            <p className="text-gray-400 flex-center gap-2 text-sm sm:text-base">
              Sign in to your account
            </p>
          </header>

          {/* Error Message */}
          {error && (
            <div className="mb-5 rounded-xl-glass bg-red-500/10 border-red-500/20 p-3 sm:p-4 shadow-lg shadow-red-500/10">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-red-500/20 flex-center">
                  <AlertCircle className="w-4 h-4 text-red-400" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-red-400 text-sm">
                    Authentication Error
                  </p>
                  <p className="text-red-300/80 text-sm break-words">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Form */}
          <form
            onSubmit={handleCredentialsSignIn}
            className="space-y-4 sm:space-y-6">
            {/* Email */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300 flex-center gap-2">
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
                <div className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 flex-center w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20">
                  <Mail className="w-3 h-3 text-blue-400" />
                </div>
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300 flex-center gap-2">
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
                  className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 flex-center w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 hover:from-purple-500/30 hover:to-pink-500/30">
                  {showPassword ? (
                    <EyeOff className="w-3 h-3 text-purple-400" />
                  ) : (
                    <Eye className="w-3 h-3 text-purple-400" />
                  )}
                </button>
              </div>
            </div>

            {/* Sign In */}
            <button
              type="submit"
              disabled={isLoading || !email || !password}
              className="btn-primary w-full h-11 sm:h-12 rounded-2xl disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98] flex-center gap-2 text-sm sm:text-base mt-6">
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* OAuth (GitHub) */}
          <div className="mt-6 sm:mt-8">
            <div className="relative mb-5">
              <div className="absolute inset-0 flex-center">
                <div className="w-full border-t border-white/10" />
              </div>
              <div className="relative flex-center text-sm">
                <span className="px-3 sm:px-4 rounded-xl-glass text-gray-400">
                  or continue with
                </span>
              </div>
            </div>

            <button
              onClick={() => signIn("github", { callbackUrl: "/" })}
              className="w-full h-11 sm:h-12 rounded-xl-glass cursor-pointer hover:bg-white/20 hover:border-white/30 hover:scale-[1.02] active:scale-[0.98] flex-center gap-3 text-sm sm:text-base">
              <Github className="w-4 h-4 sm:w-5 sm:h-5" />
              Continue with GitHub
            </button>
          </div>

          {/* Sign Up */}
          <div className="mt-6 sm:mt-8 pt-5 border-t border-white/10">
            <p className="text-xs-gray text-center mb-3">
              Don&apos;t have an account?
            </p>
            <Link href="/auth/register">
              <button className="w-full h-11 sm:h-12 rounded-xl-glass hover:bg-white/10 hover:border-white/20 hover:scale-[1.02] active:scale-[0.98] flex-center gap-2 text-sm sm:text-base">
                <UserPlus className="w-4 h-4" />
                Create new account
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
