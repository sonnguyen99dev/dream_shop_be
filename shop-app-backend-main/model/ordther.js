const mongoose = require("mongoose");
const { Schema } = mongoose;

const ortherSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    ortherItems: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          require: true,
          ref: "Product",
        },
        status: {
          type: String,
          enum: ["pending", "paid", "confirmed", "delivery", "done"],
          default: "pending",
        },
        description: Schema.Types.Mixed,
        price: { type: Number, require: true },
        quantity: { type: Number, require: true, default: 1 },
      },
    ],
    totalPrice: { type: Number, require: true, default: 0 },
    totalProduct: { type: Number, require: true, default: 1 },
    totalProductPaid: { type: Number, require: true, default: 0 },
  },
  { timestamps: true }
);

const Orther = mongoose.model("Orther", ortherSchema);
module.exports = Orther;
