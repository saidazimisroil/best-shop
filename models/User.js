import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { randomUUID } from "crypto";
import pkg from "validator";
const { isEmail } = pkg;

const useMockDb = process.env.USE_MOCK_DB === "true";

const toPlainObject = (value) =>
  value === null || value === undefined
    ? value
    : JSON.parse(JSON.stringify(value));

const buildValidationError = (errors) => {
  const err = new Error("user validation failed");
  err.errors = Object.entries(errors).reduce((acc, [path, message]) => {
    acc[path] = { properties: { path, message } };
    return acc;
  }, {});
  return err;
};

const buildMockModel = () => {
  const usersById = new Map();
  const usersByEmail = new Map();

  const create = async ({ email, password }) => {
    if (!email) {
      throw buildValidationError({ email: "Please, enter an email" });
    }
    if (!isEmail(email)) {
      throw buildValidationError({ email: "Please, enter valid email" });
    }
    if (!password) {
      throw buildValidationError({ password: "Please, enter your password" });
    }
    if (password.length < 6) {
      throw buildValidationError({
        password: "Minimum length of password is 6 characters",
      });
    }
    if (usersByEmail.has(email)) {
      const duplicateError = new Error("Duplicate email");
      duplicateError.code = 11000;
      throw duplicateError;
    }

    const salt = await bcrypt.genSalt();
    const hashed = await bcrypt.hash(password, salt);
    const user = {
      _id: randomUUID(),
      email: email.toLowerCase(),
      password: hashed,
    };

    usersById.set(user._id, user);
    usersByEmail.set(user.email, user);
    console.log("new user is saved", user);
    return toPlainObject(user);
  };

  const login = async (email, password) => {
    const user = usersByEmail.get(email.toLowerCase());
    if (!user) {
      throw new Error("Incorrect email");
    }
    const auth = await bcrypt.compare(password, user.password);
    if (!auth) {
      throw new Error("Incorrect password");
    }
    return toPlainObject(user);
  };

  const findById = async (id) => {
    const user = usersById.get(id);
    return toPlainObject(user ?? null);
  };

  return {
    create,
    login,
    findById,
  };
};

// schema for all users
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Please, enter an email"],
    unique: true,
    lowercase: true,
    validate: [isEmail, "Please, enter valid email"],
  },
  password: {
    type: String,
    required: [true, "Please, enter your password"],
    minlength: [6, "Minimum length of password is 6 characters"],
  },
});
// hashing password before saving user
userSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});
// saying about saved user
userSchema.post("save", function (doc, next) {
  console.log("new user is saved", doc);
  next();
});

// login function
userSchema.statics.login = async function (email, password) {
  const user = await this.findOne({ email });
  if (user) {
    const auth = await bcrypt.compare(password, user.password);

    if (auth) {
      return user;
    }
    throw new Error("Incorrect password");
  }
  throw new Error("Incorrect email");
};

const User = useMockDb ? buildMockModel() : mongoose.model("user", userSchema);

export default User;
