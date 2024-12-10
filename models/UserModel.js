const mongoose = require("mongoose")
const validators = require("mongoose-validator")

const jwt= require("jsonwebtoken")


const userSchema =new  mongoose.Schema({
    firstName:{
        type: String,
        // validate: validators({
        //     validator: "isLength",
        //     arguments:[2,8],
        //     message:"the name should be {ARGS[0]} and {ARGS[1]}"
        // })
        required:[true,"Please Enter FirstName"]
    },
    lastName:{
        type: String,
        required:[true,"Please Enter LastName"]
    },
    userEmail:{
        type: String,
        
        required:[true,"Please Enter UserEmail"]
    },
    empId:{
        type: String,
        unique: true
    },
    designation:{
        type: String
    },
    image:{
        type: String,
        // required:[true,"Please Upload Image"]
    },
    mobile:{
        type: Number,
        // required:[true,"Please Enter Mobile"]
    },
    otp:{
        type: String
    },
    otpExpire:{
        type: Date
    },
    facebook:{
        type: String
    },
    skype:{
        type: String
    },
    linkedin:{
        type:String
    },
    hourlyRate:{
        type: Number
    },
    account_Type:{
        type: String
    },
    humanResource:{
        type: Boolean,
        default: false
    },
    administrator:{
        type: Boolean,
        default: false
    },
    welcomeEmail:{
        type: Boolean
    },
    employee:{
        type: Boolean,
        default: true
    },
    active:{
        type: Boolean,
        default: true
    },
    lastLogin:{
        type: Date
    },
    permissions:{
        "staffs":{
            create:{
                type: Boolean
            },
            edit:{
                type: Boolean
            },
            viewGlobal:{
                type: Boolean
            },
         
        }
    },
    reportingPerson:{
        type: mongoose.Schema.ObjectId
    }
})

userSchema.methods.getJwtToken = function(){

    return jwt.sign({id: this.id},process.env.JWT_SECRET,{expiresIn: '7d'})
    
}

module.exports = mongoose.model("User",userSchema)