const mongoose = require("mongoose");
const AuditCycle = require("../models/AuditCycle");

exports.createAuditCycle = async (req, res) => {
    try {
        const auditCycle = await AuditCycle.create(req.body);

        res.status(201).json({
            success: true,
            message: "Audit cycle created successfully.",
            data: auditCycle,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

exports.getAuditCycles = async (req, res) => {
    try {
        const filter = {};

        if (req.query.status)
            filter.status = req.query.status;

        if (
            req.query.createdBy &&
            mongoose.Types.ObjectId.isValid(req.query.createdBy)
        ) {
            filter.createdBy = req.query.createdBy;
        }

        const auditCycles = await AuditCycle.find(filter)
            .populate("createdBy")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: auditCycles,
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

exports.getAuditCycleById = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid audit cycle id.",
            });
        }

        const auditCycle = await AuditCycle.findById(req.params.id)
            .populate("createdBy");

        if (!auditCycle) {
            return res.status(404).json({
                success: false,
                message: "Audit cycle not found.",
            });
        }

        res.status(200).json({
            success: true,
            data: auditCycle,
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

exports.updateAuditCycle = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid audit cycle id.",
            });
        }

        const auditCycle = await AuditCycle.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true,
            }
        ).populate("createdBy");

        if (!auditCycle) {
            return res.status(404).json({
                success: false,
                message: "Audit cycle not found.",
            });
        }

        res.status(200).json({
            success: true,
            message: "Audit cycle updated successfully.",
            data: auditCycle,
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

exports.deleteAuditCycle = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid audit cycle id.",
            });
        }

        const auditCycle = await AuditCycle.findByIdAndDelete(req.params.id);

        if (!auditCycle) {
            return res.status(404).json({
                success: false,
                message: "Audit cycle not found.",
            });
        }

        res.status(200).json({
            success: true,
            message: "Audit cycle deleted successfully.",
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};