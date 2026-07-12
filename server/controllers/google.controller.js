const { googleAuth } = require("../../services/auth/google.service");
const { validateGoogleSignupBody } = require("../../validators/google.validator");

const sendError = (res, error) => {
    return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Internal Server Error",
    });
};

const validateRequest = (res, validation) => {
    if (validation.valid) return true;
    res.status(400).json({
        success: false,
        message: validation.errors[0],
        errors: validation.errors,
    });
    return false;
};

exports.googleSignup = async (req, res) => {
    try{
        if (!validateRequest(res, validateGoogleSignupBody(req.body))) return;
        const user = await googleAuth(req.body.idToken);
        return res.status(201).json({
            success: true,
            message: "Google signup successful.",
            user,
        });
    } 
    catch(error) {
        return sendError(res, error);
    }
};

exports.googleLogin = async (req, res) => {
    try {
        if (!validateRequest(res, validateGoogleSignupBody(req.body))) return;
        const user = await googleAuth(req.body.idToken);
        return res.status(200).json({
            success: true,
            message: "Google login successful.",
            user,
        });
    } 
    catch(error) {
        return sendError(res, error);
    }
};