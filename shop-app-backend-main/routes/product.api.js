const express = require("express");
const { param } = require("express-validator");
const {
  getAllProduct,
  getSingleProduct,
  getListBrandProduct,
  createProduct,
} = require("../controller/product.controller");
const authentication = require("../middlwe/authentication");
const validations = require("../middlwe/validations");
const router = express.Router();

// create product
router.post(
  "/:userId",
  authentication.loginRequired,
  validations.validate([
    param("userId", "invalid userId")
      .exists()
      .notEmpty()
      .custom(validations.checkObjectId),
  ]),
  createProduct
);
// get all product
router.get("/allproduct", validations.validate([]), getAllProduct);
// get single product
router.get(
  "/single/:productId",
  validations.validate([
    param("productId", "invalid productId")
      .exists()
      .notEmpty()
      .custom(validations.checkObjectId),
  ]),
  getSingleProduct
);
// get list brand product
router.get("/brand", validations.validate([]), getListBrandProduct);
module.exports = router;
