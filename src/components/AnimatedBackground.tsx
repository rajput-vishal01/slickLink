"use client";
import React from "react";

const AnimatedBackground = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-black">
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-950 to-black" />
      <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-gradient-radial from-blue-500/15 via-purple-500/8 to-transparent rounded-full blur-3xl" />
    </div>
  );
};

export default AnimatedBackground;
