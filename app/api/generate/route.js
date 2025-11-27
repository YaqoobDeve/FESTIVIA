import dbConnect from "@/lib/dbConnect";
import Listing from "@/models/listing";
import sampleListings from "@/data/samplelistings";

export async function POST() {
  try {
    await dbConnect();
    await Listing.deleteMany({});
    await Listing.insertMany(sampleListings);
    return Response.json(
      { message: "Database seeded successfully!" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Seeding failed:", error);
    return Response.json(
      { error: "Failed to seed database", details: error.message },
      { status: 500 }
    );
  }
}
