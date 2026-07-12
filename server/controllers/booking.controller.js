const mongoose = require("mongoose");
const Booking = require("../models/Booking");

exports.createBooking = async (req, res) => {
    try {
        const booking = await Booking.create(req.body);

        res.status(201).json({
            success: true,
            message: "Booking created successfully.",
            data: booking,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

exports.getBookings = async (req, res) => {
    try {
        const filter = {};

        if (req.query.resource && mongoose.Types.ObjectId.isValid(req.query.resource))
            filter.resource = req.query.resource;

        if (req.query.bookedBy && mongoose.Types.ObjectId.isValid(req.query.bookedBy))
            filter.bookedBy = req.query.bookedBy;

        if (req.query.status)
            filter.status = req.query.status;

        const bookings = await Booking.find(filter)
            .populate("resource")
            .populate("bookedBy")
            .populate("approvedBy")
            .sort({ startAt: 1 });

        res.status(200).json({
            success: true,
            data: bookings,
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

exports.getBookingById = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid booking id.",
            });
        }

        const booking = await Booking.findById(req.params.id)
            .populate("resource")
            .populate("bookedBy")
            .populate("approvedBy");

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: "Booking not found.",
            });
        }

        res.status(200).json({
            success: true,
            data: booking,
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

exports.updateBooking = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid booking id.",
            });
        }

        const booking = await Booking.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true,
            }
        )
            .populate("resource")
            .populate("bookedBy")
            .populate("approvedBy");

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: "Booking not found.",
            });
        }

        res.status(200).json({
            success: true,
            message: "Booking updated successfully.",
            data: booking,
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

exports.deleteBooking = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid booking id.",
            });
        }

        const booking = await Booking.findByIdAndDelete(req.params.id);

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: "Booking not found.",
            });
        }

        res.status(200).json({
            success: true,
            message: "Booking deleted successfully.",
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};