const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const cookieParser = require("cookie-parser")

const { apiLimiter } = require("./middlewares/rateLimiter");
const { notFound, errorHandler } = require("./middlewares/errorMiddleware");

const authRoutes = require("./routes/authRoutes");
const testRoutes = require("./routes/testRoutes");
const attemptRoutes = require("./routes/attemptRoutes");
const resultRoutes = require("./routes/resultRoutes");
const adminRoutes = require("./routes/adminRoutes");

// This file builds the Express app. server.js then starts it. Keeping
// them separate makes the app easy to test and read.
const app = express();
app.use(cookieParser())

// --- Core middleware ---
app.use(
  cors({
    origin: process.env.CLIENT_URL || "*",
  })
);
app.use(express.json()); // parse JSON request bodies
if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev")); // log requests during development
}

// --- Simple health check ---
app.get("/api/health", (req, res) => {
  res.status(200).json({ success: true, message: "API is running" });
});

// --- Rate limit everything under /api ---
app.use("/api", apiLimiter);

// --- Routes ---
app.use("/api/auth", authRoutes);
app.use("/api/tests", testRoutes);
app.use("/api/attempts", attemptRoutes);
app.use("/api/results", resultRoutes);
app.use("/api/admin", adminRoutes);

// --- 404 + central error handler (must be last) ---
app.use(notFound);
app.use(errorHandler);

module.exports = app;
