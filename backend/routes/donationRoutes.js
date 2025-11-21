import express from "express";
import {
  createDonation,
  getDonations,
  getDonationById,
  updateDonation,
  deleteDonation
} from "../controllers/donationController.js";

import { protect, restrictTo } from "../middleware/authMiddleware.js";

const router = express.Router();

// CREATE donation (donor only)
router.post("/", protect, restrictTo("donor"), createDonation);

// READ all donations
router.get("/", protect, getDonations);

// READ one donation
router.get("/:id", protect, getDonationById);

// UPDATE donation (donor or staff)
router.put("/:id", protect, updateDonation);

// DELETE donation (staff only)
router.delete("/:id", protect, restrictTo("staff"), deleteDonation);

export default router;
