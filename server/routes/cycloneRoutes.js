const express = require("express");
const router = express.Router();
const { getCycloneTrack } = require("../controllers/cycloneController");

router.get("/", getCycloneTrack);

module.exports = router;
