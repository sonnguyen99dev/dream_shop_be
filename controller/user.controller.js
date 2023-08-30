const { catchAsync, AppError, sendResponse } = require("../helpers/utils");
const bcrypt = require("bcryptjs");
const User = require("../model/user");
const sendMail = require("../helpers/sendMail");

const userController = {};

// create user {normal, master}
userController.createUser = catchAsync(async (req, res, next) => {
  let { email, password, name } = req.body;
  let { role } = req.query;
  if (role && role.includes("master")) {
    console.log(password.length);
    let user = await User.findOne({ email });
    if (user) throw new AppError(400, "User exists", "Create User Error");
    if (!password.length >= 8)
      throw new AppError(
        400,
        "Password Must Be 8 Or More Characters",
        "Create User Error"
      );
    const salt = await bcrypt.genSalt(10);
    password = await bcrypt.hash(password, salt);
    user = await User.create({ email, password, name, role: role });
    const accessToken = await user.generateToken();
    sendResponse(
      res,
      200,
      true,
      { user, accessToken },
      null,
      "Create User Success"
    );
  } else {
    let user = await User.findOne({ email });
    if (user) throw new AppError(400, "User exists", "Create User Error");
    if (!password.length >= 8)
      throw new AppError(
        400,
        "Password Must Be 8 Or More Characters",
        "Create User Error"
      );
    const salt = await bcrypt.genSalt(10);
    password = await bcrypt.hash(password, salt);
    user = await User.create({ email, password, name });
    const accessToken = await user.generateToken();
    sendResponse(
      res,
      200,
      true,
      { user, accessToken },
      null,
      "Create User Success"
    );
  }
});
// get user me
userController.getUser = catchAsync(async (req, res, next) => {
  const currentUserId = req.userId;
  const user = await User.findById(currentUserId);
  if (!user) throw new AppError(400, "User Not Exists", "Get User Me Error");
  sendResponse(res, 200, true, user, null, "Get User Me Success");
});
// update user
userController.updateUser = catchAsync(async (req, res, next) => {
  const currentUserId = await req.userId;
  const userId = await req.params.userId;

  if (currentUserId !== userId)
    throw new AppError(400, "User Not Match", "Update User Error");

  let user = await User.findById(userId);
  if (!user) throw new AppError(400, "User Not exstis", "Update User Error");

  if (req.body.phone.length >= 10)
    throw new AppError(400, "Invalid Phone Number");

  const allow = ["name", "phone", "address", "avatarUrl"];

  allow.forEach(async (ele) => {
    if (req.body[ele] !== undefined) {
      user[ele] = req.body[ele];
    }
  });
  await user.save();

  sendResponse(res, 200, true, user, null, "Update User Success");
});
// deleted user
userController.deletedUser = catchAsync(async (req, res, next) => {
  const currentUserId = req.userId;
  const userId = req.params.userId;

  if (currentUserId !== userId)
    throw new AppError(400, "User Not Match", "Deleted User Error");
  let user = await User.findById(userId);
  if (!user) throw new AppError(400, "User Not exstis", "Deleted User Error");

  user = await User.deleteOne({ _id: user._id });

  sendResponse(res, 200, true, user, null, "deleted User Success");
});
// reset password
userController.resetPassword = catchAsync(async (req, res, next) => {
  const { email } = req.body;
  let user = await User.find({ email }, "+password");
  if (!user.length) {
    throw new AppError(400, "User Not Exists", "Reset Password Error");
  }
  const salt = await bcrypt.genSalt(10);
  const password = await bcrypt.hash("12345678", salt);
  let templateVars = { name: user[0]?.name };
  let subject = "Reset Password";
  await sendMail({ template: "template", templateVars, subject, to: email });
  user = await User.updateOne({ email: email }, { password: password });  
  sendResponse(res, 200, true, user, null, "Reset Password Success");
});
// change password
userController.changePassword = catchAsync(async (req, res, next) => {
  const currentUserId = req.userId;
  const userId = req.params.userId;
  const { password, changePassword } = req.body;

  if (currentUserId !== userId)
    throw new AppError(400, "User Not Match", "Change Password Error");
  let user = await User.findById(userId, "+password");

  if (!user)
    throw new AppError(400, "User not Exists", "Change Password Error");

  const isMatchPassword = await bcrypt.compare(password, user.password);

  if (!isMatchPassword)
    throw new AppError(400, "Password Don't Match", "Change Password Error");

  if (changePassword.length < 8)
    throw new AppError(
      400,
      "Password Must Be 8 Or More Characters",
      "Change Password Error"
    );

  const isPasswordAndChangePassword = await bcrypt.compare(
    changePassword,
    user.password
  );

  if (isPasswordAndChangePassword)
    throw new AppError(
      400,
      "Passwords Must Not Be The Same",
      "Change Password Error"
    );

  const salt = await bcrypt.genSalt(10);
  const newPassword = await bcrypt.hash(changePassword, salt);

  user = await User.findByIdAndUpdate(userId, { password: newPassword });
  sendResponse(res, 200, true, user, null, "Change Password Success");
});

module.exports = userController;
