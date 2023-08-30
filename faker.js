const csv = require("csvtojson");
const mongoose = require("mongoose");
const Brand = require("./model/brand");
const Catego = require("./model/category");
const Count = require("./model/count");
const Product = require("./model/product");
mongoose
  .connect(
    "mongodb+srv://shopapp:shopapp-1@shop-app.ejjh2cf.mongodb.net/shopapp"
  )
  .then(() => console.log("db connect success"))
  .catch((err) => console.log(err));

const fakerShop = async () => {
  let data = await csv().fromFile("DataLaptop.csv");
  data = data.filter((e) => e.brand.includes("APPLE")); //Samsung, Apple, Xiaomi, HUAWEI, Sony //Lenovo, APPLE, ASUS, DELL, acer
  data = new Set(data.map((e) => e));
  data = Array.from(data);
  const category = await Catego.findOne({ name: "laptop" });

  let brand = await Brand.findOne({ brand: "apple" });

  let products = await Product.find({
    authorCatego: category._id,
    authorBrand: brand._id,
  });
  products = products.map((e) => {
    
  })
  console.log(products);
  // const data = await Product.find({
  //   authorBrand: brand._id,
  //   authorCatego: category._id,
  // });
  // for (let i = 0; i < data.length; i++) {
  //   const newData = await Product.findByIdAndUpdate(data[i]._id, {
  //     imageUrl: `https://shop-app-backend-production.up.railway.app/imagecamera/fujiflim${Math.floor(
  //       Math.random() * (16 - 1) + 1
  //     )}.jpg`,
  //   });
  //   console.log(newData);
  // }

  // if (!brand) {
  //   brand = await Brand.create({ brand: "sony" });
  // }
  // await Count.create({
  //   authorBrand: brand._id,
  //   authorCatego: category._id,
  // });

  // console.log(counts);
  // let data = await Product.find({
  //   authorCatego: category._id,
  //   authorBrand: brand._id,
  // });

  // const idproduct = newData.map((e) => {
  //   return e._id;
  // });
  // console.log(data.length);
  // console.log(newData.length);

  // for (let i = 0; i < newData.length; i++) {
  //   let discount = await Math.floor(Math.random() * 50);
  //   const a = await Product.findByIdAndUpdate(idproduct[i], {
  //     discount: `${discount}`,
  //     old_price: `${15000}`,
  //     latest_price: `${15000 - Math.floor(15000 * (discount / 100))}`,
  //   });
  //   console.log(a);
  // }

  // data = data.map((e) => {
  //   const discount = Math.floor(Math.random() * 50);
  //   return {
  //     ...e,
  //     ["discount"]: `${discount}`,
  //     ["old_price"]: e.Price,
  //     ["latest_price"]: `${
  //       parseInt(e.Price) - Math.floor(e.Price * (discount / 100))
  //     }`,
  //   };
  // });

  // const newPro = ["new", "old"];

  // data.forEach(async (e) => {
  //   const random = Math.floor(Math.random() * newPro.length);
  //   await Product.create({
  //     authorCatego: category._id,
  //     authorBrand: brand._id,
  //     // model: e.model.toLowerCase(),
  //     model: e.Model.replace("Nikon ", "").toLowerCase(),
  //     // latest_price: e.Price.replace(".0", "") || "2900",
  //     // old_price: e.highest_price.replace(".0", "") || "3000",
  //     latest_price: e.latest_price.replace(".0", "") || "2900",
  //     old_price: e.old_price.replace(".0", "") || "3000",
  //     discount: e.discount,
  //     // discount: e.sellers_amount,
  //     ratings: Math.floor(Math.random() * (6 - 3) + 3),
  //     // os: e.os.toLowerCase(),
  //     weight: e.weight.toLowerCase(),
  //     // os_bit: e.os_bit,
  //     // ssd: e.ssd,
  //     // hdd: e.hdd,
  //     // ram_gb: e.ram_gb.replace(" GB", ""),
  //     // ram_type: e.ram_type,
  //     // processor_brand: e.processor_brand,
  //     // processor_name: e.processor_name,
  //     // processor_gnrtn: e.processor_gnrtn,
  //     // memory_size: e.memory_size.replace(".0", "") || "32",
  //     // battery_size: e.battery_size.replace(".0", "") || "2691",
  //     // screen_size: e.screen_size || "6",
  //     newProduct: newPro[random],
  //     dimensions: e.Dimensions,
  //     zoomWide: e.zoomWide,
  //     zoomTele: e.zoomTele,
  //     maxResolution: e.maxResolution,
  //     lowResolution: e.lowResolution,
  //     imageUrl: `https://shop-app-backend-production.up.railway.app/imagecamera/sony${Math.floor(
  //       Math.random() * (15 - 1) + 1
  //     )}.png`,
  //   });
  // });
  // // const del = await Product.deleteMany({
  // //   authorBrand: "640d5dd2b1c12eb5df5e0afc",
  // // });

  // const count = data.length;
  // console.log(data.length);
  // console.log(counts);
  // const counts = await Count.find({
  //   authorBrand: brand._id,
  //   authorCatego: category._id,
  // });

  // const countBrand = await Count.findByIdAndUpdate(counts[0]._id, {
  //   count: data.length,
  //   quantityRemaining: data.length,
  // });

  // let brandData = await Brand.findById(idbrand);
  // brandData = brandData.count.forEach((e) => {});
  // console.log(newBrand);
};

fakerShop();
