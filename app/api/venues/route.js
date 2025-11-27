// app/api/venues/route.js
import dbConnect from "@/lib/dbConnect";
import Listing from "@/models/listing";

async function parseRequestBody(req) {
  const contentType = req.headers.get("content-type") || "";

  if (contentType.includes("multipart/form-data")) {
    const fd = await req.formData();
    const obj = {};
    for (const [k, v] of fd.entries()) {
      obj[k] = typeof v === "string" ? v : v;
    }
    return obj;
  }

  try {
    return await req.json();
  } catch {
    return {};
  }
}

export async function GET() {
  try {
    await dbConnect();
    const listings = await Listing.find({});
    return new Response(JSON.stringify(listings), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Error fetching venues:", err);

    // 🔥 THIS IS THE ONLY PART THAT GETS ADDED (so middleware sees DB failure)
    return new Response(
      JSON.stringify({ error: "Failed to load listings", dbError: true }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

export async function POST(req) {
  try {
    await dbConnect();

    const body = await parseRequestBody(req);

    // Helper: convert to number safely
    const asNumberOrNull = (value) => {
      if (value == null) return null;
      const s = typeof value === "string" ? value.trim() : value;
      if (s === "") return null;
      const n = Number(s);
      return Number.isFinite(n) ? n : null;
    };

    // Required fields
    if (!body.title)
      return Response.json(
        { success: false, message: "Title is required" },
        { status: 400 }
      );
    if (!body.image)
      return Response.json(
        { success: false, message: "Image is required" },
        { status: 400 }
      );
    if (body.price === undefined || body.price === null || body.price === "")
      return Response.json(
        { success: false, message: "Price is required" },
        { status: 400 }
      );
    if (!body.location)
      return Response.json(
        { success: false, message: "Location is required" },
        { status: 400 }
      );
    if (!body.country)
      return Response.json(
        { success: false, message: "Country is required" },
        { status: 400 }
      );

    // Number validations
    const price = asNumberOrNull(body.price);
    const capacity = asNumberOrNull(body.capacity);
    const rating = asNumberOrNull(body.rating);

    if (price < 0) {
      return Response.json(
        { success: false, message: "Price cannot be negative" },
        { status: 400 }
      );
    }

    if (rating < 0) {
      return Response.json(
        { success: false, message: "Rating cannot be negative" },
        { status: 400 }
      );
    }

    if (price === null)
      return Response.json(
        { success: false, message: "Price must be a valid number" },
        { status: 400 }
      );

    // Amenities
    const amenitiesRaw = body.amenities ?? "";
    const amenities =
      typeof amenitiesRaw === "string" && amenitiesRaw.trim() !== ""
        ? amenitiesRaw
            .split(",")
            .map((a) => a.trim())
            .filter(Boolean)
        : [];

    // Checkbox
    const isAvailable =
      body.isAvailable === "on" ||
      body.isAvailable === true ||
      body.isAvailable === "true";

    // Build document
    const newVenue = new Listing({
      title: body.title.trim(),
      description: body.description.trim() || "",
      image: body.image.trim(),
      price,
      location: body.location.trim(),
      country: body.country.trim(),
      capacity,
      rating,
      amenities,
      contactEmail: body.contactEmail || null,
      contactPhone: body.contactPhone || null,
      isAvailable,
    });

    // Save + Run schema validations (price, rating, etc.)
    const saved = await newVenue.save();

    return Response.json(
      { success: true, message: "Venue created successfully", venue: saved },
      { status: 201 }
    );
  } catch (err) {
    console.error("Error creating venue:", err);

    // Clean validation error handling
    let message = err.message || "Server error";

    if (err.name === "ValidationError") {
      message = Object.values(err.errors)[0].message;
    }

    return Response.json({ success: false, message }, { status: 400 });
  }
}
