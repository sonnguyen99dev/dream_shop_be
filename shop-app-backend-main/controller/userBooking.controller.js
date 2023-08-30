const { catchAsync, AppError, sendResponse } = require("../helpers/utils");
const User = require("../model/user");
const UserBooking = require("../model/userBooking");

const userBookingController = {};
// create user booking
userBookingController.createUserBooking = catchAsync(async (req, res, next) => {
  const currentUserId = req.userId;
  const userBooking = { ...req.body };
  const user = await User.findById(currentUserId);
  if (!user) throw new AppError(400, "User Not Exists", "Update Orther Error");
  const emailInfo = await UserBooking.findOne({
    authorUser: user._id,
  });

  if (!emailInfo) {
    if (userBooking.phone.length < 10)
      throw new AppError(400, "Invalid Phone Number");

    const data = await UserBooking.create({
      name: userBooking.name,
      email: userBooking.email,
      phone: userBooking.phone,
      address: userBooking.address,
      streetsName: userBooking.streetsName,
      district: userBooking.district,
      city: userBooking.city,
      authorUser: user._id,
    });

    sendResponse(res, 200, true, data, null, "create user booking success");
  }
});
// get user Booking
userBookingController.getUserBooking = catchAsync(async (req, res, next) => {
  const currentUserId = req.userId;
  let user = await User.findById(currentUserId);
  if (!user)
    throw new AppError(
      400,
      "User Booking Not Exits",
      "Get User Booking Product Error"
    );
  user = await UserBooking.find({ authorUser: user._id });
  if (!user) sendResponse(res, 200, true, [], null, "Get User Booking Product");

  sendResponse(res, 200, true, user, null, "Get User Booking Product");
});
// update user booking
userBookingController.updateUserBooking = catchAsync(async (req, res, next) => {
  const currentUserId = req.userId;
  const userId = req.params.userId;

  if (currentUserId !== userId)
    throw new AppError(400, "User Not Match", "Update User Error");

  let user = await User.findById(currentUserId);

  if (!user)
    throw new AppError(
      400,
      "User Booking Not exstis",
      "Update User Booking Product Error"
    );
  user = await UserBooking.find({ authorUser: user._id });

  if (req.body.phone.length >= 10)
    throw new AppError(400, "Invalid Phone Number");

  const allow = [
    "name",
    "email",
    "phone",
    "address",
    "streetsName",
    "district",
    "city",
  ];

  allow.forEach(async (ele) => {
    if (req.body[ele] !== undefined) {
      user[ele] = req.body[ele];
    }
  });
  await user.save();

  sendResponse(res, 200, true, user, null, "Update User Success");
});

module.exports = userBookingController;
