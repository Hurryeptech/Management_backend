const mongoose = require("mongoose");
const ExpenseSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  expensename: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  expensecategory: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: false,
  },
  invoice: {
    type: String,
    required: false,
  },
  project: {
    type: String,
    required: false,
  },
  customer: {
    type: String,
    required: false,
  },
  uploadFile: {
    type: String,
    required: false,
  },
  currency: {
    type: String,
    required: true,
  },
  paymentmode: {
    type: String,
    required: true,
  },
  tax1: {
    type: String,
    required: true,
  },
  tax2: {
    type: String,
    required: true,
  },
  repeatevery: {
    type: String,
    required: false,
  },
  customRepeatInterval: {
    type: String,
    required: false,
  },
  customRepeatUnit: {
    type: String,
    required: false,
  },

  totalCycle: {
    type: String,
    required: false,
  },
  infinity: {
    type: Boolean,
    required: false,
  },
});

module.exports = mongoose.model("Expense", ExpenseSchema);