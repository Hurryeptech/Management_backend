const mongoose = require("mongoose");

const taxesSchema = new mongoose.Schema({
  cgst: { type: String },
  cgstAmt: { type: String },
  igst: { type: String },
  igstAmt: { type: String },
  sgst: { type: String },
  sgstAmt: { type: String },
  taxType: { type: String },
});
const companyAddressSchema = new mongoose.Schema({
  address: { type: String },
  client: { type: String },
  city: { type: String },
  state: { type: String },
  country: { type: String },
  pincode: { type: String },
  email: { type: String },
  mobile: { type: String },
});

const rowsSchema = new mongoose.Schema({
  title: { type: String },
  serviceDetails: { type: String },
  perServiceCost: { type: String },
  quantity: { type: String },
  cgst: { type: String },
  sgst: { type: String },
  igst: { type: String },
  saccode: { type: String },
  rate: { type: String },
});
const proposalSchema = new mongoose.Schema({
  subject: {
    type: String,
  },
  proposalNo: {
    type: String,
  },
  related: {
    type: String,
  },
  pdfurl: {
    type: String,
  },
  inclusive: {
    type: Number,
  },
  igst: {
    type: Boolean,
    default: false,
  },
  image: {
    type: String,
  },
  rows: [rowsSchema],
  taxes: [taxesSchema],
  companyAddress: { type: companyAddressSchema },
  clientAddress: { type: companyAddressSchema },
  status: {
    type: String,
  },
  clientNote: {
    type: String,
  },
  terms: {
    type: String,
  },
  assigned: {
    type: String,
  },
  date: {
    type: String,
  },
  opentill: {
    type: String,
  },
  discountType: {
    type: String,
  },
  related: {
    type: String,
  },
  relatedName: {
    type: String,
  },
  taxPrefer: {
    type: String,
  },
  subtotal: {
    type: String,
  },
  total: {
    type: String,
  },
  discount: {
    type: String,
  },
  adjust: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Proposal", proposalSchema);
