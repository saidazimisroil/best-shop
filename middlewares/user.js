import jwt from "jsonwebtoken";
import User from "../models/User.js";

export default function (req, res, next) {
  const token = req.cookies.jwt;

  if (token) {
    jwt.verify(token, "buM@xfiySoz", async (err, decodedToken) => {
      if (err) {
        console.log(err.message);
        res.redirect("/login");
      } else {
        const user = await User.findById(decodedToken.id);
        req.userId = user._id;
        next();
      }
    });
  } else {
    next();
  }
}
