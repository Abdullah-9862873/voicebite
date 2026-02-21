const express = require("express");
const router = express.Router();

const { processCommand } = require("../controllers/aiContoller");

router.post("/process-command", processCommand);

module.exports = router;
