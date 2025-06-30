const CatchAsyncError = require("../middlewares/CatchAsyncError")
const userModel = require("../models/UserModel")
const ErrorHandler = require("../utils/ErrorHandler")
const otplib = require("otplib")
const sendMail = require("../utils/SendEmail")
const SendToken = require("../utils/SendToken")
const AttendenceModel = require("../models/AttendenceModel")
const moment = require("moment")
const HolidayModel = require("../models/HolidayModel")
const AllowanceModel = require("../models/AllowanceModel");
const PayrollModel = require("../models/SalaryModel");
const cloudinary = require("../utils/Cloudinary")
const fs = require("fs-extra")
const LeaveModel = require("../models/LeaveModel")
const AnnouncementModel = require("../models/AnnouncementModel")
const SpreadsheetModel = require("../models/SpreadsheetModel")
const cookie = require("cookie")

exports.gSignin = CatchAsyncError(async(req,res,next)=>{

    const {email} = req.body
    
    const user = await userModel.findOne({userEmail: email})
 
   if(!user)
   {
    return next(new ErrorHandler("Not a valid User",401))
   }

   let details;
   if(user.administrator)
   {
    details = 'admin'
   }
   else
   {
    details = 'employees'
   }
 
  const token=  user.getJwtToken()
  
   res.status(200).cookie('token',token,{sameSite:'none'}).json({
      details,
      token
   })
})

exports.signin = CatchAsyncError(async(req,res,next)=>{
   

    const {userEmail,type} = req.body

    const validUser = await userModel.findOne({userEmail: userEmail})


    if(userEmail && type)
    {

        if(validUser)
        {
          
       return SendToken(validUser,res,200)
        }
        else
        {

      return next(new ErrorHandler("Not a Valid User",401))
                
        }
    }

  
  

    otplib.totp.options= {digits: 6,step: 120}
    const otp = otplib.totp.generate(userEmail+process.env.OTPLIB_SECRET)
    validUser.otp = otp
    validUser.otpExpire = new Date(Date.now() + 1 * 60 * 1000)
    validUser.save()


// const options = {
//         to: validUser.userEmail,
//         html: `<p> Verify Your Otp ${otp}`,
//         subject: "Otp For H-Management"
// }
// const mail = sendMail(options)

// if(!mail)
// {
//     return next(new ErrorHandler("Problem in Sending Mail",500))
// }

res.status(200).json({
    success: true,
    message: "Mail Sent Successfully",
    otp
})
})

exports.verifyOtp = CatchAsyncError(async(req,res,next)=>{

    const {otp,userEmail} = req.body

    const user = await userModel.findOne({userEmail: userEmail})
    if(user.otpExpire  < Date.now())
    {
        user.otpExpire = undefined,
        user.otp = undefined
        user.save()
        return next(new ErrorHandler("Time is exceeded",401))
    }



    if(otp !== user.otp)
    {
        return next(new ErrorHandler("Otp is Wrong",401))
    }

    user.otp = undefined
    user.otpExpire = undefined

    user.lastLogin = new Date()
    moment(user.lastLogin).diff()
    await user.save({validateBeforeSave: false})

    if(!user)
    {
        return next(new ErrorHandler("Not a Valid User",401))
    }

    res.setHeader('Set-Cookie', cookie.serialize('hasToken', true, {
        httpOnly: 'true', 
        sameSite: 'none',
        path: '/', 
        secure:'false'
      }))
   
 SendToken(user,res,200)

})


exports.viewProfile = CatchAsyncError(async(req,res,next)=>{

    const id = req.user.id

    const user = await userModel.findById(id)

    res.status(200).json({
        success: true,
        message: "Logged in",
        user
    })
})



