const express = require("express");
const router = express.Router();
const { auth } = require("../config/firebase");
const User = require("../models/User");
const Provider = require("../models/Provider");
const { verifyToken, verifyAdmin } = require("../middleware/auth");

// Register/Create user profile
router.post("/register", async (req, res) => {
  try {
    const { uid, email, name, phone, role, experience, address, aadharUrl } =
      req.body;

    const user = await User.create(uid, {
      email,
      name,
      phone,
      role: role || "user",
    });

    // Set custom claims based on role
    if (role === "provider") {
      await auth.setCustomUserClaims(uid, { provider: true });

      // Auto-create basic provider profile with pending status
      await Provider.create({
        uid,
        email,
        businessName: name || "New Provider",
        category: "other",
        phone: phone || "",
        description: "Waiting for admin approval",
        experience: experience || "",
        address: address || "",
        aadharUrl: aadharUrl || "",
      });
    } else if (role === "admin") {
      await auth.setCustomUserClaims(uid, { admin: true });
    }

    res.status(201).json({ success: true, user });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Set custom claims (admin only)
router.post("/set-claims/:uid", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { uid } = req.params;
    const { claims } = req.body;

    await auth.setCustomUserClaims(uid, claims);

    // Update role in Firestore
    if (claims.admin) {
      await User.update(uid, { role: "admin" });
    } else if (claims.provider) {
      await User.update(uid, { role: "provider" });
    }

    res.json({ success: true, message: "Claims updated successfully" });
  } catch (error) {
    console.error("Set claims error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Set admin claim (for initial admin setup)
router.post("/set-admin/:uid", async (req, res) => {
  try {
    const { uid } = req.params;
    const { adminSecret } = req.body;

    // Use environment variable for security
    if (adminSecret !== process.env.ADMIN_SECRET) {
      return res.status(403).json({ error: "Invalid admin secret" });
    }

    await auth.setCustomUserClaims(uid, { admin: true });
    await User.update(uid, { role: "admin" });

    res.json({ success: true, message: "Admin claim set successfully" });
  } catch (error) {
    console.error("Set admin error:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
