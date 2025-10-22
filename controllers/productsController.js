import Product from "../models/Product.js";
import fs from "node:fs";
import path from "node:path";

const productsController = {};

const toPlain = (value) => {
  if (Array.isArray(value)) {
    return value.map(toPlain);
  }
  if (value && typeof value.toObject === "function") {
    return value.toObject();
  }
  return value;
};

const reverseProducts = (items) => {
  const list = Array.isArray(items) ? items.slice() : [];
  return list.reverse();
};

productsController.main_get = async (req, res) => {
  const productsRaw = await Product.find();
  const products = reverseProducts(toPlain(productsRaw));
  res.render("index", { products, userId: req.userId || null });
};

productsController.food_get = async (req, res) => {
  const productsRaw = await Product.find({ category: "food" });
  const products = reverseProducts(toPlain(productsRaw));
  res.render("food", { products, userId: req.userId || null });
};

productsController.drinks_get = async (req, res) => {
  const productsRaw = await Product.find({ category: "drinks" });
  const products = reverseProducts(toPlain(productsRaw));
  res.render("drinks", { products, userId: req.userId || null });
};

productsController.add_get = (req, res) => {
  res.render("add", {
    addError: req.flash("addError"),
  });
};

productsController.add_post = async (req, res) => {
  const { title, price, description, category } = req.body;
  const image = req.file;

  if (!title || !price || !description || !category) {
    req.flash("addError", "All fields are required");
    res.redirect("/add");
    return;
  }

  if (!image) {
    req.flash("addError", "Product image is required");
    res.redirect("/add");
    return;
  }

  try {
    await Product.create({
      ...req.body,
      user: req.userId,
      image: image.path.split(path.sep).pop(),
    });
    res.status(201).redirect("/");
  } catch (err) {
    res.json(err.message);
  }
};

productsController.about_get = async (req, res) => {
  const id = req.params.id;
  fs.writeFile("test.txt", id, (err) => {
    if (err) {
      console.error(err);
    }
  });
  res.redirect("/product");
};

productsController.product_get = (req, res) => {
  fs.readFile("test.txt", "utf8", async (err, data) => {
    if (err) {
      console.error(err);
      return;
    }

    try {
      const product = toPlain(await Product.findById(data));
      res.render("about", { product });
    } catch (error) {
      res.json(error.message);
    }
  });
};

export default productsController;
