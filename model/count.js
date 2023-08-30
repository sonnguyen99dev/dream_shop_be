const mongoose = require("mongoose");
const { Schema } = mongoose;

const countSchema = new Schema(
  {
    authorBrand: { type: Schema.Types.ObjectId, required: true, ref: "Brand" },
    authorCatego: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Catego",
    },
    count: { type: Number, require: false, default: 0 },
    quantityRemaining: { type: Number, require: false, default: 0 },
  },
  { timestamps: true }
);

const Count = mongoose.model("Count", countSchema);
module.exports = Count;
