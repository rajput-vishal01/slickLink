"use client";

import { signIn, getProviders } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Github,
  UserPlus,
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";

export default function SignIn() {
  const [providers, setProviders] = useState<any>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchProviders = async () => {
      const res = await getProviders();
      setProviders(res);
    };
    fetchProviders();
  }, []);

  const handleCredentialsSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setIsLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid email or password. Please try again.");
      } else if (result?.ok) {
        router.push("/");
      }
    } catch (error) {
      console.log("Error in Signin Page", error);
      setError("Something went wrong. Please try again later.");
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
              Welcome back
            </h1>
            <p className="text-gray-400 text-sm animate-in fade-in-0 slide-in-from-top-2 duration-500 delay-100">
              Sign in to your account
            </p>
          </div>

          <form onSubmit={handleCredentialsSignIn} className="space-y-4">
            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-950/50 border border-red-500/20 rounded-lg animate-in fade-in-0 slide-in-from-top-2 duration-300">
                <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

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

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-white text-black hover:bg-white/90 hover:shadow-lg hover:shadow-white/20 hover:scale-[1.02] disabled:bg-gray-800 disabled:text-gray-500 disabled:cursor-not-allowed disabled:hover:scale-100 font-medium transition-all duration-300 transform active:scale-[0.98]">
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin"></div>
                  Signing in...
                </span>
              ) : (
                "Sign in"
              )}
            </Button>
          </form>

          {/* OAuth Providers */}
          <div className="mt-4">
            {providers &&
              Object.values(providers).map((provider: any) => {
                if (provider.name === "GitHub") {
                  return (
                    <Button
                      key={provider.name}
                      onClick={() => signIn(provider.id, { callbackUrl: "/" })}
                      className="w-full bg-gray-800 border-white/20 text-white hover:bg-gray-700 hover:border-white/30 hover:shadow-lg hover:shadow-white/10 hover:scale-[1.02] font-medium transition-all duration-300 transform active:scale-[0.98]">
                      <Github className="w-4 h-4 mr-2" />
                      Continue with {provider.name}
                    </Button>
                  );
                }
                return null;
              })}
          </div>

          <div className="mt-6 pt-6 border-t border-white/10">
            <p className="text-gray-400 text-sm text-center mb-3">
              Don't have an account?
            </p>
            <Link href="/auth/register">
              <Button
                variant="outline"
                className="w-full bg-transparent border-white/20 text-whi font-medium transition-all duration-300 transform active:scale-[0.98]">
                <UserPlus className="w-4 h-4 mr-2" />
                Create new account
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
