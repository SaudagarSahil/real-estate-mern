import { errorHandler } from "../utills/error.js";
import bcryptjs from "bcryptjs";
import User from "../models/user.model.js";
import Listing from "../models/listing.model.js";

export const test = (req, res) => {
  res.send("Hello Sahil");
};

export const updateUser = async (req, res, next) => {
  if (req.user.id != req.params.id)
    return next(errorHandler(401, "Cannot update different user!"));

  try {
    if (req.body.password) {
      req.body.password = bcryptjs.hashSync(req.body.password, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          password: req.body.password,
          avatar: req.body.avatar,
        },
      },
      { new: true }
    );

    const { password: pass, ...rest } = updatedUser._doc;
    res.status(201).json(rest);
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  if (req.user.id !== req.params.id)
    return next(errorHandler(401, "You can only delete your own account!"));

  try {
    await User.findByIdAndDelete(req.params.id);
    res.clearCookie("access_token");
    res.status(201).json("User deleted successfully!");
  } catch (error) {
    next(error);
  }
};

export const getUserListing = async (req, res, next) => {
  if(req.user.id === req.params.id) {
    try {
      const listings = await Listing.find({userRef : req.params.id});
      res.status(201).json(listings);
      console.log("Listings retrived !")
    } catch (error) {
      next(error);
    }
  } else {
    return next(errorHandler(401, 'You can only view your listings :)'));
  }

}
