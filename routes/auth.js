const express = require("express");
const router = express.Router();
const User = require("../models/Users");

/* 🔐 LOGIN */
router.post("/login", async (req, res) => {
    const { username, password } = req.body;

    try {

        const user = await User.findOne({ username, password });

        if (!user) {
            console.log("Invalid credential");
            console.log(req)
            return res.status(401).json({ message: "Invalid credentials" });
        }

        res.json({
            _id: user._id,
            username: user.username,
            role: user.role
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;