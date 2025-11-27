"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";

import Image from "next/image";
import Loader from "@/app/components/Loader";
export default function Venues() {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);


useEffect(() => {
  window.scrollTo(0, 0);

  async function fetchVenues() {
    try {
      const response = await fetch("/api/venues");
      if (!response.ok) {
  console.warn("API returned non-OK status", response.status);
  setVenues([]);
  return;
}

      const data = await response.json();
      console.log("API DATA:", data);
      setVenues(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching venues:", error);
      setVenues([]);
    } finally {
      setLoading(false);
    }
  }

  fetchVenues();
  
}, []);

  if (loading) return <Loader />;
  return (
    <div className="bg-gradient-to-b from-rose-50 via-white to-rose-50 text-gray-800 font-[Poppins]">
      <section className="relative">
        <Image
          src="https://images.pexels.com/photos/169185/pexels-photo-169185.jpeg?auto=compress&cs=tinysrgb&w=600"
          width={1600}
          height={600}
          alt="Wedding Hero"
          className="w-full h-80 object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-rose-900/70 via-rose-800/40 to-transparent"></div>
        <div className="absolute inset-0 flex items-center justify-center text-center">
          <div className="text-white max-w-2xl">
            <h2
              className="text-4xl md:text-5xl font-bold"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Discover <span className="text-rose-300">Dream Venues</span>
            </h2>
            <p className="mt-4 text-lg text-rose-100">
              Find, compare, and book the perfect place to make your shaadi unforgettable ✨
            </p>
          </div>
        </div>
      </section>
      <main className="max-w-7xl mx-auto px-6 py-16">
        <h3 className="text-2xl font-bold text-rose-900 mb-8">Available Venues</h3>

        <div className="grid md:grid-cols-3 gap-10">
          {venues.map((venue) => (
            <Link key={venue._id} href={`/venues/${venue._id}`}>
              <article className="group relative bg-white rounded-2xl shadow-xl overflow-hidden transform transition duration-500 hover:scale-105 hover:shadow-2xl">
                <Image
                  src={venue.image || "https://via.placeholder.com/900x600?text=No+Image"}
                  width={900}
                  height={600}
                  alt={venue.title || "Venue"}
                  className="w-full h-60 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-bold text-rose-900">{venue.title || "No Title"}</h3>
                  <p className="text-sm text-gray-600">
                    {venue.location || "Unknown City"} —{" "}
                    {venue.capacity ? `Capacity ${venue.capacity} guests` : "Capacity not listed"}
                  </p>

                  <div className="flex items-center gap-2 mt-2 text-yellow-500">
                    {venue.rating ? (
                      <>
                        <span>⭐ {venue.rating.toFixed(1)}</span>
                        <span className="text-xs text-gray-500">(User ratings)</span>
                      </>
                    ) : (
                      <span className="text-gray-500 text-sm">No ratings yet</span>
                    )}
                  </div>

                  <div className="mt-2 text-sm text-gray-700">
                    {venue.amenities && venue.amenities.length > 0
                      ? venue.amenities.join(", ")
                      : "No amenities listed"}
                  </div>

                  <div className="mt-2 text-sm text-gray-700">
                    Email: {venue.contactEmail || "Not provided"} | Phone:{" "}
                    {venue.contactPhone || "Not provided"}
                  </div>

                  <div className="mt-4 flex justify-between items-center">
                    <span className="bg-rose-50 text-rose-800 font-semibold px-3 py-1 rounded-lg">
                      PKR {venue.price || "N/A"}/day
                    </span>

                    <button className="relative cursor-pointer px-5 py-2 rounded-xl font-semibold text-white bg-gradient-to-r from-rose-500 to-pink-600 shadow-md hover:shadow-rose-400/50 transition">
                      Book Now
                    </button>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
