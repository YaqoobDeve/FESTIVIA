"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { ToastContainer, toast } from 'react-toastify';
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import Loader from "@/app/components/Loader";
import { notFound } from "next/navigation";


export default function VenueDetailShow() {
  const { id } = useParams();
  const router = useRouter();
  const [venue, setVenue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [reviewText, setReviewText] = useState("");
  const [reviewRating, setReviewRating] = useState(2.5); // Changed default to 2.5
  const [submittingReview, setSubmittingReview] = useState(false);

  const fallback = {
    title: "No Title",
    description: "No description provided",
    image: "https://via.placeholder.com/1600x900?text=No+Image",
    price: null,
    location: "Unknown City",
    country: "Unknown Country",
    capacity: null,
    rating: null,
    amenities: [],
    contactEmail: null,
    contactPhone: null,
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!id) {
      setLoading(false);
      return;
    }

    let mounted = true;
    async function fetchVenue() {
      try {
        const res = await fetch(`/api/venues/${id}`);
        if (res.status === 400 || res.status === 404) {
          notFound();
          return;
        }
        if (!res.ok) throw new Error("Not found");
        const data = await res.json();
        
        // 🔍 DEBUG: Check if reviews are populated
        console.log("Fetched venue:", data);
        console.log("Reviews:", data.reviews);
        
        if (mounted) setVenue(data || fallback);
      } catch (err) {
        console.warn("Fetch venue failed, using fallback", err);
        notFound()
      } finally {
        if (mounted) setLoading(false);
      }
    }
    fetchVenue();
    return () => (mounted = false);
  }, [id]);

  const formatPKR = (n) =>
    n ? new Intl.NumberFormat("en-PK", { style: "currency", currency: "PKR" }).format(Number(n)) : "Price not listed";

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this venue?")) return;
    try {
      const res = await fetch(`/api/venues/${id}`, { method: "DELETE" });
      if (res.ok) router.push("/venues");
      else console.error("Delete failed", await res.json());
    } catch (err) {
      console.error("Delete error", err);
    }
  };
  const DeleteReview = async (reviewid) => {
   const res =  await fetch(`/api/venues/${id}/reviews/${reviewid}`,{method:"DELETE"})
   setVenue((prev)=>({
    ...prev,
    reviews:prev.reviews.filter((r)=> r._id !== reviewid)
   }))
  }
  

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setSubmittingReview(true);
    
    try {
      // CLIENT-SIDE VALIDATION
      if (reviewRating < 0 || reviewRating > 5) {
        toast.error("Rating must be between 0 and 5");
        setSubmittingReview(false);
        return;
      }

      if (!reviewText || !reviewText.trim()) {
        toast.error("Please enter a comment");
        setSubmittingReview(false);
        return;
      }

      console.log("Submitting review:", { rating: reviewRating, comment: reviewText.trim() });

      const res = await fetch(`/api/venues/${id}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rating: Number(reviewRating),
          comment: reviewText.trim(),
        }),
      });

      // ✅ FIX: Check response status first, then parse JSON
      if (!res.ok) {
        let errorMessage = "Failed to submit review";
        try {
          const errorData = await res.json();
          errorMessage = errorData.error || errorMessage;
        } catch (e) {
          console.error("Error parsing error response:", e);
        }
        toast.error(errorMessage);
        return;
      }

      // Only parse JSON if response is ok
      const data = await res.json();

      toast.success("Review submitted successfully!");
      
      // ✅ UPDATE VENUE STATE WITH NEW DATA
      setVenue(data);
      
      // Reset form
      setReviewRating(2.5);
      setReviewText("");

    } catch (err) {
      console.error("Review submit error:", err);
      toast.error("An error occurred while submitting your review");
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleBook = async () => setBooking(true);

  if (loading) return <Loader />;
  
  if (!loading && !venue) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-3xl font-bold">Venue Not Found</h1>
      </div>
    );
  }

  const gallery = [
    venue.image || fallback.image,
    `https://source.unsplash.com/900x600/?wedding,decor,ceremony`,
    `https://source.unsplash.com/900x600/?banquet,hall`,
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-rose-50 via-white to-rose-50 font-[Poppins] py-12 px-6">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-8">
        {/* Left / Main column */}
        <section className="lg:col-span-2 space-y-6">
          {/* Cinematic hero */}
          <div className="relative rounded-2xl overflow-hidden shadow-2xl">
            <div className="absolute inset-0 z-10 bg-gradient-to-t from-rose-900/70 via-rose-800/30 to-transparent" />
            <Image
              src={gallery[0]}
              alt={venue.title}
              width={1600}
              height={900}
              className="w-full h-[420px] object-cover"
              priority
            />
            <div className="absolute bottom-6 left-6 z-20 text-white">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight" style={{ fontFamily: "Playfair Display, serif" }}>
                {venue.title || fallback.title}
              </h1>
              <p className="mt-2 text-sm md:text-base text-rose-100 max-w-2xl">
                {venue.location || fallback.location} · {venue.country || fallback.country}
              </p>
            </div>
            <div className="absolute top-6 right-6 z-20 flex gap-3">
              <Link href={`/venues/${id}/edit`}>
                <button className="px-4 py-2 rounded-lg bg-white/90 text-rose-700 font-semibold shadow">Edit</button>
              </Link>
              <button onClick={handleDelete} className="px-4 py-2 rounded-lg bg-red-600 text-white font-semibold shadow">
                Delete
              </button>
            </div>
          </div>

          {/* Gallery thumbnails */}
          <div className="grid grid-cols-3 gap-3">
            {gallery.map((src, i) => (
              <div key={i} className="rounded-lg overflow-hidden transform transition hover:scale-105 shadow">
                <Image src={src} alt={`${venue.title} ${i}`} width={400} height={260} className="w-full h-28 md:h-36 object-cover" />
              </div>
            ))}
          </div>

          {/* Description & highlights */}
          <article className="bg-white rounded-2xl p-6 shadow">
            <h2 className="text-2xl font-bold text-rose-900 mb-3" style={{ fontFamily: "Playfair Display, serif" }}>
              About this venue
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">{venue.description || fallback.description}</p>

            <div className="flex flex-wrap gap-3 mb-6">
              {venue.amenities && venue.amenities.length > 0
                ? venue.amenities.map((a, i) => (
                    <span key={i} className="px-3 py-1 rounded-full bg-rose-50 text-rose-800 font-medium">
                      {a}
                    </span>
                  ))
                : <span className="px-3 py-1 rounded-full bg-rose-50 text-gray-500 font-medium">No amenities listed</span>
              }
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 bg-rose-50 rounded-lg">
                <p className="text-xs text-gray-600">Capacity</p>
                <p className="text-lg font-semibold text-rose-900">{venue.capacity ? `${venue.capacity} guests` : "Capacity not listed"}</p>
              </div>
              <div className="p-4 bg-rose-50 rounded-lg">
                <p className="text-xs text-gray-600">Venue Type</p>
                <p className="text-lg font-semibold text-rose-900">Marquee / Banquet</p>
              </div>
              <div className="p-4 bg-rose-50 rounded-lg">
                <p className="text-xs text-gray-600">Host City</p>
                <p className="text-lg font-semibold text-rose-900">{venue.location.replace("📍 ", "") || fallback.location}</p>
              </div>
            </div>
          </article>

          {/* Policies / Notes */}
          <article className="bg-white rounded-2xl p-6 shadow">
            <h3 className="text-lg font-semibold text-rose-900 mb-2">Policies & notes</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Booking requires 30% deposit.</li>
              <li>Catering & decor allowed with prior approval.</li>
              <li>Peak season surcharges may apply.</li>
            </ul>
          </article>

          

          {/* ✅ REVIEW FORM - NOW INSIDE THE GRID */}
          <form onSubmit={handleReviewSubmit} className="bg-white rounded-2xl p-6 shadow">
            <h3 className="text-2xl font-bold text-rose-900 mb-4" style={{ fontFamily: "Playfair Display, serif" }}>
              Leave a Review
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Rating: <span className="text-rose-600">{reviewRating.toFixed(1)} ⭐</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="5"
                  step="0.1"
                  value={reviewRating}
                  onChange={(e) => setReviewRating(Number(e.target.value))}
                  className="w-full h-2 bg-rose-200 rounded-lg appearance-none cursor-pointer accent-rose-600"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>0</span>
                  <span>2.5</span>
                  <span>5</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Your Comment
                </label>
                <textarea
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="Share your experience with this venue..."
                  rows="4"
                  className="w-full p-3 border border-rose-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <button
                type="submit"
                disabled={submittingReview}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 text-white font-semibold shadow-lg transform active:scale-95 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submittingReview ? "Submitting..." : "Submit Review"}
              </button>
            </div>
          </form>

          {/* ✅ ALL REVIEWS SECTION */}
          <div className="bg-white rounded-2xl p-6 shadow">
            <h3 className="text-2xl font-bold text-rose-900 mb-4" style={{ fontFamily: "Playfair Display, serif" }}>
              Reviews ({venue.reviews?.length || 0})
            </h3>

            <div className="space-y-4">
              {venue.reviews && venue.reviews.length > 0 ? (
                venue.reviews.map((review) => (
                  <div key={review._id} className="p-4 border border-rose-100 rounded-lg bg-rose-50/50">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-yellow-600">
                        ⭐ {review.rating != null ? Number(review.rating).toFixed(1) : 'N/A'}
                      </span>
                      <span className="text-xs text-gray-500">
                        {review.createdAt ? new Date(review.createdAt).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric', 
                          year: 'numeric' 
                        }) : 'Just now'}
                      </span>
                    </div>
                    <p className="text-gray-700">{review.comment || 'No comment'}</p>
                    <div>
                      <button onClick={()=>{DeleteReview(review._id)}}>
                        delete
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-8">No reviews yet. Be the first to review!</p>
              )}
            </div>
          </div>
        </section>

        {/* Right / Sticky booking card */}
        <aside className="lg:col-span-1">

          <div className="sticky top-28 space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-gray-500">Starting at</p>
                  <div className="flex items-baseline gap-2">
                    <p className="text-2xl font-extrabold text-rose-900">{formatPKR(venue.price)}</p>
                    <span className="text-sm text-gray-500">/day</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-500">Rating</div>
                  <div className="text-yellow-500 font-semibold">
                    {venue.rating ? `⭐ ${venue.rating.toFixed(1)}` : "No ratings yet"}
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <button
                  onClick={handleBook}
                  disabled={booking}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 text-white font-semibold shadow-lg transform active:scale-95 transition"
                >
                  {booking ? "Processing…" : "Book Now"}
                </button>
                <button
                  onClick={() => router.push(`/venues/${id}/edit`)}
                  className="w-full mt-3 py-2 rounded-xl border border-rose-200 text-rose-700 font-semibold"
                >
                  Request Quote
                </button>
              </div>

              <div className="mt-4 text-xs text-gray-500">
                <p>Free cancellation within 24 hours.</p>
                <p>Email: {venue.contactEmail || "Not provided"}</p>
                <p>Phone: {venue.contactPhone || "Not provided"}</p>
              </div>
            </div>
          </div>
        </aside>




      </div>
    </main>
  );
}