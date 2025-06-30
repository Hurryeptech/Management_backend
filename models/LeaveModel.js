const mongoose = require("mongoose")
const LeaveSchema = new mongoose.Schema({
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    leaveBalances: {
      type: Object
    },
    lastResetDate: {
      type: Map,
      of: Date,
      default: {},
    },
    leaveRequests: [
      {
        file:{
          type: String, 
        },
        resultby: {
          type: String,
        },
        leavetype: {
          type: String,
          required: true,
        },
        fromDate: {
          type: String,
          required: true,
        },
        toDate: {
          type: String,
          required: true,
        },
        subject: {
          type: String,
          required: true,
        },
        remarks: {
          type: String,
          required: false,
        },
        status: {
          type: String,
          required: true,
          default: "Pending",
        },
        fs: {
          type: String,
          required: true,
          enum: ["FN", "AN"],
        },
        ts: {
          type: String,
          required: true,
          enum: ["FN", "AN"],
        },
        numofdays: {
          type: Number,
          required: true,
        },
      },
    ],
  });
LeaveSchema.plugin
module.exports = mongoose.model("Leave",LeaveSchema)