import { Router } from "express";
import authController from "../controllers/authController.js";
import checkUser from "../middlewares/checkUser.js";

const router = Router();

router.get("/register", checkUser, authController.register_get);
router.post("/register", authController.register_post);

router.get("/login", checkUser, authController.login_get);
router.post("/login", authController.login_post);

router.get("/logout", authController.logout_get);

export default router;
