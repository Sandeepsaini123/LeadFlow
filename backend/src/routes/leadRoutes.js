const express = require("express");
const router = express.Router();

const {
  createLead,
  getLeads,
  updateLead,
  deleteLead,
  getStats,
  getReport,
} = require("../controllers/leadController");

router.post("/leads", createLead);
router.get("/leads", getLeads);
router.put("/leads/:id", updateLead);
router.delete("/leads/:id", deleteLead);
router.get("/leads/stats", getStats);
router.get("/leads/report", getReport);

module.exports = router;
