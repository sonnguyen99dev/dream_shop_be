const express = require("express");
const { body, param } = require("express-validator");
const {
  createUser,
  getUser,
  updateUser,
  deletedUser,
  resetPassword,
  changePassword,
} = require("../controller/user.controller");
const authentication = require("../middlwe/authentication");
const validations = require("../middlwe/validations");
const {
  getUserBooking,
  createUserBooking,
} = require("../controller/userBooking.controller");
const router = express.Router();

// create User
router.post(
  "/",
  validations.validate([
    body("email", "invalid email")
      .exists()
      .isEmail()
      .notEmpty()
      .normalizeEmail({ gmail_remove_dots: false }),
    body("password", "invalid password").exists().notEmpty(),
    body("name", "invalid name").exists().notEmpty().isString(),
  ]),
  createUser
);
// get user me
router.get(
  "/me",
  authentication.loginRequired,
  validations.validate([]),
  getUser
);
// update user
router.put(
  "/update/:userId",
  authentication.loginRequired,
  validations.validate([
    param("userId", "invalid userId")
      .exists()
      .notEmpty()
      .custom(validations.checkObjectId),
  ]),
  updateUser
);
// deleted user
router.delete(
  "/deleted/:userId",
  authentication.loginRequired,
  validations.validate([
    param("userId", "invalid userId")
      .exists()
      .notEmpty()
      .custom(validations.checkObjectId),
  ]),
  deletedUser
);
// reset password
router.post(
  "/resetpassword",
  validations.validate([
    body("email", "invalid email")
      .exists()
      .notEmpty()
      .normalizeEmail({ gmail_remove_dots: false }),
  ]),
  resetPassword
);
// change password
router.post(
  "/changepassword/:userId",
  authentication.loginRequired,
  validations.validate([
    param("userId", "invalid userId")
      .exists()
      .notEmpty()
      .custom(validations.checkObjectId),
    body("password", "invalid password").exists().notEmpty(),
  ]),
  changePassword
);
//create user booking
router.post(
  "/userBooking",
  authentication.loginRequired,
  validations.validate([
    body("email", "invalid email")
      .exists()
      .isEmail()
      .notEmpty()
      .normalizeEmail({ gmail_remove_dots: false }),
    body("name", "invalid name").exists().notEmpty().isString(),
    body("phone", "invalid phone").exists().notEmpty().isNumeric(),
    body("address", "invalid address").exists().notEmpty().isString(),
    body("streetsName", "invalid streetsName").exists().notEmpty().isString(),
    body("district", "invalid district").exists().notEmpty().isString(),
    body("city", "invalid city").exists().notEmpty().isString(),
  ]),
  createUserBooking
);
// get user Booking
router.get(
  "/userBooking",
  authentication.loginRequired,
  validations.validate([]),
  getUserBooking
);
module.exports = router;
