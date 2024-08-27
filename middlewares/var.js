export default function (req, res, next) {
  const isAuth = req.cookies.jwt ? true : false;
  res.locals.token = isAuth;
  next();
}
