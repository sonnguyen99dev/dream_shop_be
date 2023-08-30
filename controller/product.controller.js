const { catchAsync, AppError, sendResponse } = require("../helpers/utils");
const Brand = require("../model/brand");
const Catego = require("../model/category");
const Product = require("../model/product");
const User = require("../model/user");

const productController = {};

// get all product
productController.getAllProduct = catchAsync(async (req, res, next) => {
  let { page, limit, ...filterQuery } = req.query;
  const allowfilter = ["search", "type", "gte", "lte"];

  let arrBrand = [];
  let arrCategory = [];
  let type = {};

  page = parseInt(page) || 1;
  limit = parseInt(limit) || 20;

  let filterkey = Object.keys(filterQuery);

  let isQuery;

  filterkey.map((key) => {
    if (!allowfilter.includes(key)) {
      throw new AppError(401, `Query ${key} is not allowed`, "Search Error");
    }
    if (!filterQuery[key]) delete filterQuery[key];
    if (filterQuery[key]) isQuery = true;
  });

  if (filterQuery.search) {
    const brand = await Brand.find({
      brand: { $regex: filterQuery.search, $options: "si" },
    });
    if (brand.length < 1) {
      const category = await Catego.find({
        name: { $regex: filterQuery.search, $options: "si" },
      });
      category.find((e) => arrCategory.push(e._id));
    }
    brand.find((e) => {
      arrBrand.push(e._id);
    });
  }

  const filterConditions =
    isQuery === true
      ? [
          {
            $or: [
              { authorBrand: { $in: arrBrand } },
              { authorCatego: { $in: arrCategory } },
              {
                model: {
                  $regex: new RegExp(filterQuery.search, "i") || "",
                },
              },
            ],
          },
        ]
      : null;

  if (filterQuery.type) {
    if (filterQuery.type?.includes("high-low")) {
      type = { latest_price: -1 };
    } else if (filterQuery.type?.includes("low-high")) {
      type = { latest_price: 1 };
    } else {
      filterConditions.push({ newProduct: `${filterQuery.type}` });
    }
  }
  if (filterQuery.gte) {
    filterConditions.push({ latest_price: { $gte: filterQuery.gte } });
  }
  if (filterQuery.lte) {
    filterConditions.push({ latest_price: { $lte: filterQuery.lte } });
  }

  const filterCrirerial = isQuery === true ? { $and: filterConditions } : {};

  let data = await Product.find(filterCrirerial) // {name: "" , emal: ""}
    .sort(type)
    .collation({ locale: "en_US", numericOrdering: true })
    .populate([
      { path: "authorCatego", model: Catego },
      {
        path: "authorBrand",
        model: Brand,
      },
    ]);

  const offset = limit * (page - 1);
  const count = await data.length;
  const totalPage = Math.ceil(count / limit);

  data = await data
    .sort(() => {
      if (!filterQuery.type) {
        return Math.random() - 0.5;
      } else {
        return;
      }
    })
    .slice(offset, offset + limit);

  sendResponse(
    res,
    200,
    true,
    { data, totalPage },
    null,
    "Get List All Product"
  );
});
// get single product
productController.getSingleProduct = catchAsync(async (req, res, next) => {
  const productId = req.params.productId;

  const product = await Product.findById(productId)
    .populate({ path: "authorCatego", model: Catego })
    .populate({ path: "authorBrand", model: Brand });
  if (!product)
    throw new AppError(400, "Product Not Exists", "Get Single Product Error");

  sendResponse(res, 200, true, product, null, "Get Single Product Success");
});
//get list brand procuct
productController.getListBrandProduct = catchAsync(async (req, res, next) => {
  let { page, limit, ...filterQuery } = req.query;
  const allowfilter = ["category", "brand", "search", "type", "gte", "lte"];

  const brand = filterQuery.brand;
  let category;
  let type = {};

  page = parseInt(page) || 1;
  limit = parseInt(limit) || 20;

  let filterkey = Object.keys(filterQuery);

  filterkey.forEach((key) => {
    if (!allowfilter.includes(key)) {
      throw new AppError(401, `Query ${key} is not allowed`, "Search Error");
    }
    if (!filterQuery[key]) delete filterQuery[key];
  });

  const newBrand = await Brand.findOne({ brand: brand });

  const filterConditions = filterQuery.brand
    ? [
        { authorBrand: { $eq: newBrand._id } },
        { model: { $regex: new RegExp(filterQuery.search, "i") } },
      ]
    : null;

  if (filterQuery.category) {
    category = await Catego.findOne({ name: filterQuery.category });
    await filterConditions.push({ authorCatego: category._id });
  }

  if (filterQuery.type) {
    if (filterQuery.type?.includes("high-low")) {
      type = { latest_price: -1 };
    } else if (filterQuery.type?.includes("low-high")) {
      type = { latest_price: 1 };
    } else {
      filterConditions.push({ ["newProduct"]: `${filterQuery.type}` });
    }
  }

  if (filterQuery.gte) {
    filterConditions.push({ latest_price: { $gte: filterQuery.gte } });
  }
  if (filterQuery.lte) {
    filterConditions.push({ latest_price: { $lte: filterQuery.lte } });
  }

  const filterCrirerial = filterQuery.brand ? { $and: filterConditions } : {};

  let data = await Product.find(filterCrirerial)
    .sort(type)
    .collation({ locale: "en_US", numericOrdering: true })
    .populate([
      { path: "authorCatego", model: Catego },
      {
        path: "authorBrand",
        model: Brand,
      },
    ]);

  const offset = limit * (page - 1);
  const count = await data.length;
  const totalPage = Math.ceil(count / limit);

  data = await data
    .sort(() => {
      if (!filterQuery.type) {
        return Math.random() - 0.5;
      } else {
        return;
      }
    })
    .slice(offset, offset + limit);

  sendResponse(
    res,
    200,
    true,
    { data, totalPage },
    null,
    "Get List Brand Product Success"
  );
});

module.exports = productController;
