const mongoose = require("mongoose");

const leadSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    mobile: { type: String, required: true },
    email: { type: String, required: true },
    city: { type: String, required: true },
    service: { type: String, required: true },
    budget: { type: Number, required: true },
    status: {
      type: String,
      enum: ["New", "Interested", "Converted", "Rejected"],
      default: "New",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Lead", leadSchema);