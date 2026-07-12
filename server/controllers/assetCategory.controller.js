const mongoose = require("mongoose");
const AssetCategory = require("../models/AssetCategory");

exports.createAssetCategory = async (req, res) => {
    try {
        const assetCategory = await AssetCategory.create(req.body);

        res.status(201).json({
            success: true,
            message: "Asset category created successfully.",
            data: assetCategory,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

exports.getAssetCategories = async (req, res) => {
    try {
        const filter = {};

        if (req.query.search) {
            const search = req.query.search.trim();

            filter.$or = [
                { name: { $regex: search, $options: "i" } },
                { slug: { $regex: search, $options: "i" } },
                { description: { $regex: search, $options: "i" } },
            ];
        }

        if (
            req.query.parentCategory &&
            mongoose.Types.ObjectId.isValid(req.query.parentCategory)
        ) {
            filter.parentCategory = req.query.parentCategory;
        }

        const assetCategories = await AssetCategory.find(filter)
            .populate("parentCategory")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: assetCategories,
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

exports.getAssetCategoryById = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid asset category id.",
            });
        }

        const assetCategory = await AssetCategory.findById(req.params.id)
            .populate("parentCategory");

        if (!assetCategory) {
            return res.status(404).json({
                success: false,
                message: "Asset category not found.",
            });
        }

        res.status(200).json({
            success: true,
            data: assetCategory,
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

exports.updateAssetCategory = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid asset category id.",
            });
        }

        const assetCategory = await AssetCategory.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true,
            }
        ).populate("parentCategory");

        if (!assetCategory) {
            return res.status(404).json({
                success: false,
                message: "Asset category not found.",
            });
        }

        res.status(200).json({
            success: true,
            message: "Asset category updated successfully.",
            data: assetCategory,
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

exports.deleteAssetCategory = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid asset category id.",
            });
        }

        const assetCategory = await AssetCategory.findByIdAndDelete(req.params.id);

        if (!assetCategory) {
            return res.status(404).json({
                success: false,
                message: "Asset category not found.",
            });
        }

        res.status(200).json({
            success: true,
            message: "Asset category deleted successfully.",
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};