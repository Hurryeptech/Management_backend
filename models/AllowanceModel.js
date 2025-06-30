const mongoose = require("mongoose")

const allowanceSchema = new mongoose.Schema({
    allowanceName: {
        type: String,
        unique:true,
        required: [true, "Please Enter Allowance Name"]
    },
    componentType: {
        type: String,
        required: [true, "Please Enter Component Type"]
    },
    percentage: {
        type: String,
        required: [true, "Please Enter Percentage"]
    },
    amount: {
        type: String,
    },

})

module.exports = mongoose.model("Allowance", allowanceSchema)