"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Newvenue() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);

    const toastId = toast.loading("Creating venue...");
    const formData = new FormData(e.currentTarget);

    try {
      const res = await fetch("/api/venues", {
        method: "POST",
        body: formData, // DO NOT set Content-Type; browser sets it for FormData
      });

      // If server returned non-JSON (or invalid), catch parsing errors:
      let result = null;
      try {
        result = await res.json();
      } catch (parseErr) {
        throw new Error(`Invalid server response (${res.status})`);
      }

      if (res.ok && result && result.success) {
        toast.update(toastId, {
          render: result.message || "Venue created",
          type: "success",
          isLoading: false,
          autoClose: 2000,
        });

        // give toast a moment to show then navigate
        setTimeout(() => router.push("/venues"), 700);
      } else {
        const msg = (result && result.message) || `Server error (${res.status})`;
        toast.update(toastId, {
          render: msg,
          type: "error",
          isLoading: false,
          autoClose: 4000,
        });
        setSubmitting(false);
      }
    } catch (err) {
      toast.update(toastId, {
        render: err.message || "Network error",
        type: "error",
        isLoading: false,
        autoClose: 4000,
      });
      setSubmitting(false);
    }
  }

  return (
    <>
      <ToastContainer position="top-right" newestOnTop />
      <main className="min-h-screen bg-gradient-to-b from-rose-50 via-white to-rose-50 py-12 px-6 font-[Poppins]">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-rose-500 to-pink-600 p-8 text-white">
            <h1 className="text-3xl font-bold" style={{ fontFamily: "Playfair Display, serif" }}>
              Add New Venue
            </h1>
            <p className="mt-2 text-sm text-rose-100">Fill in the details to create your dream venue ✨</p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Venue Title</label>
                <input type="text" name="title" placeholder="Crown Marquee Jallo" required className="w-full text-black rounded-xl border border-gray-300 px-4 py-3 shadow-sm focus:ring-2 focus:ring-rose-400 focus:outline-none" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input type="text" name="location" placeholder="📍 Lahore, Pakistan" required className="w-full text-black rounded-xl border border-gray-300 px-4 py-3 shadow-sm focus:ring-2 focus:ring-rose-400 focus:outline-none" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                <input type="text" name="country" placeholder="Pakistan" required className="w-full text-black rounded-xl border border-gray-300 px-4 py-3 shadow-sm focus:ring-2 focus:ring-rose-400 focus:outline-none" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price (per day in PKR)</label>
                <input type="number" name="price" placeholder="120000" required className="w-full text-black rounded-xl border border-gray-300 px-4 py-3 shadow-sm focus:ring-2 focus:ring-rose-400 focus:outline-none" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Capacity</label>
                <input type="number" name="capacity" placeholder="500" className="w-full text-black rounded-xl border border-gray-300 px-4 py-3 shadow-sm focus:ring-2 focus:ring-rose-400 focus:outline-none" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rating (1-5)</label>
                <input type="number" step="0.1" max="5" name="rating" placeholder="4.5" className="w-full text-black rounded-xl border border-gray-300 px-4 py-3 shadow-sm focus:ring-2 focus:ring-rose-400 focus:outline-none" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
              <input type="text" name="image" placeholder="https://example.com/venue.jpg" required className="w-full text-black rounded-xl border border-gray-300 px-4 py-3 shadow-sm focus:ring-2 focus:ring-rose-400 focus:outline-none" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea name="description" rows="4" placeholder="Describe your venue..." className="w-full text-black rounded-xl border border-gray-300 px-4 py-3 shadow-sm focus:ring-2 focus:ring-rose-400 focus:outline-none"></textarea>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Amenities (comma separated)</label>
              <input type="text" name="amenities" placeholder="Parking, Catering, Bridal Room" className="w-full text-black rounded-xl border border-gray-300 px-4 py-3 shadow-sm focus:ring-2 focus:ring-rose-400 focus:outline-none" />
            </div>

            <div className="flex justify-end">
              <button type="submit" disabled={submitting} className={`px-6 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-rose-500 to-pink-600 shadow-lg transform active:scale-95 transition ${submitting ? "opacity-60 cursor-not-allowed" : "hover:shadow-rose-400/50"}`}>
                {submitting ? "Creating..." : "Create Venue"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </>
  );
}
