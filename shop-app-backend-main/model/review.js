const mongoose = require("mongoose");
const { Schema } = mongoose;

const reviewSchema = new Schema(
  {
    authorProductId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Product",
    },
    userId: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    content: { type: String, require: false, default: "" },
    rating: { type: Number, min: 0, max: 5, required: true },
  },
  { timestamps: true }
);
const Review = mongoose.model("Review", reviewSchema);
module.exports = Review;
