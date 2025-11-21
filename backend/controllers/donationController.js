import Donation from "../models/Donation.js";
import ApiError from "../utils/ApiError.js";

// CREATE donation
export const createDonation = async (req, res, next) => {
  try {
    const donation = await Donation.create({
      ...req.body,
      donor: req.user._id,
    });

    res.status(201).json(donation);
  } catch (error) {
    next(error);
  }
};

// READ all donations
export const getDonations = async (req, res, next) => {
  try {
    const filter = {};

    // Recipients see approved only
    if (req.user.role === "recipient") {
      filter.status = "approved";
    }

    const donations = await Donation.find(filter)
      .populate("donor", "name email")
      .sort({ createdAt: -1 });

    res.json(donations);
  } catch (error) {
    next(error);
  }
};

// READ one donation
export const getDonationById = async (req, res, next) => {
  try {
    const donation = await Donation.findById(req.params.id)
      .populate("donor", "name email");

    if (!donation) return next(new ApiError(404, "Donation not found"));

    res.json(donation);
  } catch (error) {
    next(error);
  }
};

// UPDATE donation
export const updateDonation = async (req, res, next) => {
  try {
    const donation = await Donation.findById(req.params.id);

    if (!donation) return next(new ApiError(404, "Donation not found"));

    // donor can only edit their own donation
    if (req.user.role === "donor" &&
        donation.donor.toString() !== req.user._id.toString()) {
      return next(new ApiError(403, "You cannot edit this donation"));
    }

    Object.assign(donation, req.body);
    await donation.save();

    res.json(donation);
  } catch (error) {
    next(error);
  }
};

// DELETE donation (staff only)
export const deleteDonation = async (req, res, next) => {
  try {
    const donation = await Donation.findById(req.params.id);
    if (!donation) return next(new ApiError(404, "Donation not found"));

    await donation.deleteOne();
    res.json({ message: "Donation deleted" });
  } catch (error) {
    next(error);
  }
};
