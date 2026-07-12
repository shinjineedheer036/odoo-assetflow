const mongoose = require("mongoose");

const TransferRequest = require("../models/TransferRequest.js");
const Asset = require("../models/Asset.js");
const Department = require("../models/Department.js");
const Employee = require("../models/Employee.js");

const createTransferRequest = async (req, res) => {
  try {
    const {
      asset,
      toDepartment,
      requestedBy,
      reason,
    } = req.body;

    if (!asset || !toDepartment || !requestedBy) {
      return res.status(400).json({
        message: "asset, toDepartment and requestedBy are required",
      });
    }

    const [existingAsset, targetDepartment, employee] = await Promise.all([
      Asset.findById(asset),
      Department.findById(toDepartment),
      Employee.findById(requestedBy),
    ]);

    if (!existingAsset) {
      return res.status(404).json({
        message: "Asset not found",
      });
    }

    if (!targetDepartment) {
      return res.status(404).json({
        message: "Target department not found",
      });
    }

    if (!employee) {
      return res.status(404).json({
        message: "Requesting employee not found",
      });
    }

    const existingPendingRequest = await TransferRequest.findOne({
      asset,
      status: "pending",
    });

    if (existingPendingRequest) {
      return res.status(409).json({
        message: "A pending transfer request already exists for this asset",
      });
    }

    if (
      existingAsset.currentDepartment &&
      existingAsset.currentDepartment.toString() === toDepartment
    ) {
      return res.status(400).json({
        message: "Asset already belongs to target department",
      });
    }

    const transferRequest = await TransferRequest.create({
      asset,
      fromDepartment: existingAsset.currentDepartment || null,
      toDepartment,
      requestedBy,
      reason,
    });

    return res.status(201).json({
      message: "Transfer request created successfully",
      transferRequest,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

const getTransferRequests = async (req, res) => {
  try {
    const filter = {};

    if (req.query.status) {
      filter.status = req.query.status;
    }

    const transferRequests = await TransferRequest.find(filter)
      .populate("asset", "assetTag name status currentDepartment")
      .populate("fromDepartment", "name code")
      .populate("toDepartment", "name code")
      .populate("requestedBy", "employeeId firstName lastName")
      .populate("approvedBy", "employeeId firstName lastName")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      count: transferRequests.length,
      transferRequests,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

const getTransferRequestById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        message: "Invalid transfer request ID",
      });
    }

    const transferRequest = await TransferRequest.findById(req.params.id)
      .populate("asset", "assetTag name status currentDepartment")
      .populate("fromDepartment", "name code")
      .populate("toDepartment", "name code")
      .populate("requestedBy", "employeeId firstName lastName")
      .populate("approvedBy", "employeeId firstName lastName");

    if (!transferRequest) {
      return res.status(404).json({
        message: "Transfer request not found",
      });
    }

    return res.status(200).json({
      transferRequest,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

const updateTransferStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, approvedBy } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid transfer request ID",
      });
    }

    const allowedStatuses = [
      "approved",
      "rejected",
      "completed",
      "cancelled",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid transfer status",
      });
    }

    const transferRequest = await TransferRequest.findById(id);

    if (!transferRequest) {
      return res.status(404).json({
        message: "Transfer request not found",
      });
    }

    // Prevent arbitrary state changes after terminal states
    if (
      ["rejected", "completed", "cancelled"].includes(
        transferRequest.status
      )
    ) {
      return res.status(400).json({
        message: `Cannot update a ${transferRequest.status} transfer request`,
      });
    }

    // Only pending requests can be approved/rejected/cancelled
    if (
      transferRequest.status === "pending" &&
      !["approved", "rejected", "cancelled"].includes(status)
    ) {
      return res.status(400).json({
        message: "Pending request must be approved, rejected, or cancelled first",
      });
    }

    // Only approved requests can be completed
    if (
      transferRequest.status === "approved" &&
      status !== "completed"
    ) {
      return res.status(400).json({
        message: "Approved request can only be completed",
      });
    }

    if (["approved", "rejected"].includes(status)) {
      if (!approvedBy) {
        return res.status(400).json({
          message: "approvedBy employee ID is required",
        });
      }

      const approvingEmployee = await Employee.findById(approvedBy);

      if (!approvingEmployee) {
        return res.status(404).json({
          message: "Approving employee not found",
        });
      }

      transferRequest.approvedBy = approvedBy;
      transferRequest.decisionAt = new Date();
    }

    if (status === "completed") {
      const asset = await Asset.findById(transferRequest.asset);

      if (!asset) {
        return res.status(404).json({
          message: "Asset not found",
        });
      }

      asset.currentDepartment = transferRequest.toDepartment;
      asset.currentEmployee = null;
      asset.assignedAt = new Date();

      await asset.save();

      transferRequest.transferDate = new Date();
    }

    transferRequest.status = status;

    await transferRequest.save();

    return res.status(200).json({
      message: "Transfer request status updated successfully",
      transferRequest,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

module.exports = {
  createTransferRequest,
  getTransferRequests,
  getTransferRequestById,
  updateTransferStatus,
};