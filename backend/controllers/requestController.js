import Request from "../models/Request.js";
import Donation from "../models/Donation.js";
import ApiError from "../utils/ApiError.js";

// CREATE request (Recipient only)
export const createRequest = async (req, res, next) => {
  try {
    console.log("BODY:", req.body);
    console.log("USER:", req.user);
    
    const { donationId } = req.body;

    // Check donation validity
    const donation = await Donation.findById(donationId);
    if (!donation) return next(new ApiError(404, "Donation not found"));

    if (donation.status !== "approved") {
      return next(new ApiError(400, "Donation is not available"));
    }

    // Create request
    const request = await Request.create({
      donation: donationId,
      recipient: req.user._id,
      status: "pending",
    });

    res.status(201).json(request);
  } catch (error) {
    next(error);
  }
};

// GET requests created by recipient
export const getMyRequests = async (req, res, next) => {
  try {
    const requests = await Request.find({ recipient: req.user._id })
      .populate("donation")
      .sort({ createdAt: -1 });

    res.json(requests);
  } catch (error) {
    next(error);
  }
};

// STAFF — GET all requests
export const getAllRequests = async (req, res, next) => {
  try {
    const requests = await Request.find()
      .populate("recipient", "name email")
      .populate("donation")
      .sort({ createdAt: -1 });

    res.json(requests);
  } catch (error) {
    next(error);
  }
};

// STAFF — update request status
export const updateRequestStatus = async (req, res, next) => {
  try {
    const { status } = req.body; // "approved" / "rejected" / "picked_up"
    const request = await Request.findById(req.params.id);

    if (!request) return next(new ApiError(404, "Request not found"));

    request.status = status;
    await request.save();

    // Update donation status depending on request
    if (status === "approved") {
      await Donation.findByIdAndUpdate(request.donation, { status: "reserved" });
    }

    if (status === "picked_up") {
      await Donation.findByIdAndUpdate(request.donation, { status: "completed" });
    }

    if (status === "rejected") {
      await Donation.findByIdAndUpdate(request.donation, { status: "approved" });
    }

    res.json(request);
  } catch (error) {
    next(error);
  }
};
