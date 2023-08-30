const mongoose = require("mongoose");
const { Schema } = mongoose;

const productSchema = new Schema(
  {
    authorCatego: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Catego",
    },
    authorBrand: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Brand",
    },
    description: Schema.Types.Mixed,
    imageUrl: [{ type: String, require: false, default: "" }],
    stock: {
      type: String,
      require: false,
      enum: ["stocking", "outofstock"],
      default: "stocking",
    },
    newProduct: {
      type: String,
      require: false,
      enum: ["old", "new"],
      default: "new",
    },
    ratings: { type: Number, require: false, default: 5 },
    reviews: [{ type: Schema.Types.ObjectId, ref: "Review" }],
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
