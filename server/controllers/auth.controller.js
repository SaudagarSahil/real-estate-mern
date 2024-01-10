import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utills/error.js";
import jwt from "jsonwebtoken";

export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;
  const hashedPassword = bcryptjs.hashSync(password, 10);
  const newUser = new User({ username, email, password: hashedPassword });
  try {
    await newUser.save();
    res.status(201).json("User Created Successfully");
  } catch (error) {
    next(error);
    // next(errorHandler(501, "Test Error"));
  }
};

export const signin = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const validUser = await User.findOne({ email });
    if (!validUser) return next(errorHandler(401, "Invalid Email"));
    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) return next(errorHandler(401, "Invalid Password"));
    const { password: pass, ...rest } = validUser._doc;
    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET_KEY);
    res
      .cookie("access_token", token, { httpOnly: true })
      .status(200)
      .json(rest);
  } catch (error) {
    next(error);
  }
};

export const google = async (req, res, next) => {
  try {
    const { username, email, imageURL } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY);
      const { password: pass, ...rest } = user._doc;
      res
        .cookie("access_token", token, { httpOnly: true })
        .status(200)
        .json(rest);
      console.log("User LoggedIn Successfully using Google");
    } else {
      const generatedPassword = Math.random().toString(36).slice(-8);
      const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
      const newUser = new User({
        username:
          username.split(" ").join("").toLowerCase() +
          Math.random().toString().slice(-3),
        email,
        password: hashedPassword,
        avatar: imageURL,
      });
      await newUser.save();
      res.status(200).json("User Created Successfully using Google");
      console.log("User Created Successfully using Google");
    }
  } catch (error) {
    next(error);
  }
};
