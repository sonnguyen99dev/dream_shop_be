const express = require("express");
const { body } = require("express-validator");
const { loginWithEmail } = require("../controller/auth.controller");
const validations = require("../middlwe/validations");
const router = express.Router();

router.post(
  "/login",
  validations.validate([
    body("email", "invalid email")
      .exists()
      .isEmail()
      .notEmpty()
      .normalizeEmail({ gmail_remove_dots: false }),
    body("password", "invalid password").exists().notEmpty(),
  ]),
  loginWithEmail
);

module.exports = router;
