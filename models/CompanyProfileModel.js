const mongoose = require("mongoose");

const CompanyProfileSchema = new mongoose.Schema({
  companyname: { type: String, required: true },
  email: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  country: { type: String, required: true },
  state: { type: String, required: true },
  phone: { type: Number, required: true },
  gst: { type: Number, required: true },
  zip: { type: Number, required: true },
  file: { type: String }, // ✅ Ensure the file field exists!
});

module.exports = mongoose.model("CompanyProfile", CompanyProfileSchema);