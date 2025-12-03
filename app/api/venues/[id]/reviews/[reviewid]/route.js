import dbConnect from "@/lib/dbConnect";
import Listing from "@/models/listing";
import Review from "@/models/review";
import mongoose from "mongoose";
import { isValidObjectId } from "mongoose";




export async function DELETE(req, { params }) {
  try {
    await dbConnect();
    const { id,reviewid } = await params;

    // ❌ Invalid ObjectId
    if (!isValidObjectId(id)) {
      return Response.json({ error: "Invalid ID" }, { status: 400 });
    }
     if (!isValidObjectId(reviewid)) {
      return Response.json({ error: "Invalid review ID" }, { status: 400 });
    }

    const updatedReview = await Listing.findByIdAndUpdate(id,{$pull:{reviews: reviewid}});
    const deletedReview = await Review.findByIdAndDelete(reviewid);

    if (!updatedReview) {
      return Response.json({ error: "Venue not found" }, { status: 404 });
    }
    if (!deletedReview) {
      return Response.json({ error: "Review not found" }, { status: 404 });
    }

    return Response.json(deletedReview, { status: 200 });
  } catch (error) {
    console.error("Error deleting Review:", error);
    return Response.json({ error: "Failed to delete Review" }, { status: 500 });
  }
}
