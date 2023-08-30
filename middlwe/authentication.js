const { AppError } = require("../helpers/utils");
const jwt = require("jsonwebtoken");
const JWT_KEY = process.env.JWT_KEY;

const authentication = {};

authentication.loginRequired = async (req, res, next) => {
  try {
    const tokenString = req.headers.authorization;
    if (!tokenString)
      throw new AppError(402, "Login Required", "authentication Error");
    const token = tokenString.replace("Bearer ", "");
    jwt.verify(token, JWT_KEY, (err, payload) => {
      if (err) {
        if (err.name === "TokenExpriredError") {
          throw new AppError(401, "Token Expired", "authentication error");
        } else {
          throw new AppError(401, "Token is invalid", "authentication error");
        }
      }
      req.userId = payload._id;
    });
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = authentication;