exports.requestLeave = CatchAsyncError(async(req,res,next)=>{
    const user = req.user

    const {type,reason,startDate,endDate} = req.body

    const leave = await LeaveModel.create({type,reason,startDate,endDate,user: user.id,userName: user.userName})

    if(!leave)
    {
        return next(new ErrorHandler("Error in adding Leave Request",400))
    }

    res.status(201).json({
        success: true,
    
    })
})

exports.updatePermissions = CatchAsyncError(async(req,res)=>{

    const userId = req.params.id
    const user = await userModel.findByIdAndUpdate(userId,req.body)
    res.json({
        success: true,
        user  
    })
})

exports.getPermissions = CatchAsyncError(async(req,res)=>{

    const userId = req.params.id
   
    const user = await userModel.findById(userId,{permissions: 1,administrator: 1})
    res.json({
        success: true,
        user
    })
})


exports.getUserDetails = CatchAsyncError(async(req,res)=>{

    const {id} = req.params
    const user = await userModel.findById(id)

    res.status(200).json({
        success: true,
        user
    })
})



exports.addAllowance = CatchAsyncError(async (req, res, next) => {

  const { allowanceName, componentType, percentage, amount } = req.body;

  const addallowance = await AllowanceModel.create({
    allowanceName,
    componentType,
    percentage,
    amount
  });

  if (!addallowance) {
    return next(new ErrorHandler("Error in adding Allowance", 400));
  }

  res.status(201).json({
    success: true,
    message: 'Allowance Added Successfully'
  });
});
exports.editAllowance = CatchAsyncError(async (req, res, next) => {

  const { _id, allowanceName, componentType, percentage, amount } = req.body;

  const addallowance = await AllowanceModel.findByIdAndUpdate({ _id }, {
    allowanceName,
    componentType,
    percentage,
    amount
  }, { new: true, upsert: true });

  if (!addallowance) {
    return next(new ErrorHandler("Error in updating Allowance", 400));
  }

  res.status(201).json({
    success: true,
    message: 'Allowance Updated Successfully'
  });
});
exports.deleteAllowance = CatchAsyncError(async (req, res, next) => {

  const { id } = req.query;
  const deleteallowance = await AllowanceModel.findByIdAndDelete({ _id: id });

  if (!deleteallowance) {
    return next(new ErrorHandler("Error in deleting Allowance", 400));
  }

  res.status(201).json({
    success: true,
    message: 'Allowance Deleted Successfully'
  });
});
exports.getAllAllowance = CatchAsyncError(async (req, res, next) => {

  const allowances = await AllowanceModel.find();

  res.status(201).json({
    success: true,
    allowances: allowances || []
  });
});
exports.addPayroll = CatchAsyncError(async (req, res, next) => {

  const data = req.body;

  const addsalary = await PayrollModel.create(data);

  if (!addsalary) {
    return next(new ErrorHandler("Error in adding Allowance", 400));
  }

  res.status(201).json({
    success: true,
    message: 'Payroll Added Successfully'
  });
});
exports.editPayroll = CatchAsyncError(async (req, res, next) => {

  const { _id, ...rest } = req.body;

  const addallowance = await PayrollModel.findByIdAndUpdate({ _id }, {
    ...rest,
  }, { new: true, upsert: true });

  if (!addallowance) {
    return next(new ErrorHandler("Error in updating Allowance", 400));
  }

  res.status(201).json({
    success: true,
    message: 'Payroll Updated Successfully'
  });
});
exports.deletePayroll = CatchAsyncError(async (req, res, next) => {

  const { id } = req.query;
  const deletesalary = await PayrollModel.findByIdAndDelete({ _id: id });

  if (!deletesalary) {
    return next(new ErrorHandler("Error in deleting Allowance", 400));
  }

  res.status(201).json({
    success: true,
    message: 'Payroll Deleted Successfully'
  });
});
exports.getAllPayroll = CatchAsyncError(async (req, res, next) => {

  const payrolls = await PayrollModel.find();

  res.status(201).json({
    success: true,
    payrolls: payrolls || []
  });
});