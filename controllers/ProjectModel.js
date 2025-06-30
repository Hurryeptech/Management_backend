const mongoose = require("mongoose")

const projectScehma = new mongoose.Schema({

    projectName:{
        type: String,
        required:[true,"Please Enter ProjectName"]
    },
    customer:{
       _id:{
        type: mongoose.Types.ObjectId
       },
       companyName:{
        type: String
       }
    },
    progress:{
        type: Number
    },
    calculateProgressThroughTask:{
        type: Boolean
    },
    status:{
        type: String
    },
    startDate:{
        type: Date,
        required:[true,"Please Enter Start Date"]
    },
    endDate:{
        type: Date
    },
    members:[
        {
            _id:{
                type: mongoose.Types.ObjectId
            },
           membersName:{
            type: String
           }
        }
    ],
    tags:[
        {
            tagsName:{
                type: String
            }
        }
    ],
    billingType:{
        type: String
    },
    totalRate:{
        type: String
    },
    tasks:[
        {
            type: mongoose.Types.ObjectId,
            ref:'tasks'
        }
    ],
    createdBy:{
        _id:{
            type: mongoose.Types.ObjectId
        },
        name:{
            type: String
        },
        date:{
            type: Date,
            default: Date.now()
        }
    }
})

module.exports = mongoose.model("Project",projectScehma)