import genToken from "../config/token.js";
import User from "../models/user.model.js";

export const googleAuth = async (req, res) => {
try {
const { name, email } = req.body;


    if (!name || !email) {
        return res.status(400).json({
            message: "Name and email are required"
        });
    }

    let user = await User.findOne({ email });

    if (!user) {
        user = await User.create({ name, email });
    }

    const token = await genToken(user._id);

    res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 7 * 24 * 60 * 60 * 1000,
        path: "/"
    });

    return res.status(200).json(user);
} catch (error) {
    console.error("Google auth failed:", error);
    return res.status(500).json({
        message: "Google authentication failed"
    });
}


};

export const logOut = async (req, res) => {
try {
res.clearCookie("token", {
httpOnly: true,
secure: true,
sameSite: "none",
path: "/"
});


    return res.status(200).json({
        message: "Logged out successfully"
    });
} catch (error) {
    console.error("Logout failed:", error);
    return res.status(500).json({
        message: "Logout failed"
    });
}


};
