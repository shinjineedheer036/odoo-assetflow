const express = require("express");

const {
  createResource,
  getResources,
  getResourceById,
  updateResource
} = require("../controllers/resource.controller.js");

const { protect } = require("../middlewares/authMiddleware.js");

const {
  authorizeRoles,
} = require("../middlewares/roleMiddleware.js");

const router = express.Router();

router.post(
  "/",
  protect,
  authorizeRoles("ADMIN", "ASSET_MANAGER", "DEPARTMENT_HEAD"),
  createResource
);

router.get(
  "/",
  protect,
  getResources
);

router.get(
  "/:id",
  protect,
  getResourceById
);

router.patch(
  "/:id",
  protect,
  authorizeRoles("ADMIN", "ASSET_MANAGER", "DEPARTMENT_HEAD"),
  updateResource
);

module.exports = router;