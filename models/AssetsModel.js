const mongoose = require("mongoose");

const AssetsModel = new mongoose.Schema({
  employeename: {
    type: String,
    required: true,
  },
  employeeid: {
    type: String,
    required: true,
  },
  assetitem: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  modal: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: false,
  },
})


module.exports = mongoose.model("Assets", AssetsModel);