import mongoose from "mongoose";

// schema for all products
const productSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  image: String,
  category: String,
  user: { type: mongoose.Schema.ObjectId, ref: "User" },
});

// saying about saved product
productSchema.post("save", function (doc, next) {
  console.log("new product is saved", doc);
  next();
});

const Product = mongoose.model("product", productSchema);

export default Product;
