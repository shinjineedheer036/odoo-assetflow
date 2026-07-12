const mongoose = require("mongoose");
const Asset = require("../models/Asset");

exports.createAsset = async (req, res) => {
    try {
        const asset = await Asset.create(req.body);

        res.status(201).json({
            success: true,
            message: "Asset created successfully.",
            data: asset,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

exports.getAssets = async (req, res) => {
    try {
        const filter = {};

        if (req.query.category && mongoose.Types.ObjectId.isValid(req.query.category))
            filter.category = req.query.category;

        if (req.query.status)
            filter.status = req.query.status;

        if (req.query.condition)
            filter.condition = req.query.condition;

        if (req.query.search) {
            const search = req.query.search.trim();

            filter.$or = [
                { assetTag: { $regex: search, $options: "i" } },
                { name: { $regex: search, $options: "i" } },
                { serialNumber: { $regex: search, $options: "i" } },
                { model: { $regex: search, $options: "i" } },
                { brand: { $regex: search, $options: "i" } },
            ];
        }

        const assets = await Asset.find(filter)
            .populate("category")
            .populate("currentEmployee")
            .populate("currentDepartment")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: assets,
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

exports.getAssetById = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid asset id.",
            });
        }

        const asset = await Asset.findById(req.params.id)
            .populate("category")
            .populate("currentEmployee")
            .populate("currentDepartment");

        if (!asset) {
            return res.status(404).json({
                success: false,
                message: "Asset not found.",
            });
        }

        res.status(200).json({
            success: true,
            data: asset,
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

exports.updateAsset = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid asset id.",
            });
        }

        const asset = await Asset.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true,
            }
        )
            .populate("category")
            .populate("currentEmployee")
            .populate("currentDepartment");

        if (!asset) {
            return res.status(404).json({
                success: false,
                message: "Asset not found.",
            });
        }

        res.status(200).json({
            success: true,
            message: "Asset updated successfully.",
            data: asset,
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

exports.deleteAsset = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid asset id.",
            });
        }

        const asset = await Asset.findByIdAndDelete(req.params.id);

        if (!asset) {
            return res.status(404).json({
                success: false,
                message: "Asset not found.",
            });
        }

        res.status(200).json({
            success: true,
            message: "Asset deleted successfully.",
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};