const express = require("express");

const {
  getEmployees,
  createEmployee,
  updateEmployee,
  updateEmployeeRole,
} = require("../controllers/employee.controller.js");

const { protect } = require("../middlewares/authMiddleware.js");

const {
  authorizeRoles,
} = require("../middlewares/roleMiddleware.js");

const router = express.Router();

router.get(
  "/",
  protect,
  authorizeRoles("ADMIN"),
  getEmployees
);

router.post(
  "/",
  protect,
  authorizeRoles("ADMIN"),
  createEmployee
);

router.patch(
  "/:id",
  protect,
  authorizeRoles("ADMIN"),
  updateEmployee
);

router.patch(
  "/:id/role",
  protect,
  authorizeRoles("ADMIN"),
  updateEmployeeRole
);

module.exports = router;