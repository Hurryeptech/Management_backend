const mongoose = require("mongoose");

const taxesSchema = new mongoose.Schema({
  cgst: { type: String },
  cgstAmt: { type: String },
  gstValue: { type: String },
  igst: { type: String },
  igstAmt: { type: String },
  sgst: { type: String },
  sgstAmt: { type: String },
  totalRate: { type: String },
  taxType: { type: String },
});
const companyAddressSchema = new mongoose.Schema({
  name: { type: String },
  address: { type: String },
  client: { type: String },
  city: { type: String },
  gst: { type: String },
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
  gst: { type: String },
  cgst: { type: String },
  sgst: { type: String },
  igst: { type: String },
  saccode: { type: String },
  rate: { type: String },
});
const invoiceSchema = new mongoose.Schema({
  subject: {
    type: String,
  },
  invoiceNo: {
    type: String,
  },
  refNo: {
    type: String,
  },
  customer: {
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
  billingAddress: { type: companyAddressSchema },
  shippingAddress: { type: companyAddressSchema },
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
  dueDate: {
    type: String,
  },
  discountType: {
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
  totalPaid: {
    type: String,
  },
  credits: {
    type: String,
    default: "0",
  },
  amountDue: {
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

module.exports = mongoose.model("Invoice", invoiceSchema);
