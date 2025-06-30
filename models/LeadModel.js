const mongoose = require("mongoose");

const leadSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please Enter FirstName"],
  },
  business: {
    type: String,
    required: [true, "Please Enter LastName"],
  },
  status: {
    type: String,
    default: "New Lead",
  },
  source: {
    type: String,
  },
  mobile: {
    type: String,
    required: [true, "Please Enter Mobile"],
  },

  salesOwner: [
    {
      _id: {
        type: mongoose.Types.ObjectId,
      },
      assigneesName: {
        type: String,
      },
    },
  ],
  email: {
    type: String,
  },
  street: {
    type: String,
  },
  pincode: {
    type: String,
  },
  city: {
    type: String,
  },
  state: {
    type: String,
  },
  category: {
    type: String,
  },
  createdDate: {
    type: Date,
    default: new Date(),
  },
  tags: [
    {
      tagsName: {
        type: String,
      },
    },
  ],
});

module.exports = mongoose.model("Lead", leadSchema);
