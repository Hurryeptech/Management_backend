const mongoose = require("mongoose")

const taskSchema = new mongoose.Schema({

    taskName:{
        type: String,
        required:[true,"Please Enter Subject"]
    },
    createdBy:{
        _id: {
            type: mongoose.Types.ObjectId
        },
        name: {
            type: String
        }
    },
    assignees:[
        {
            _id: {
                type: mongoose.Types.ObjectId
            },
            assigneesName: {
                type: String
            }
        }
    ],
    followers:[
        {
            _id: {
                type: mongoose.Types.ObjectId
            },
            followersName: {
                type: String
            }
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
   totalCycles:{
     type: Number,
   },
   infinity:{
    type: Boolean
   },
    relatedTo:{
        type: String
    },
    categories:[{
        type: String
    }],
    description:{
        type: String
    },
    related:{
        type: mongoose.Schema.Types.Mixed
    },
    project:{      
            _id: {
                type: mongoose.Types.ObjectId
            },
            projectName: {
                type: String
            }
    },
    comments:[
        {
            name:{
                type: String
            },
            date:{
                type: Date,
                 default: new Date()
            },
            id:{
                type: mongoose.Types.ObjectId
            },
            comment:{
                type: String
            }
        }
    ],
    attachments:[
        {
        id:{
            type: Number
        },
        image:{
            type: String
        },
        name:{
            type: String
        }
        }
    ],
    noDays:{
        type: Number
    },
    days:{
        type: String
    }
    // user:{
    //     type: mongoose.Types.ObjectId,
    //     ref: "User"
    // }
})
 
// taskSchema.pre('save',function(next){
//     if(this.noDays && this.days)
//     {
//         console.log("this",this.repeatEvery,this.days,this.noDays)
       
//     }
//     next()
// })

module.exports = mongoose.model("task",taskSchema)