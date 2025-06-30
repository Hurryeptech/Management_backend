const mongoose = require("mongoose")

const paymentSchema = new mongoose.Schema({
    invoiceNo: {
        type: String,
        required: [true, "Please Enter Invoice No"]
    },
    client: {
        type: String,
        required: [true, "Please Enter client"]
    },
    paymentMode: {
        type: String,
        required: [true, "Please Enter paymentMode"]
    },
    note: {
        type: String,
    },
    date: {
        type: String,
        required: [true, "Please Enter date"]
    },
    amount: {
        type: String,
        required: [true, "Please Enter amount"]
    },

})

module.exports = mongoose.model("Payment", paymentSchema)