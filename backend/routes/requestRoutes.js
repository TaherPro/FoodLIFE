import express from "express";
import {
  createRequest,
  getMyRequests,
  getAllRequests,
  updateRequestStatus,
  deleteRequest
} from "../controllers/requestController.js";

import { protect, restrictTo } from "../middleware/authMiddleware.js";

const router = express.Router();

// Recipient creates request
router.post("/", protect, restrictTo("recipient"), createRequest);

// Recipient views own requests
router.get("/mine", protect, restrictTo("recipient"), getMyRequests);

// Staff views all requests
router.get("/", protect, restrictTo("staff"), getAllRequests);

// Staff updates request status
router.put("/:id", protect, restrictTo("staff"), updateRequestStatus);

// Staff delete request
router.delete("/:id", protect, restrictTo("staff"), deleteRequest);

export default router;
