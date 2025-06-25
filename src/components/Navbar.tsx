"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";
import { LogOut, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const { data: session, status } = useSession();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" });
  };

  const getUserInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (status === "loading") return null;

  return (
    <div className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-5">
      <nav
        className={`w-full max-w-6xl rounded-2xl transition-all duration-300 ${
          scrolled
            ? "backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl shadow-black/25"
            : "backdrop-blur-md bg-white/5 border border-white/10"
        } before:absolute before:inset-0 before:rounded-2xl before:bg-gradient-to-r before:from-white/5 before:to-transparent before:pointer-events-none`}>
        <div className="relative px-4 sm:px-6 py-3 flex items-center justify-between z-10">
          {/* Logo */}
          <Link href="/" className="flex items-center group">
            <span className="text-lg font-semibold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent transition-opacity group-hover:opacity-80">
              slickLink
            </span>
          </Link>

          {/* Auth Section */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {status === "loading" ? (
              <div className="w-8 h-8 rounded-full bg-gray-800 animate-pulse" />
            ) : session ? (
              <div className="flex items-center space-x-2">
                {/* Clickable User Avatar for Profile */}
                <Link
                  href="/profile"
                  className="hover:opacity-80 transition-opacity">
                  <Avatar className="h-8 w-8 cursor-pointer ring-1 ring-white/20 shadow-lg shadow-black/20">
                    <AvatarImage
                      src={session.user?.image || ""}
                      alt={session.user?.name || "User"}
                    />
                    <AvatarFallback className="text-xs text-gray-100 bg-white/10 backdrop-blur-sm border-white/20">
                      {session.user?.name
                        ? getUserInitials(session.user.name)
                        : "U"}
                    </AvatarFallback>
                  </Avatar>
                </Link>

                {/* Sign Out Button */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSignOut}
                  className="text-red-400 hover:text-red-300 hover:bg-red-500/10 backdrop-blur-sm p-1.5 cursor-pointer rounded-full border border-red-400/20 shadow-lg shadow-red-500/10"
                  title="Sign out">
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <Button
                onClick={() => signIn()}
                className="cursor-pointer rounded-full bg-white/90 backdrop-blur-sm text-black hover:bg-white border border-white/30 shadow-lg shadow-white/10 h-8 px-3 sm:h-9 sm:px-4">
                <UserPlus className="w-4" />
                <span>Sign up</span>
              </Button>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
}
