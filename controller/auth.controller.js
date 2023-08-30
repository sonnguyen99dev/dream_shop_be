const { AppError, sendResponse, catchAsync } = require("../helpers/utils");
const { faker } = require("@faker-js/faker");
const bcrypt = require("bcryptjs");

const User = require("../model/user");

const authController = {};

authController.loginWithEmail = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }, "+password");
  if (!user)
    throw new AppError(
      400,
      "you do not have an account please create an account",
      "Login Error"
    );
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new AppError(400, "wrong password", "Login Error");

  const accessToken = await user.generateToken();
  sendResponse(res, 200, true, { user, accessToken }, null, "Login Success");
  console.log(faker.image.business());
});

module.exports = authController;
