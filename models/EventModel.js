const mongoose = require("mongoose")

const eventSchema = new mongoose.Schema({
    subject:{
        type: String,
        required:[true,"Please Enter Event Name"]
    },
    startDate:{
        type: Date,
        required:[true,"Please Enter Event Date"]
    },
    endDate:{
        type: Date,
        required:[true,"Please Enter Event Date"]
    },
    type:{
        type: String
    }
    
})

module.exports = mongoose.model("Event",eventSchema)