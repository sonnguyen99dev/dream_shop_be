const express = require("express");
const authentication = require("../middlwe/authentication");
const validations = require("../middlwe/validations");
const {
  addReview,
  getSingleReview,
  updateReview,
  deletedReview,
} = require("../controller/review.controller");
const { param } = require("express-validator");
const router = express.Router();

//create review
router.post(
  "/:productId",
  authentication.loginRequired,
  validations.validate([]),
  addReview
);
//get single review
router.get(
  "/:reviewId",
  authentication.loginRequired,
  validations.validate([
    param("reviewId", "invalid reviewId")
      .exists()
      .notEmpty()
      .custom(validations.checkObjectId),
  ]),
  getSingleReview
);
// update review
router.put(
  "/:reviewId",
  authentication.loginRequired,
  validations.validate([
    param("reviewId", "invalid reviewId")
      .exists()
      .notEmpty()
      .custom(validations.checkObjectId),
  ]),
  updateReview
);
// deleted review
router.delete(
  "/:reviewId",
  authentication.loginRequired,
  validations.validate([
    param("reviewId", "invalid reviewId")
      .exists()
      .notEmpty()
      .custom(validations.checkObjectId),
  ]),
  deletedReview
);
module.exports = router;
