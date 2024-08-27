import { Router } from "express";
import productsController from "../controllers/productsController.js";
import requireAuth from "../middlewares/auth.js";
import checkUser from "../middlewares/checkUser.js";
import upload from "../middlewares/upload.js";

const router = Router();

router.get("/", checkUser, productsController.main_get);
router.get("/food", checkUser, productsController.food_get);
router.get("/drinks", checkUser, productsController.drinks_get);

router.get("/add", requireAuth, checkUser, productsController.add_get);
router.post("/add", requireAuth, upload.single("image"), productsController.add_post);

router.get("/product/:id", checkUser, productsController.about_get);
router.get("/product", checkUser, productsController.product_get);

export default router;
