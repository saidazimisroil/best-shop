import jwt from "jsonwebtoken";

export default function (req, res, next) {
  const token = req.cookies.jwt;

  if (token) {
    jwt.verify(token, "buM@xfiySoz", (err, decodedToken) => {
      if (err) {
        console.log(err.message);
        res.redirect("/login");
      } else {
        console.log(decodedToken);
        next();
      }
    });
  } else {
    res.redirect("/login");
  }
}
