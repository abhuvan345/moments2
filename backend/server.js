const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

/* =========================
   BODY PARSING (MUST BE FIRST)
   ========================= */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* =========================
   CORS CONFIG (PRODUCTION SAFE)
   ========================= */
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "http://localhost:3002",
  "https://momennt.netlify.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow Postman / server-to-server calls
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

/* =========================
   ROUTES
   ========================= */
app.use("/api/auth", require("./routes/auth"));
app.use("/api/users", require("./routes/users"));
app.use("/api/providers", require("./routes/providers"));
app.use("/api/services", require("./routes/services"));
app.use("/api/bookings", require("./routes/bookings"));
app.use("/api/upload", require("./routes/upload"));

/* =========================
   HEALTH CHECK
   ========================= */
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    message: "Server is running",
    environment: process.env.NODE_ENV || "development",
  });
});

/* =========================
   GLOBAL ERROR HANDLER
   ========================= */
app.use((err, req, res, next) => {
  console.error("ERROR:", err.message);

  res.status(err.status || 500).json({
    error: {
      message: err.message || "Internal Server Error",
      status: err.status || 500,
    },
  });
});

/* =========================
   SERVER START
   ========================= */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
