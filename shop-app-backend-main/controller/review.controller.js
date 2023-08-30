const { catchAsync, AppError, sendResponse } = require("../helpers/utils");
const Product = require("../model/product");
const Review = require("../model/review");
const User = require("../model/user");

const reviewController = {};

// add review
reviewController.addReview = catchAsync(async (req, res, next) => {
  const currentUserId = req.userId;
  const productId = req.params.productId;
  const { content, rating } = req.body;

  const user = await User.findById(currentUserId);
  if (!user) throw new AppError(400, "user not exits", "create review error");

  const product = await Product.findById(productId);
  if (!product)
    throw new AppError(400, "product not exists", "create review error");

  const userReview = await Review.findOne({ userId: user._id });

  if (userReview) {
    throw new AppError(400, "you rated", "create review error");
  } else {
    const review = await Review.create({
      authorProductId: product._id,
      userId: user._id,
      content: content,
      rating: rating,
    });

    let total = ((product.ratings + rating) / 2) * 100;
    const percentTotal = Number(total.toString().slice(1));
    if (percentTotal === 50) {
      total = total / 100;
    } else if (percentTotal < 50 || percentTotal > 50) {
      total = Math.round(total / 100);
    }

    const pushProduct = await Product.findByIdAndUpdate(product._id, {
      $push: { reviews: review._id },
      ratings: total,
    });

    sendResponse(res, 200, true, {}, null, "create review error");
  }
});
// get single review
reviewController.getSingleReview = catchAsync(async (req, res, next) => {
  const currentUserId = req.userId;
  const reviewId = req.params.reviewId;
  const user = await User.findById(currentUserId);
  if (!user)
    throw new AppError(400, "user not exits", "get single Review error");

  const review = await Review.findById(reviewId);
  sendResponse(res, 200, true, review, null, "get single review success");
});
// update review
reviewController.updateReview = catchAsync(async (req, res, next) => {
  const currentUserId = req.userId;
  const reviewId = req.params.reviewId;
  const user = await User.findById(currentUserId);
  if (!user)
    throw new AppError(400, "user not exits", "get single Review error");

  const allow = ["content", "rating"];
  let review = await Review.findById({ _id: reviewId });
  const product = await Product.findById(review.authorProductId);

  allow.forEach(async (ele) => {
    if (req.body[ele] !== undefined) {
      review[ele] = req.body[ele];
    }
  });
  await review.save();

  let total = ((product.ratings + review.rating) / 2) * 100;
  const percentTotal = Number(total.toString().slice(1));
  if (percentTotal === 50) {
    total = total / 100;
  } else if (percentTotal < 50 || percentTotal > 50) {
    total = Math.round(total / 100);
  }

  const pushProduct = await Product.findByIdAndUpdate(product._id, {
    ratings: total,
  });

  sendResponse(res, 200, true, {}, null, "update review success");
});
// deleted review
reviewController.deletedReview = catchAsync(async (req, res, next) => {
  const currentUserId = req.userId;
  const reviewId = req.params.reviewId;
  const user = await User.findById(currentUserId);
  if (!user)
    throw new AppError(400, "user not exits", "get single Review error");

  let review = await Review.findById({ _id: reviewId });
  const product = await Product.findByIdAndUpdate(review.authorProductId, {
    $pull: { reviews: review._id },
  });
  review.deleteOne();

  sendResponse(res, 200, true, {}, null, "deleted review success");
});
module.exports = reviewController;
