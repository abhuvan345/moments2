const express = require("express");
const router = express.Router();
const cloudinary = require("../config/cloudinary");
const upload = require("../middleware/upload");
const { verifyToken } = require("../middleware/auth");

// Public upload for registration (no auth required)
router.post("/", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Upload to Cloudinary
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "moments/aadhar",
          resource_type: "auto",
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );

      uploadStream.end(req.file.buffer);
    });

    res.json({
      success: true,
      url: result.secure_url,
      publicId: result.public_id,
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Upload single image
router.post(
  "/single",
  verifyToken,
  upload.single("image"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      // Upload to Cloudinary
      const result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: "moments",
            resource_type: "auto",
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );

        uploadStream.end(req.file.buffer);
      });

      res.json({
        success: true,
        url: result.secure_url,
        publicId: result.public_id,
      });
    } catch (error) {
      console.error("Upload error:", error);
      res.status(500).json({ error: error.message });
    }
  }
);

// Upload multiple images
router.post(
  "/multiple",
  verifyToken,
  upload.array("images", 10),
  async (req, res) => {
    try {
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ error: "No files uploaded" });
      }

      const uploadPromises = req.files.map((file) => {
        return new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            {
              folder: "moments",
              resource_type: "auto",
            },
            (error, result) => {
              if (error) reject(error);
              else
                resolve({
                  url: result.secure_url,
                  publicId: result.public_id,
                });
            }
          );

          uploadStream.end(file.buffer);
        });
      });

      const results = await Promise.all(uploadPromises);

      res.json({
        success: true,
        images: results,
      });
    } catch (error) {
      console.error("Upload multiple error:", error);
      res.status(500).json({ error: error.message });
    }
  }
);

// Delete image
router.delete("/:publicId", verifyToken, async (req, res) => {
  try {
    const { publicId } = req.params;

    // Decode the publicId (it might be URL encoded)
    const decodedPublicId = decodeURIComponent(publicId);

    await cloudinary.uploader.destroy(decodedPublicId);

    res.json({
      success: true,
      message: "Image deleted successfully",
    });
  } catch (error) {
    console.error("Delete image error:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
