"use client";
import React, { useState, useEffect } from "react";
import Loader from "@/app/components/Loader";
import { useParams, useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


export default function VenueEditForm() {
  const router = useRouter();
  const { id } = useParams();
  const [formData, setFormData] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(`/api/venues/${id}`);
        const data = await res.json();
        setFormData(data);
      } catch (error) {
        console.error("Error fetching venue:", error);
      }
    }
    fetchData();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation for required fields
    const title = e.target.title.value.trim();
    const description = e.target.description.value.trim();
    const image = e.target.image.value.trim();
    const location = e.target.location.value.trim();
    const country = e.target.country.value.trim();
    const price = e.target.price.value;

    if (!title || !description || !image || !location || !country || !price) {
      toast.error("Please fill in all required fields.");
      return;
    }

    const updatedVenue = {
      title,
      description,
      image,
      price: Number(price),
      location,
      country,
      capacity: e.target.capacity.value ? Number(e.target.capacity.value) : null,
      rating: e.target.rating.value ? Number(e.target.rating.value) : null,
      amenities: e.target.amenities.value
        ? e.target.amenities.value.split(",").map((a) => a.trim()).filter((a) => a)
        : [],
    };

    try {
      const res = await fetch(`/api/venues/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedVenue),
      });

      if (res.ok) {
        router.push("/venues");
      } else {
        const err = await res.json();
        toast.error(err.error || "Update failed");


      }
    } catch (error) {
      toast.error("Network error. Please try again.");

    }
  };

  if (!formData) return <Loader />;

  return (
    <main className="min-h-screen bg-gradient-to-b from-rose-50 via-white to-rose-50 py-12 px-6 font-[Poppins]">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-rose-500 to-pink-600 p-8 text-white">
          <h1 className="text-3xl font-bold" style={{ fontFamily: "Playfair Display, serif" }}>
            Edit Venue
          </h1>
          <p className="mt-2 text-sm text-rose-100">
            Update details of your venue and make it shine ✨
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Venue Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                defaultValue={formData.title}
                required
                className="w-full rounded-xl border text-black border-gray-300 px-4 py-3 shadow-sm focus:ring-2 focus:ring-rose-400 focus:outline-none"
              />
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="location"
                defaultValue={formData.location}
                required
                className="w-full rounded-xl border text-black border-gray-300 px-4 py-3 shadow-sm focus:ring-2 focus:ring-rose-400 focus:outline-none"
              />
            </div>

            {/* Country */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Country <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="country"
                defaultValue={formData.country}
                required
                className="w-full rounded-xl border text-black border-gray-300 px-4 py-3 shadow-sm focus:ring-2 focus:ring-rose-400 focus:outline-none"
              />
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price (per day in PKR) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="price"
                defaultValue={formData.price}
                required
                className="w-full rounded-xl border text-black border-gray-300 px-4 py-3 shadow-sm focus:ring-2 focus:ring-rose-400 focus:outline-none"
              />
            </div>

            {/* Capacity */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Capacity
              </label>
              <input
                type="number"
                name="capacity"
                defaultValue={formData.capacity || ""}
                className="w-full rounded-xl border text-black border-gray-300 px-4 py-3 shadow-sm focus:ring-2 focus:ring-rose-400 focus:outline-none"
              />
            </div>

            {/* Rating */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Rating (1-5)
              </label>
              <input
                type="number"
                step="0.1"
                max="5"
                name="rating"
                defaultValue={formData.rating || ""}
                className="w-full rounded-xl border text-black border-gray-300 px-4 py-3 shadow-sm focus:ring-2 focus:ring-rose-400 focus:outline-none"
              />
            </div>
          </div>

          {/* Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Image URL <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="image"
              defaultValue={formData.image}
              required
              className="w-full rounded-xl border text-black border-gray-300 px-4 py-3 shadow-sm focus:ring-2 focus:ring-rose-400 focus:outline-none"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              name="description"
              rows="4"
              defaultValue={formData.description}
              required
              className="w-full rounded-xl border text-black border-gray-300 px-4 py-3 shadow-sm focus:ring-2 focus:ring-rose-400 focus:outline-none"
            ></textarea>
          </div>

          {/* Amenities */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Amenities (comma separated)
            </label>
            <input
              type="text"
              name="amenities"
              defaultValue={formData.amenities?.join(", ") || ""}
              placeholder="Parking, Catering, Bridal Room"
              className="w-full rounded-xl border text-black border-gray-300 px-4 py-3 shadow-sm focus:ring-2 focus:ring-rose-400 focus:outline-none"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-6 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-rose-500 to-pink-600 shadow-lg hover:shadow-rose-400/50 transform active:scale-95 transition"
            >
              Update Venue
            </button>
          </div>
        </form>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </main>
  );
}
