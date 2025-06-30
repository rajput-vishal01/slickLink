import Link from "next/link";
import { Search, Home, ArrowLeft } from "lucide-react";

export default function NotFound(): React.JSX.Element {
  return (
    <div className="min-h-screen w-full flex-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-md mx-auto card-glass p-6 sm:p-8 lg:p-10 shadow-2xl shadow-black/25 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none rounded-3xl" />

        <div className="relative z-10 text-center">
          {/* 404 Display */}
          <div className="mb-6 sm:mb-8">
            <div className="mb-4">
              <span className="text-6xl sm:text-8xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                404
              </span>
            </div>
            <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-xl-glass flex-center mb-4">
              <Search className="w-8 h-8 sm:w-10 sm:h-10 text-blue-400" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold mb-2 sm:mb-3 bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
              Page Not Found
            </h1>
          </div>

          {/* Not Found Message */}
          <div className="mb-6 sm:mb-8">
            <p className="text-xs-gray mb-2">
              The page you&apos;re looking for doesn&apos;t exist or has been
              moved.
            </p>
            <p className="text-xs text-gray-500">
              Don&apos;t worry, let&apos;s get you back on track!
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 sm:gap-4">
            <Link href="/">
              <button
                type="button"
                className="w-full h-11 sm:h-12 rounded-2xl btn-primary hover:from-blue-600 hover:to-purple-600 hover:scale-[1.02] active:scale-[0.98] flex-center gap-2 text-sm sm:text-base">
                <Home className="w-4 h-4" />
                <span>Go Home</span>
              </button>
            </Link>

            <Link href="javascript:history.back()">
              <button
                type="button"
                className="w-full h-11 sm:h-12 rounded-2xl rounded-xl-glass hover:bg-white/20 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] flex-center gap-2 text-white text-sm sm:text-base">
                <ArrowLeft className="w-4 h-4" />
                <span>Go Back</span>
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
