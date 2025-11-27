import mongoose, { Schema } from "mongoose";

const ListingSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    image: {
      type: String,
      required: true,
      default: "https://images.pexels.com/photos/169189/pexels-photo-169189.jpeg",
    },
    price: { type: Number, required: true, min: [0, "Price cannot be negative. Please enter a valid amount."] },
    location: { type: String, required: true },
    country: { type: String, required: true },
    capacity: { type: Number, default: 0, min: [0, "Capacity cannot be negative."] },
    amenities: { type: [String], default: [] },
    isAvailable: { type: Boolean, default: true },
    contactEmail: { type: String, trim: true },
    contactPhone: { type: String, trim: true },
    reviews:[
      {
        type: Schema.Types.ObjectId,
        ref:"review"
      }
    ]
  },
  { timestamps: true }
);

// Export the model for server actions and API
const Listing = mongoose.models.Listing || mongoose.model("Listing", ListingSchema);

export default Listing;
