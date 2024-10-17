const mongoose = require("mongoose")
const jwt= require("jsonwebtoken")

const userSchema =new  mongoose.Schema({
    userName:{
       type: String,
    //    required:[true,"Please Enter UserName"]
    },
    userEmail:{
        type: String,
        // required:[true,"Please Enter UserEmail"]
    },
    team:[
        {
            type: mongoose.Types.ObjectId,
            ref: "teams"
        }
    ],
    image:{
        type: String,
        // required:[true,"Please Upload Image"]
    },
    position:{
        type: String,
        // required:[true,"Please Enter Position"]
    },
    mobile:{
        type: Number,
        // required:[true,"Please Enter Mobile"]
    },
    dob:{
        type: Date,
        // required:[true,"Please Enter Date Of Birth"]
    },
    doj:{
        type: Date
    },
    aboutText:{
        type: String
    },
    proficiency:[
     
    ],
    skills:[
        
    ],
    department:{
        type: String
    },
    address:{
        type: String
    },
    role:{
        type: String
    },
    socialUrl:
        {
            type: Object
        }
    ,
    otp:{
        type: String
    },
    otpExpire:{
        type: Date
    },
    paidLeave:{
        type: Number
    },
    sickLeave:{
        type: Number
    },
    account_Type:{
        type: String
    }
    
})

userSchema.methods.getJwtToken = function(){

    return jwt.sign({id: this.id},process.env.JWT_SECRET,{expiresIn: '7d'})
    
}

module.exports = mongoose.model("User",userSchema)