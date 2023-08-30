const { catchAsync, AppError, sendResponse } = require("../helpers/utils");
const Brand = require("../model/brand");
const Catego = require("../model/category");
const Orther = require("../model/ordther");
const Product = require("../model/product");
const User = require("../model/user");
const UserBooking = require("../model/userBooking");

const ortherController = {};
// create orther
ortherController.createOrther = catchAsync(async (req, res, next) => {
  const currentUserId = req.userId;
  const productId = req.params.productId;

  const user = await User.findById(currentUserId);
  if (!user) throw new AppError(400, "User Not Exists", "Create Orther Error");
  const product = await Product.findById(productId).populate([
    { path: "authorBrand", model: Brand },
    { path: "authorCatego", model: Catego },
  ]);
  if (!product)
    throw new AppError(400, "Product Not Exists", "Create Orther Error");

  let orther = await Orther.findOne({ userId: user._id });

  let countQuanlity;
  let totalAmount;

  if (!orther) {
    const ortherItems = [
      {
        name: `${product.authorBrand.brand} ${product.model}`,
        description:
          `${product.weight} ${product.os} ${product.os_bit} ${product.ssd} ${product.ram_gb} ${product.processor_brand} ${product.processor_name} ${product.memory_size} ${product.battery_size} ${product.screen_size} ${product.dimensions} ${product.zoomWide} ${product.zoomTele} ${product.maxResolution} ${product.lowResolution}`.trim(),
        latestPrice: product.latest_price,
        oldPrice: product.old_price,
        totalAmount: product.latest_price,
        discount: product.discount,
        imageUrl: product.imageUrl,
        quantity: "1",
        productId,
      },
    ];
    await Orther.create({
      userId: currentUserId,
      ortherItems,
      total: 1,
    });
  } else {
    const indexOrther = orther.ortherItems.findIndex((e) => {
      countQuanlity = parseInt(e.quantity) + 1;
      totalAmount = parseInt(e.latestPrice) * countQuanlity;
      return e.productId.equals(product._id);
    });
    if (indexOrther !== -1) {
      await Orther.updateOne(
        { _id: orther._id },
        {
          $set: {
            "ortherItems.$[element].quantity": countQuanlity,
            "ortherItems.$[element].totalAmount": totalAmount,
          },
          total: orther.total + 1,
        },
        {
          arrayFilters: [{ "element.productId": { $eq: product._id } }],
        }
      );
    } else {
      const ortherItems = {
        name: `${product.authorBrand.brand} ${product.model}`,
        description:
          `${product.weight} ${product.os} ${product.os_bit} ${product.ssd} ${product.ram_gb} ${product.processor_brand} ${product.processor_name} ${product.memory_size} ${product.battery_size} ${product.screen_size} ${product.dimensions} ${product.zoomWide} ${product.zoomTele} ${product.maxResolution} ${product.lowResolution}`.trim(),
        latestPrice: product.latest_price,
        oldPrice: product.old_price,
        totalAmount: product.latest_price,
        discount: product.discount,
        imageUrl: product.imageUrl,
        quantity: "1",
        productId,
      };
      await Orther.updateOne(
        { _id: orther._id },
        {
          $push: { ortherItems: ortherItems },
          total: orther.total + 1,
        }
      );
    }
  }
  sendResponse(res, 200, true, [], null, "Create Orther Success");
});
// get list orther
ortherController.getListOrther = catchAsync(async (req, res, next) => {
  const currentUserId = req.userId;
  let { page, limit } = req.query;

  const user = await User.findById(currentUserId);
  if (!user) throw new AppError(400, "Get List Orther Error");

  const orthers = await Orther.findOne({
    userId: currentUserId,
  });

  let data = [];
  let totalQuanlity = 0;
  if (orthers !== null) {
    data = orthers.ortherItems.filter((e) => e.status === "pending");
  }
  if (data.length) {
    for (let i = 0; i < data.length; i++) {
      totalQuanlity += parseInt(data[i].quantity);
    }
  }

  sendResponse(
    res,
    200,
    true,
    { data, totalProduct: orthers?.length, totalQuanlity: totalQuanlity },
    null,
    "Get List Orther Success"
  );
});
// update orther
ortherController.updateCountOrther = catchAsync(async (req, res, next) => {
  const currentUserId = req.userId;
  const ortherId = req.params.ortherId;
  const { quantity } = req.body;

  if (quantity === 0) {
    throw new AppError(400, "Quantity Cannot Be 0");
  }
  const user = await User.findById(currentUserId);
  if (!user) throw new AppError(400, "Update Orther Error");

  const orthers = await Orther.findOne({ userId: currentUserId });

  let totalAmount;
  let oldQuantity;
  const ortherIndex = orthers.ortherItems.findIndex((e) => {
    oldQuantity = parseInt(e.quantity);
    totalAmount = parseInt(e.latestPrice);
    return e._id.equals(ortherId);
  });

  if (quantity > oldQuantity) {
    let total = orthers.total + 1;
    totalAmount = totalAmount * parseInt(quantity);
    await Orther.updateOne(
      { _id: orthers._id },
      {
        $set: {
          "ortherItems.$[element].quantity": quantity,
          "ortherItems.$[element].totalAmount": totalAmount,
        },
        total: total,
      },
      {
        arrayFilters: [{ "element._id": { $eq: ortherId } }],
      }
    );
  } else if (quantity < oldQuantity) {
    let total = orthers.total - 1;
    totalAmount = totalAmount * parseInt(quantity);
    await Orther.updateOne(
      { _id: orthers._id },
      {
        $set: {
          "ortherItems.$[element].quantity": quantity,
          "ortherItems.$[element].totalAmount": totalAmount,
        },
        total: total,
      },
      {
        arrayFilters: [{ "element._id": { $eq: ortherId } }],
      }
    );
  } else {
    throw new AppError(
      400,
      "Product Not Exists",
      "Update Single Product Error"
    );
  }

  sendResponse(res, 200, true, [], null, "Update Orther Success");
});
// deleted single product orther
ortherController.deletedSingleProudctOrther = catchAsync(
  async (req, res, next) => {
    const currentUserId = req.userId;
    const ortherId = req.params.ortherId;

    const user = await User.findById(currentUserId);
    if (!user)
      throw new AppError(400, "User Not Exists", "Create Orther Error");

    const orthers = await Orther.findOne({ userId: currentUserId });

    let quantity;
    const ortherIndex = orthers.ortherItems.findIndex((e) => {
      quantity = parseInt(e.quantity);
      return e._id.equals(ortherId);
    });

    if (ortherIndex !== -1) {
      await Orther.updateOne(
        { _id: orthers._id },
        {
          $pull: { ortherItems: { _id: ortherId } },
          total: orthers.total - quantity,
        }
      );
    }
    sendResponse(res, 200, true, {}, null, "deleted Orther Success");
  }
);
// update status orther
ortherController.updateOrther = catchAsync(async (req, res, next) => {
  const currentUserId = req.userId;
  const { dataOrthers, infoUserBooking } = req.body;
  const user = await User.findById(currentUserId);
  if (!user) throw new AppError(400, "User Not Exists", "Update Orther Error");
  let orthers = await Orther.findOne({ userId: currentUserId });

  const emailInfo = await UserBooking.findOne({ email: infoUserBooking.email });
 
  if (infoUserBooking.phone.length < 10)
    throw new AppError(400, "Invalid Phone Number");

  if (!emailInfo) {
    await UserBooking.create({
      name: infoUserBooking.name,
      email: infoUserBooking.email,
      phone: infoUserBooking.phone,
      address: infoUserBooking.address,
      streetsName: infoUserBooking.streetsName,
      district: infoUserBooking.district,
      city: infoUserBooking.city,
      authorUser: user._id,
    });
  }

  if (dataOrthers.length) {
    for (let i = 0; i < dataOrthers.length; i++) {
      await Orther.updateOne(
        { _id: orthers._id },
        {
          $set: {
            "ortherItems.$[element].status": "confirm",
          },
        },
        {
          arrayFilters: [{ "element._id": { $eq: dataOrthers[i].id } }],
        }
      );
    }
  }

  sendResponse(res, 200, true, [], null, "Update Orther Success");
});
// get list Booking
ortherController.getListBookingProduct = catchAsync(async (req, res, next) => {
  const currentUserId = req.userId;
  const user = await User.findById(currentUserId);
  if (!user)
    throw new AppError(
      400,
      "Get List Booking Product",
      "Get List Booking Product Error"
    );

  const orthers = await Orther.findOne({ userId: currentUserId });

  let data = [];
  let totalQuanlity = 0;
  if (orthers !== null) {
    data = await orthers.ortherItems.filter((e) => e.status === "confirm");
  }

  if (data.length) {
    for (let i = 0; i < data.length; i++) {
      totalQuanlity += parseInt(data[i].quantity);
    }
  }

  sendResponse(
    res,
    200,
    true,
    { data, totalProduct: orthers?.length, totalQuanlity: totalQuanlity },
    null,
    "Get List Booking Product Success"
  );
});
// get user Booking
ortherController.getUserBooking = catchAsync(async (req, res, next) => {
  const currentUserId = req.userId;
  let user = await User.findById(currentUserId);
  if (!user)
    throw new AppError(
      400,
      "Get User Booking Product",
      "Get User Booking Product Error"
    );
  user = await UserBooking.find({ authorUser: user._id });
  console.log(user);
  sendResponse(res, 200, true, {}, null, "Get User Booking Product");
});

module.exports = ortherController;
