import dbConnect from "@/lib/dbConnect";
import Listing from "@/models/listing";
import Review from "@/models/review";

export async function POST(req, { params }) {
  try {
    await dbConnect();

    const { id } =  await params;
    const { rating, comment } = await req.json();

    // validation 
 if (rating === undefined || rating === null) {
    return Response.json(
      { error: "Rating is required" },
      { status: 400 }
    );
  }

  if (typeof rating !== "number" || rating <= 0 || rating > 5) {
    return Response.json(
      { error: "Rating must be a number between 0 and 5" },
      { status: 400 }
    );
  }

  if (!comment || comment.trim().length === 0) {
    return Response.json(
      { error: "Comment is required" },
      { status: 400 }
    );
  }
   // 1 Find the venue first
    const venue = await Listing.findById(id);

    if (!venue) {
      return Response.json({ error: "Venue not found" }, { status: 404 });
    }

    // 2 Create a review document
    const newReview = await Review.create({
      rating,
      comment,
    });
     // 3 Push the review._id into listing
    venue.reviews.push(newReview._id);
    await venue.save();

    // 4 Push ONLY the review._id into listing

    const updatedVenue = await Listing.findById(id).populate("reviews");

    return Response.json(updatedVenue, { status: 201 });

  } catch (error) {
    console.error("Review POST error:", error);
    return Response.json(
      { error: error.message || "Internal server error" }, 
      { status: 500 }
    );
  }
}