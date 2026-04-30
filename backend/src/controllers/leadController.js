const Lead = require("../models/lead");

exports.createLead = async (req, res) => {
  try {
    const { name, mobile, email, city, service, budget, status } = req.body;

    if (!name || !mobile || !email || !city || !service || !budget) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const lead = await Lead.create({ name, mobile, email, city, service, budget, status });
    res.status(201).json(lead);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getLeads = async (req, res) => {
  try {
    const leads = await Lead.find().sort({ createdAt: -1 });
    res.json(leads);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateLead = async (req, res) => {
  try {
    const lead = await Lead.findByIdAndUpdate(req.params.id, req.body, { new: true });

    if (!lead) {
      return res.status(404).json({ message: "Lead not found" });
    }

    res.json(lead);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteLead = async (req, res) => {
  try {
    const lead = await Lead.findByIdAndDelete(req.params.id);

    if (!lead) {
      return res.status(404).json({ message: "Lead not found" });
    }

    res.json({ message: "Lead deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getStats = async (req, res) => {
  try {
    const total = await Lead.countDocuments();

    const [statusStats, cityStats, serviceStats] = await Promise.all([
      Lead.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]),
      Lead.aggregate([{ $group: { _id: "$city", count: { $sum: 1 } } }]),
      Lead.aggregate([{ $group: { _id: "$service", count: { $sum: 1 } } }]),
    ]);

    res.json({ total, statusStats, cityStats, serviceStats });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getReport = async (req, res) => {
  try {
    const { city, status, service, startDate, endDate } = req.query;

    const filter = {};

    if (city) filter.city = city;
    if (status) filter.status = status;
    if (service) filter.service = service;

    if (startDate && endDate) {
      filter.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    const leads = await Lead.find(filter).sort({ createdAt: -1 });
    res.json(leads);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
