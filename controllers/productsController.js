import Product from "../models/Product.js";
import fs from "node:fs";

const productsController = {};

productsController.main_get = async (req, res) => {
  const products = await Product.find().lean();
  res.render("index", { products: products.reverse(), userId: req.userId || null });
};
productsController.food_get = async (req, res) => {
  const products = await Product.find({ category: "food" }).lean();
  res.render("food", { products: products.reverse(), userId: req.userId || null });
};
productsController.drinks_get = async (req, res) => {
  const products = await Product.find({ category: "drinks" }).lean();
  res.render("drinks", { products: products.reverse(), userId: req.userId || null });
};

productsController.add_get = (req, res) => {
  res.render("add", {
    addError: req.flash("addError"),
  });
};
productsController.add_post = async (req, res) => {
  const { title, price, description, category } = req.body;
  const image = req.file;
  console.log(req.file);
  if (!title || !price || !description || !category) {
    req.flash("addError", "All fields are required");
    res.redirect("/add");
    return;
  }

  try {
    const product = await Product.create({
      ...req.body,
      user: req.userId,
      image: image.path.split("\\")[1],
    });
    res.status(201).redirect("/");
  } catch (err) {
    res.json(err.message);
  }
};

productsController.about_get = async (req, res) => {
  const id = req.params.id;
  const content = id;
  fs.writeFile("test.txt", content, (err) => {
    if (err) {
      console.error(err);
    }
    // file written successfully
  });
  res.redirect("/product");
};
productsController.product_get = (req, res) => {
  fs.readFile("test.txt", "utf8", async (err, data) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log(data);
    try {
      let product = await Product.findById(data);
      res.render("about", { product });
    } catch (err) {
      res.json(err.message);
    }
  });
};
export default productsController;
