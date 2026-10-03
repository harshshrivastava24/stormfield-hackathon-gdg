const express = require("express");
const router = express.Router();
const { calculateRisk } = require("../controllers/riskController");

router.post("/", calculateRisk);

module.exports = router;
