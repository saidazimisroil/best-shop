import "dotenv/config";
import express from "express";
import { create } from "express-handlebars";
import { allowInsecurePrototypeAccess } from "@handlebars/allow-prototype-access";
import Handlebars from "handlebars";
import authRoutes from "./routes/auth.js";
import productsRoutes from "./routes/products.js";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import flash from "connect-flash";
import session from "cookie-session";

import varMiddleware from "./middlewares/var.js";
import userMiddleware from "./middlewares/user.js";

const app = express();
const useMockDb = process.env.USE_MOCK_DB === "true";

const hbs = create({
  defaultLayout: "main",
  extname: "hbs",
  helpers: {
    ifequal: function (a, b, options) {
      if (a === b) {
        return options.fn(this);
      } else {
        return options.inverse(this);
      }
    },
  },
  handlebars: allowInsecurePrototypeAccess(Handlebars),
});

app.engine("hbs", hbs.engine);
app.set("view engine", "hbs");
app.set("views", "./views");

// middlewares
app.use(express.static("public"));
app.use(express.static("uploads")); // Serve the "uploads" directory as a static folder

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(session({ secret: "Said", resave: false, saveUninitialized: false }));
app.use(flash());
app.use(varMiddleware);
app.use(userMiddleware);

const PORT = process.env.PORT || 3000;

// database connection
const dbURI =
  process.env.MONGODB_URI ||
  "mongodb+srv://saidazim:test123@cluster0.mhvu77y.mongodb.net/?retryWrites=true&w=majority";

if (useMockDb) {
  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT} in mock mode`);
  });
} else if (!process.env.MONGODB_URI) {
  console.warn(
    "MONGODB_URI is not set. Either provide a database connection string or set USE_MOCK_DB=true to run with in-memory data."
  );
  mongoose
    .connect(dbURI)
    .then(() =>
      app.listen(PORT, () => console.log(`Server listening on port ${PORT}`))
    )
    .catch((err) => console.log(err));
} else {
  mongoose
    .connect(dbURI)
    .then(() =>
      app.listen(PORT, () => console.log(`Server listening on port ${PORT}`))
    )
    .catch((err) => console.log(err));
}

// routes
app.use(authRoutes);
app.use(productsRoutes);
