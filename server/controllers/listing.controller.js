import Listing from "../models/listing.model.js";
import { errorHandler } from "../utills/error.js";

export const createListing = async (req, res, next) => {
  try {
    const newListing = await Listing.create(req.body);
    console.log("New Listing Created !!!");
    res.status(201).json(newListing);
  } catch (error) {
    next(error);
  }
};

export const deleteListing = async (req, res, next) => {
  const listing = Listing.findById(req.params.id);
  if (!listing) {
    return next(errorHandler(401, "Listing not found"));
  }
  if (req.user._id !== listing.userRef) {
    return next(errorHandler(401, "You can only delete your own listings"));
  }
  try {
    await Listing.findByIdAndDelete(req.params.id);
    res.status(201).json("Succesfully deleted a Listing");
  } catch (error) {
    next(error);
  }
};

export const updateListing = async (req, res, next) => {
  const listing = Listing.findById(req.params.id);
  if (!listing) {
    return next(errorHandler(401, "Listing not found"));
  }
  if (req.user._id !== listing.userRef) {
    return next(errorHandler(401, "You can only edit your own listings"));
  }
  try {
    const updatedListing = await Listing.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(201).json(updatedListing);
  } catch (error) {
    next(error);
  }
};

export const getListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if(!listing) {
      return next(errorHandler(401, "Listing not found"));
    }
    res.status(201).json(listing);
  } catch (error) {
    next(error);
  }
}