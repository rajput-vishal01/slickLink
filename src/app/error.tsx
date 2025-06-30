"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw, Home, Bug } from "lucide-react";

interface ErrorProps {
  error: Error;
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps): JSX.Element {
  useEffect(() => {
    console.error(error);
  }, [error]);

  const handleGoHome = (): void => {
    if (typeof window !== 'undefined') {
      window.location.href = '/';
    }
  };

  return (
    <div className="min-h-screen w-full flex-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-md mx-auto card-glass p-6 sm:p-8 lg:p-10 shadow-2xl shadow-black/25 relative overflow-hidden animate-in fade-in-0 slide-in-from-bottom-8 duration-1000">
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none rounded-3xl" />
        
        <div className="relative z-10 text-center">
          {/* Error Icon */}
          <div className="mb-6 sm:mb-8">
            <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-xl-glass bg-gradient-to-r from-red-500/20 to-orange-500/20 flex-center mb-4">
              <AlertTriangle className="w-8 h-8 sm:w-10 sm:h-10 text-red-400" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold mb-2 sm:mb-3 bg-gradient-to-r from-red-400 via-orange-400 to-yellow-400 bg-clip-text text-transparent">
              Something went wrong
            </h1>
          </div>

          {/* Error Message */}
          <div className="mb-6 sm:mb-8 card-glass bg-red-500/10 border border-red-500/20 p-3 sm:p-4 shadow-lg shadow-red-500/10">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-red-500/20 flex-center flex-shrink-0 mt-0.5 sm:mt-0">
                <Bug className="w-4 h-4 text-red-400" />
              </div>
              <div className="flex-1 min-w-0 text-left">
                <p className="font-medium text-red-400 text-sm">Application Error</p>
                <p className="text-red-300/80 text-sm break-words">
                  {error?.message || "An unexpected error occurred. Please try again."}
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 sm:space-y-4">
            <button
              type="button"
              onClick={reset}
              className="w-full h-11 sm:h-12 rounded-2xl bg-gradient-to-r from-orange-500 to-red-500 text-white font-medium hover:from-orange-600 hover:to-red-600 transition-all duration-300 shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 hover:scale-[1.02] active:scale-[0.98] flex-center gap-2 text-sm sm:text-base"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Try Again</span>
            </button>

            <button
              type="button"
              onClick={handleGoHome}
              className="w-full h-11 sm:h-12 rounded-2xl rounded-xl-glass hover:bg-white/20 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] flex-center text-white gap-2 text-sm sm:text-base"
            >
              <Home className="w-4 h-4" />
              <span>Go Home</span>
            </button>
          </div>

          {/* Additional Info */}
          <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-white/10">
            <p className="text-xs-gray">
              If this problem persists, please contact our support team.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
