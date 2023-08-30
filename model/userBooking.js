const mongoose = require("mongoose");
const { Schema } = mongoose;

const userBooking = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    streetsName: { type: String, required: true },
    district: { type: String, required: true },
    city: { type: String, required: true },
    authorUser: { type: Schema.Types.ObjectId, required: true },
  },
  { timestamps: true }
);

const UserBooking = mongoose.model("UserBooking", userBooking);
module.exports = UserBooking;
