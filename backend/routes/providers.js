const express = require("express");
const router = express.Router();
const Provider = require("../models/Provider");
const {
  verifyToken,
  verifyAdmin,
  verifyProvider,
} = require("../middleware/auth");

// Get all providers
router.get("/", async (req, res) => {
  try {
    const { status, category } = req.query;
    const filters = {};

    if (status) filters.status = status;
    if (category) filters.category = category;

    const providers = await Provider.getAll(filters);
    res.json({ success: true, providers });
  } catch (error) {
    console.error("Get providers error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Get provider by ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const provider = await Provider.findById(id);

    if (!provider) {
      return res.status(404).json({ error: "Provider not found" });
    }

    res.json({ success: true, provider });
  } catch (error) {
    console.error("Get provider error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Get provider by user ID
router.get("/user/:uid", verifyToken, async (req, res) => {
  try {
    const { uid } = req.params;
    const provider = await Provider.findByUid(uid);

    if (!provider) {
      return res.status(404).json({ error: "Provider not found" });
    }

    res.json({ success: true, provider });
  } catch (error) {
    console.error("Get provider by uid error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Create provider
router.post("/", verifyToken, async (req, res) => {
  try {
    const providerData = {
      ...req.body,
      uid: req.user.uid,
    };

    const provider = await Provider.create(providerData);
    res.status(201).json({ success: true, provider });
  } catch (error) {
    console.error("Create provider error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Update provider
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const provider = await Provider.findById(id);

    if (!provider) {
      return res.status(404).json({ error: "Provider not found" });
    }

    // Only provider owner or admin can update
    if (provider.uid !== req.user.uid && !req.user.admin) {
      return res.status(403).json({ error: "Forbidden" });
    }

    const updatedProvider = await Provider.update(id, req.body);
    res.json({ success: true, provider: updatedProvider });
  } catch (error) {
    console.error("Update provider error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Update provider status (admin only)
router.patch("/:id/status", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const provider = await Provider.updateStatus(id, status);
    res.json({ success: true, provider });
  } catch (error) {
    console.error("Update provider status error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Delete provider
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const provider = await Provider.findById(id);

    if (!provider) {
      return res.status(404).json({ error: "Provider not found" });
    }

    // Only provider owner or admin can delete
    if (provider.uid !== req.user.uid && !req.user.admin) {
      return res.status(403).json({ error: "Forbidden" });
    }

    await Provider.delete(id);
    res.json({ success: true, message: "Provider deleted successfully" });
  } catch (error) {
    console.error("Delete provider error:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
