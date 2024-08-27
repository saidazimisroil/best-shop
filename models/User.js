import mongoose from "mongoose";
import bcrypt from "bcrypt";
import pkg from "validator";
const { isEmail } = pkg;

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

const User = mongoose.model("user", userSchema);

export default User;
