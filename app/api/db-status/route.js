// app/api/db-status/route.js
import mongoose from "mongoose";
import dbConnect from "@/lib/dbConnect";

export async function GET() {
  try {
    // Try connecting using the same connection utility
    await dbConnect();

    // If Mongoose is ready, DB is healthy
    if (mongoose.connection.readyState === 1) {
      return Response.json({ status: "ok" }, { status: 200 });
    }

    return Response.json(
      { status: "down", message: "Mongoose not connected" },
      { status: 500 }
    );
  } catch (error) {
    console.error("DB status check failed:", error);
    return Response.json(
      { status: "down", message: error?.message },
      { status: 500 }
    );
  }
}
