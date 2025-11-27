"use client";
import Link from "next/link";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur shadow-md">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/">
        <h1
          className="text-2xl font-bold text-rose-800"
          style={{ fontFamily: "Playfair Display, serif" }}
        >
          Festivia
        </h1></Link>

        {/* Navigation */}
        <nav className="hidden items-center text-black md:flex gap-6 text-sm font-medium">
          <Link href="/" className="hover:text-rose-600 transition">
            Home
          </Link>
          <Link href="/venues" className="hover:text-rose-600 transition">
            Venues
          </Link>
          <Link href="/planners" className="hover:text-rose-600 transition">
            Planners
          </Link>
          <Link href="/stories" className="hover:text-rose-600 transition">
            Stories
          </Link>
          <Link href="/contact" className="hover:text-rose-600 transition">
            Contact
          </Link>
          <Link href="/venues">
          <button className="px-4 py-2 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 text-white font-semibold shadow-lg hover:shadow-rose-400/50 transition">
            List Venue
          </button></Link>
        </nav>
      </div>
    </header>
  );
}
