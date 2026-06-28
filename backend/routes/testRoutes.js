const express = require("express");
const router = express.Router();

const { listTests, getTestById } = require("../controllers/testController");
const { protect } = require("../middlewares/authMiddleware");

// All test routes require a logged-in user.
router.get("/", protect, listTests);
router.get("/:id", protect, getTestById);

module.exports = router;
