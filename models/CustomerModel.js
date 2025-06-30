const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const customerSchema = new mongoose.Schema({
  companyName: {
    type: String,
    required: [true, "Please Enter Company Name"],
  },
  contact: {
    type: String,
    required: [true, "Please Enter Contact Person"],
  },
  gstNo: {
    type: String,
  },
  assigned: {
    type: String,
    required: true,
  },
  mobile: {
    type: String,
    required: [true, "Please Enter Mobile Number"],
    unique: true,
  },
  email: {
    type: String,
    required: [true, "Please Enter Email"],
    unique: true,
  },
  active: {
    type: Boolean,
    default: true,
    required: true,
  },
  billing: {
    street: {
      type: String,
      required: [true, "Please Enter Street"],
    },
    city: {
      type: String,
      required: [true, "Please Enter City"],
    },
    state: {
      type: String,
      required: [true, "Please Enter State"],
    },
    country: {
      type: String,
      required: [true, "Please Enter Country"],
    },
    pincode: {
      type: String,
      required: [true, "Please Enter Pincode"],
    },
  },
  shipping: {
    street: {
      type: String,
      required: false,
    },
    city: {
      type: String,
      required: false,
    },
    state: {
      type: String,
      required: false,
    },
    country: {
      type: String,
      required: false,
    },
    pincode: {
      type: String,
      required: false,
    },
  },
});

// customerSchema.methods.getJwtToken = function () {
//   return jwt.sign({ id: this.id }, process.env.JWT_SECRET, { expiresIn: "7d" });
// };

module.exports = mongoose.model("Customer", customerSchema)