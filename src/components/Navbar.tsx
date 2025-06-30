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
            ? "rounded-xl-glass shadow-2xl shadow-black/25"
            : "card-glass"
        } before:absolute before:inset-0 before:rounded-2xl before:bg-gradient-to-r before:from-white/5 before:to-transparent before:pointer-events-none`}>
        <div className="relative px-4 sm:px-6 py-3 flex items-center justify-between z-10">
          {/* Logo */}
          <Link href="/" className="flex-center group">
            <span className="text-lg font-semibold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent transition-opacity group-hover:opacity-80">
              slickLink
            </span>
          </Link>

          {/* Auth Section */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {session ? (
              <div className="flex items-center space-x-2 sm:space-x-3">
                {/* Merged Dashboard Button with Avatar */}
                <Link
                  href="/dashboard"
                  className="h-8 px-3 sm:h-9 sm:px-4 flex items-center gap-2 text-sm font-medium text-white rounded-full backdrop-blur-sm bg-white/10 border border-white/20 hover:bg-white/20 transition-all duration-300">
                  <span>Dashboard</span>
                  <span className="hidden sm:flex">
                    <Avatar className="h-6 w-6 ring-1 ring-white/20 shadow-md shadow-black/20">
                      <AvatarImage
                        src={session.user?.image || ""}
                        alt={session.user?.name || "User"}
                      />
                      <AvatarFallback className="text-xs-gray bg-white/10 backdrop-blur-sm border-white/20">
                        {session.user?.name
                          ? getUserInitials(session.user.name)
                          : "U"}
                      </AvatarFallback>
                    </Avatar>
                  </span>
                </Link>

                {/* Sign Out */}
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
                className="h-8 px-3 sm:h-9 sm:px-4 flex items-center gap-1 rounded-full bg-white/90 backdrop-blur-sm text-black hover:bg-white border border-white/30 shadow-lg shadow-white/10">
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
