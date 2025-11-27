import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    comment: String,
     rating: {
         type: Number,
          default: 0,
           min: [0, "Rating cannot be negative. Enter a rating between 0 and 5."], 
           max: [5, "Rating cannot be greater than 5. Enter a rating between 0 and 5."] 
        },
    createdAt:{
        type: Date,
        default: Date.now()
    }
  }
);
  
const review = mongoose.models.review || mongoose.model("review", reviewSchema);

export default review;
