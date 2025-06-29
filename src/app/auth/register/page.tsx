"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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

    if (!name || !email || !password || !confirmPassword) {
      setError("All fields are required.");
      return;
    }

    if (!email.includes("@") || password.length < 6) {
      setError("Invalid email or password too short.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Registration failed.");
        return;
      }

      const login = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (login?.error) {
        setError("Account created, but automatic login failed.");
      } else {
        router.push("/");
      }
    } catch (err) {
      console.log("Error in Register Page", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="bg-black/80 backdrop-blur-xl rounded-xl border border-white/10 shadow-2xl shadow-black/50 p-8 animate-in fade-in-0 slide-in-from-bottom-4 duration-700">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-semibold text-white mb-2 animate-in fade-in-0 slide-in-from-top-2 duration-500">
              Create Account
            </h1>
            <p className="text-gray-400 text-sm animate-in fade-in-0 slide-in-from-top-2 duration-500 delay-100">
              Join VideoVault today
            </p>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-950/50 border border-red-500/20 rounded-lg animate-in fade-in-0 slide-in-from-top-2 duration-300">
                <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            <div className="relative group">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 transition-all duration-300 group-focus-within:text-white group-focus-within:scale-110" />
              <Input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="pl-10 bg-transparent border-white/20 text-white placeholder-gray-400 focus:border-white/60 focus:ring-0 focus:shadow-lg focus:shadow-white/10 transition-all duration-300 hover:border-white/30 hover:shadow-md hover:shadow-white/5"
                required
              />
            </div>

            <div className="relative group">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 transition-all duration-300 group-focus-within:text-white group-focus-within:scale-110" />
              <Input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 bg-transparent border-white/20 text-white placeholder-gray-400 focus:border-white/60 focus:ring-0 focus:shadow-lg focus:shadow-white/10 transition-all duration-300 hover:border-white/30 hover:shadow-md hover:shadow-white/5"
                required
              />
            </div>

            <div className="relative group">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 transition-all duration-300 group-focus-within:text-white group-focus-within:scale-110" />
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 pr-10 bg-transparent border-white/20 text-white placeholder-gray-400 focus:border-white/60 focus:ring-0 focus:shadow-lg focus:shadow-white/10 transition-all duration-300 hover:border-white/30 hover:shadow-md hover:shadow-white/5"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-all duration-300 hover:scale-110">
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>

            <div className="relative group">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 transition-all duration-300 group-focus-within:text-white group-focus-within:scale-110" />
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="pl-10 bg-transparent border-white/20 text-white placeholder-gray-400 focus:border-white/60 focus:ring-0 focus:shadow-lg focus:shadow-white/10 transition-all duration-300 hover:border-white/30 hover:shadow-md hover:shadow-white/5"
                required
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-white text-black hover:bg-white/90 hover:shadow-lg hover:shadow-white/20 hover:scale-[1.02] disabled:bg-gray-800 disabled:text-gray-500 disabled:cursor-not-allowed disabled:hover:scale-100 font-medium transition-all duration-300 transform active:scale-[0.98]">
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin"></div>
                  Creating...
                </span>
              ) : (
                "Create Account"
              )}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-white/10">
            <p className="text-gray-400 text-sm text-center mb-3">
              Already have an account?
            </p>
            <Link href="/auth/signin">
              <Button
                variant="outline"
                className="w-full bg-transparent border-white">
                <LogIn className="w-4 h-4 mr-2" />
                Sign in instead
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
