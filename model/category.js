const mongoose = require("mongoose");
const { Schema } = mongoose;

const categoSchema = new Schema(
  {
    name: { type: String, required: true, default: "" },
  },
  { timestamps: true }
);

const Catego = mongoose.model("Catego", categoSchema);
module.exports = Catego;
