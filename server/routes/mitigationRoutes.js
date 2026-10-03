const express = require("express");
const router = express.Router();
const { handleGenerateMitigation } = require("../controllers/mitigationController");

router.post("/", handleGenerateMitigation);

module.exports = router;
