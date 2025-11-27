"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black px-6">

      {/* Floating 404 */}
      <motion.h1
        initial={{ opacity: 0, scale: 0.5, y: -50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-[120px] md:text-[160px] font-extrabold text-white drop-shadow-lg"
      >
        404
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.3 }}
        className="text-xl md:text-2xl text-gray-300 text-center max-w-xl"
      >
        The page you're looking for has wandered off into the unknown.
      </motion.p>

      {/* Animated Illustration */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, delay: 0.4 }}
        className="mt-10"
      >
        <img
          src="https://illustrations.popsy.co/gray/camping.svg"
          alt="Not Found Illustration"
          className="w-64 md:w-80 opacity-90"
        />
      </motion.div>

      {/* Buttons */}
      <div className="flex gap-4 mt-12">

        {/* Home Button */}
        <motion.div
          whileHover={{ scale: 1.07 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link
            href="/"
            className="px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold shadow-lg hover:bg-blue-700 transition"
          >
            Go Home
          </Link>
        </motion.div>

        {/* Contact Button */}
        <motion.div
          whileHover={{ scale: 1.07 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link
            href="/contact"
            className="px-6 py-3 rounded-xl bg-gray-700 text-gray-200 font-semibold shadow-lg hover:bg-gray-600 transition"
          >
            Contact Support
          </Link>
        </motion.div>

      </div>

      {/* Floating Stars Animation */}
      <motion.div
        animate={{
          opacity: [0.2, 1, 0.2],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-10 right-20 text-white text-4xl"
      >
        ✦
      </motion.div>

      <motion.div
        animate={{
          opacity: [0.1, 1, 0.1],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute bottom-20 left-16 text-white text-3xl"
      >
        ✧
      </motion.div>

    </div>
  );
}
