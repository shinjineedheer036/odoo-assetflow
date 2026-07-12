const express = require("express");

const {
  createTransferRequest,
  getTransferRequests,
  getTransferRequestById,
  updateTransferStatus,
} = require("../controllers/transferRequest.controller.js");

const { protect } = require("../middlewares/authMiddleware.js");
const {
  authorizeRoles,
} = require("../middlewares/roleMiddleware.js");

const router = express.Router();

router.post(
  "/",
  protect,
  authorizeRoles("ADMIN", "ASSET_MANAGER", "DEPARTMENT_HEAD"),
  createTransferRequest
);

router.get(
  "/",
  protect,
  authorizeRoles("ADMIN", "ASSET_MANAGER", "DEPARTMENT_HEAD"),
  getTransferRequests
);

router.get(
  "/:id",
  protect,
  authorizeRoles("ADMIN", "ASSET_MANAGER", "DEPARTMENT_HEAD"),
  getTransferRequestById
);

router.patch(
  "/:id/status",
  protect,
  authorizeRoles("ADMIN", "ASSET_MANAGER"),
  updateTransferStatus
);

module.exports = router;