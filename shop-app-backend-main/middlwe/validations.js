const { validationResult } = require("express-validator");
const { sendResponse } = require("../helpers/utils");
const mongoose = require("mongoose");

const validations = {};

validations.validate = (validationArray) => async (req, res, next) => {
  await Promise.all(validationArray.map((validation) => validation.run(req)));
  const err = validationResult(req);
  if (err.isEmpty()) return next();

  const message = err
    .array()
    .map((err) => err.msg)
    .join("&");
  return sendResponse(res, 422, false, null, { message }, "Validation Error");
};

validations.checkObjectId = (paramId) => {
  if (!mongoose.Types.ObjectId.isValid(paramId)) {
    throw new Error("invalid objectId");
  }
  return true;
};
module.exports = validations;
