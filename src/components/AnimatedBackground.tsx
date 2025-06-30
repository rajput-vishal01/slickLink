import React from "react";

const AnimatedBackground = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Base gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900" />
      
      {/* Static floating orbs with consistent opacity */}
      <div className="absolute -top-40 -right-32 w-80 h-80 bg-blue-500/15 rounded-full blur-2xl" />
      <div className="absolute top-1/2 -left-32 w-80 h-80 bg-purple-500/15 rounded-full blur-2xl" />
      <div className="absolute bottom-0 right-1/3 w-80 h-80 bg-pink-500/15 rounded-full blur-2xl" />
      
      {/* Additional subtle orbs for depth */}
      <div className="absolute top-1/4 right-1/4 w-60 h-60 bg-cyan-500/15 rounded-full blur-xl" />
      <div className="absolute bottom-1/4 left-1/4 w-60 h-60 bg-indigo-500/15 rounded-full blur-xl" />
    </div>
  );
};

export default AnimatedBackground;