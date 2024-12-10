const mongoose = require("mongoose")

const taskSchema = new mongoose.Schema({

    subject:{
        type: String,
        required:[true,"Please Enter Subject"]
    },
    createdBy:{
        type: String
    },
    assignedTo:[
        {
            type: String
        }
    ],
    followers:[
        {
            type: String
        }
    ],
    hourlyRate:{
        type: Number
    },
    startDate:{
        type: Date,
        required:[true,"Please Enter Start Date"]
    },
    status:{
        type: String,
        default:"Inprogress"
    },
    endDate:{
        type: Date
    },
    priority:{
        type: String
    },
    repeatEvery:{
        type: String
    },
    relatedTo:{
        type: String
    },
    tags:{
        type: String
    },
    taskDescription:{
        type: String
    },
    user:{
        type: mongoose.Types.ObjectId,
        ref: "User"
    }
})

module.exports = mongoose.model("task",taskSchema)