const { auth } = require("../config/firebase");

const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ error: "Unauthorized - No token provided" });
    }

    const token = authHeader.split("Bearer ")[1];

    const decodedToken = await auth.verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error("Auth error:", error);
    return res.status(401).json({ error: "Unauthorized - Invalid token" });
  }
};

const verifyAdmin = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Check if user has admin custom claim
    if (req.user.admin !== true) {
      return res
        .status(403)
        .json({ error: "Forbidden - Admin access required" });
    }

    next();
  } catch (error) {
    console.error("Admin verification error:", error);
    return res.status(403).json({ error: "Forbidden" });
  }
};

const verifyProvider = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Check if user has provider custom claim
    if (req.user.provider !== true && req.user.admin !== true) {
      return res
        .status(403)
        .json({ error: "Forbidden - Provider access required" });
    }

    next();
  } catch (error) {
    console.error("Provider verification error:", error);
    return res.status(403).json({ error: "Forbidden" });
  }
};

module.exports = { verifyToken, verifyAdmin, verifyProvider };
