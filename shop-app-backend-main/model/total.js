const mongoose = require("mongoose");
const { Schema } = mongoose;

const totalSchema = new Schema(
  {
    authorBrand: { type: Schema.Types.ObjectId, required: true, ref: "Brand" },
    authorCatego: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Catego",
    },
    totalProduct: { type: Number, require: false, default: 0 },
    quantityRemaining: { type: Number, require: false, default: 0 },
  },
  { timestamps: true }
);

const Total = mongoose.model("Total", totalSchema);
module.exports = Total;
