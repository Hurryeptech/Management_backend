const CatchAsyncError = require("../middlewares/CatchAsyncError")
const customerModel = require("../models/CustomerModel")
const ErrorHandler = require("../utils/ErrorHandler")
const SendToken = require("../utils/SendToken")
const otplib = require("otplib")


exports.login = CatchAsyncError(async(req,res,next)=>{

    const {email} = req.body
    const customer = await customerModel.findOne({"contactPerson.email": email})
    if(!customer)
    {
        return next(new ErrorHandler("Not a valid customer",401))
    }
    otplib.totp.options= {digits: 6,step: 120}
    const otp = otplib.totp.generate(email+process.env.OTPLIB_SECRET)

    customer.otp = otp
    customer.otpExpire = new Date(Date.now() + 1 * 60 * 1000)
    await customer.save()

    res.json({
        success: true,
        otp
    })
})

exports.verifyOtp = CatchAsyncError(async(req,res,next)=>{

    
    const {otp,email} = req.body

    const customer = await customerModel.findOne({"contactPerson.email": email})
    if(customer.otpExpire  < Date.now())
    {
        customer.otpExpire = undefined,
        customer.otp = undefined
        customer.save()
        return next(new ErrorHandler("Time is exceeded",401))
    }

   

    if(otp !== customer.otp)
    {
        return next(new ErrorHandler("Otp is Wrong",401))
    }

    customer.otp = undefined
    customer.otpExpire = undefined
    customer.lastLogin = new Date()
    await customer.save({validateBeforeSave: false})

    if(!customer)
    {
        return next(new ErrorHandler("Not a Valid User",401))
    }
    SendToken(customer,res,200)

})