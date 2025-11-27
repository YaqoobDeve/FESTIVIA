"use client";
import React from "react";

const Loader = () => {
  return (
    <div className="flex items-center justify-center h-[85vh] bg-gradient-to-b from-rose-50 via-white to-rose-50">
      <div className="flex flex-col items-center space-y-4">
        <div className="w-12 h-12 border-4 border-rose-400 border-t-transparent rounded-full animate-spin"></div>
        <p
          className="text-gray-700 text-lg font-medium tracking-wide"
          style={{ fontFamily: "Playfair Display, serif" }}
        >
          Loading Festivia…
        </p>
      </div>
    </div>
  );
};

export default Loader;
