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
    //laptop
    model: { type: String, required: true, default: "" },
    latest_price: { type: String, require: false, default: "" },
    old_price: { type: String, require: false, default: "" },
    discount: { type: String, require: false, default: "" },
    ratings: { type: String, require: false, default: "" },
    weight: { type: String, require: false, default: "" },
    os: { type: String, require: false, default: "" },
    os_bit: { type: String, require: false, default: "" },
    ssd: { type: String, require: false, default: "" },
    ssd: { type: String, require: false, default: "" },
    ram_gb: { type: String, require: false, default: "" },
    ram_type: { type: String, require: false, default: "" },
    processor_brand: { type: String, require: false, default: "" },
    processor_name: { type: String, require: false, default: "" },
    processor_gnrtn: { type: String, require: false, default: "" },
    imageUrl: { type: String, require: false, default: "" },
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
    //phone
    memory_size: { type: String, require: false, default: "" },
    battery_size: { type: String, require: false, default: "" },
    screen_size: { type: String, require: false, default: "" },
    // watch
    dimensions: { type: String, require: false, default: "" },
    zoomWide: { type: String, require: false, default: "" },
    zoomTele: { type: String, require: false, default: "" },
    maxResolution: { type: String, require: false, default: "" },
    lowResolution: { type: String, require: false, default: "" },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
