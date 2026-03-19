const express = require("express");
const router = express.Router();
const User = require("../models/Users");
const checkRole = require("../middleware/role");

/* 📌 GET ALL USERS (ADMIN ONLY) */
router.get("/", checkRole(["admin"]), async (req, res) => {
    try {
        const users = await User.find(); // ✅ include password
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: "Error fetching users" });
    }
});

/* ➕ CREATE USER */
router.post("/", checkRole(["admin"]), async (req, res) => {
    const { username, password, role } = req.body;

    try {
        const exists = await User.findOne({ username });

        if (exists) {
            return res.status(400).json({ message: "User already exists" });
        }

        const user = new User({ username, password, role });
        await user.save();

        res.json({ message: "User created" });

    } catch (err) {
        res.status(500).json({ message: "Error creating user" });
    }
});

/* ✏️ UPDATE USER */
router.put("/:id", checkRole(["admin"]), async (req, res) => {
    const { username, password, role } = req.body;

    try {
        await User.findByIdAndUpdate(req.params.id, {
            username,
            password,
            role
        });

        res.json({ message: "User updated" });

    } catch (err) {
        res.status(500).json({ message: "Error updating user" });
    }
});

/* ❌ DELETE USER */
router.delete("/:id", checkRole(["admin"]), async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: "User deleted" });
    } catch (err) {
        res.status(500).json({ message: "Error deleting user" });
    }
});

module.exports = router;