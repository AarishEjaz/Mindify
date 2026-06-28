const express = require("express");
const router = express.Router();

const { getResultByAttempt } = require("../controllers/resultController");
const { protect } = require("../middlewares/authMiddleware");

router.get("/:attemptId", protect, getResultByAttempt);

module.exports = router;
