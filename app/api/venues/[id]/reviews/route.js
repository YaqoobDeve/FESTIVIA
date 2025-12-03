import dbConnect from "@/lib/dbConnect";
import Listing from "@/models/listing";
import Review from "@/models/review";

export async function POST(req, { params }) {
  try {
    await dbConnect();

    const { id } = params;
    
    // ✅ Add error handling for JSON parsing
    let body;
    try {
      body = await req.json();
    } catch (e) {
      console.error("JSON parse error:", e);
      return Response.json(
        { error: "Invalid JSON in request body" },
        { status: 400 }
      );
    }

    const { rating, comment } = body;

    console.log("Received review submission:", { id, rating, comment });

    // ✅ VALIDATION
    if (rating === undefined || rating === null) {
      return Response.json(
        { error: "Rating is required" },
        { status: 400 }
      );
    }

    if (typeof rating !== "number" || rating < 0 || rating > 5) {
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

    // 1️⃣ Find the venue first
    const venue = await Listing.findById(id);

    if (!venue) {
      return Response.json({ error: "Venue not found" }, { status: 404 });
    }

    // 2️⃣ Create a review document
    const newReview = await Review.create({
      rating: Number(rating),
      comment: comment.trim(),
    });

    console.log("Created review:", newReview);

    // 3️⃣ Push the review._id into listing
    venue.reviews.push(newReview._id);
    await venue.save();

    console.log("Updated venue with review ID");

    // 4️⃣ ✅ RETURN POPULATED VENUE DATA
    const updatedVenue = await Listing.findById(id).populate("reviews");
    
    console.log("Returning updated venue with populated reviews");
    
    return Response.json(updatedVenue, { status: 201 });

  } catch (error) {
    console.error("Review POST error:", error);
    console.error("Error stack:", error.stack);
    
    return Response.json(
      { error: error.message || "Internal server error" }, 
      { status: 500 }
    );
  }
}