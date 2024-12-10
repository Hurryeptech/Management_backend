const mongoose = require("mongoose")
const jwt = require("jsonwebtoken")
const customerSchema = new mongoose.Schema({

    companyName:{
        type: String,
        required:[true,"Please Enter Company Name"]
    },
    address:{
        street:{
            type: String
        },
        state:{
            type: String
        },
        city:{
            type: String
        },
        street:{
            type: String
        },
        zipcode:{
            type: Number
        }
    },
    gstNumber:{
        type: String
    },
    phone:{
        type: Number
    },
    website:{
        type: String
    },
    group:{
        type: String
    },
    currency:{
        type: String
    },
    billingAddress:{
        state:{
            type: String
        },
        city:{
            type: String
        },
        street:{
            type: String
        },
        pincode:{
            type: Number
        },
        country:{
            type: String
        }
    },
    shippingAddress:{
        state:{
            type: String
        },
        city:{
            type: String
        },
        street:{
            type: String
        },
        zipcode:{
            type: Number
        },
        country:{
            type: String
        }
    },
    otp:{
        type: String
    },
    otpExpire:{
        type: Date
    },
    contactPerson:{
        name:{
            type: String
        },
        email:{
            type: String
        },
        position:{
            type: String
        },
        phone:{
            type: Number
        },
        active:{
            type: Boolean
        }
    }
})


customerSchema.methods.getJwtToken = function(){

    return jwt.sign({id: this.id},process.env.JWT_SECRET,{expiresIn: '7d'})
    
}


module.exports = mongoose.model("Customer",customerSchema)