const mongoose = require("mongoose")
const moment = require("moment")

const attendenceSchema = new mongoose.Schema({
    date:{
        type: Date
    },
    checkin:{
        type: Date
    },
    checkout:{
        type: Date
    },
    loggedHours:{
        type: Number,
    },
    pausedTimes:[
       {
        type: Date
       }
    ],
    resumedTimes:[
       {
        type: Date
       }
    ],
    status:{
        type: String
    },
    isPaused:{
        type: Boolean
    },
    user:{
        type: mongoose.Types.ObjectId,
        ref:"User"
    }
})

module.exports = mongoose.model("attendence",attendenceSchema)