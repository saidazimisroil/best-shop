import jwt from "jsonwebtoken";
import User from "../models/User.js";

export default (req, res, next) => {
  const token = req.cookies.jwt;

  if (token) {
    jwt.verify(token, "buM@xfiySoz", async (err, decodedToken) => {
      if (err) {
        console.log(err.message);
        res.locals.user = null;
        next();
      } else {
        console.log(decodedToken);
        let user = await User.findById(decodedToken.id);
        res.locals.user = user;
        next();
      }
    });
  } else {
    res.locals.user = null;
    next();
  }
};
