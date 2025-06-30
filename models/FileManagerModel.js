const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  file: [
    {
      filename: String,
      url: String,
      uploadedAt: { type: Date, default: Date.now },
      public_id:String
    },
  ],
});

module.exports = mongoose.model("File", fileSchema);