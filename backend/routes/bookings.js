const express = require("express");
const router = express.Router();
const Booking = require("../models/Booking");
const {
  verifyToken,
  verifyProvider,
  verifyAdmin,
} = require("../middleware/auth");

// Get all bookings (admin only)
router.get("/", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const bookings = await Booking.getAll();
    res.json({ success: true, bookings });
  } catch (error) {
    console.error("Get bookings error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Get booking by ID
router.get("/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findById(id);

    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    // Users can only see their own bookings unless they're provider or admin
    if (
      booking.userId !== req.user.uid &&
      !req.user.provider &&
      !req.user.admin
    ) {
      return res.status(403).json({ error: "Forbidden" });
    }

    res.json({ success: true, booking });
  } catch (error) {
    console.error("Get booking error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Get user's bookings
router.get("/user/:userId", verifyToken, async (req, res) => {
  try {
    const { userId } = req.params;

    // Users can only see their own bookings
    if (userId !== req.user.uid && !req.user.admin) {
      return res.status(403).json({ error: "Forbidden" });
    }

    const bookings = await Booking.getByUserId(userId);
    res.json({ success: true, bookings });
  } catch (error) {
    console.error("Get user bookings error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Get provider's bookings
router.get(
  "/provider/:providerId",
  verifyToken,
  verifyProvider,
  async (req, res) => {
    try {
      const { providerId } = req.params;
      const bookings = await Booking.getByProviderId(providerId);
      res.json({ success: true, bookings });
    } catch (error) {
      console.error("Get provider bookings error:", error);
      res.status(500).json({ error: error.message });
    }
  }
);

// Create booking
router.post("/", verifyToken, async (req, res) => {
  try {
    const bookingData = {
      ...req.body,
      userId: req.user.uid,
    };

    const booking = await Booking.create(bookingData);
    res.status(201).json({ success: true, booking });
  } catch (error) {
    console.error("Create booking error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Update booking
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findById(id);

    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    // Only booking owner, provider, or admin can update
    if (
      booking.userId !== req.user.uid &&
      !req.user.provider &&
      !req.user.admin
    ) {
      return res.status(403).json({ error: "Forbidden" });
    }

    const updatedBooking = await Booking.update(id, req.body);
    res.json({ success: true, booking: updatedBooking });
  } catch (error) {
    console.error("Update booking error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Update booking status
router.patch("/:id/status", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const booking = await Booking.findById(id);

    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    // Only booking owner, provider, or admin can update status
    if (
      booking.userId !== req.user.uid &&
      !req.user.provider &&
      !req.user.admin
    ) {
      return res.status(403).json({ error: "Forbidden" });
    }

    const updatedBooking = await Booking.updateStatus(id, status);
    res.json({ success: true, booking: updatedBooking });
  } catch (error) {
    console.error("Update booking status error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Delete booking
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findById(id);

    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    // Only booking owner or admin can delete
    if (booking.userId !== req.user.uid && !req.user.admin) {
      return res.status(403).json({ error: "Forbidden" });
    }

    await Booking.delete(id);
    res.json({ success: true, message: "Booking deleted successfully" });
  } catch (error) {
    console.error("Delete booking error:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
