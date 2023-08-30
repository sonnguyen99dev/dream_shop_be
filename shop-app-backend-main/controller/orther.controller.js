const { catchAsync, AppError, sendResponse } = require("../helpers/utils");
const Brand = require("../model/brand");
const Catego = require("../model/category");
const Orther = require("../model/ordther");
const Product = require("../model/product");
const Total = require("../model/total");
const User = require("../model/user");

const ortherController = {};
// create orther
ortherController.createOrther = catchAsync(async (req, res, next) => {
  const currentUserId = req.userId;
  const productId = req.params.productId;
  let isUpdate = false;

  const user = await User.findById(currentUserId);
  if (!user) throw new AppError(400, "User Not Exists", "Create Orther Error");
  const product = await Product.findById(productId).populate([
    { path: "authorBrand", model: Brand },
    { path: "authorCatego", model: Catego },
  ]);

  if (!product)
    throw new AppError(400, "Product Not Exists", "Create Orther Error");

  let orthers = await Orther.findOne({ userId: user._id });
  const total = await Total.findOne({
    authorBrand: product.authorBrand,
    authorCatego: product.authorCatego,
  });

  if (total.quantityRemaining === 0)
    throw new AppError(400, "out of stock", "create orther error");

  if (!orthers) {
    const ortherItems = [
      {
        description: {
          ...product.description,
          brand: product.authorBrand.brand,
          category: product.authorCatego.name,
        },
        productId: product._id,
        price: product.description.latest_price,
        quantity: 1,
      },
    ];
    await Orther.create({
      userId: user._id,
      ortherItems,
    });
  } else if (orthers) {
    const idOrther = orthers?.ortherItems.find((obj) => {
      if (obj.productId.equals(productId)) {
        isUpdate = true;
        return obj;
      }
    });

    if (isUpdate === true) {
      const orther = await Orther.updateMany(
        { _id: orthers._id },
        {
          $set: {
            "ortherItems.$[element].quantity":
              idOrther.quantity + idOrther.quantity,
          },
          totalProduct: orthers?.totalProduct + orthers?.totalProduct,
        },
        {
          arrayFilters: [{ "element._id": { $eq: idOrther._id } }],
          upsert: true,
        }
      );
    } else {
      const ortherItems = {
        description: {
          ...product.description,
          brand: product.authorBrand.brand,
          category: product.authorCatego.name,
        },
        productId: product._id,
        price: product.description.latest_price,
        quantity: 1,
      };

      const orther = await Orther.updateMany(
        { _id: orthers?._id },
        {
          $push: { ortherItems: ortherItems },
          totalProduct: orthers?.totalProduct + 1,
        }
      );
    }
  }

  sendResponse(res, 200, true, [], null, "Create Orther Success");
});
// get list orther
ortherController.getListOrther = catchAsync(async (req, res, next) => {
  const currentUserId = req.userId;

  const user = await User.findById(currentUserId);
  if (!user) throw new AppError(400, "Get List Orther Error");

  if (user.role === "normal") {
    const orthers = await Orther.findOne({
      userId: currentUserId,
    });

    if (orthers) {
      const totalPrice = 0;
      let totalProduct = 0;
      const data = orthers?.ortherItems.filter((obj) => {
        if (obj.status === "pending") {
          totalProduct += obj.quantity;
          return obj;
        }
      });
      sendResponse(
        res,
        200,
        true,
        { data, totalPrice, totalProduct },
        null,
        "Get List Orther Success"
      );
    }
  }
  if (user.role === "master") {
    const orthers = await Orther.find({});
    sendResponse(res, 200, true, orthers, null, "get list orther success");
  }
});
// update orther
ortherController.updateQuantity = catchAsync(async (req, res, next) => {
  const currentUserId = req.userId;
  const ortherId = req.params.ortherId;
  const { quantity } = req.query;

  const user = await User.findById(currentUserId);
  if (!user)
    throw new AppError(400, "User Not Exits", " update quantity error");

  const orthers = await Orther.findOne({ userId: user._id });

  const idOrther = await orthers?.ortherItems.find((obj) => {
    if (obj._id.equals(ortherId)) {
      return obj;
    }
  });
  const product = await Product.findById(idOrther.productId);
  const total = await Total.findOne({
    authorBrand: product.authorBrand,
    authorCatego: product.authorCatego,
  });

  let totalQuantity = total.quantityRemaining;

  if (totalQuantity - idOrther.quantity <= 0)
    throw new AppError(
      400,
      "The remaining quantity is gone",
      "update quantity error"
    );

  if (totalQuantity === 0)
    throw new AppError(
      400,
      "The remaining quantity is gone",
      "update quantity error"
    );

  if (idOrther.quantity >= 1) {
    const orther = await Orther.updateMany(
      { _id: orthers._id },
      {
        $set: {
          "ortherItems.$[element].quantity":
            idOrther.quantity + Number(quantity),
        },
        totalProduct: orthers?.totalProduct + Number(quantity),
      },
      { arrayFilters: [{ "element._id": { $eq: idOrther._id } }], upsert: true }
    );
  }

  sendResponse(res, 200, true, [], null, "Update quantity Success");
});
// deleted single product orther
ortherController.deletedSingleProudctOrther = catchAsync(
  async (req, res, next) => {
    const currentUserId = req.userId;
    const ortherId = req.params.ortherId;

    const user = await User.findById(currentUserId);
    if (!user)
      throw new AppError(400, "User Not Exists", "Create Orther Error");

    const orthers = await Orther.findOne({ userId: user._id });

    const idOrther = orthers?.ortherItems.find((obj) => {
      if (obj._id.equals(ortherId)) {
        return obj;
      }
    });

    const orther = await Orther.updateMany(
      { _id: orthers._id },
      {
        $pull: { ortherItems: { _id: idOrther._id } },
        totalProduct: orthers.totalProduct - idOrther.quantity,
      }
    );
    sendResponse(res, 200, true, [], null, "deleted Orther Success");
  }
);
// update status orther
ortherController.updateOrther = catchAsync(async (req, res, next) => {
  const currentUserId = req.userId;
  const { dataOrthers } = req.body;
  const { userId } = req.query;
  const user = await User.findById(currentUserId);
  if (!user) throw new AppError(400, "User Not Exists", "Update Orther Error");

  if (user.role === "normal") {
    let orthers = await Orther.findOne({ userId: user._id });

    let totalPrice = 0;
    let totalProductPaid = 0;
    for (let i = 0; i < dataOrthers.length; i++) {
      if (orthers.ortherItems[i]._id.equals(dataOrthers[i]._id)) {
        totalPrice +=
          orthers.ortherItems[i].price * orthers.ortherItems[i].quantity;
        totalProductPaid += orthers.ortherItems[i].quantity;
      }
      await Orther.updateMany(
        { _id: orthers._id },
        {
          $set: {
            "ortherItems.$[element].status": "paid",
          },
        },
        {
          arrayFilters: [{ "element._id": { $eq: dataOrthers[i]._id } }],
          upsert: true,
        }
      );
    }

    await Orther.updateMany(
      { _id: orthers._id },
      { totalPrice, totalProductPaid }
    );

    sendResponse(res, 200, true, [], null, "Update Orther Success");
  }

  if (user.role === "master") {
    const user = await User.findById(userId);
    let orthers = await Orther.findOne({ userId: user._id });

    for (let i = 0; i < dataOrthers.length; i++) {
      const product = await Product.findById(orthers?.ortherItems[i].productId);
      if (
        orthers?.ortherItems[i]._id.equals(dataOrthers[i]._id) &&
        dataOrthers[i].status === "confirmed"
      ) {
        await Orther.updateMany(
          { _id: orthers._id },
          { $set: { "ortherItems.$[element].status": dataOrthers[i].status } },
          { arrayFilters: [{ "element._id": { $eq: dataOrthers[i]._id } }] }
        );
        let total = await Total.findOne({
          authorBrand: product.authorBrand,
          authorCatego: product.authorCatego,
        });
        total.quantityRemaining =
          total.quantityRemaining - orthers?.ortherItems[i].quantity;
        total.save();

        if (total.quantityRemaining === 0) {
          product.stock = "outofstock";
        }
        product.save();
      } else if (orthers?.ortherItems[i]._id.equals(dataOrthers[i]._id)) {
        await Orther.updateMany(
          { _id: orthers._id },
          { $set: { "ortherItems.$[element].status": dataOrthers[i].status } },
          { arrayFilters: [{ "element._id": { $eq: dataOrthers[i]._id } }] }
        );
      }
    }

    sendResponse(res, 200, true, {}, null, "Update Orther Success");
  }
});
// get list Booking
ortherController.getListBookingProduct = catchAsync(async (req, res, next) => {
  const currentUserId = req.userId;
  const user = await User.findById(currentUserId);
  if (!user)
    throw new AppError(
      400,
      "user not exists",
      "Get List Booking Product Error"
    );

  const orthers = await Orther.findOne({ userId: user._id });
  console.log(orthers);

  if (orthers) {
    const data = orthers.ortherItems.filter((obj) => {
      if (
        obj.status === "paid" ||
        obj.status === "confirmed" ||
        obj.status === "delivery"
      ) {
        return obj;
      }
    });
    sendResponse(
      res,
      200,
      true,
      data,
      null,
      "Get List Booking Product Success"
    );
  }
});

module.exports = ortherController;
