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

exports.getInsights = async (req, res) => {
  try {
    const total = await Lead.countDocuments();

    if (total === 0) {
      return res.json({ insights: [], summary: { total: 0 } });
    }

    const [statusStats, cityStats, serviceStats, budgetStats] = await Promise.all([
      Lead.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]),
      Lead.aggregate([{ $group: { _id: "$city", count: { $sum: 1 } } }]),
      Lead.aggregate([{ $group: { _id: "$service", count: { $sum: 1 } } }]),
      Lead.aggregate([{ $group: { _id: null, avg: { $avg: "$budget" }, max: { $max: "$budget" } } }]),
    ]);

    const getCount = (arr, id) => arr.find((x) => x._id === id)?.count ?? 0;
    const topCity = [...cityStats].sort((a, b) => b.count - a.count)[0];
    const topService = [...serviceStats].sort((a, b) => b.count - a.count)[0];
    const converted = getCount(statusStats, "Converted");
    const rejected = getCount(statusStats, "Rejected");
    const conversionRate = ((converted / total) * 100).toFixed(1);
    const avgBudget = Math.round(budgetStats[0]?.avg ?? 0);

    const insights = [];

    insights.push({
      type: "conversion",
      icon: "trending-up",
      text: `Overall conversion rate is ${conversionRate}% (${converted} out of ${total} leads converted).`,
    });

    if (topCity) {
      insights.push({
        type: "city",
        icon: "map-pin",
        text: `${topCity._id} generates the most leads with ${topCity.count} total.`,
      });
    }

    if (topService) {
      insights.push({
        type: "service",
        icon: "briefcase",
        text: `"${topService._id}" is the most requested service (${topService.count} leads).`,
      });
    }

    insights.push({
      type: "budget",
      icon: "indian-rupee",
      text: `Average lead budget is ₹${avgBudget.toLocaleString("en-IN")}.`,
    });

    if (rejected > 0) {
      const rejectedRate = ((rejected / total) * 100).toFixed(1);
      insights.push({
        type: "warning",
        icon: "alert-circle",
        text: `${rejectedRate}% of leads are rejected. Consider reviewing your qualification process.`,
      });
    }

    const newLeads = getCount(statusStats, "New");
    if (newLeads > 0) {
      insights.push({
        type: "action",
        icon: "zap",
        text: `${newLeads} leads are still in "New" status and need follow-up.`,
      });
    }

    res.json({ insights, summary: { total, converted, conversionRate, avgBudget } });
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
