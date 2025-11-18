const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { verifyToken, verifyAdmin } = require("../middleware/auth");

// Get all users (admin only)
router.get("/", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const users = await User.getAll();
    res.json({ success: true, users });
  } catch (error) {
    console.error("Get users error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Get user by ID
router.get("/:uid", verifyToken, async (req, res) => {
  try {
    const { uid } = req.params;
    const user = await User.findById(uid);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ success: true, user });
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Update user
router.put("/:uid", verifyToken, async (req, res) => {
  try {
    const { uid } = req.params;

    // Users can only update their own profile unless they're admin
    if (req.user.uid !== uid && !req.user.admin) {
      return res.status(403).json({ error: "Forbidden" });
    }

    const user = await User.update(uid, req.body);
    res.json({ success: true, user });
  } catch (error) {
    console.error("Update user error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Delete user (admin only)
router.delete("/:uid", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { uid } = req.params;
    await User.delete(uid);
    res.json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    console.error("Delete user error:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
