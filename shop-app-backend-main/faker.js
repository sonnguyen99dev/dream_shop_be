const csv = require("csvtojson");
const mongoose = require("mongoose");
const Brand = require("./model/brand");
const Catego = require("./model/category");
const Product = require("./model/product");
const Total = require("./model/total");
mongoose
  .connect(
    "mongodb+srv://shopapp:shopapp-1@shop-app.ejjh2cf.mongodb.net/shopapp"
  )
  .then(() => console.log("db connect success"))
  .catch((err) => console.log(err));

const fakerShop = async () => {
  let data = await csv().fromFile("DataCamera.csv");
  data = data.filter((e) => e.Model.includes("Sony"));
  //Samsung, Apple, Xiaomi, HUAWEI, Sony // Lenovo, APPLE, ASUS, DELL, acer
  data = new Set(data.map((e) => e));
  data = Array.from(data);
  const category = await Catego.findOne({ name: "camera" });

  let brand = await Brand.findOne({ brand: "sony" });
  const newPro = ["new", "old"];

  // for (let i = 0; i < data.length; i++) {
  //   const random = Math.floor(Math.random() * newPro.length);
  //   let discount = Number(Math.floor(Math.random() * (20 - 10) + 10));
  //   const total = Math.floor(Number(data[i].Price) * (discount / 100));
  //   const latest_price = Number(data[i].Price) - total;

  //   const product = await Product.create({
  //     authorCatego: category._id,
  //     authorBrand: brand._id,
  //     imageUrl: [
  //       `https://shop-app-backend-production-5c4e.up.railway.app/imagecamera/sony${Math.floor(
  //         Math.random() * (14 - 1) + 1
  //       )}.png`,
  //       `https://shop-app-backend.vercel.app/imagecamera/sony${Math.floor(
  //         Math.random() * (14 - 1) + 1
  //       )}.png`,
  //     ],
  //     ratings: Math.floor(Math.random() * (5 - 3) + 3),
  //     newProduct: newPro[random],
  //     description: {
  //       model: data[i].Model.replace("Sony ", ""),
  //       latest_price: Number(data[i].Price) === 0 ? 1000 : latest_price,
  //       old_price: Number(data[i].Price),
  //       discount: Number(data[i].Price) === 0 ? 0 : discount,
  //       dimensions: data[i].Dimensions,
  //       zoomWide: data[i].zoomWide,
  //       zoomTele: data[i].zoomTele,
  //       maxResolution: data[i].maxResolution,
  //       lowResolution: data[i].lowResolution,
  //     },
  //   });
  // }

  // const products = await Product.find({
  //   authorCatego: category._id,
  //   authorBrand: brand._id,
  // });
  // const total = await Total.create({
  //   authorCatego: category._id,
  //   authorBrand: brand._id,
  //   totalProduct: Number(data.length),
  //   quantityRemaining: Number(data.length),
  // });
  // console.log(products);
  // console.log(total);
};

fakerShop();
