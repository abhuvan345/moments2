const express = require("express");
const router = express.Router();
const Service = require("../models/Service");
const Provider = require("../models/Provider");
const { verifyToken, verifyProvider } = require("../middleware/auth");

// Get all services
router.get("/", async (req, res) => {
  try {
    const { category, available } = req.query;
    const filters = {};

    if (category) filters.category = category;
    if (available !== undefined) filters.available = available === "true";

    const services = await Service.getAll(filters);
    res.json({ success: true, services });
  } catch (error) {
    console.error("Get services error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Get service by ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const service = await Service.findById(id);

    if (!service) {
      return res.status(404).json({ error: "Service not found" });
    }

    res.json({ success: true, service });
  } catch (error) {
    console.error("Get service error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Get services by provider ID
router.get("/provider/:providerId", async (req, res) => {
  try {
    const { providerId } = req.params;
    const services = await Service.getByProviderId(providerId);
    res.json({ success: true, services });
  } catch (error) {
    console.error("Get provider services error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Create service (provider only)
router.post("/", verifyToken, verifyProvider, async (req, res) => {
  try {
    const { providerId } = req.body;

    // Verify the provider belongs to the authenticated user
    const provider = await Provider.findById(providerId);
    if (!provider) {
      return res.status(404).json({ error: "Provider not found" });
    }

    if (provider.uid !== req.user.uid && !req.user.admin) {
      return res.status(403).json({ error: "Forbidden" });
    }

    const service = await Service.create(req.body);
    res.status(201).json({ success: true, service });
  } catch (error) {
    console.error("Create service error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Update service
router.put("/:id", verifyToken, verifyProvider, async (req, res) => {
  try {
    const { id } = req.params;
    const service = await Service.findById(id);

    if (!service) {
      return res.status(404).json({ error: "Service not found" });
    }

    // Verify ownership through provider
    const provider = await Provider.findById(service.providerId);
    if (provider.uid !== req.user.uid && !req.user.admin) {
      return res.status(403).json({ error: "Forbidden" });
    }

    const updatedService = await Service.update(id, req.body);
    res.json({ success: true, service: updatedService });
  } catch (error) {
    console.error("Update service error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Delete service
router.delete("/:id", verifyToken, verifyProvider, async (req, res) => {
  try {
    const { id } = req.params;
    const service = await Service.findById(id);

    if (!service) {
      return res.status(404).json({ error: "Service not found" });
    }

    // Verify ownership through provider
    const provider = await Provider.findById(service.providerId);
    if (provider.uid !== req.user.uid && !req.user.admin) {
      return res.status(403).json({ error: "Forbidden" });
    }

    await Service.delete(id);
    res.json({ success: true, message: "Service deleted successfully" });
  } catch (error) {
    console.error("Delete service error:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
