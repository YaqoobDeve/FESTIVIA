import mongoose from "mongoose";
import Review from "./review";

const ListingSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    image: {
      type: String,
      required: true,
      default:
        "https://images.pexels.com/photos/169189/pexels-photo-169189.jpeg",
    },
    price: { type: Number, required: true, min: 0 },
    location: { type: String, required: true },
    country: { type: String, required: true },
    capacity: { type: Number, default: 0, min: 0 },
    amenities: { type: [String], default: [] },
    isAvailable: { type: Boolean, default: true },
    contactEmail: { type: String, trim: true },
    contactPhone: { type: String, trim: true },

    // Store review ObjectIDs
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }],
  },
);

// 🟩 Correct middleware
ListingSchema.post("findOneAndDelete", async (listing) => {
  console.log(listing)
  if (!listing) return;  
  await Review.deleteMany({ _id: { $in: listing.reviews } });
});

const Listing =
  mongoose.models.Listing || mongoose.model("Listing", ListingSchema);

export default Listing;
